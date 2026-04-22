import {
  AuthTokens,
  DietDay,
  DietPlan,
  ProgressLog,
  ProgressSummary,
  User,
  WorkoutDay,
  WorkoutPlan,
} from '../types';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
}

export interface DietState {
  activePlan: DietPlan | null;
  todaysMeals: DietDay | null;
  lastFetched: number | null;

  setActivePlan: (plan: DietPlan) => void;
  setTodaysMeals: (day: DietDay) => void;
  clearDiet: () => void;
}

export interface ProgressState {
  summary: ProgressSummary | null;
  latestLog: ProgressLog | null;
  streak: { current: number; longest: number };
  lastFetched: number | null;

  setSummary: (s: ProgressSummary) => void;
  setLatestLog: (log: ProgressLog) => void;
  setStreak: (streak: { current: number; longest: number }) => void;
  addLog: (log: ProgressLog) => void;
  clearProgress: () => void;
}

export interface WorkoutState {
  activePlan: WorkoutPlan | null;
  todaysWorkout: WorkoutDay | null;
  lastFetched: number | null;

  setActivePlan: (plan: WorkoutPlan) => void;
  setTodaysWorkout: (day: WorkoutDay) => void;
  markDayComplete: (dayNumber: number) => void;
  clearWorkout: () => void;
}

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface OfflineRequest {
  method: string;
  url: string;
  data?: unknown;
  params?: unknown;
  timestamp: number;
}
