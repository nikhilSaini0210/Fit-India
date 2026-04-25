import RNConfig from 'react-native-config';

export const STORAGE_KEYS = {
  AUTH_STORE: 'fitindia-auth',
  DIET_STORE: 'fitindia-diet',
  PROGRESS_STORE: 'fitindia-progress',
  WORKOUT_STORE: 'fitindia-workout',
  APP_STORE: 'fitindia-app',

  STORE_ID: 'fitindia.store',
  STORE_KEY: RNConfig.ENCRYPTION_KEY,

  ACCESS_TOKEN: 'auth.accessToken',
  REFRESH_TOKEN: 'auth.refreshToken',

  // USER: 'auth.user',
  // IS_LOGGED_IN: 'auth.isLoggedIn',

  ONBOARDING_DONE: 'auth.onboardingDone',
  THEME: 'app.theme', // 'light' | 'dark' | 'system'
  UNITS: 'app.units', // 'metric' | 'imperial'
  LANGUAGE: 'app.language', // 'en' | 'hi'
  FCM_TOKEN: 'push.fcmToken',

  // Cache with TTL pattern  — value is JSON: { data, expiresAt }
  CACHE_DIET_PLAN: 'cache.dietPlan',
  CACHE_WORKOUT_PLAN: 'cache.workoutPlan',
  CACHE_NUTRITION_TARGETS: 'cache.nutritionTargets',

  // Offline queue — value is JSON array of pending requests
  OFFLINE_QUEUE: 'offline.queue',

  // Progress quick log (local draft before sync)
  DRAFT_WEIGHT_LOG: 'draft.weightLog',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// Cache TTL durations in milliseconds
export const CACHE_TTL = {
  DIET_PLAN: 6 * 60 * 60 * 1000, // 6 hours
  WORKOUT_PLAN: 6 * 60 * 60 * 1000, // 6 hours
  NUTRITION_TARGETS: 24 * 60 * 60 * 1000, // 24 hours
  DEFAULT_TTL: 5 * 60 * 1000,
} as const;

export const QUEUE = {
  OFFLINE_MAX_QUEUE: 20,
};
