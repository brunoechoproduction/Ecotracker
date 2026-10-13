import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import ParentWrapper from '@/components/ParentWrapper';
import AuthHeader from '@/components/auth/AuthHeader';
import CButton from '@/components/CButton';
import InputField from '@/components/InputField';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { wp } from '../../services/utilities/appFontSizes';
import { useLogin, useResendOTP } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  const { mutateAsync: login, isPending } = useLogin();
  const { mutateAsync: resendOTP } = useResendOTP();
  const { setAuth } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: __DEV__ ? (process.env.EXPO_PUBLIC_DEV_EMAIL || '') : '',
      password: __DEV__ ? (process.env.EXPO_PUBLIC_DEV_PASSWORD || '') : '',
      role: 'user'
    },
    validationSchema: loginSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values);

        // Check if user is unverified after successful login
        const user = response?.data?.user;
        if (user && (user.isVerified === false || user.isEmailVerified === false || user.is_verified === false)) {
          // Send OTP before navigating to verification page
          try {
            await resendOTP({ email: values.email });
          } catch (otpError) {
            console.log('Error sending OTP:', otpError);
          }
          showMessage({ message: 'Please verify your email. A new OTP has been sent.', type: 'warning' });
          router.push({ pathname: '/(auth)/verify-otp', params: { email: values.email, mode: 'signup' } });
          return;
        }

        await setAuth(response.data.user, response.data.token, response.data.refreshToken);

        showMessage({ message: 'Logged in successfully!', type: 'success' });
        router.replace('/(tabs)');
      } catch (e) {
        // Handle unverified email — server returns 403 with errorType
        if (e.response?.status === 403 && e.response?.data?.errorType === 'email-unverified') {
          // Explicitly resend OTP here before navigating
          try {
            await resendOTP({ email: values.email });
          } catch (otpError) {
            console.log('Error resending OTP on 403:', otpError);
          }
          showMessage({ message: 'Please verify your email. A new OTP has been sent.', type: 'warning' });
          router.push({ pathname: '/(auth)/verify-otp', params: { email: values.email, mode: 'signup' } });
        } else {
          let errorMessage = 'Login failed. Please check your internet connection and try again.';
          if (e.response) {
            errorMessage = e.response.data?.message || 'Login failed. Please try again.';
          } else if (e.message && e.message.toLowerCase().includes('timeout')) {
            errorMessage = 'Connection timed out. Please check your connection and try again.';
          } else if (e.message && e.message.toLowerCase().includes('network')) {
            errorMessage = 'Network error. Please make sure the server is reachable.';
          } else if (e.message) {
            errorMessage = e.message;
          }
          showMessage({ message: errorMessage, type: 'danger' });
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ParentWrapper disableTopPadding={true}>
      <AuthHeader title="Welcome Back 🌱" subtitle="Continue your eco journey" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <InputField
            colors={inputColors}
            title="Email Address"
            placeholder="you@example.com"
            leftIcon={require('../../../assets/icons/email.png')}
            value={formik.values.email}
            onChangeText={(text) => formik.setFieldValue('email', text.trim().toLowerCase())}
            onBlur={formik.handleBlur('email')}
            keyboardType="email-address"
            errorText={formik.touched.email && formik.errors.email}
            changeMainContainer={styles.firstField}
          />

          <InputField
            colors={inputColors}
            title="Password"
            placeholder="Enter your password"
            leftIcon={require('../../../assets/icons/lock.png')}
            hideValue={!showPassword}
            rightEyeIcon={!showPassword}
            showPassword={showPassword}
            onPressEyeIcon={() => setShowPassword(!showPassword)}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            errorText={formik.touched.password && formik.errors.password}
          />

          <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={[styles.forgotText, { color: "#16A34A" }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, minHeight: heightPixel(60) }} />

          <CButton
            title="Login to EcoTrackr"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
            <Text style={[styles.orText, { color: "#9CA3AF" }]}>or</Text>
            <View style={[styles.line, { backgroundColor: colors.divider }]} />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.bottomRow}>
            <Text style={[styles.bottomText, { color: colors.textSecondary }]}>No account? </Text>
            <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up Free</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  form: { flexGrow: 1, paddingBottom: heightPixel(32) },
  firstField: { marginTop: heightPixel(28) },
  forgotRow: { alignSelf: 'flex-end', marginRight: widthPixel(20), marginTop: heightPixel(4) },
  forgotText: { fontFamily: FontFamily.InterSemiBold, fontSize: fontPixel(13), marginTop: wp(3) },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: widthPixel(20), marginTop: heightPixel(24) },
  line: { flex: 1, height: 1 },
  orText: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(13), marginHorizontal: widthPixel(12) },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: heightPixel(20) },
  bottomText: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(14), },
  linkText: { fontFamily: FontFamily.InterSemiBold, fontSize: fontPixel(16), lineHeight: 18 },
});
