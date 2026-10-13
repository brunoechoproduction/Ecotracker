import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import CButton from '@/components/CButton';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel, hp, wp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';

export default function VerificationFailedScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { reason } = params;

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  return (
    <ParentWrapper style={{ backgroundColor: '#FEF2F2' }}>
      <View style={styles.container}>

        <Image source={appIcons.circleCross} style={styles.crossIcon} />


        <Text style={[styles.title, { color: "#7F1D1D" }]}>Verification Failed</Text>
        <Text style={[styles.subtitle, { color: "#991B1B" }]}>
          {reason || "We couldn't verify your photo. Please make sure the image is clear and shows the challenge activity."}
        </Text>

        <View style={[styles.tipsCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.tipsTitle, { color: "#374151" }]}>Try again with:</Text>
          <View style={styles.tipsList}>
            <Text style={[styles.tipItem, { color: "#6B7280" }]}>✓ A clearer, better-lit photo</Text>
            <Text style={[styles.tipItem, { color: "#6B7280" }]}>✓ Visible activity or context in frame</Text>
            <Text style={[styles.tipItem, { color: "#6B7280" }]}>✓ Recent timestamp (within 24h)</Text>
          </View>
        </View>

        <View style={{ height: heightPixel(28) }} />

        <CButton
          title="Try Again"
          icon={appIcons.reset}
          colors={['#DC2626', '#B91C1C']}
          onPress={() => router.back()}
          containerStyle={styles.retryButton}
          textStyle={styles.retryButtonText}
        />

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={[styles.backText, { color: "#6B7280" }]}>Back</Text>
        </TouchableOpacity>
      </View>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(20),
  },

  crossIcon: {

    width: widthPixel(180),
    height: widthPixel(180),
  },
  title: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(24),
    textAlign: 'center',
    marginTop: heightPixel(-5),
  },
  subtitle: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(14),
    marginTop: heightPixel(16),
    textAlign: 'center',
    lineHeight: fontPixel(24),
    marginHorizontal: wp(5)

  },
  tipsCard: {
    borderRadius: widthPixel(24),
    padding: widthPixel(24),
    marginTop: heightPixel(20),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  tipsTitle: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(13),
    marginBottom: heightPixel(16),
  },
  tipsList: {
    gap: heightPixel(12),
  },
  tipItem: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
  },
  retryButton: {
    height: heightPixel(60),
    borderRadius: widthPixel(16),
    width: wp(90),
    alignSelf: "center"
  },
  retryButtonText: {
    fontSize: fontPixel(18),
  },
  backLink: {
    marginTop: heightPixel(24),
  },
  backText: {
    fontFamily: FontFamily.InterSemiBold,
    fontSize: fontPixel(14),
  },
});
