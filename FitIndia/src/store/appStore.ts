import { create } from 'zustand';
import {
  type AppColors,
  darkColors,
  lightColors,
  STORAGE_KEYS,
  type ThemeType,
} from '../constants';
import { AppSettings } from './interface';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from './mmkv';

interface AppState extends AppSettings {
  colors: AppColors;
  isDark: boolean;

  setTheme: (t: ThemeType) => void;
  setUnits: (u: AppSettings['units']) => void;
  setLanguage: (l: AppSettings['language']) => void;

  resolveTheme: (systemScheme: 'light' | 'dark') => void;
}

const getColors = (
  theme: ThemeType,
  system: 'light' | 'dark',
): { colors: AppColors; isDark: boolean } => {
  const effective =
    theme === 'system' ? system : theme === 'dark' ? 'dark' : 'light';

  return {
    colors: effective === 'dark' ? darkColors : lightColors,
    isDark: effective === 'dark',
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      units: 'metric',
      language: 'en',
      colors: lightColors,
      isDark: false,

      setTheme: theme => {
        set({ theme });
      },

      setUnits: units => {
        set({ units });
      },
      setLanguage: language => {
        set({ language });
      },

      resolveTheme: systemScheme => {
        const { theme } = get();
        set(getColors(theme, systemScheme));
      },
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: s => ({
        theme: s.theme,
        units: s.units,
        language: s.language,
      }),
    },
  ),
);

export const useColors = () => useAppStore(s => s.colors);
export const useIsDark = () => useAppStore(s => s.isDark);
export const useTheme = () => useAppStore(s => s.theme);
export const useUnits = () => useAppStore(s => s.units);
