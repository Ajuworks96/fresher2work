import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="profile/edit"
          options={{
            headerShown: true,
            title: 'Edit Talent Profile',
            headerBackTitle: 'Profile',
          }}
        />
        <Stack.Screen
          name="profile/preview"
          options={{
            headerShown: true,
            title: 'Recruiter View',
            headerBackTitle: 'Profile',
          }}
        />
        <Stack.Screen
          name="profile/[slug]"
          options={{
            headerShown: true,
            title: 'Public Profile',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
