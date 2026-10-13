import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import AuthHeader from '@/components/auth/AuthHeader';
import CButton from '@/components/CButton';
import InfoBox from '@/components/auth/InfoBox';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { hp, wp } from '../../services/utilities/appFontSizes';

export default function ResetSuccessScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <ParentWrapper disableTopPadding={true}>
      <AuthHeader
        title="All Done! ✅"
        subtitle="Your password has been reset"
        showBackButton
        onBackPress={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../../assets/icons/circle_green_tick.png')}
          style={styles.successIcon}
          resizeMode="contain"
        />

        <Text style={[styles.heading, { color: "#111827" }]}>Password Reset! 🎉</Text>
        <Text style={[styles.description, { color: "#6B7280" }]}>
          Your password has been successfully updated. You can now log in with your new password.
        </Text>

        <View style={{ height: heightPixel(24) }} />
        <InfoBox 
          emoji="🔐" 
          text="Keep your password safe and never share it with anyone." 
        />

        <View style={{ height: heightPixel(48) }} />
        <CButton 
          title="Back to Login" 
          onPress={() => router.replace('/(auth)/login')} 
        />
      </ScrollView>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center', paddingBottom: heightPixel(48) },
  successIcon: {
    width: wp(40),
    height: wp(40),
    marginTop: hp(3.5),
  },
  heading: { fontFamily: FontFamily.InterExtraBold, fontSize: fontPixel(22), textAlign: 'center',lineHeight: 32  },
  description: {
    fontFamily: FontFamily.InterRegular, fontSize: fontPixel(14.5),
    textAlign: 'center', lineHeight: fontPixel(23),
    paddingHorizontal: wp(4), marginTop: heightPixel(12),
  },
});
