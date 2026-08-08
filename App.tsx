import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastContainer } from './src/components/common/ToastContainer';
import { useThemeStore } from './src/store/useThemeStore';
import { useAuthStore } from './src/store/useAuthStore';
import { useGalleryStore } from './src/store/useGalleryStore';

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);
  const initializeTheme = useThemeStore((s) => s.initializeTheme);
  const initializeSession = useAuthStore((s) => s.initializeSession);
  const initializeGallery = useGalleryStore((s) => s.initializeGallery);

  useEffect(() => {
    // Cold boot initialization with safe error catching
    const initApp = async () => {
      try {
        await initializeTheme();
        await initializeSession();
        await initializeGallery();
      } catch (e) {
        console.warn('Cold boot initialization error:', e);
      }
    };
    initApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
      <ToastContainer />
    </SafeAreaProvider>
  );
}
