import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastContainer } from './src/components/common/ToastContainer';
import { useThemeStore } from './src/store/useThemeStore';

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
      <ToastContainer />
    </SafeAreaProvider>
  );
}
