import { create } from 'zustand';
import { ThemeColors } from '../types';
import { LIGHT_THEME, DARK_THEME } from '../config/constants';
import { storageService } from '../services/storageService';

interface ThemeState {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'dark' | 'light') => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: DARK_THEME, // Default to sleek FotoOwl dark mode
  isDark: true,

  toggleTheme: async () => {
    const newIsDark = !get().isDark;
    const newTheme = newIsDark ? DARK_THEME : LIGHT_THEME;
    set({ isDark: newIsDark, theme: newTheme });
    await storageService.setThemeMode(newIsDark ? 'dark' : 'light');
  },

  setTheme: async (mode: 'dark' | 'light') => {
    const isDark = mode === 'dark';
    set({ isDark, theme: isDark ? DARK_THEME : LIGHT_THEME });
    await storageService.setThemeMode(mode);
  },

  initializeTheme: async () => {
    const savedMode = await storageService.getThemeMode();
    if (savedMode) {
      const isDark = savedMode === 'dark';
      set({ isDark, theme: isDark ? DARK_THEME : LIGHT_THEME });
    }
  },
}));
