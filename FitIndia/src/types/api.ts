export type Goal =
  | 'weight_loss'
  | 'weight_gain'
  | 'muscle_gain'
  | 'maintenance';
export type DietType = 'veg' | 'non_veg' | 'jain' | 'vegan';
export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type WorkoutType = 'home' | 'gym';
export type Mood = 'great' | 'good' | 'okay' | 'tired' | 'bad';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  goal?: Goal;
  dietType?: DietType;
  activityLevel?: ActivityLevel;
  fitnessLevel?: FitnessLevel;
  workoutType?: WorkoutType;
  allergies?: string[];
  injuries?: string[];
  notifications?: {
    whatsapp: boolean;
    sms: boolean;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  isPremium: boolean;
  plan: 'free' | 'basic' | 'premium';
  profileComplete: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  ingredients: string[];
}

export interface DietDay {
  day: number;
  date?: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: {
    breakfast: MealItem;
    lunch: MealItem;
    snack: MealItem;
    dinner: MealItem;
  };
}

export interface DietPlan {
  _id: string;
  userId: string;
  title: string;
  days: DietDay[];
  totalDays: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  dietType: DietType;
  goal: Goal;
  isActive: boolean;
  generatedBy: 'ai' | 'template';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Exercise {
  exercise: string;
  sets?: number;
  reps?: string;
  rest?: number;
  duration?: string;
  notes?: string;
  muscle?: string;
}

export interface WorkoutDay {
  day: number;
  type: 'workout' | 'rest';
  focus: string;
  duration: number;
  caloriesBurned: number;
  warmup: { exercise: string; duration: string }[];
  exercises: Exercise[];
  cooldown: { exercise: string; duration: string }[];
  isCompleted: boolean;
  completedAt?: string;
}

export interface WorkoutPlan {
  _id: string;
  userId: string;
  weeklyPlan: WorkoutDay[];
  workoutType: WorkoutType;
  fitnessLevel: FitnessLevel;
  goal: Goal;
  isActive: boolean;
  createdAt: string;
}

export interface ProgressLog {
  _id: string;
  userId: string;
  weight: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
  mood?: Mood;
  logDate: string;
}

export interface ProgressSummary {
  totalLogs: number;
  startWeight: number;
  currentWeight: number;
  weightChange: number;
  weightTrend: 'loss' | 'gain' | 'maintained';
  streak: { current: number; longest: number };
  lastLogDate: string;
}

export interface NutritionTargets {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type AppErrorCode =
  | 'NO_NETWORK'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'SESSION_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface AppError {
  code: AppErrorCode;
  message: string;
  errors?: { field: string; message: string }[];
  isAppError: true;
}
