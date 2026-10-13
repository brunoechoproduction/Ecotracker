
import { Stack, usePathname } from "expo-router";
import mobileAds from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import FlashMessage from "react-native-flash-message";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import * as Notifications from "expo-notifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();



import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout() {
  const { expoPushToken, notification, requestPermissions } = usePushNotifications({ autoRequest: false });
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  console.log(pathname)
  const [loaded, error] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-ExtraBold": Inter_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    async function initPermissionsAndAds() {
      // 1. Request Tracking Permission First (Critical for Apple Review)
      if (Platform.OS === 'ios') {
        const { status } = await requestTrackingPermissionsAsync();
        console.log('Tracking permission status:', status);
      }
      
      // 2. Request Push Notification Permission Second
      if (requestPermissions) {
        await requestPermissions();
      }
      
      // 3. Finally Initialize Ads
      mobileAds()
        .initialize()
        .then(adapterStatuses => {
          console.log('AdMob Initialized', adapterStatuses);
        });
    }
    
    initPermissionsAndAds();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }} />
            <FlashMessage 
              position="top" 
         
              style={{ paddingTop:Platform.OS=="ios"? 0 : insets.top}}
            />
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

