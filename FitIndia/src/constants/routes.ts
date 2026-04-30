export const ROOT_ROUTES = {
  MAIN: 'Main',
  AUTH: 'Auth',
} as const;

// ─── Auth stack ──────────────────────────────────────────────────────────────
export const AUTH_ROUTES = {
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE_SETUP: 'ProfileSetup',
  FORGOT_PW: 'ForgotPassword',
} as const;

// ─── Tab names ────────────────────────────────────────────────────────────────
export const TAB_ROUTES = {
  HOME: 'Home',
  DIET: 'Diet',
  WORKOUT: 'Workout',
  PROGRESS: 'Progress',
  PROFILE: 'Profile',
} as const;

// ─── Home stack ───────────────────────────────────────────────────────────────
export const HOME_ROUTES = {
  HOME: 'HomeMain',
  QUICK_WORKOUT: 'QuickWorkout',
  STREAK: 'Streak',
  NUTRITION_TARGETS: 'NutritionTargets',
} as const;

// ─── Diet stack ───────────────────────────────────────────────────────────────
export const DIET_ROUTES = {
  DIET_TODAY: 'DietToday',
  DIET_PLAN: 'DietPlan',
  DAY_DETAIL: 'DietDayDetail',
  MEAL_DETAIL: 'MealDetail',
  GENERATE: 'GenerateDiet',
  HISTORY: 'DietHistory',
  NUTRITION: 'Nutrition',
} as const;

// ─── Workout stack ────────────────────────────────────────────────────────────
export const WORKOUT_ROUTES = {
  WORKOUT_TODAY: 'WorkoutToday',
  WORKOUT_PLAN: 'WorkoutPlan',
  DAY_DETAIL: 'WorkoutDayDetail',
  ACTIVE_WORKOUT: 'ActiveWorkout',
  COMPLETE: 'WorkoutComplete',
  GENERATE: 'GenerateWorkout',
} as const;

// ─── Progress stack ───────────────────────────────────────────────────────────
export const PROGRESS_ROUTES = {
  PROGRESS: 'ProgressMain',
  LOG_WEIGHT: 'LogWeight',
  CHARTS: 'ProgressCharts',
  STREAK: 'StreakBadges',
} as const;

// ─── Profile stack ────────────────────────────────────────────────────────────
export const PROFILE_ROUTES = {
  PROFILE: 'ProfileMain',
  EDIT_PROFILE: 'EditProfile',
  NOTIFICATIONS: 'NotificationSettings',
  SUBSCRIPTION: 'Subscription',
  SETTINGS: 'AppSettings',
} as const;
