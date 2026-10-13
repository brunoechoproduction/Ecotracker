import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import AuthHeader from '@/components/auth/AuthHeader';
import CButton from '@/components/CButton';
import InfoBox from '@/components/auth/InfoBox';
import OTPInput from '@/components/auth/OTPInput';
import StepIndicator from '@/components/auth/StepIndicator';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { useVerifyOTPResetPassword, useForgotPassword, useVerifyEmail, useResendOTP } from '@/hooks/useAuth';
import { useAuth } from '@/context/AuthContext';
import { showMessage } from 'react-native-flash-message';
import { fontPixel, heightPixel } from '@/services/utilities/appFontSizes';

const RESEND_SECONDS = 60;

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { email = '', mode = 'forgot-password' } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const isSignupMode = mode === 'signup';

  // Forgot-password hooks
  const { mutateAsync: verifyOTPResetPassword } = useVerifyOTPResetPassword();
  const { mutateAsync: forgotPassword } = useForgotPassword();

  // Signup email verification hooks
  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const { mutateAsync: resendOTP } = useResendOTP();
  const { setAuth } = useAuth();

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = () => {
    setTimer(RESEND_SECONDS);
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(intervalRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      if (isSignupMode) {
        await resendOTP({ email: email.toString() });
      } else {
        await forgotPassword({ email: email.toString(), role: "user" });
      }
      showMessage({ message: 'Code resent successfully!', type: 'success' });
      setCode('');
      startTimer();
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Error resending code.';
      showMessage({ message: errorMessage, type: 'danger' });
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      if (isSignupMode) {
        // Signup email verification — returns tokens + user
        const response = await verifyEmail({ email: email.toString(), otp: code });
        
        if (response?.data?.token && response?.data?.user && response?.data?.refreshToken) {
          await setAuth(response.data.user, response.data.token, response.data.refreshToken);
        }
        
        showMessage({ message: response?.message || 'Email verified successfully!', type: 'success' });
        router.replace('/(auth)/signup-success');
      } else {
        // Forgot-password OTP verification
        await verifyOTPResetPassword({ email: email.toString(), otp: code, role: 'user' });
        router.replace({ pathname: '/(auth)/reset-password', params: { email, otp: code } });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Invalid code. Please try again.';
      showMessage({ message: errorMessage, type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentWrapper disableTopPadding={true}>
      <AuthHeader
        title={isSignupMode ? "Verify Your Email 📧" : "Check Your Email 📧"}
        subtitle={`We sent a 6-digit code to ${email}`}
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StepIndicator currentStep={2} totalSteps={isSignupMode ? 2 : 3} />

        <Text style={[styles.codeLabel, { color: "#374151" }]}>Enter 6-Digit Code</Text>
        <OTPInput code={code} onChangeCode={setCode} />

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <>
              <Text style={[styles.resendBase, { color: "#9CA3AF" }]}>Resend code in </Text>
              <Text style={[styles.timerText, { color: colors.primary }]}>{timer}s</Text>
            </>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendLink, { color: colors.primary }]}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: heightPixel(20) }} />
        <InfoBox
          variant="warning"
          emoji="⏱️"
          text="This code expires in 10 minutes. Check your spam folder if not received."
        />

        <View style={{ height: heightPixel(32) }} />
        <CButton 
          title={isSignupMode ? "Verify Email ✓" : "Verify Code ✓"} 
          onPress={handleVerify} 
          loading={loading} 
          disabled={code.length < 6} 
        />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: heightPixel(40) },
  codeLabel: { fontFamily: FontFamily.InterSemiBold, fontSize: fontPixel(14), textAlign: 'center', marginTop: heightPixel(20), marginBottom: heightPixel(10) },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginTop: heightPixel(21), marginBottom: heightPixel(5), alignItems: 'center' },
  resendBase: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(13) },
  timerText: { fontFamily: FontFamily.InterBold, fontSize: fontPixel(13) },
  resendLink: { fontFamily: FontFamily.InterRegular, fontSize: fontPixel(13) },
});

