import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import { FontFamily } from '@/constants/Fonts';
import { useAppTheme } from '@/context/ThemeContext';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons, appImages } from '@/services/utilities/appAssets';
import InputField from '@/components/InputField';
import { useListStays, useSearchStays } from '@/hooks/useStays';
import LoadingSpinner from '@/components/LoadingSpinner';



export default function EcoStaysScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Map tab name to backend stay type (singular)
  const getBackendType = (tab) => {
    if (tab === 'Hotels') return 'hotel';
    if (tab === 'Hostels') return 'hostel';
    if (tab === 'Resorts') return 'resort';
    if (tab === 'Eco-Lodges') return 'eco-lodge';
    if (tab === 'Villas') return 'villa';
    return undefined;
  };

  const isSearchActive = !!searchQuery || activeTab !== 'All';

  // React Query calls
  const { data: listData, isLoading: isListLoading, refetch: refetchList } = useListStays({
    page: 1,
    limit: 20
  });

  const { data: searchData, isLoading: isSearchLoading, refetch: refetchSearch } = useSearchStays({
    q: searchQuery || undefined,
    type: getBackendType(activeTab),
    // isCertified: true
  });

  const stays = isSearchActive ? (searchData?.data?.stays || []) : (listData?.data?.stays || []);
  const isLoading = isSearchActive ? isSearchLoading : isListLoading;
  const refetch = isSearchActive ? refetchSearch : refetchList;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStayImage = (stay, index) => {
    if (stay.image && stay.image.startsWith('http')) {
      return { uri: stay.image };
    }
    const fallbacks = [appImages.stay1, appImages.stay2, appImages.stay3];
    return fallbacks[index % fallbacks.length];
  };

  const renderStayCard = (stay, index) => {
    const stayType = stay.type ? stay.type.charAt(0).toUpperCase() + stay.type.slice(1) : 'Hotel';
    const stayPrice = stay.rate ? `$${stay.rate}/${stay.rateType?.replace('per ', '') || 'night'}` : (stay.price || '$120/night');
    const stayLocation = stay.location?.address || (typeof stay.location === 'string' ? stay.location : '');
    const locationDisplay = stayLocation.startsWith('📍') ? stayLocation : `📍 ${stayLocation}`;
    const rating = typeof stay.rating === 'number' ? stay.rating : 5.0;
    const features = stay.features || ['Solar Powered', 'Zero Waste Kitchen'];

    return (
      <View key={stay._id || stay.id || index} style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={getStayImage(stay, index)} style={styles.cardImage} />
          <View style={styles.topLeftBadge}>
            <Text style={styles.topLeftBadgeText}>{stayType}</Text>
          </View>
          <View style={styles.topRightBadge}>
            <Image source={appIcons.leafFill} style={styles.smallLeafIcon} tintColor="#16A34A" />
            <Text style={styles.topRightBadgeText}>
              {stay.isCertified !== false ? 'Eco Cert' : 'Verified'}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{stay.title}</Text>
            <Text style={styles.cardPrice}>{stayPrice}</Text>
          </View>

          <View style={styles.locationRow}>
            <Text style={styles.locationText}>{locationDisplay}</Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.leavesRow}>
              {[...Array(5)].map((_, i) => (
                <Image key={i} source={appIcons.leafFill} style={styles.ratingLeaf} tintColor="#16A34A" />
              ))}
            </View>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>

          <View style={styles.featuresRow}>
            {features.map((feature, idx) => (
              <View key={idx} style={styles.featurePill}>
                <Text style={styles.featurePillText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={{ borderRadius: widthPixel(16), overflow: 'hidden' }}
            onPress={() => router.push({ pathname: '/eco-stays/details', params: { id: stay._id || stay.id } })}
          >
            <LinearGradient
              colors={['#16A34A', '#15803D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.viewStayButton}
            >
              <Text style={styles.viewStayButtonText}>View Stay</Text>
              <Image source={appIcons.chevronRight} style={styles.buttonChevron} tintColor="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };



  return (
    <ParentWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Eco Stays</Text>
            <Text style={styles.headerSubtitle}>Sustainable certified stays worldwide</Text>
          </View>
          <View style={styles.headerIconContainer}>
            <Image source={appIcons.leaf} style={styles.headerLeafIcon} tintColor="#16A34A" />
          </View>
        </View>

        <InputField
          colors={colors}
          leftIcon={appIcons.magnify}
          placeholder="Search eco stays, locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          changeMainContainer={{ marginTop: heightPixel(20) }}
          changeContainer={{
            backgroundColor: '#F9FAFB',
            borderColor: '#E5E7EB',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.02,
            shadowRadius: 8,
            elevation: 2,
            height: heightPixel(52),
          }}
          leftIconStyle={{ tintColor: "#9CA3AF" }}
        />

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {['All', 'Hotels', 'Hostels', 'Eco-Lodges', 'Villas', 'Resorts'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#16A34A" />
          }
        >
          {isLoading && !isRefreshing && stays.length === 0 ? (
            <LoadingSpinner isVisible={true} />
          ) : stays.length === 0 ? (
            <View style={{ paddingVertical: heightPixel(40), alignItems: 'center' }}>
              <Text style={{ fontFamily: FontFamily.InterMedium, color: '#6B7280', fontSize: fontPixel(14) }}>
                No eco stays found
              </Text>
            </View>
          ) : (
            stays.map((stay, index) => renderStayCard(stay, index))
          )}
        </ScrollView>
      </View>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: widthPixel(24),
    marginTop: heightPixel(20),
  },
  headerTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
    color: '#111827',
  },
  headerSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#6B7280',
    marginTop: heightPixel(4),
  },
  headerIconContainer: {
    width: widthPixel(48),
    height: widthPixel(48),
    borderRadius: widthPixel(16),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLeafIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: widthPixel(16),
    marginHorizontal: widthPixel(24),
    marginTop: heightPixel(24),
    paddingHorizontal: widthPixel(16),
    height: heightPixel(52),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginRight: widthPixel(12),
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(15),
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: widthPixel(24),
    marginTop: heightPixel(18),
    marginBottom: heightPixel(30),
    gap: widthPixel(12),
  },
  tab: {
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(20),
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#16A34A',
  },
  tabText: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(13),
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
  },
  scrollContent: {
    paddingHorizontal: widthPixel(24),
    paddingBottom: heightPixel(40),
    gap: heightPixel(24),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  imageContainer: {
    height: heightPixel(200),
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topLeftBadge: {
    position: 'absolute',
    top: heightPixel(16),
    left: widthPixel(16),
    backgroundColor: '#16A34A',
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(20),
  },
  topLeftBadgeText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#FFFFFF',
  },
  topRightBadge: {
    position: 'absolute',
    top: heightPixel(16),
    right: widthPixel(16),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(12),
    gap: widthPixel(4),
  },
  smallLeafIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
  },
  topRightBadgeText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(10),
    color: '#16A34A',
  },
  cardContent: {
    padding: widthPixel(20),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(8),
  },
  cardTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
    flex: 1,
  },
  cardPrice: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#16A34A',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(12),
    gap: widthPixel(4),
  },
  pinIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  locationText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#6B7280',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(16),
    gap: widthPixel(8),
  },
  leavesRow: {
    flexDirection: 'row',
    gap: widthPixel(2),
  },
  ratingLeaf: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  ratingText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthPixel(8),
    marginBottom: heightPixel(20),
  },
  featurePill: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(8),
  },
  featurePillText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(10),
    color: '#16A34A',
  },
  viewStayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(14),
    borderRadius: widthPixel(16),
    gap: widthPixel(8),
  },
  viewStayButtonText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#FFFFFF',
  },
  buttonChevron: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
});
