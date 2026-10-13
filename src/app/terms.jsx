import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, LayoutAnimation } from 'react-native';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Accordion from '@/components/profile/Accordion';
import { appIcons } from '@/services/utilities/appAssets';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useTermsAndConditions } from '@/hooks/useSystem';
import LoadingSpinner from '@/components/LoadingSpinner';

const TERMS_DATA = [
  {
    id: 1,
    title: '1. Acceptance of Terms',
    content: 'By accessing or using EcoTrackr, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app. EcoTrackr reserves the right to update these terms at any time without prior notice.'
  },
  {
    id: 2,
    title: '2. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must be at least 13 years old to use EcoTrackr.'
  },
  {
    id: 3,
    title: '3. Eco Challenges & Verification',
    content: 'EcoTrackr provides sustainability challenges. Verification of challenge completion may require photo evidence or location data. We reserve the right to disqualify submissions that are fraudulent or do not meet our community guidelines.'
  },
  {
    id: 4,
    title: '4. EcoScore, Points & Rewards',
    content: 'Points and EcoScores are internal metrics and have no cash value. Rewards are subject to availability and may be changed or removed at any time. We are not responsible for third-party rewards or their fulfillment.'
  },
  {
    id: 5,
    title: '5. User Conduct',
    content: 'You agree not to use the app for any unlawful purpose or to solicit others to perform or participate in any unlawful acts. Harassment, abuse, or impersonation of other users is strictly prohibited.'
  },
  {
    id: 6,
    title: '6. Intellectual Property',
    content: 'All content, features, and functionality of EcoTrackr are the exclusive property of EcoTrackr Inc. and are protected by international copyright, trademark, and other intellectual property laws.'
  },
  {
    id: 7,
    title: '7. Location & Photo Data',
    content: 'EcoTrackr uses location services and camera access to verify eco-friendly activities. By using these features, you consent to our collection and use of this data as described in our Privacy Policy.'
  }
];

export default function TermsScreen() {
  const { data: termsResponse, isLoading } = useTermsAndConditions();
  const [openId, setOpenId] = useState(1);

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(openId === id ? null : id);
  };

  const renderFirstEcoTrackrBold = (text) => {
    if (typeof text !== 'string') return text;
    const match = text.match(/EcoTrackr/i);
    if (!match) return text;
    const index = match.index;
    return (
      <Text>
        {text.substring(0, index)}
        <Text style={styles.boldText}>{match[0]}</Text>
        {text.substring(index + match[0].length)}
      </Text>
    );
  };

  const backendTerms = termsResponse?.data?.terms;
  const termsToUse = backendTerms?.sections?.length > 0 ? backendTerms.sections.map((t, idx) => ({
    id: t._id || t.id || idx + 1,
    title: t.title,
    content: renderFirstEcoTrackrBold(t.content)
  })) : TERMS_DATA.map(t => ({...t, content: renderFirstEcoTrackrBold(t.content)}));

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
        showBackButton={false}
        title="Terms & Conditions" 
        subtitle=""
        gradientColors={['#16A34A', '#14532D']}
      >
        <View style={styles.bannerBox}>
          <View style={styles.iconWrapper}>
            <Image source={appIcons.page} style={styles.bannerIcon} tintColor="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.bannerTitle}>Please read carefully 📋</Text>
            <Text style={styles.bannerSubtitle}>
              Effective date: {backendTerms?.effectiveDate 
                ? new Date(backendTerms.effectiveDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) 
                : 'January 1, 2026'}
            </Text>
          </View>
        </View>
      </ProfileHeader>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            {backendTerms?.introduction ? (
              renderFirstEcoTrackrBold(backendTerms.introduction)
            ) : (
              <>These Terms and Conditions govern your use of <Text style={styles.boldText}>EcoTrackr</Text> (the "App") operated by EcoTrackr Inc. By using our App, you agree to these terms. These terms form a legally binding agreement between you and EcoTrackr Inc.</>
            )}
          </Text>
        </View>

        {/* Accordion List */}
        {isLoading && !backendTerms ? (
          <LoadingSpinner isVisible={true} />
        ) : (
          <View style={styles.listContainer}>
            {termsToUse.map((item) => (
              <Accordion 
                key={item.id}
                title={item.title}
                isOpen={openId === item.id}
                onPress={() => toggleAccordion(item.id)}
              >
                {item.content}
              </Accordion>
            ))}
          </View>
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
  iconWrapper: {
    width: widthPixel(42),
    height: widthPixel(42),
    borderRadius: widthPixel(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerIcon: {
    width: widthPixel(22),
    height: widthPixel(22),
  },
  bannerTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: heightPixel(2),
  },
  introCard: {
    backgroundColor: '#FFFBEB',
    padding: widthPixel(18),
    borderRadius: widthPixel(20),
    marginTop: heightPixel(20),
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  introText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(13),
    lineHeight: fontPixel(22),
    color: '#92400E',
  },
  boldText: {
    fontFamily: FontFamily.InterBold,
  },
  listContainer: {
    marginTop: heightPixel(24),
  },
});
