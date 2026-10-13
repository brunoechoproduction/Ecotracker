import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, LayoutAnimation, TouchableOpacity } from 'react-native';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Accordion from '@/components/profile/Accordion';
import { appIcons } from '@/services/utilities/appAssets';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useFAQ } from '@/hooks/useSystem';
import LoadingSpinner from '@/components/LoadingSpinner';

const FAQ_DATA = [
  {
    id: 1,
    category: 'Getting Started',
    questions: [
      {
        q: 'What is EcoScore?',
        a: 'EcoScore is a metric that reflects your overall sustainability impact. It increases as you complete challenges and verify eco-friendly activities.'
      },
      {
        q: 'How do I earn points?',
        a: 'You earn points (EcoMiles) by completing daily challenges, reaching milestones, and participating in community events.'
      }
    ]
  },
  {
    id: 2,
    category: 'Challenges & Verification',
    questions: [
      {
        q: 'How do I verify a challenge?',
        a: 'Depending on the challenge, you may need to take a photo of the completed action or allow location tracking for activities like cycling.'
      },
      {
        q: 'Why was my submission rejected?',
        a: 'Submissions are rejected if the photo is unclear, the location data does not match, or the activity does not meet the specific challenge criteria.'
      }
    ]
  },
  {
    id: 3,
    category: 'Rewards & Account',
    questions: [
      {
        q: 'Can I redeem points for cash?',
        a: 'No, points have no cash value. They can be redeemed for eco-friendly products, discounts from partners, or donated to environmental causes.'
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Settings > Account > Delete Account. Please note that this action is permanent and all progress will be lost.'
      }
    ]
  }
];

export default function FAQScreen() {
  const { data: faqResponse, isLoading } = useFAQ();
  const [openId, setOpenId] = useState('1-0'); // CategoryID-QuestionIndex

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId(openId === id ? null : id);
  };

  const backendFaqs = faqResponse?.data?.faqs || faqResponse?.data || [];
  const faqsToUse = backendFaqs.length > 0 ? backendFaqs : FAQ_DATA;

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions"
        gradientColors={['#16A34A', '#14532D']}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Placeholder */}
        <View style={styles.searchPlaceholder}>
          <Image source={appIcons.information} style={styles.infoIcon} tintColor="#16A34A" />
          <Text style={styles.searchText}>Looking for something specific?</Text>
        </View>

        {isLoading && backendFaqs.length === 0 ? (
          <LoadingSpinner isVisible={true} />
        ) : (
          faqsToUse.map((category, catIndex) => {
            const categoryId = category.id || category._id || `cat-${catIndex}`;
            return (
              <View key={categoryId} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category.category.toUpperCase()}</Text>
                {category.questions.map((item, index) => {
                  const uniqueId = `${categoryId}-${index}`;
                  return (
                    <Accordion 
                      key={uniqueId}
                      title={item.q}
                      isOpen={openId === uniqueId}
                      onPress={() => toggleAccordion(uniqueId)}
                    >
                      {item.a}
                    </Accordion>
                  );
                })}
              </View>
            );
          })
        )}

        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <Text style={styles.contactText}>Our support team is here to help you 24/7.</Text>
          <TouchableOpacity style={styles.contactBtn}>
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

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
  searchPlaceholder: {
    backgroundColor: '#F0FDF4',
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    marginTop: heightPixel(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  infoIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
  },
  searchText: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(14),
    color: '#16A34A',
  },
  categorySection: {
    marginTop: heightPixel(24),
  },
  categoryTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#94A3B8',
    marginBottom: heightPixel(16),
    letterSpacing: 1,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    marginTop: heightPixel(32),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  contactTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(18),
    color: '#1E293B',
  },
  contactText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    color: '#64748B',
    textAlign: 'center',
    marginTop: heightPixel(8),
    marginBottom: heightPixel(20),
  },
  contactBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: widthPixel(32),
    paddingVertical: heightPixel(14),
    borderRadius: widthPixel(14),
  },
  contactBtnText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(15),
    color: '#FFFFFF',
  },
});
