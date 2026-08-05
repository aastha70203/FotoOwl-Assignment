import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/constants';
import { UserProfile, AuthSession, PicsumImage } from '../types';

const COMMUNITY_UPLOADS_KEY = '@fotoowl_collective_uploaded_photos_v1';

export const storageService = {
  /**
   * Get all registered users from storage
   */
  async getRegisteredUsers(): Promise<UserProfile[]> {
    try {
      const jsonStr = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (!jsonStr) return [];
      return JSON.parse(jsonStr) as UserProfile[];
    } catch (error) {
      console.error('Error reading registered users from storage:', error);
      return [];
    }
  },

  /**
   * Save a newly registered user
   */
  async saveUser(user: UserProfile): Promise<boolean> {
    try {
      const existingUsers = await this.getRegisteredUsers();
      const filtered = existingUsers.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
      filtered.push(user);
      await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error saving user to storage:', error);
      return false;
    }
  },

  /**
   * Get active persistent user session
   */
  async getActiveSession(): Promise<AuthSession | null> {
    try {
      const jsonStr = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (!jsonStr) return null;
      return JSON.parse(jsonStr) as AuthSession;
    } catch (error) {
      console.error('Error reading active session from storage:', error);
      return null;
    }
  },

  /**
   * Set active persistent session
   */
  async setActiveSession(session: AuthSession): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error setting active session:', error);
      return false;
    }
  },

  /**
   * Clear active session (Logout)
   */
  async clearSession(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  },

  /**
   * Get favorite image IDs
   */
  async getFavorites(): Promise<string[]> {
    try {
      const jsonStr = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (!jsonStr) return [];
      return JSON.parse(jsonStr) as string[];
    } catch (error) {
      console.error('Error reading favorites:', error);
      return [];
    }
  },

  /**
   * Save favorite image IDs
   */
  async saveFavorites(favorites: string[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Error saving favorites:', error);
      return false;
    }
  },

  /**
   * Get community uploaded collective photos
   */
  async getUploadedPhotos(): Promise<PicsumImage[]> {
    try {
      const jsonStr = await AsyncStorage.getItem(COMMUNITY_UPLOADS_KEY);
      if (!jsonStr) return [];
      return JSON.parse(jsonStr) as PicsumImage[];
    } catch (error) {
      console.error('Error reading uploaded photos from storage:', error);
      return [];
    }
  },

  /**
   * Save a newly uploaded community photo to collective storage
   */
  async saveUploadedPhoto(photo: PicsumImage): Promise<boolean> {
    try {
      const existing = await this.getUploadedPhotos();
      const updated = [photo, ...existing];
      await AsyncStorage.setItem(COMMUNITY_UPLOADS_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Error saving uploaded photo:', error);
      return false;
    }
  },

  /**
   * Get Theme mode preference ('dark' | 'light')
   */
  async getThemeMode(): Promise<'dark' | 'light' | null> {
    try {
      return (await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE)) as 'dark' | 'light' | null;
    } catch {
      return null;
    }
  },

  /**
   * Save Theme mode preference
   */
  async setThemeMode(mode: 'dark' | 'light'): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
      return true;
    } catch {
      return false;
    }
  },
};
