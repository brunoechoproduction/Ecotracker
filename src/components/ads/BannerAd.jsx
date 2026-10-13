import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const isTestMode = String(process.env.EXPO_PUBLIC_ADMOB_TEST_MODE).trim().toLowerCase() === 'true';
const productionAdUnitId = Platform.OS === 'ios'
  ? process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER
  : process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER;

const adUnitId = isTestMode ? TestIds.BANNER : productionAdUnitId;
const CustomBannerAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  if (!adUnitId || typeof adUnitId !== 'string') {
    if (__DEV__) {
      console.warn('CustomBannerAd: adUnitId missing or invalid, skipping ad render', {
        isTestMode,
        adUnitId,
      });
    }
    return null;
  }

  return (
    <View style={[styles.container, !isAdLoaded && styles.placeholder]}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => setIsAdLoaded(true)}
        onAdFailedToLoad={(error) => {
          console.error('Banner Ad failed to load: ', error);
          console.log('DEBUG ADMOB:', { isTestMode, adUnitId, envVal: process.env.EXPO_PUBLIC_ADMOB_TEST_MODE });
          setIsAdLoaded(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50, // Typical banner height to prevent Cumulative Layout Shift
  },
  placeholder: {
    backgroundColor: '#f3f4f6', // Light gray skeleton placeholder
  }
});

export default React.memo(CustomBannerAd);
