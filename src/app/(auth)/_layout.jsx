import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      {/* Green status bar across all auth screens */}
      <StatusBar style="light" backgroundColor="#34A853" />
      <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="verify-otp" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="reset-success" />
        <Stack.Screen name="signup-success" />
      </Stack>
    </>
  );
}
