// Core Type Definitions for FotoOwl Gallery Mobile Application

export type GenderType = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  gender: GenderType;
  mobileNumber: string; // 10 digits
  address: string;
  city: string;
  avatarUrl: string;
  createdAt: string;
  securityScore?: number;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  loginTimestamp: number;
}

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  isFavorite?: boolean;
  isCommunityUpload?: boolean;
  eventTag?: string;
  aiTags?: string[];
  uploadedBy?: string;
  uploadedAt?: string;
}

export type FilterCategory = 'ALL' | 'COMMUNITY_UPLOADS' | 'AUTHOR_A_M' | 'AUTHOR_N_Z' | 'FAVORITES_ONLY';

export type SortOrder = 'ID_ASC' | 'ID_DESC' | 'AUTHOR_ASC' | 'AUTHOR_DESC';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  error: string;
  success: string;
  warning: string;
  surface: string;
  inputBg: string;
  inputBorder: string;
  shadowColor: string;
  isDark: boolean;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}
