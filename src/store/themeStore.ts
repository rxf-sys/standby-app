import { create } from 'zustand';
import { Appearance } from 'react-native';
import { saveTheme, getTheme } from '@/utils/storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  useDynamicColors: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setUseDynamicColors: (enabled: boolean) => void;
  initTheme: () => void;
}

const getActiveTheme = (mode: ThemeMode): ActiveTheme => {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
  }
  return mode;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'light',
  activeTheme: 'light',
  useDynamicColors: false,

  setThemeMode: async (mode) => {
    const activeTheme = getActiveTheme(mode);
    set({ themeMode: mode, activeTheme });
    await saveTheme(mode);
  },

  setUseDynamicColors: (enabled) => {
    set({ useDynamicColors: enabled });
  },

  initTheme: () => {
    // Load saved theme asynchronously
    getTheme().then((savedTheme) => {
      const mode = savedTheme || 'light';
      const activeTheme = getActiveTheme(mode);
      set({ themeMode: mode, activeTheme });
    });

    // Listen to system theme changes
    Appearance.addChangeListener(({ colorScheme }) => {
      const currentMode = get().themeMode;
      if (currentMode === 'system') {
        set({ activeTheme: colorScheme === 'dark' ? 'dark' : 'light' });
      }
    });
  },
}));
