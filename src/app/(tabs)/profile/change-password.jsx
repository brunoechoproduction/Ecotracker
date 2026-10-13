import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showMessage } from 'react-native-flash-message';
import ParentWrapper from '@/components/ParentWrapper';
import ProfileHeader from '@/components/profile/ProfileHeader';
import InputField from '@/components/InputField';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { appIcons } from '@/services/utilities/appAssets';
import { heightPixel, widthPixel, fontPixel } from '@/services/utilities/appFontSizes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUpdatePassword } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const TipItem = ({ text }) => (
  <View style={styles.tipItem}>
    <View style={styles.dot} />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const insets = useSafeAreaInsets();
  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  const { mutateAsync: updatePassword } = useUpdatePassword();
  const { setAuth } = useAuth();

  const formik = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await updatePassword({
          currentPassword: values.currentPassword,
          password: values.newPassword,
        });

        if (response?.data?.token && response?.data?.user && response?.data?.refreshToken) {
          await setAuth(response.data.user, response.data.token, response.data.refreshToken);
        }

        showMessage({ message: 'Password updated successfully!', type: 'success' });
        router.back();
      } catch (e) {
        if (e.response?.status === 400 && e.response?.data?.errorType === 'incorrect-old-password') {
          showMessage({ message: 'Incorrect current password. Please try again.', type: 'danger' });
        } else {
          const errorMessage = e.response?.data?.message || 'Failed to update password. Please try again.';
          showMessage({ message: errorMessage, type: 'danger' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ParentWrapper disableTopPadding={true}>
      <ProfileHeader 
        showBackButton={false}
        title="Change Password" 
        subtitle="Keep your account secure with a strong password"
        gradientColors={['#16A34A', '#14532D']}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Current Password Section */}
        <View style={styles.card}>
          <InputField
            title="CURRENT PASSWORD"
            colors={inputColors}
            placeholder="Enter current password"
            leftIcon={appIcons.lock}
            hideValue={!showCurrent}
            rightEyeIcon={true}
            showPassword={showCurrent}
            onPressEyeIcon={() => setShowCurrent(!showCurrent)}
            value={formik.values.currentPassword}
            onChangeText={formik.handleChange('currentPassword')}
            onBlur={formik.handleBlur('currentPassword')}
            errorText={formik.touched.currentPassword && formik.errors.currentPassword}
            changeMainContainer={styles.fieldMargin}
          />
          <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.forgotText}>Forgot current password?</Text>
          </TouchableOpacity>
        </View>

        {/* New Password Section */}
        <View style={styles.card}>
          <InputField
            title="NEW PASSWORD"
            colors={inputColors}
            placeholder="Enter new password"
            leftIcon={appIcons.lock}
            hideValue={!showNew}
            rightEyeIcon={true}
            showPassword={showNew}
            onPressEyeIcon={() => setShowNew(!showNew)}
            value={formik.values.newPassword}
            onChangeText={formik.handleChange('newPassword')}
            onBlur={formik.handleBlur('newPassword')}
            errorText={formik.touched.newPassword && formik.errors.newPassword}
            changeMainContainer={styles.fieldMargin}
          />
          <InputField
            colors={inputColors}
            placeholder="Confirm new password"
            leftIcon={appIcons.lock}
            hideValue={!showConfirm}
            rightEyeIcon={true}
            showPassword={showConfirm}
            onPressEyeIcon={() => setShowConfirm(!showConfirm)}
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            errorText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            changeMainContainer={styles.fieldMargin}
          />
        </View>

        {/* Password Tips */}
        <View style={styles.tipsBox}>
          <View style={styles.tipsHeader}>
            <Image 
              source={appIcons.lock} 
              style={styles.tipIcon} 
              tintColor="#16A34A" 
            />
            <Text style={styles.tipsTitle}>Password Tips</Text>
          </View>
          <TipItem text="Use at least 8 characters" />
          <TipItem text="Include uppercase & lowercase letters" />
          <TipItem text="Add numbers and symbols" />
          <TipItem text="Avoid common words or birthdays" />
        </View>

        <View style={{ height: heightPixel(40) }} />
      </ScrollView>
      <CButton 
            containerStyle={{marginBottom:insets.bottom}}

        title="Update Password 🔐" 
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
        changeMainContainer={styles.submitBtn}
      />
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: heightPixel(20),
    paddingHorizontal: widthPixel(20),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(24),
    paddingHorizontal: widthPixel(20),
    paddingVertical: heightPixel(16),
    marginTop: heightPixel(24),
    borderWidth: 1,
    borderColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  fieldMargin: {
    marginBottom: heightPixel(16),
    marginHorizontal: 0,
    marginTop: 0,
  },
  forgotBtn: {
  },
  forgotText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(12),
    color: '#16A34A',
  },
  tipsBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: widthPixel(20),
    padding: widthPixel(20),
    marginTop: heightPixel(24),
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    marginBottom: heightPixel(12),
  },
  tipIcon: {
    width: widthPixel(14),
    height: widthPixel(14),
  },
  tipsTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(12),
    color: '#16A34A',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(10),
    marginTop: heightPixel(8),
  },
  dot: {
    width: widthPixel(5),
    height: widthPixel(5),
    borderRadius: widthPixel(2.5),
    backgroundColor: '#16A34A',
  },
  tipText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#166534',
  },
  submitBtn: {
    marginTop: heightPixel(32),
  },
});
