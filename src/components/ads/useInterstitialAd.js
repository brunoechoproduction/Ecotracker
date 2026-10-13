import { useState, useEffect, useCallback } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

const isTestMode = String(process.env.EXPO_PUBLIC_ADMOB_TEST_MODE).trim().toLowerCase() === 'true';
const productionAdUnitId = Platform.OS === 'ios'
  ? process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL
  : process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL;

const adUnitId = isTestMode ? TestIds.INTERSTITIAL : productionAdUnitId;
export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);
  const [ad, setAd] = useState(null);

  useEffect(() => {
    if (!adUnitId || typeof adUnitId !== 'string') {
      if (__DEV__) {
        console.warn('useInterstitialAd: adUnitId missing or invalid, skipping ad load', {
          isTestMode,
          adUnitId,
        });
      }
      return;
    }

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    setAd(interstitial);

    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error: ', error);
      // Still set loaded to false or handle error state if needed
    });

    // Start loading the ad
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
    };
  }, []);

  const showAd = useCallback(async (onAdClosed) => {
    if (loaded && ad) {
      // Listen for the close event to trigger the callback (e.g., navigation)
      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        unsubscribeClosed();
        if (onAdClosed) onAdClosed();
      });
      
      try {
        await ad.show();
      } catch (error) {
        console.error("Failed to show interstitial:", error);
        unsubscribeClosed();
        if (onAdClosed) onAdClosed();
      }
    } else {
      // If ad isn't loaded yet (or failed), fallback gracefully and continue user flow
      if (onAdClosed) onAdClosed();
    }
  }, [loaded, ad]);

  return { loaded, showAd };
};
