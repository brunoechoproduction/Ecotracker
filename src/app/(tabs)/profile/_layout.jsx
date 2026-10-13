import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="rewards" />
      <Stack.Screen name="levels" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="streak" />
      <Stack.Screen name="report" />
    </Stack>
  );
}
