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
import { Appearance } from 'react-native';

interface AppState extends AppSettings {
  colors: AppColors;
  isDark: boolean;
  loadingStep: number;
  isHydrated: boolean;
  setTheme: (t: ThemeType) => void;
  setUnits: (u: AppSettings['units']) => void;
  setLanguage: (l: AppSettings['language']) => void;
  setLoadingStep: (step: number) => void;
  _onHydrated: () => void;

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

const system: 'light' | 'dark' =
  Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
const initialTheme = getColors('system', system);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      units: 'metric',
      language: 'en',
      colors: initialTheme.colors,
      isDark: initialTheme.isDark,
      loadingStep: 0,
      isHydrated: false,

      setTheme: theme => {
        set({ theme });
        set(getColors(theme, system));
      },

      setUnits: units => {
        set({ units });
      },
      setLanguage: language => {
        set({ language });
      },

      setLoadingStep: step => {
        set({ loadingStep: step });
      },

      resolveTheme: systemScheme => {
        const { theme } = get();
        set(getColors(theme, systemScheme));
      },
      _onHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: s => ({
        theme: s.theme,
        units: s.units,
        language: s.language,
      }),
      onRehydrateStorage: () => state => {
        if (!state) return;
        state.loadingStep = 1;
        state.resolveTheme(system);
        state._onHydrated();
      },
    },
  ),
);

export const useColors = () => useAppStore(s => s.colors);
export const useIsDark = () => useAppStore(s => s.isDark);
export const useTheme = () => useAppStore(s => s.theme);
export const useUnits = () => useAppStore(s => s.units);
export const useIsHydrated = () => useAppStore(s => s.isHydrated);
export const useLanguage = () => useAppStore(s => s.language);
export const useLoadingStep = () => useAppStore(s => s.loadingStep);
