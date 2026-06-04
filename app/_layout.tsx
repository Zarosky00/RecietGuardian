import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({
  default: 'native',
  web: 'native',
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f0efe9' }, // Retro Light sand/beige bg
        }}
      />
    </SafeAreaProvider>
  );
}
