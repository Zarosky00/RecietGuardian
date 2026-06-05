import React from 'react';
import { Stack } from 'expo-router';
import '../components/output.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
