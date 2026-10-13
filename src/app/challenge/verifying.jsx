import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import { useAppTheme } from '@/context/ThemeContext';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel, hp, wp } from '@/services/utilities/appFontSizes';
import { appIcons } from '@/services/utilities/appAssets';
import { useSubmitChallengeAttempt } from '@/hooks/useChallenges';
import { userService } from '@/services/api/userService';
import * as Location from 'expo-location';

export default function AIVerifyingScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const params = useLocalSearchParams();
  const navigation = useNavigation();

  // Retrieve params passed from upload screen
  const {
    attemptId,
    challengeId,
    image,
    requiresPhoto,
    requiresGPS,
    isSelfCheck,
    title,
    points,
    xp
  } = params;

  const dot1 = useRef(new Animated.Value(0.4)).current;
  const dot2 = useRef(new Animated.Value(0.4)).current;
  const dot3 = useRef(new Animated.Value(0.4)).current;

  const submitAttemptMutation = useSubmitChallengeAttempt();

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  useEffect(() => {
    // Setup animation
    const animate = (val, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.4, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);

    let isMounted = true;
    const minAnimationDuration = 2500; // 2.5 seconds minimum
    const startTime = Date.now();

    const verify = async () => {
      try {
        let imageUrl = undefined;

        // 1. Image upload if required
        if (requiresPhoto === 'true' && image) {
          imageUrl = await userService.uploadImage(image);
        }

        // 2. Prepare submission payload
        const payload = {};
        if (imageUrl) {
          payload.image = imageUrl;
        }
        if (requiresGPS === 'true') {
          try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              let loc = await Location.getLastKnownPositionAsync({});
              if (!loc) {
                loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
              }
              if (loc) {
                payload.location = {
                  type: 'Point',
                  coordinates: [loc.coords.longitude, loc.coords.latitude]
                };
              }
            }
          } catch (e) {
            console.warn("Could not get real location, falling back to mock:", e);
            payload.location = {
              type: 'Point',
              coordinates: [103.8198, 1.3521] // Mock fallback
            };
          }
        }
        payload.status = 'completed';

        // 3. Submit
        const response = await submitAttemptMutation.mutateAsync({
          attemptId,
          payload
        });

        // 4. Respect minimum animation duration
        const elapsed = Date.now() - startTime;
        const remaining = minAnimationDuration - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        if (isMounted) {
          if (response.success && response.data?.attempt?.status === 'completed') {
            const earnedPoints = response.data.attempt.pointsEarned ?? points;
            const earnedXp = response.data.attempt.xpEarned ?? xp;

            router.replace({
              pathname: '/challenge/completed',
              params: {
                points: earnedPoints,
                xp: earnedXp,
                attemptId
              }
            });
          } else {
            const reason = response.message || response.data?.attempt?.failureReason || "We couldn't verify your submission.";
            router.replace({
              pathname: '/challenge/failed',
              params: { reason }
            });
          }
        }
      } catch (err) {
        console.log("Submission verification failed:", err?.response?.data?.message || err.message);
        const elapsed = Date.now() - startTime;
        const remaining = minAnimationDuration - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        if (isMounted) {
          const reason = err?.response?.data?.message || err?.response?.data?.data?.attempt?.failureReason || "We couldn't verify your submission.";
          router.replace({
            pathname: '/challenge/failed',
            params: { reason }
          });
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ParentWrapper style={{ backgroundColor: '#F0F9FF' }}>
      <View style={styles.container}>

          <Image source={appIcons.aiVerifying} style={styles.aiIcon} />
       

        <Text style={[styles.title, { color: '#1E40AF' }]}>AI Verifying...</Text>
        <Text style={[styles.subtitle, { color: '#3B82F6' }]}>Running AI verification...</Text>

        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { backgroundColor: '#2563EB', opacity: dot1, transform: [{ scale: dot1 }] }]} />
          <Animated.View style={[styles.dot, { backgroundColor: '#2563EB', width: widthPixel(24), opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { backgroundColor: '#2563EB', opacity: dot3, transform: [{ scale: dot3 }] }]} />
          <Animated.View style={[styles.dot, { backgroundColor: '#2563EB', opacity: dot1, transform: [{ scale: dot1 }] }]} />
        </View>

        <Text style={[styles.bottomText, { color: colors.textSecondary }]}>
          Our AI engine is reviewing your submission. This usually takes a few seconds.
        </Text>
      </View>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: widthPixel(40),
  },

  aiIcon: {
    width: widthPixel(110),
    height: widthPixel(110),
    marginBottom: heightPixel(30),
    backgroundColor:'transparent',
    borderWidth:4,
    borderRadius:widthPixel(55),
    borderColor:"#dde7f5ff",
  },
  title: {
    fontFamily: FontFamily.InterBold,
    fontSize: fontPixel(22),
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.InterMedium,
    fontSize: fontPixel(14),
    marginTop: heightPixel(12),
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: widthPixel(8),
    marginTop: heightPixel(40),
  },
  dot: {
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
  },
  bottomText: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    textAlign: 'center',
  marginTop: heightPixel(30),
  lineHeight:heightPixel(20),
  
  
  },
});
