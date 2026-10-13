import React, { useEffect, useRef } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, StatusBar, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import ParentWrapper from '@/components/ParentWrapper';
import { FontFamily } from '@/constants/Fonts';
import { fontPixel, heightPixel, widthPixel } from '@/services/utilities/appFontSizes';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Animation values for the 3 dots
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);

  useEffect(() => {
    // Sequence animation loop
    const animateDots = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(dot1, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            Animated.timing(dot2, { toValue: 1, duration: 400, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(dot2, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            Animated.timing(dot3, { toValue: 1, duration: 400, useNativeDriver: true }),
          ]),
          Animated.timing(dot3, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };

    animateDots();

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000); // 3 seconds splash duration

    return () => clearTimeout(timer);
  }, [dot1, dot2, dot3]);

  useEffect(() => {
    if (minTimeElapsed && !isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [minTimeElapsed, isLoading, isAuthenticated, router]);

  return (
    <ParentWrapper disableTopPadding={true} style={[styles.wrapper, { paddingBottom: 0 }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../../assets/icons/splash_background.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Center content */}
        <View style={styles.centerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/icons/leaf.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>EcoTrackr</Text>
          <Text style={styles.tagline}>Track. Act. Earn. 🌍</Text>
          
          {/* Loading Dots */}
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: dot1, transform: [{ scale: dot1.interpolate({ inputRange: [0.3, 1], outputRange: [1, 1.2] }) }] }]} />
            <Animated.View style={[styles.dot, { opacity: dot2, transform: [{ scale: dot2.interpolate({ inputRange: [0.3, 1], outputRange: [1, 1.2] }) }] }]} />
            <Animated.View style={[styles.dot, { opacity: dot3, transform: [{ scale: dot3.interpolate({ inputRange: [0.3, 1], outputRange: [1, 1.2] }) }] }]} />
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>MAKING EARTH GREENER</Text>
      </ImageBackground>
    </ParentWrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: widthPixel(90),
    height: widthPixel(90),
    backgroundColor: '#FFFFFF',
    borderRadius: widthPixel(28),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  logoIcon: {
    width: widthPixel(50),
    height: widthPixel(50),
  },
  appName: {
    fontFamily: FontFamily.InterExtraBold,
    fontSize: fontPixel(36),
    color: '#FFFFFF',
    marginTop: heightPixel(28),
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(15),
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: heightPixel(8),
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: widthPixel(12),
    marginTop: heightPixel(48),
  },
  dot: {
    width: widthPixel(8),
    height: widthPixel(8),
    borderRadius: widthPixel(4),
    backgroundColor: '#FFFFFF',
  },
  footer: {
    position: 'absolute',
    bottom: heightPixel(40),
    fontFamily: FontFamily.InterRegular,
    fontSize: fontPixel(12),
    color: '#FFFFFF73',
    letterSpacing: 2,
    alignSelf: 'center',
  },
});
