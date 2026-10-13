import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontFamily } from '@/constants/Fonts';
import { useAppTheme } from '@/context/ThemeContext';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons, appImages } from '@/services/utilities/appAssets';

export default function EcoStayMapDetailsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams();

  // In a real app, you would fetch the stay details using the ID.
  const stay = {
    type: 'Hotel',
    title: 'Green Valley Resort',
    location: 'Ubud, Bali',
    price: '$120/night',
    ecoRating: 5.0,
    userRating: 4.9,
    reviewsCount: 128,
    description: "A luxury eco-resort nestled in the heart of Bali's lush rainforest. Fully solar-powered with a zero-waste kitchen and organic farm. Every stay contributes to local reforestation programs.",
    ecoFeatures: ['Solar Powered', 'Organic Farm', 'Zero Waste Kitchen', 'Rainwater Harvesting'],
    ecoMiles: 200,
    image: appImages.stay1,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <Image source={appImages.stay1} style={styles.mainImage} />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Image source={appIcons.backArrow} style={styles.backIcon} tintColor="#111827" />
          </TouchableOpacity>

          <View style={styles.ecoCertifiedBadge}>
            <Image source={appIcons.leafFill} style={styles.smallLeafIcon} tintColor="#16A34A" />
            <Text style={styles.ecoCertifiedText}>Eco Certified ✓</Text>
           
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{stay.type}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{stay.price}</Text>
              <Text style={styles.perNightText}>per night</Text>
            </View>
          </View>

          <Text style={styles.titleText}>{stay.title}</Text>

          <View style={styles.locationRow}>
            <Image source={appIcons.pin} style={styles.pinIcon} tintColor="#6B7280" />
            <Text style={styles.locationText}>{stay.location}</Text>
          </View>

          <View style={styles.ratingsContainer}>
            <View style={styles.ecoRatingRow}>
              <View style={styles.leavesRow}>
                {[...Array(5)].map((_, i) => (
                  <Image key={i} source={appIcons.leafFill} style={styles.ratingLeaf} tintColor="#16A34A" />
                ))}
              </View>
              <Text style={styles.ecoRatingText}>{stay.ecoRating.toFixed(1)} Eco Rating</Text>
            </View>

            <View style={styles.userRatingRow}>
              <Image source={appIcons.star} style={styles.starIcon} tintColor="#F59E0B" />
              <Text style={styles.userRatingText}>{stay.userRating} ({stay.reviewsCount} reviews)</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>{stay.description}</Text>

          <Text style={styles.sectionTitle}>Eco Features</Text>
          <View style={styles.featuresGrid}>
            {stay.ecoFeatures.map((feature, idx) => (
              <View key={idx} style={styles.featurePill}>
                <Image source={appIcons.leaf} style={styles.featureIcon} tintColor="#16A34A" />
                <Text style={styles.featurePillText}>{feature}</Text>
              </View>
            ))}
          </View>

          <View style={styles.verifiedBanner}>
            <Image source={appIcons.shieldOutline} style={styles.shieldIcon} tintColor="#2563EB" />
            <View style={styles.verifiedTextContainer}>
              <Text style={styles.verifiedTitle}>EcoTrackr Verified</Text>
              <Text style={styles.verifiedSubtitle}>Earn +{stay.ecoMiles} EcoMiles when you stay here</Text>
            </View>
          </View>

          <View style={{ height: heightPixel(100) }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={{ borderRadius: widthPixel(16), overflow: 'hidden' }}
          onPress={() => router.push('/eco-stays/map-booking')}
        >
          <LinearGradient
            colors={['#16A34A', '#15803D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookButton}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
            <Image source={appIcons.backArrow} style={styles.bookArrow} tintColor="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: heightPixel(40),
  },
  imageContainer: {
    width: '100%',
    height: heightPixel(300),
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: heightPixel(60),
    left: widthPixel(20),
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(22),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  ecoCertifiedBadge: {
    position: 'absolute',
    bottom: heightPixel(20),
    left: widthPixel(24),
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(8),
    borderRadius: widthPixel(16),
    gap: widthPixel(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  smallLeafIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  ecoCertifiedText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
  },
  smallTickIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  contentContainer: {
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(20),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: heightPixel(6),
  },
  typeBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(6),
    borderRadius: widthPixel(12),
  },
  typeBadgeText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#16A34A',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
    color: '#16A34A',
  },
  perNightText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
   
  },
  titleText: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(22),
    color: '#111827',
    marginBottom: heightPixel(8),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(18),
    gap: widthPixel(6),
  },
  pinIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  locationText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#6B7280',
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(20),
    flexWrap: 'wrap',
    gap: widthPixel(16),
  },
  ecoRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  ecoRatingText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#16A34A',
  },
  userRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(6),
  },
  starIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  userRatingText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#6B7280',
  },
  descriptionText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#4B5563',
    lineHeight: heightPixel(24),
    marginBottom: heightPixel(28),
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#111827',
    marginBottom: heightPixel(16),
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: widthPixel(12),
    marginBottom: heightPixel(28),
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor:"#DCFCE7",
    borderWidth:1,
    paddingHorizontal: widthPixel(14),
    paddingVertical: heightPixel(10),
    borderRadius: widthPixel(12),
    gap: widthPixel(8),
  },
  featureIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  featurePillText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    color: '#166534',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: widthPixel(16),
    padding: widthPixel(16),
    gap: widthPixel(16),
  },
  shieldIcon: {
    width: widthPixel(28),
    height: widthPixel(28),
  },
  verifiedTextContainer: {
    flex: 1,
  },
  verifiedTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#1E40AF',
    marginBottom: heightPixel(4),
  },
  verifiedSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#3B82F6',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(16),
    paddingBottom: heightPixel(20),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(18),
    borderRadius: widthPixel(16),
    gap: widthPixel(8),
  },
  bookButtonText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
    color: '#FFFFFF',
  },
  bookArrow: {
    width: widthPixel(18),
    height: widthPixel(18),
    transform: [{ rotate: '180deg' }],
  },
});
