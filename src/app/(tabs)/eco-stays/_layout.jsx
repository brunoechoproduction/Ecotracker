import { Stack } from 'expo-router';

export default function EcoStaysLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="map-details" />
      <Stack.Screen name="map-booking" />
      <Stack.Screen name="redirecting" />
      <Stack.Screen name="map-redirecting" />
    </Stack>
  );
}
