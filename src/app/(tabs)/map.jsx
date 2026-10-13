import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  TextInput,
  Keyboard,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';
import ParentWrapper from '@/components/ParentWrapper';
import { useNearby } from '@/hooks/useEcoMap';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import { PinDetailSheet } from '@/components/map/PinDetailSheet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: '🌍 All', icon: appIcons.world },
  { id: 'stays', label: '🏨 Stays', icon: appIcons.hospital },
  { id: 'challenges', label: '⚡ Challenges', icon: appIcons.purpleThunder },
];

// Initial region centered around the pins
const INITIAL_REGION = {
  latitude: 40.7128,
  longitude: -74.006,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};



export default function MapScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { colors } = useAppTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState(null);
  const [location, setLocation] = useState({ lat: INITIAL_REGION.latitude, lng: INITIAL_REGION.longitude });
  const mapRef = useRef(null);
  // Per-pin entrance animation values, keyed by pin id. Persists across
  // re-renders (it's a ref), so a pin already on screen never re-animates —
  // only pins that are NEW to the current filteredPins set fade/scale in.
  const pinAnimRefs = useRef(new Map()).current;

  const initialMapRegion = useMemo(() => {
    return {
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [location.lat, location.lng]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasRequestedLocation = useRef(false);

  useEffect(() => {
    if (!isFocused || hasRequestedLocation.current) return;

    (async () => {
      hasRequestedLocation.current = true;
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
      try {
        // Try getting last known position first (fast, usually works)
        let loc = await Location.getLastKnownPositionAsync({});

        // If not available, ask for current position but with Balanced accuracy
        // to prevent kCLErrorDomain error 0 on physical devices indoors
        if (!loc) {
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }

        if (loc) {
          setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });

          // Move map to user location
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }, 1000);
          }
        }
      } catch (err) {
        console.warn('Failed to get current location:', err);
      }
    })();
  }, []);

  const { data: nearbyData, isLoading } = useNearby({
    lat: location.lat,
    lng: location.lng,
    type: activeCategory === 'all' ? undefined : activeCategory,
    q: debouncedQuery || undefined,
  });

  // Animation refs for bottom sheet — peek from below (e.g. 300) then animate to 0
  const sheetAnim = useRef(new Animated.Value(300)).current;

  // Entrance animation
  useEffect(() => {
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, []);

  const handlePinPress = useCallback((pin) => {
    Keyboard.dismiss();
    // Animate map to center on selected pin
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: pin.latitude - 0.005,
          longitude: pin.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400
      );
    }

    // 1. Hide current sheet quickly
    Animated.timing(sheetAnim, {
      toValue: 300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // 2. Swap to Detail view
      setSelectedPin(pin);
      // 3. Show sheet again with a snappy spring
      Animated.spring(sheetAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 140,
        friction: 12,
      }).start();
    });
  }, [sheetAnim]);

  const closeSheet = () => {
    // 1. Hide current sheet quickly
    Animated.timing(sheetAnim, {
      toValue: 300,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // 2. Swap back to Summary view
      setSelectedPin(null);
      // 3. Show sheet again (stick by default)
      Animated.spring(sheetAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 140,
        friction: 12,
      }).start();
    });
  };


  const filteredPins = useMemo(() => {
    const itemsRaw = nearbyData?.data?.items ?? nearbyData?.items;
    const backendItems = Array.isArray(itemsRaw) ? itemsRaw : [];

    const mapped = backendItems.map((item, index) => {
      let itemType = item.itemType ?? item.type;
      if (!itemType) {
        if (item.challenge) itemType = 'challenge';
        else if (item.stay) itemType = 'stay';
        else itemType = 'stay';
      }

      // Use ?? (nullish) NOT || (falsy) — coordinates can be 0 which is falsy but valid
      // Backend sends GeoJSON: location.coordinates is [lng, lat]
      const lat = item.coordinates?.latitude ?? item.location?.coordinates?.[1] ?? location.lat;
      const lng = item.coordinates?.longitude ?? item.location?.coordinates?.[0] ?? location.lng;

      return {
        id: item._id || item.id || `pin-${index}`,
        type: itemType,
        title: item.title || '',
        subtitle: item.description || (itemType === 'stay' ? 'Sustainable stay' : 'Eco challenge'),
        distance: item.distanceMeters ? `${(item.distanceMeters / 1000).toFixed(1)} km away` : 'Nearby',
        latitude: lat,
        longitude: lng,
        icon: itemType === 'stay' ? appIcons.hospital : appIcons.thunder64,
        color: itemType === 'stay' ? '#16A34A' : '#7C3AED',
        rawItem: item,
      };
    }).filter((pin) =>
      // Guard against NaN/null coords — passing NaN to MapView Marker crashes the native bridge
      Number.isFinite(pin.latitude) && Number.isFinite(pin.longitude)
    );

    if (activeCategory === 'all') return mapped;

    // Backend already filters by type, but we also filter client-side for instant response
    // 'stays' -> 'stay', 'challenges' -> 'challenge'
    const singularCategory = activeCategory.replace(/s$/, '');
    return mapped.filter((pin) => pin.type === singularCategory);
  }, [nearbyData, location.lat, location.lng, activeCategory]);

  // Get (or lazily create) the Animated.Value for a pin's entrance.
  // New pins start at 0 (invisible/scaled down) and animate to 1.
  // Pins that already exist keep their current value — no re-trigger.
  const getPinAnim = useCallback((pinId) => {
    let anim = pinAnimRefs.get(pinId);
    if (!anim) {
      anim = new Animated.Value(0);
      pinAnimRefs.set(pinId, anim);
    }
    return anim;
  }, [pinAnimRefs]);

  useEffect(() => {
    const currentIds = new Set(filteredPins.map((p) => p.id));

    // Animate in any pin that's new to this set (value still at 0)
    filteredPins.forEach((pin) => {
      const anim = getPinAnim(pin.id);
      // @ts-ignore - _value is read-only but fine for a quick check
      const currentValue = anim.__getValue ? anim.__getValue() : 0;
      if (currentValue === 0) {
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
        }).start();
      }
    });

    // Prune animated values for pins no longer present, so the Map
    // doesn't grow unbounded over a long session of searching/filtering.
    for (const id of Array.from(pinAnimRefs.keys())) {
      if (!currentIds.has(id)) {
        pinAnimRefs.delete(id);
      }
    }
  }, [filteredPins, getPinAnim, pinAnimRefs]);

  // ─── Custom Marker Fix ───────────────────────────────────────────────────────
  // react-native-maps defaults tracksViewChanges=true for custom child markers.
  // This causes it to re-screenshot the native view on EVERY render → markers
  // flicker, go blank, or never appear on Android.
  //
  // FIXED: key this off the actual set of pin IDs (not just .length).
  // Previously this watched `filteredPins.length`, which meant:
  //   1) Typing in search could swap to a different set of pins with the SAME
  //      length → effect never re-fired → tracksViewChanges stayed false →
  //      native tried to reuse a stale snapshot for changed markers → crash.
  //   2) Switching stays → challenges → all: by the time "all" pins reappeared,
  //      tracksViewChanges was already locked false from the previous filter
  //      pass, so the reappearing markers never got their first native
  //      snapshot → pins were in the React tree but invisible on the map.
  // Re-arming `true` whenever the id set changes, and always giving each new
  // set its own 300ms settle window, fixes both.
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const pinIdsKey = useMemo(
    () => filteredPins.map((p) => p.id).join(','),
    [filteredPins]
  );

  useEffect(() => {
    if (filteredPins.length === 0) return;
    setTracksViewChanges(true); // re-arm snapshot for this pin set
    // Window must outlast the marker entrance spring animation (~450-500ms
    // in practice for tension:80/friction:9) or native locks tracksViewChanges
    // to false while a marker is still mid fade/scale-in, freezing it
    // half-transparent. 600ms gives the spring room to fully settle.
    const id = setTimeout(() => setTracksViewChanges(false), 600);
    return () => clearTimeout(id);
  }, [pinIdsKey]);
  // ─────────────────────────────────────────────────────────────────────────────

  const renderMarker = useCallback((pin) => {
    const anim = getPinAnim(pin.id);
    return (
      <Marker
        key={pin.id}
        coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
        onPress={() => handlePinPress(pin)}
        tracksViewChanges={tracksViewChanges}
      >
        <Animated.View
          style={[
            styles.markerWrapper,
            {
              opacity: anim,
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.pinCircle,
              { backgroundColor: pin.color },
              selectedPin?.id === pin.id && styles.selectedPinCircle,
            ]}
          >
            <Image source={pin.icon} style={styles.pinIcon} />
          </View>
          <View style={[styles.pinGlow, { backgroundColor: pin.color }]} />
          <View style={[styles.pinTail, { borderTopColor: pin.color }]} />
        </Animated.View>
      </Marker>
    );
  }, [tracksViewChanges, selectedPin?.id, handlePinPress, getPinAnim]);
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <ParentWrapper style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: '#111827' }]}>Eco Map</Text>
          <Text style={[styles.headerSubtitle, { color: '#6B7280' }]}>
            {isLoading ? 'Searching nearby...' : `${filteredPins.length} locations nearby`}
          </Text>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryChip,
              { backgroundColor: activeCategory === cat.id ? '#16A34A' : '#F3F4F6' },
            ]}
            onPress={() => {
              Keyboard.dismiss();
              setActiveCategory(cat.id);
            }}
          >
            <Text
              style={[
                styles.categoryLabel,
                { color: activeCategory === cat.id ? '#FFFFFF' : '#6B7280' },
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Image source={appIcons.magnify} style={styles.searchIcon} tintColor="#9CA3AF" />
          <TextInput
            placeholder="Search locations, stays, challenges..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => Keyboard.dismiss()}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Map Area */}
      <View style={styles.mapArea}>
        {isFocused && (
          <MapView
            ref={mapRef}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={StyleSheet.absoluteFillObject}
            initialRegion={initialMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
            onPress={() => Keyboard.dismiss()}
          >
            {filteredPins.map(renderMarker)}
          </MapView>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
            <Text style={styles.legendText}>Eco Stay</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#7C3AED' }]} />
            <Text style={styles.legendText}>Challenge</Text>
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY: sheetAnim }] }]}
      >
        <View style={styles.sheetHandle} />

        <PinDetailSheet
          selectedPin={selectedPin}
          isLoading={isLoading}
          filteredPins={filteredPins}
          onClose={closeSheet}
          onViewDetails={(pin) => {
            if (pin.type === 'stay') {
              router.push({ pathname: '/eco-stays/details', params: { id: pin.id } });
            } else {
              router.push({ pathname: '/challenge/details', params: { id: pin.id } });
            }
          }}
        />
      </Animated.View>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(10),
    paddingBottom: heightPixel(16),
  },
  headerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(22),
  },
  headerSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    marginTop: heightPixel(2),
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: widthPixel(20),
    gap: widthPixel(12),
    marginBottom: heightPixel(16),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(100),
    gap: widthPixel(8),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  catIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  categoryLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
  },
  searchContainer: {
    paddingHorizontal: widthPixel(20),
    marginBottom: heightPixel(16),
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: widthPixel(12),
    paddingHorizontal: widthPixel(16),
    height: heightPixel(48),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
    marginRight: widthPixel(10),
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  mapArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  markerWrapper: {
    alignItems: 'center',
    backgroundColor: "transparent"
  },
  pinCircle: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedPinCircle: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
    backgroundColor: '#000000',
  },
  pinIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  pinGlow: {
    position: 'absolute',
    width: widthPixel(50),
    height: widthPixel(50),
    borderRadius: widthPixel(25),
    opacity: 0.15,
    top: -widthPixel(4),
    left: -widthPixel(4),
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  legend: {
    position: 'absolute',
    top: heightPixel(10),
    right: widthPixel(10),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: widthPixel(8),
    padding: widthPixel(8),
    gap: heightPixel(6),
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(6),
  },
  legendDot: {
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
  },
  legendText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(10),
    color: '#374151',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: widthPixel(32),
    borderTopRightRadius: widthPixel(32),
    paddingHorizontal: widthPixel(24),
    paddingBottom: heightPixel(40),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 100,
  },
  sheetHandle: {
    width: widthPixel(48),
    height: heightPixel(5),
    backgroundColor: '#E5E7EB',
    borderRadius: widthPixel(10),
    alignSelf: 'center',
    marginVertical: heightPixel(16),
  },

});