import { ThemeColors } from '../types';

export const API_CONFIG = {
  PICSUM_BASE_URL: 'https://picsum.photos/v2/list',
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
};

export const STORAGE_KEYS = {
  REGISTERED_USERS: '@fotoowl_registered_users_v1',
  ACTIVE_SESSION: '@fotoowl_active_session_v1',
  FAVORITES: '@fotoowl_favorites_v1',
  THEME_MODE: '@fotoowl_theme_mode_v1',
  USER_AVATAR: '@fotoowl_user_avatar_v1',
};

export const PREDEFINED_CITIES = [
  'Baner, Pune',
  'Pune',
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'San Francisco',
  'London',
  'Singapore',
  'Dubai',
  'Berlin',
  'Tokyo',
];

export const PREDEFINED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
];

// Pinterest Design System Theme Colors
export const LIGHT_THEME: ThemeColors = {
  primary: '#E60023', // Signature Pinterest Red
  primaryLight: '#FF3B5C',
  background: '#FFFFFF',
  cardBg: '#FFFFFF',
  cardBorder: 'transparent',
  textPrimary: '#111111',
  textSecondary: '#5F5F5F',
  textMuted: '#767676',
  accent: '#0076D7',
  accentGlow: 'rgba(0, 118, 215, 0.15)',
  error: '#E60023',
  success: '#00875A',
  warning: '#FFAB00',
  surface: '#E9E9E9',
  inputBg: '#E9E9E9',
  inputBorder: '#DA001A',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  isDark: false,
};

export const DARK_THEME: ThemeColors = {
  primary: '#E60023', // Signature Pinterest Red
  primaryLight: '#FF3B5C',
  background: '#0E0E0E', // Pinterest Midnight Dark
  cardBg: '#1C1C1C',
  cardBorder: 'transparent',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#767676',
  accent: '#0087FF',
  accentGlow: 'rgba(0, 135, 255, 0.2)',
  error: '#E60023',
  success: '#2ED573',
  warning: '#FFA502',
  surface: '#2B2B2B',
  inputBg: '#232323',
  inputBorder: '#333333',
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  isDark: true,
};
