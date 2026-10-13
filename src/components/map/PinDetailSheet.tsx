import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, ImageSourcePropType, Linking, Platform } from 'react-native';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import CButton from '@/components/CButton';

const CButtonAny = CButton as any;

interface Pin {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  distance: string;
  latitude: number;
  longitude: number;
  icon: ImageSourcePropType;
  color: string;
  rawItem: any;
}

interface PinDetailSheetProps {
  selectedPin: Pin | null;
  isLoading: boolean;
  filteredPins: Pin[];
  onClose: () => void;
  onViewDetails: (pin: Pin) => void;
}

export const PinDetailSheet: React.FC<PinDetailSheetProps> = memo(({
  selectedPin,
  isLoading,
  filteredPins,
  onClose,
  onViewDetails,
}) => {
  if (selectedPin) {
    return (
      <View style={styles.sheetContent}>
        <View style={styles.pinDetailHeader}>
          <View style={[styles.pinIconBox, { backgroundColor: '#F0FDF4' }]}>
            <Image source={selectedPin.icon} style={styles.detailIcon} />
          </View>
          <View style={styles.pinHeaderText}>
            <Text style={styles.pinDetailTitle} numberOfLines={1}>{selectedPin.title}</Text>
            <Text style={styles.pinDetailSubtitle} numberOfLines={1}>{selectedPin.subtitle}</Text>
            <View style={styles.distanceRow}>
              <Image source={appIcons.pin} style={styles.miniPin} />
              <Text style={styles.distanceText}>{selectedPin.distance}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <View style={styles.closeIconCircle}>
              <Image source={appIcons.cross} style={styles.closeIcon} tintColor="#6B7280" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsRow}>
          <CButtonAny
            title="Directions"
            onPress={() => {
              const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
              const latLng = `${selectedPin.latitude},${selectedPin.longitude}`;
              const label = selectedPin.title;
              const url = Platform.select({
                ios: `${scheme}${label}@${latLng}`,
                android: `${scheme}${latLng}(${label})`
              });
              if (url) {
                Linking.openURL(url).catch(err => console.error('Error opening maps', err));
              }
            }}
            style={{ flex: 1, paddingHorizontal: 0 }}
            colors={['#7a8cb1ff', '#E5E7EB']}
            textStyle={{ color: '#111827' }}
            containerStyle={{ shadowOpacity: 0, elevation: 0 }}
          />
          <View style={{ width: widthPixel(12) }} />
          <CButtonAny
            title={selectedPin.type === 'stay' ? 'View Stay →' : 'View Challenge →'}
            onPress={() => onViewDetails(selectedPin)}
            style={{ flex: 1, paddingHorizontal: 0 }}
          />
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.sheetContent}>
        <View style={{ alignItems: 'center', paddingVertical: heightPixel(20) }}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={[{ marginTop: heightPixel(16) }, styles.tapMessage]}>Loading nearby locations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.sheetContent}>
      <Text style={styles.tapMessage}>Tap a pin to explore eco locations 🌍</Text>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#F0FDF4' }]}>
          <Image source={appIcons.hospital} style={styles.summaryIcon} />
          <Text style={[styles.summaryText, { color: '#16A34A' }]}>
            {filteredPins.filter(p => p.type === 'stay').length} Stays
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#F5F3FF' }]}>
          <Image source={appIcons.thunder64} style={styles.summaryIcon} />
          <Text style={[styles.summaryText, { color: '#7C3AED' }]}>
            {filteredPins.filter(p => p.type === 'challenge').length} Challenges
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  sheetContent: {
    paddingHorizontal: widthPixel(20),
    paddingBottom: heightPixel(20),
  },
  pinDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(20),
    gap: widthPixel(16),
  },
  pinIconBox: {
    width: widthPixel(54),
    height: widthPixel(54),
    borderRadius: widthPixel(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
  },
  pinHeaderText: {
    flex: 1,
  },
  pinDetailTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#111827',
  },
  pinDetailSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#6B7280',
    marginTop: heightPixel(2),
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(4),
    marginTop: heightPixel(4),
  },
  miniPin: {
    width: widthPixel(12),
    height: widthPixel(12),
    tintColor: '#9CA3AF',
  },
  distanceText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
  },
  closeBtn: {
    padding: widthPixel(4),
  },
  closeIconCircle: {
    width: widthPixel(24),
    height: widthPixel(24),
    borderRadius: widthPixel(12),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  tapMessage: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: heightPixel(20),
  },
  summaryRow: {
    flexDirection: 'row',
    gap: widthPixel(16),
  },
  summaryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: heightPixel(12),
    paddingHorizontal: widthPixel(16),
    borderRadius: widthPixel(16),
    gap: widthPixel(10),
  },
  summaryIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  summaryText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});