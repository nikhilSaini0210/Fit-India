import RNConfig from 'react-native-config';

const ENV = RNConfig.APP_ENV;

export const API_BASE_URL = (() => {
  switch (ENV) {
    case 'development':
      return `${RNConfig.API_BASE_URL_DEV}${RNConfig.API_PREFIX}`;
    case 'staging':
      return `${RNConfig.API_BASE_URL_DEV}${RNConfig.API_PREFIX}`; // staging URL
    case 'production':
      return `${RNConfig.API_BASE_URL_PROD}${RNConfig.API_PREFIX}`;
    default:
      return `${RNConfig.API_BASE_URL_DEV}${RNConfig.API_PREFIX}`;
  }
})();

export const API_TIMEOUT_MS = parseInt(RNConfig.API_TIMEOUT, 10);

export const HTTP = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY: 429,
  SERVER_ERROR: 500,
} as const;

export const ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  CHANGE_PASSWORD: '/auth/change-password',

  // User
  PROFILE: '/users/profile',
  NOTIFICATIONS_PREFS: '/users/notifications',
  NUTRITION_TARGETS: '/users/nutrition-targets',

  // Diet
  DIET_GENERATE: '/diet/generate',
  DIET_ACTIVE: '/diet/active',
  DIET_TODAY: '/diet/today',
  DIET_HISTORY: '/diet/history',
  DIET_BY_ID: (id: string) => `/diet/${id}`,

  // Workout
  WORKOUT_GENERATE: '/workout/generate',
  WORKOUT_ACTIVE: '/workout/active',
  WORKOUT_TODAY: '/workout/today',
  WORKOUT_COMPLETE: '/workout/complete',
  WORKOUT_QUICK: '/workout/quick',

  // Progress
  PROGRESS_LOG: '/progress/log',
  PROGRESS_HISTORY: '/progress/history',
  PROGRESS_SUMMARY: '/progress/summary',
  PROGRESS_STREAK: '/progress/streak',
  PROGRESS_LATEST: '/progress/latest',

  // Push notifications
  PUSH_REGISTER: '/push/register',
  PUSH_TOKEN: '/push/token',
  PUSH_TEST: '/push/test',
} as const;
