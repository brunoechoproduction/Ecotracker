import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import InputField from '@/components/InputField';
import CButton from '@/components/CButton';
import { appIcons } from '@/services/utilities/appAssets';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useAppTheme } from '@/context/ThemeContext';
import { hp, wp } from '../../../services/utilities/appFontSizes';
import { useHelpCenter, useCustomerSupport } from '@/hooks/useSystem';
import { showMessage } from 'react-native-flash-message';
import LoadingSpinner from '@/components/LoadingSpinner';

const ContactMethod = ({ icon, label, value, bgColor, tintColor = "#3B82F6" }) => (
  <View style={[styles.methodCard, { backgroundColor: bgColor }]}>
    <Image source={icon} style={styles.methodIcon} tintColor={tintColor} />
    <Text style={styles.methodLabel}>{label}</Text>
    <Text style={styles.methodValue}>{value}</Text>
  </View>
);

export default function SupportScreen() {
  const { colors } = useAppTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { data: helpResponse, isLoading } = useHelpCenter();
  const { mutateAsync: submitSupport, isPending: isSubmitting } = useCustomerSupport();

  const helpData = helpResponse?.data?.helpCenter || helpResponse?.data || {};

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      showMessage({ message: 'Please fill in all fields', type: 'warning' });
      return;
    }

    try {
      const response = await submitSupport({ fullName: name, email, subject, message });
      const successMessage = response?.data?.message || response?.message || 'Message sent successfully!';
      showMessage({ message: successMessage, type: 'success' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send message. Please try again.';
      showMessage({ message: errorMessage, type: 'danger' });
    }
  };

  const emailVal = helpData.email || "support@ecotrackr.io";
  const phoneVal = helpData.phoneNumber || "+1 (800) 326-2876";
  const officeVal = helpData.officeAddress || "San Francisco, CA";
  const responseTimeVal = helpData.responseTime || "Under 4 hours";
  const operatingHoursVal = helpData.operatingHours || "Mon–Fri, 9am–6pm PST";

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader
        showBackButton={false}
        title="Contact Us"
        subtitle="We reply within 24 hours — usually much faster!"
        gradientColors={['#16A34A', '#14532D']}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Contact Methods Grid */}
          {isLoading && !helpResponse ? (
            <LoadingSpinner isVisible={true} />
          ) : (
            <View style={styles.methodsGrid}>
              <ContactMethod
                icon={appIcons.email}
                label="EMAIL"
                value={emailVal}
                bgColor="#F0FDF4"
                tintColor='#16A34A'
              />
              <ContactMethod
                icon={appIcons.phone}
                label="PHONE"
                value={phoneVal}
                bgColor="#EFF6FF"
                tintColor='#3B82F6'
              />
              <ContactMethod
                icon={appIcons.pin}
                label="OFFICE"
                value={officeVal}
                bgColor="#FFFBEB"
                tintColor='#F59E0B'
              />
            </View>
          )}

          {/* Response Time Indicator */}
          {!isLoading && (
            <View style={styles.responseBox}>
              <Image source={appIcons.thunder64} style={styles.thunderIcon} tintColor="#F59E0B" />
              <View>
                <Text style={styles.responseText}>Average Response Time: <Text style={styles.greenBold}>{responseTimeVal}</Text></Text>
                <Text style={styles.responseSubtitle}>{operatingHoursVal}</Text>
              </View>
            </View>
          )}

          {/* Message Form */}
          <View style={styles.formCard}>
            <Text style={styles.formHeader}>SEND US A MESSAGE</Text>

            <InputField
              colors={inputColors}
              title="Full Name"
              placeholder="Your name"

              value={name}
              onChangeText={setName}
              changeMainContainer={styles.fieldMargin}
            />

            <InputField
              colors={inputColors}
              title="Email"
              placeholder="you@example.com"

              value={email}
              onChangeText={(text) => setEmail(text.trim().toLowerCase())}
              keyboardType="email-address"
              changeMainContainer={styles.fieldMargin}
            />

            <InputField
              colors={inputColors}
              title="Subject"
              placeholder="Select a subject..."

              value={subject}
              onChangeText={setSubject}
              showDropDownIcon={true}
              changeMainContainer={styles.fieldMargin}
            />

            <InputField
              colors={inputColors}
              title="Message"
              placeholder="Describe your issue or question in detail..."
              multiLineStatus={true}
              numberOfLinesToShow={5}
              value={message}
              onChangeText={setMessage}
              changeContainer={styles.textArea}
              changeMainContainer={styles.fieldMargin}
            />

            <Text style={styles.charCount}>{message.length}/500</Text>
          </View>





          <View style={{ height: heightPixel(40) }} />
        </ScrollView>
        <CButton
          icon={appIcons.send}
          title="Send Message"
          onPress={handleSubmit}
          loading={isSubmitting}
          changeMainContainer={styles.sendBtn}
        />
      </KeyboardAvoidingView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: hp(20),
  },
  methodsGrid: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    marginTop: heightPixel(24),
    gap: widthPixel(12),
  },
  methodCard: {
    flex: 1,
    borderRadius: widthPixel(20),
    padding: widthPixel(4),
    paddingVertical: heightPixel(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  methodIcon: {
    width: widthPixel(20),
    height: widthPixel(20),
    marginBottom: heightPixel(8),
  },
  methodLabel: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(10),
    color: '#6B7280',
    marginBottom: heightPixel(4),
  },
  methodValue: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(11),
    color: '#111827',
    textAlign: 'center',
  },
  responseBox: {
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    backgroundColor: '#F0FDF4',
    borderRadius: widthPixel(16),
    padding: widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(12),
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  thunderIcon: {
    width: widthPixel(24),
    height: widthPixel(24),
  },
  responseText: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#16A34A',
  },
  greenBold: {
    fontFamily: FontFamily.InterBold,
  },
  responseSubtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#6B7280',
    marginTop: heightPixel(2),
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: widthPixel(20),
    marginTop: heightPixel(24),
    borderRadius: widthPixel(24),
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(24),
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  formHeader: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    marginLeft: widthPixel(0),
    marginBottom: heightPixel(8),
    letterSpacing: 0.5,
  },
  fieldMargin: {
    marginHorizontal: 0,
    marginTop: heightPixel(15),
  },
  textArea: {
    height: heightPixel(120),
    alignItems: 'flex-start',
    paddingTop: heightPixel(12),

  },
  charCount: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(11),
    color: '#9CA3AF',
    textAlign: 'right',
    marginRight: widthPixel(0),
    marginTop: heightPixel(8),

  },
  sendBtn: {
    marginBottom: heightPixel(20)
  },
  btnIcon: {
    width: widthPixel(18),
    height: widthPixel(18),
    marginRight: widthPixel(8),
    transform: [{ rotate: '-45deg' }],
  },
});
