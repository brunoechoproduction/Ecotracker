import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily } from '@/constants/Fonts';
import { useAppTheme } from '@/context/ThemeContext';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons, appImages } from '@/services/utilities/appAssets';
import CButton from '@/components/CButton';

import { useStayById } from '@/hooks/useStays';

export default function EcoStayBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useAppTheme();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showRewardModal, setShowRewardModal] = useState(false);

  const { data: stayResponse, isLoading } = useStayById(id);
  const stayData = stayResponse?.data?.stay;

  if (isLoading || !stayData) {
    // Basic loading state or fallback
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontFamily: FontFamily.InterMedium }}>Loading booking options...</Text>
      </SafeAreaView>
    );
  }

  const stay = {
    title: stayData.title || 'Eco Stay',
    location: stayData.location?.address || 'Location',
    price: stayData.rate ? `$${stayData.rate}/${stayData.rateType?.replace('per ', '') || 'night'}` : (stayData.price || '$120/night'),
    ecoRating: typeof stayData.rating === 'number' ? stayData.rating : 5.0,
    image: (stayData.image && stayData.image.startsWith('http')) ? { uri: stayData.image } : appImages.stay1,
    ecoMiles: stayData.points || stayData.pointsReward || 200,
    xp: stayData.xp || 200,
    treesPlanted: stayData.treesPlanted || 3,
  };

  const BOOKING_METHODS = [];
  if (stayData.website) {
    BOOKING_METHODS.push({
      id: 'website',
      title: 'Book via Official Website',
      subtitle: 'Best rates • Instant confirmation',
      link: stayData.website,
      icon: appIcons.world,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      recommended: true,
    });
  }
  if (stayData.whatsapp) {
    BOOKING_METHODS.push({
      id: 'whatsapp',
      title: 'Book via WhatsApp',
      subtitle: 'Chat directly with the property team',
      link: stayData.whatsapp,
      icon: appIcons.chat,
      color: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#DCFCE7',
      fastResponse: true,
    });
  }
  if (stayData.phoneNumber) {
    BOOKING_METHODS.push({
      id: 'phone',
      title: 'Call to Book',
      subtitle: 'Speak with reception directly',
      link: stayData.phoneNumber,
      icon: appIcons.phone,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#EDE9FE',
    });
  }

  // Fallback if no methods are defined on backend
  if (BOOKING_METHODS.length === 0) {
    BOOKING_METHODS.push({
      id: 'website',
      title: 'Book via Official Website',
      subtitle: 'Best rates • Instant confirmation',
      link: 'https://example.com',
      icon: appIcons.world,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      recommended: true,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Image source={appIcons.chevronRight} style={styles.backIcon} tintColor="#374151" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Book Your Stay</Text>
          <Text style={styles.headerSubtitle}>Choose how you'd like to book</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Compact Stay Card */}
        <View style={styles.headerCard}>
          <View style={styles.imageWrapper}>
            <Image source={stay.image} style={styles.mainImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageGradient}
            />
            
            <View style={styles.imageContentOverlay}>
              <View>
                <Text style={styles.titleOnImage}>{stay.title}</Text>
                <View style={styles.locationRowOnImage}>
                  <Text style={styles.locationTextOnImage}>{stay.location}</Text>
                </View>
              </View>
              <View style={styles.typeBadgeOnImage}>
                <Text style={styles.typeBadgeTextOnImage}>Hotel</Text>
              </View>
            </View>
          </View>

          <View style={styles.headerInfoRow}>
            <View style={styles.ecoRatingRow}>
              <View style={styles.leavesRow}>
                {[...Array(5)].map((_, i) => (
                  <Image key={i} source={appIcons.leafFill} style={styles.ratingLeaf} tintColor="#16A34A" />
                ))}
              </View>
              <Text style={styles.ecoRatingText}>{stay.ecoRating.toFixed(1)} Eco Rating</Text>
            </View>
            <Text style={styles.priceTextOnCard}>{stay.price}</Text>
          </View>
        </View>

        {/* Reward Banner */}
        <LinearGradient
          colors={['#F0FDF4', '#DCFCE7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.rewardsCard}
        >
          <View style={styles.rewardsHeader}>
            <Image source={appIcons.leave} style={styles.rewardsIcon} tintColor="#16A34A" />
            <Text style={styles.rewardsTitle}>Book & Earn EcoPoints!</Text>
          </View>
          
          <Text style={styles.rewardsDescription}>
            Book this hotel through any method below. After your stay, upload your confirmation photo in EcoTrackr to earn rewards.
          </Text>

          <View style={styles.rewardsPillsRow}>
            <View style={styles.rewardPill}>
              <Image source={appIcons.star} style={styles.pillIcon}  />
              <Text style={styles.pillText}>+{stay.ecoMiles} EcoMiles</Text>
            </View>
            <View style={styles.rewardPill}>
              <Image source={appIcons.fire} style={styles.pillIcon} />
              <Text style={styles.pillText}>+{stay.xp} XP</Text>
            </View>
            <View style={styles.rewardPill}>
              <Image source={appIcons.doubleLeaf} style={styles.pillIcon} />
              <Text style={styles.pillText}>{stay.treesPlanted} Trees planted</Text>
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>How would you like to book?</Text>

        {/* Booking Methods */}
        <View style={styles.methodsContainer}>
          {BOOKING_METHODS.map((method) => (
            <TouchableOpacity 
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && { backgroundColor: method.bgColor, borderColor: method.borderColor }
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.methodIconBg, { backgroundColor: method.bgColor }]}>
                <Image source={method.icon} style={styles.methodIcon} tintColor={method.color} />
              </View>
              
              <View style={styles.methodInfo}>
                <View style={styles.methodTitleRow}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  {method.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Recommended</Text>
                    </View>
                  )}
                  {method.fastResponse && (
                    <View style={styles.fastResponseBadge}>
                      <Text style={styles.fastResponseText}>Fast Response</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                <Text style={[styles.methodLink, { color: method.color }]}>{method.link}</Text>
              </View>

              <View style={styles.radioContainer}>
                <View style={[
                  styles.radio, 
                  selectedMethod === method.id && { backgroundColor: method.color, borderColor: method.color }
                ]}>
                  {selectedMethod === method.id && <Image source={appIcons.whiteTick} style={styles.radioCheck} tintColor="#FFFFFF" />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.verifiedInfo}>
          <Image source={appIcons.shield} style={styles.shieldIcon}  />
          <Text style={styles.verifiedText}>
            <Text style={{ fontFamily: FontFamily.InterBold, color: '#2563EB' }}>EcoTrackr Verified:</Text> This hotel is officially certified. Any booking method above connects you directly with them — no middleman markup.
          </Text>
        </View>

        <View style={{ height: heightPixel(80) }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {selectedMethod ? (
          <View style={styles.bookingViaRow}>
            <Text style={styles.bookingViaLabel}>Booking via</Text>
            <View style={styles.bookingViaValue}>
              <Image 
                source={BOOKING_METHODS.find(m => m.id === selectedMethod)?.icon} 
                style={styles.viaIcon} 
                tintColor={BOOKING_METHODS.find(m => m.id === selectedMethod)?.color || "#2563EB"}
              />
              <Text style={styles.viaText}>{BOOKING_METHODS.find(m => m.id === selectedMethod)?.title.split('via ')[1] || 'Official Website'}</Text>
            </View>
          </View>
        ) : null}
        
        <TouchableOpacity 
          style={{ borderRadius: widthPixel(16), overflow: 'hidden' }}
          onPress={() => {
            if (selectedMethod) {
              setShowRewardModal(true);
            }
          }}
          disabled={!selectedMethod}
        >
          <LinearGradient
            colors={selectedMethod ? ['#16A34A', '#15803D'] : ['#D1D5DB', '#9CA3AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookBtn}
          >
            <Text style={styles.bookBtnText}>Book Your Stay</Text>
            <Image source={appIcons.backArrow} style={styles.bookArrow} tintColor="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {!selectedMethod && (
          <Text style={styles.selectionPrompt}>Select a booking method above to continue</Text>
        )}
      </View>

      {/* Reward Modal */}
      <Modal
        visible={showRewardModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRewardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            activeOpacity={1} 
            style={StyleSheet.absoluteFill} 
            onPress={() => setShowRewardModal(false)} 
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              contentContainerStyle={{ paddingBottom: heightPixel(30) }}
            >
              {/* Header Banner */}
              <LinearGradient
                colors={['#166534', '#15803D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modalBanner}
              >
                <View style={styles.bannerIconContainer}>
                  <Image source={appIcons.leave} style={styles.bannerLeaf}  />
                </View>
                <View>
                  <Text style={styles.bannerSubtitle}>ECOTRACKR REWARD</Text>
                  <Text style={styles.bannerTitle}>{"Earn EcoPoints\nAfter Your Stay! 🎉"}</Text>
                </View>
                
                {/* Decorative circles */}
                <View style={[styles.decorCircle, { top: -20, right: -20 }]} />
                <View style={[styles.decorCircle, { bottom: -30, left: 10, opacity: 0.1 }]} />
              </LinearGradient>

              <View style={styles.modalContent}>
                <Text style={styles.modalIntro}>
                  You're about to book <Text style={styles.boldText}>{stay.title}</Text> via <Text style={[styles.boldText, { color: '#16A34A' }]}>Official Website</Text>. Once you check in and complete your stay, come back to EcoTrackr and upload your proof to earn your rewards.
                </Text>

                <Text style={styles.modalSectionTitle}>WHAT YOU'LL EARN</Text>
                <View style={styles.earningsRow}>
                  <View style={[styles.earningCard, { backgroundColor: '#FFFBEB' }]}>
                    <Image source={appIcons.star} style={styles.earningIcon}  />
                    <Text style={[styles.earningValue, { color: '#B45309' }]}>+{stay.ecoMiles}</Text>
                    <Text style={styles.earningLabel}>EcoMiles</Text>
                  </View>
                  <View style={[styles.earningCard, { backgroundColor: '#F5F3FF' }]}>
                    <Image source={appIcons.thunder64} style={styles.earningIcon} />
                    <Text style={[styles.earningValue, { color: '#7C3AED' }]}>+{stay.xp}</Text>
                    <Text style={styles.earningLabel}>XP</Text>
                  </View>
                  <View style={[styles.earningCard, { backgroundColor: '#F0FDF4' }]}>
                    <Image source={appIcons.doubleLeaf} style={styles.earningIcon}  />
                    <Text style={[styles.earningValue, { color: '#15803D' }]}>x{stay.treesPlanted}</Text>
                    <Text style={styles.earningLabel}>Trees</Text>
                  </View>
                </View>

                <View style={styles.stepsContainer}>
                  <Text style={styles.modalSectionTitle}>How to claim your EcoPoints:</Text>
                  
                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconContainer, { backgroundColor: '#16A34A' }]}>
                      <Image source={appIcons.redirect} style={styles.stepIcon} tintColor="#FFFFFF" />
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepTitle}>Book through Official Website</Text>
                      <Text style={styles.stepSubtitle}>Complete your reservation externally</Text>
                    </View>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconContainer, { backgroundColor: '#16A34A' }]}>
                      <Image source={appIcons.camera} style={styles.stepIcon} tintColor="#FFFFFF" />
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepTitle}>After check-in, upload proof</Text>
                      <Text style={styles.stepSubtitle}>Photo of your booking confirmation or key card</Text>
                    </View>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconContainer, { backgroundColor: '#16A34A' }]}>
                      <Image source={appIcons.whiteTick} style={[styles.stepIcon, { height:widthPixel(15),width:widthPixel(15) }]} tintColor="#FFFFFF" />
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepTitle}>EcoTrackr verifies your stay</Text>
                      <Text style={styles.stepSubtitle}>Usually within 24 hours</Text>
                    </View>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={[styles.stepIconContainer, { backgroundColor: '#16A34A' }]}>
                      <Image source={appIcons.tabThunder} style={styles.stepIcon} tintColor="#FFFFFF" />
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepTitle}>Rewards added to your account!</Text>
                      <Text style={styles.stepSubtitle}>EcoMiles, XP & tree donations credited</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.importantBanner}>
                  <Image source={appIcons.leaf} style={styles.infoIcon} tintColor="#D97706" />
                  <Text style={styles.importantText}>
                    <Text style={{ fontFamily: FontFamily.InterBold }}>Important:</Text> Save your booking confirmation. You'll need it to upload as proof and earn your EcoPoints after your stay.
                  </Text>
                </View>

                <CButton 
                  title="Continue to Official Website →"
                  onPress={async () => {
                    setShowRewardModal(false);
                    const methodObj = BOOKING_METHODS.find(m => m.id === selectedMethod);
                    if (methodObj && methodObj.link) {
                      let url = methodObj.link;
                      if (selectedMethod === 'whatsapp' && !url.startsWith('http') && !url.startsWith('whatsapp:')) {
                        const cleanNumber = url.replace(/[^0-9+]/g, '');
                        url = `whatsapp://send?phone=${cleanNumber}`;
                      } else if (selectedMethod === 'phone' && !url.startsWith('tel:')) {
                        url = `tel:${url}`;
                      } else if (selectedMethod === 'website' && !url.startsWith('http')) {
                        url = `https://${url}`;
                      }
                      try {
                        await Linking.openURL(url);
                      } catch (e) {
                        console.log('Error opening URL', e);
                      }
                    }
                    router.push('/eco-stays/redirecting');
                  }}
                  style={{ paddingHorizontal: 0, marginTop: heightPixel(24) }}
                />

                <TouchableOpacity 
                  onPress={() => setShowRewardModal(false)}
                  style={styles.modalCloseBtn}
                >
                  <Text style={styles.modalCloseText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPixel(24),
    paddingVertical: heightPixel(16),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: widthPixel(40),
    height: widthPixel(40),
    borderRadius: widthPixel(10),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPixel(16),
  },
  backIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    transform: [{ rotate: '180deg' }],
  },
  headerTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
    color: '#111827',
  },
  headerSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#6B7280',
    marginTop: heightPixel(2),
  },
  scrollContent: {
    paddingHorizontal: widthPixel(20),
    paddingTop: heightPixel(20),
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    marginBottom: heightPixel(24),
  },
  imageWrapper: {
    width: '100%',
    height: heightPixel(150),
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  imageContentOverlay: {
    position: 'absolute',
    bottom: heightPixel(16),
    left: widthPixel(16),
    right: widthPixel(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleOnImage: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(16),
    color: '#FFFFFF',
    marginBottom: heightPixel(2),
  },
  locationRowOnImage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(6),
  },
  locationTextOnImage: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#F3F4F6',
  },
  typeBadgeOnImage: {
    backgroundColor: '#16A34A',
    paddingHorizontal: widthPixel(10),
    paddingVertical: heightPixel(7),
    borderRadius: widthPixel(22),
  },
  typeBadgeTextOnImage: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#FFFFFF',
  },
  headerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: widthPixel(16),
  },
  priceTextOnCard: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(16),
    color: '#16A34A',
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
    fontSize: fontPixel(12),
    color: '#16A34A',
  },
  rewardsCard: {
    borderRadius: widthPixel(24),
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    padding: widthPixel(20),
    marginBottom: heightPixel(24),
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
    marginBottom: heightPixel(10),
  },
  rewardsIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  rewardsTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(14),
    color: '#166534',
  },
  rewardsDescription: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#166534',
    lineHeight: heightPixel(20),
    marginBottom: heightPixel(16),
    opacity: 0.9,
  },
  rewardsPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: widthPixel(8),
  },
  rewardPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: heightPixel(8),
    paddingHorizontal: widthPixel(6),
    borderRadius: widthPixel(12),
    justifyContent: 'center',
    gap: widthPixel(4),
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderColor:"#DCFCE7",
    borderWidth: 1,
  },
  pillIcon: {
    width: widthPixel(12),
    height: widthPixel(12),
  },
  pillText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(10),
    color: '#166534',
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#374151',
    marginBottom: heightPixel(16),
  },
  methodsContainer: {
    gap: heightPixel(12),
    marginBottom: heightPixel(24),
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(20),
    padding: widthPixel(16),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  methodIconBg: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  methodInfo: {
    flex: 1,
    marginLeft: widthPixel(16),
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    marginBottom: heightPixel(2),
  },
  methodTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
  },
  recommendedBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(3),
    borderRadius: widthPixel(14),
  },
  recommendedText: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(9),
    color: '#FFFFFF',
  },
  fastResponseBadge: {
    backgroundColor: '#16A34A',
    paddingHorizontal: widthPixel(8),
    paddingVertical: heightPixel(2),
    borderRadius: widthPixel(6),
  },
  fastResponseText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(9),
    color: '#FFFFFF',
  },
  methodSubtitle: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(12),
    color: '#9CA3AF',
    marginBottom: heightPixel(4),
  },
  methodLink: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    textDecorationLine: 'none',
  },
  radioContainer: {
    paddingLeft: widthPixel(10),
  },
  radio: {
    width: widthPixel(24),
    height: widthPixel(24),
    borderRadius: widthPixel(12),
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    width: widthPixel(12),
    height: widthPixel(12),
  },
  verifiedInfo: {
    flexDirection: 'row',
    paddingHorizontal: widthPixel(16),
    paddingVertical: heightPixel(16),
    backgroundColor: '#EFF6FF',
    borderRadius: widthPixel(16),
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: widthPixel(12),
    marginBottom: heightPixel(40),
  },
  shieldIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
    marginTop: heightPixel(2),
  },
  verifiedText: {
    flex: 1,
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#2563EB',
    lineHeight: heightPixel(18),
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(16),
    paddingBottom: heightPixel(10),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    position:"absolute",
    bottom:0,
    left:0,
    right:0
  },
  bookingViaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPixel(16),
  },
  bookingViaLabel: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#6B7280',
  },
  bookingViaValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(6),
  },
  viaIcon: {
    width: widthPixel(16),
    height: widthPixel(16),
  },
  viaText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#374151',
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(56),
    borderRadius: widthPixel(16),
    gap: widthPixel(8),
  },
  bookBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(16),
    color: '#FFFFFF',
  },
  bookArrow: {
    width: widthPixel(18),
    height: widthPixel(18),
    transform: [{ rotate: '180deg' }],
  },
  selectionPrompt: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: heightPixel(12),
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: widthPixel(32),
    borderTopRightRadius: widthPixel(32),
    maxHeight: '85%',
    paddingBottom: heightPixel(20),
  },
  modalHandle: {
    width: widthPixel(40),
    height: heightPixel(4),
    backgroundColor: '#E5E7EB',
    borderRadius: widthPixel(2),
    alignSelf: 'center',
    marginVertical: heightPixel(12),
  },
  modalBanner: {
    marginHorizontal: widthPixel(20),
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(16),
    overflow: 'hidden',
    position: 'relative',
  },
  bannerIconContainer: {
    width: widthPixel(55),
    height: widthPixel(55),
    borderRadius: widthPixel(30),
    backgroundColor: "#FFFFFF33",
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:"#FFFFFF59",
    borderWidth:2
  },
  bannerLeaf: {
    width: widthPixel(28),
    height: widthPixel(28),
  },
  bannerSubtitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#FFFFFFBF',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(18),
    color: '#FFFFFF',
    marginTop: heightPixel(2),
    lineHeight: 24,
  },
  decorCircle: {
    position: 'absolute',
    width: widthPixel(80),
    height: widthPixel(80),
    borderRadius: widthPixel(40),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalContent: {
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(20),
  },
  modalIntro: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#374151',
    lineHeight: heightPixel(22),
    marginBottom: heightPixel(24),
  },
  boldText: {
    fontFamily: FontFamily.InterBold,
    color: '#111827',
  },
  modalSectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: heightPixel(16),
    textTransform: 'uppercase',
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: heightPixel(32),
  },
  earningCard: {
    flex: 1,
    marginHorizontal: widthPixel(4),
    paddingVertical: heightPixel(16),
    borderRadius: widthPixel(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginBottom: heightPixel(8),
  },
  earningValue: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(16),
    marginBottom: heightPixel(2),
  },
  earningLabel: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(10),
    color: '#6B7280',
  },
  stepsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: widthPixel(24),
    padding: widthPixel(20),
    marginBottom: heightPixel(24),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPixel(16),
    gap: widthPixel(16),
  },
  stepIconContainer: {
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
  },
  stepIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#111827',
  },
  stepSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginTop: heightPixel(3),
  },
  importantBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: widthPixel(16),
    borderRadius: widthPixel(12),
    gap: widthPixel(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  infoIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
    alignSelf: 'flex-start',
  },
  importantText: {
    flex: 1,
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#92400E',
    lineHeight: heightPixel(18),
  },
  modalCloseBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(16),
    marginTop: heightPixel(4),
    marginBottom: heightPixel(20),
  },
  modalCloseText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(13),
    color: '#9CA3AF',
  },
});
