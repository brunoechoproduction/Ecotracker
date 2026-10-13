import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Image,
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
import { useSignUp } from '@/hooks/useAuth';

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  const { mutateAsync: signup } = useSignUp();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '', role: "user" },
    validationSchema: signupSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!agreed) {
        showMessage({ message: 'Please agree to the Terms and Conditions', type: 'warning' });
        setSubmitting(false);
        return;
      }
      try {
        const { confirmPassword, ...payload } = values;

        console.log('📤 [Signup Screen] Sending payload:', JSON.stringify(payload, null, 2));
        const response = await signup(payload);
        console.log('📥 [Signup Screen] Response:', JSON.stringify(response, null, 2));

        // Don't save auth here — user needs to verify email first
        showMessage({ message: response?.message || 'Verification code sent to your email!', type: 'success' });
        router.push({ pathname: '/(auth)/verify-otp', params: { email: values.email, mode: 'signup' } });
      } catch (e) {
        console.log('❌ [Signup Screen] Error:', e?.response?.data || e.message);
        const errorMessage = e.response?.data?.message || 'Signup failed. Please try again.';
        showMessage({ message: errorMessage, type: 'danger' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ParentWrapper disableTopPadding={true}>
      <AuthHeader
        title="Create Account 🌍"
        subtitle="Join 50K+ eco warriors worldwide"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <InputField
            colors={inputColors}
            title="Full Name"
            placeholder="Aria Chen"
            leftIcon={require('../../../assets/icons/person.png')}
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            errorText={formik.touched.name && formik.errors.name}
            changeMainContainer={styles.firstField}
          />

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
          />

          <InputField
            colors={inputColors}
            title="Password"
            placeholder="Min. 8 characters"
            leftIcon={require('../../../assets/icons/lock.png')}
            hideValue={!showPwd}
            rightEyeIcon={!showPwd}
            showPassword={showPwd}
            onPressEyeIcon={() => setShowPwd(!showPwd)}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            onBlur={formik.handleBlur('password')}
            errorText={formik.touched.password && formik.errors.password}
          />

          <InputField
            colors={inputColors}
            title="Confirm Password"
            placeholder="Re-enter password"
            leftIcon={require('../../../assets/icons/lock.png')}
            hideValue={!showConfirm}
            rightEyeIcon={!showConfirm}
            showPassword={showConfirm}
            onPressEyeIcon={() => setShowConfirm(!showConfirm)}
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange('confirmPassword')}
            onBlur={formik.handleBlur('confirmPassword')}
            errorText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          {/* Terms */}
          <TouchableOpacity style={styles.checkRow} onPress={() => setAgreed(!agreed)} activeOpacity={0.7}>
            <View style={[styles.checkbox, agreed && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
              {agreed && (
                <Image source={require('../../../assets/icons/white_tick.png')}
                  style={styles.tickIcon} resizeMode="contain" />
              )}
            </View>
            <Text style={[styles.checkText, { color: colors.textSecondary }]}>
              I agree to EcoTrackr's{' '}
              <Text onPress={() => router.push('/terms')} style={[styles.link, { color: colors.primary }]}>Terms of Service</Text>
              {' '}and{' '}
              <Text onPress={() => router.push('/privacy-policy')} style={[styles.link, { color: colors.primary }]}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <View style={{ height: heightPixel(24) }} />

          <CButton
            title="Create My Account 🌱"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
          />

          <TouchableOpacity onPress={() => router.back()} style={styles.bottomRow}>
            <Text style={[styles.bottomText, { color: colors.textSecondary }]}>Already have an account?</Text>
            <Text style={[styles.linkBold, { color: colors.primary }]}> Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  form: { paddingBottom: heightPixel(100) },
  firstField: { marginTop: heightPixel(28) },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: widthPixel(20), marginTop: heightPixel(20), gap: widthPixel(12) },
  checkbox: { width: widthPixel(20), height: widthPixel(20), borderRadius: widthPixel(4), borderWidth: 2, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginTop: heightPixel(2) },
  tickIcon: { width: widthPixel(12), height: widthPixel(12) },
  checkText: { flex: 1, fontFamily: FontFamily.InterRegular, fontSize: fontPixel(13), lineHeight: fontPixel(20) },
  link: { fontFamily: FontFamily.InterSemiBold },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: heightPixel(20) },
  bottomText: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(15) },
  linkBold: { fontFamily: FontFamily.InterSemiBold, fontSize: fontPixel(16) },
});
