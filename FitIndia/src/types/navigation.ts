import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: { redirectTo?: string } | undefined;
  Register: undefined;
  ProfileSetup: { fromRegister?: boolean } | undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  QuickWorkout: undefined;
  Streak: undefined;
  NutritionTargets: undefined;
};

export type DietStackParamList = {
  DietToday: undefined;
  DietPlan: undefined;
  DietDayDetail: { dayIndex: number };
  MealDetail: {
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
    dayIndex: number;
  };
  GenerateDiet: undefined;
  DietHistory: undefined;
};

export type WorkoutStackParamList = {
  WorkoutToday: undefined;
  WorkoutPlan: undefined;
  WorkoutDayDetail: { dayNumber: number };
  ActiveWorkout: { dayNumber: number; planId: string };
  WorkoutComplete: {
    caloriesBurned: number;
    duration: number;
    dayNumber: number;
  };
  GenerateWorkout: undefined;
};

export type ProgressStackParamList = {
  ProgressMain: undefined;
  LogWeight: { prefillDate?: string } | undefined;
  ProgressCharts:
    | { period?: 'week' | 'month' | '3months' | 'year' }
    | undefined;
  StreakBadges: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  NotificationSettings: undefined;
  Subscription: undefined;
  AppSettings: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Diet: NavigatorScreenParams<DietStackParamList>;
  Workout: NavigatorScreenParams<WorkoutStackParamList>;
  Progress: NavigatorScreenParams<ProgressStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, T>,
    MainTabScreenProps<'Home'>
  >;

export type DietStackScreenProps<T extends keyof DietStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<DietStackParamList, T>,
    MainTabScreenProps<'Diet'>
  >;

export type WorkoutStackScreenProps<T extends keyof WorkoutStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<WorkoutStackParamList, T>,
    MainTabScreenProps<'Workout'>
  >;

export type ProgressStackScreenProps<T extends keyof ProgressStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProgressStackParamList, T>,
    MainTabScreenProps<'Progress'>
  >;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ProfileStackParamList, T>,
    MainTabScreenProps<'Profile'>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
