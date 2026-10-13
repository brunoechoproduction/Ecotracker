import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import ParentWrapper from '@/components/ParentWrapper';
import { useResetPassword } from '@/hooks/useAuth';
import AuthHeader from '@/components/auth/AuthHeader';
import CButton from '@/components/CButton';
import InputField from '@/components/InputField';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import StepIndicator from '@/components/auth/StepIndicator';
import { useAppTheme } from '@/context/ThemeContext';
import { heightPixel } from '@/services/utilities/appFontSizes';

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams();
  const { colors } = useAppTheme();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutateAsync: resetPassword } = useResetPassword();

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: resetPasswordSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await resetPassword({ 
          email: email?.toString(), 
          otp: otp?.toString(), 
          password: values.password,
          role: 'user'
        });
        showMessage({ message: 'Password reset successfully!', type: 'success' });
        router.replace('/(auth)/reset-success');
      } catch (e) {
        const errorMessage = e.response?.data?.message || 'Error resetting password.';
        showMessage({ message: errorMessage, type: 'danger' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ParentWrapper disableTopPadding={true}>
      <AuthHeader
        title="New Password 🔒"
        subtitle="Create a strong new password"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <StepIndicator currentStep={3} totalSteps={3} />

          <InputField 
            colors={inputColors} 
            title="New Password" 
            placeholder="••••••••"
            leftIcon={require('../../../assets/icons/lock.png')}
            hideValue={!showPwd} 
            rightEyeIcon={!showPwd}
            showPassword={showPwd}
            onPressEyeIcon={() => setShowPwd(!showPwd)}
            value={formik.values.password} 
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            errorText={formik.touched.password && formik.errors.password}
            changeMainContainer={{ marginTop: heightPixel(24) }}
          />

          <InputField 
            colors={inputColors} 
            title="Confirm New Password" 
            placeholder="••••••••"
            leftIcon={require('../../../assets/icons/lock.png')}
            hideValue={!showConfirm} 
            rightEyeIcon={!showConfirm}
            showPassword={showConfirm}
            onPressEyeIcon={() => setShowConfirm(!showConfirm)}
            value={formik.values.confirmPassword} 
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            errorText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            changeMainContainer={{ marginTop: heightPixel(20) }}
          />

          <PasswordStrengthIndicator password={formik.values.password} />

          <View style={{ height: heightPixel(32) }} />
          
          <CButton 
            title="Reset Password 🔒" 
            onPress={formik.handleSubmit} 
            loading={formik.isSubmitting} 
            disabled={!formik.isValid || !formik.dirty}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: heightPixel(100) },
});
