import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image as RNImage } from 'react-native';
import { Moon, Sun, ArrowLeft } from 'lucide-react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Image } from 'expo-image';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
}) => {
  const { theme, toggleTheme, isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background }]}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onBackPress}
            style={[styles.iconButton, { backgroundColor: theme.surface }]}
          >
            <ArrowLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            {/* Pinterest Style Brand Logo */}
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>P</Text>
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                {title || 'FotoOwl Pins'}
              </Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightAction}

        {/* User Avatar Circle */}
        {user?.avatarUrl && !showBack && (
          <Image
            source={{ uri: user.avatarUrl }}
            style={styles.headerAvatar}
            contentFit="cover"
          />
        )}

        {/* Theme Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={toggleTheme}
          style={[styles.iconButton, { backgroundColor: theme.surface }]}
        >
          {isDarkMode ? (
            <Sun size={18} color="#FFA502" />
          ) : (
            <Moon size={18} color={theme.textPrimary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E60023',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: -2,
  },
  titleTextContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
});
