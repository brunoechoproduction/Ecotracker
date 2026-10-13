import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const getDeviceDetails = async (): Promise<{ id: string; deviceToken: string }> => {
  let deviceToken = 'expo-push-token-default';
  let deviceId = 'expo-device-id-default';

  try {
    // Get Device ID
    if (Platform.OS === 'android') {
      deviceId = Constants.sessionId || 'android-device';
    } else if (Platform.OS === 'ios') {
      deviceId = await Platform.select({
        ios: Constants.sessionId || 'ios-device',
        default: 'unknown-device'
      });
    }

    // You can also use expo-application's androidId or iosIdForVendor for a more persistent ID, 
    // but typically people use a random UUID if none exists or expo-constants sessionId
    // For now, let's use the simplest reliable approach:
    deviceId = Device.osInternalBuildId || Device.modelName || 'expo-device';

    if (Device.isDevice) {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus === 'granted') {
          const projectId = Constants.expoConfig?.extra?.eas?.projectId;
          const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
          deviceToken = tokenData.data;
        }
      } catch (pushError) {
        console.log('Push notification error bypassed, using dummy token.', pushError);
      }
    }
  } catch (error) {
    console.error('Error getting device details:', error);
  }

  return {
    id: deviceId,
    deviceToken,
  };
};
