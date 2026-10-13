import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { showMessage } from 'react-native-flash-message';
import ParentWrapper from '@/components/ParentWrapper';
import { useForgotPassword } from '@/hooks/useAuth';
import AuthHeader from '@/components/auth/AuthHeader';
import StepIndicator from '@/components/auth/StepIndicator';
import InfoBox from '@/components/auth/InfoBox';
import CButton from '@/components/CButton';
import InputField from '@/components/InputField';
import { useAppTheme } from '@/context/ThemeContext';
import { heightPixel, widthPixel } from '@/services/utilities/appFontSizes';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const inputColors = {
    inputBackground: colors.inputBackground,
    primary: colors.primary,
    darkGrey: colors.darkGrey,
    black: colors.black,
    text2: colors.text2,
  };

  const { mutateAsync: forgotPassword } = useForgotPassword();

  const formik = useFormik({
    initialValues: { email: '', role: 'user' },
    validationSchema: forgotPasswordSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await forgotPassword(values);
        showMessage({
          message: 'Reset code sent!',
          description: `A code has been sent to ${values.email}`,
          type: 'success'
        });
        router.push({ pathname: '/(auth)/verify-otp', params: { email: values.email } });
      } catch (e) {
        const errorMessage = e?.response?.data?.message || 'Error sending code. Please try again.';
        showMessage({ message: errorMessage, type: 'danger' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ParentWrapper disableTopPadding={true}>
      <AuthHeader
        title="Forgot Password? 🔑"
        subtitle="Enter your email and we'll send a reset code"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <StepIndicator currentStep={1} totalSteps={3} />

          <InputField
            colors={inputColors}
            title="Email Address"
            placeholder="you@example.com"
            leftIcon={require('../../../assets/icons/email.png')}
            value={formik.values.email}
            onChangeText={(text) => formik.setFieldValue('email', text.trim().toLowerCase())}
            onBlur={formik.handleBlur('email')}
            errorText={formik.touched.email && formik.errors.email}
            keyboardType="email-address"
            changeMainContainer={styles.fieldTop}
          />

          <View style={{ height: heightPixel(24) }} />

          <InfoBox
            emoji="💡"
            text={"We'll send a one-time verification code to this email\naddress."}
          />

          <View style={{ height: heightPixel(48) }} />

          <CButton
            title="Send Reset Code 📨"
            onPress={formik.handleSubmit}
            loading={formik.isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: heightPixel(40) },
  fieldTop: { marginTop: heightPixel(8) },
});
