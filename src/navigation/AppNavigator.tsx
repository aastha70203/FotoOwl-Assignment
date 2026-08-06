import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid, Heart, User } from 'lucide-react-native';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { HomeScreen } from '../screens/main/HomeScreen';
import { FavoritesScreen } from '../screens/main/FavoritesScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { ImageDetailScreen } from '../screens/main/ImageDetailScreen';

import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { theme } = useThemeStore();
  const insets = useSafeAreaInsets();

  const bottomPadding = Platform.OS === 'android'
    ? Math.max(insets.bottom, 16)
    : Math.max(insets.bottom, 12);

  const tabHeight = 64 + bottomPadding;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E60023',
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.cardBg,
          borderTopColor: theme.cardBorder,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 16,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Pins',
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size - 2} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();

  return (
    <NavigationContainer
      theme={{
        dark: theme.isDark,
        colors: {
          primary: '#E60023',
          background: theme.background,
          card: theme.cardBg,
          text: theme.textPrimary,
          border: theme.cardBorder,
          notification: '#E60023',
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="ImageDetail"
              component={ImageDetailScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
