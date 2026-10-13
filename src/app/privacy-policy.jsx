import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import { usePrivacyPolicy } from '@/hooks/useSystem';
import LoadingSpinner from '@/components/LoadingSpinner';

const renderWithBoldEcoTrackr = (text) => {
  if (typeof text !== 'string') return text;
  return text.split(/(EcoTrackr Inc\.)/i).map((part, index) => 
    part.toLowerCase() === 'ecotrackr inc.' ? (
      <Text key={index} style={styles.boldText}>{part}</Text>
    ) : (
      part
    )
  );
};

const PolicySection = ({ title, content }) => (
  <View style={styles.policyCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.policyText}>{renderWithBoldEcoTrackr(content)}</Text>
  </View>
);

export default function PrivacyPolicyScreen() {
  const { data: policyResponse, isLoading } = usePrivacyPolicy();
  const backendPolicy = policyResponse?.data?.privacy;

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
        showBackButton={false}
        title="Privacy Policy" 
        subtitle=""
        gradientColors={['#16A34A', '#14532D']}
      >
        <View style={styles.bannerBox}>
          <View style={styles.bannerIconBg}>
            <Image 
              source={appIcons.shieldOutline} 
              style={styles.bannerIcon} 
              tintColor="#FFFFFF" 
            />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Your privacy matters to us 🔒</Text>
            <Text style={styles.bannerDate}>
              Last updated: {backendPolicy?.lastUpdated 
                ? new Date(backendPolicy.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) 
                : 'March 15, 2026'}
            </Text>
          </View>
        </View>
      </ProfileHeader>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.introBox}>
          <Text style={styles.introText}>
            {backendPolicy?.introduction ? (
              renderWithBoldEcoTrackr(backendPolicy.introduction)
            ) : (
              <>This Privacy Policy describes how <Text style={styles.boldText}>EcoTrackr Inc.</Text> collects, uses, and protects your information when you use our mobile application. We are committed to transparency and giving you control over your data.</>
            )}
          </Text>
        </View>

        {isLoading && !backendPolicy ? (
          <LoadingSpinner isVisible={true} />
        ) : backendPolicy?.sections?.length > 0 ? (
          backendPolicy.sections.map((section, index) => (
            <PolicySection 
              key={section._id || index}
              title={section.title} 
              content={section.content}
            />
          ))
        ) : (
          <>
            <PolicySection 
              title="1. Information We Collect" 
              content="We collect information you provide directly to us, such as when you create an account, complete challenges, or contact us for support. This includes your name, email address, profile photo, and eco activity data including challenge completions, EcoScore, streaks, and location data when you use GPS-based challenges."
            />

            <PolicySection 
              title="2. How We Use Your Information" 
              content="We use the information we collect to provide, maintain, and improve our services, including tracking your eco impact, calculating your EcoScore and XP, powering leaderboards, and sending you notifications about challenges and rewards. We also use data to personalize your experience and generate your Eco Impact Reports."
            />

            <PolicySection 
              title="3. Location Data" 
              content="When you participate in GPS-based challenges, we collect your location data to verify challenge completion. Location data is only collected when you explicitly start a GPS challenge and is used solely for verification purposes. You can disable location access at any time through your device settings or our app settings."
            />

            <PolicySection 
              title="4. Data Security" 
              content="We implement robust security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
            />
          </>
        )}

        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
    paddingHorizontal: widthPixel(20),
  },
  bannerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: widthPixel(16),
    padding: widthPixel(16),
    marginTop: heightPixel(16),
    gap: widthPixel(14),
  },
  bannerIconBg: {
    width: widthPixel(44),
    height: widthPixel(44),
    borderRadius: widthPixel(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#FFFFFF',
  },
  bannerDate: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: heightPixel(2),
  },
  introBox: {
    backgroundColor: '#F0FDF4',
    padding: widthPixel(16),
    borderRadius: widthPixel(16),
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: heightPixel(24),
    marginTop: heightPixel(20)
  },
  introText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#15803D',
    lineHeight: fontPixel(22),
  },
  boldText: {
    fontFamily: FontFamily.InterBold,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    marginBottom: heightPixel(16),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(14),
    color: '#111827',
    marginBottom: heightPixel(10),
  },
  policyText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    color: '#4B5563',
    lineHeight: fontPixel(21),
  },
});
