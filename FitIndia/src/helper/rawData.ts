import { AppColors } from '../constants';

export const STEPS = [
  'Basic info',
  'Body stats',
  'Your goal',
  'Diet type',
  'Fitness level',
] as const;

// ─── Single source of truth for all onboarding slides ─────────────────────────

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  accentColor: string;
  gradientColors: string[];
  features: string[];
  badge?: string;
  hindi?: string;
}

export const getOnboardingSlides = (Colors: AppColors): OnboardingSlide[] => [
  {
    id: 'welcome',
    title: 'Welcome to',
    subtitle: 'FitSutra 💪',
    description:
      "India's first AI-powered fitness app built around your culture, language and lifestyle.",
    emoji: '🇮🇳',
    accentColor: Colors.accentColorA,
    gradientColors: Colors.gradientColorsA,
    features: [
      '100% Indian food database',
      'Hindi & English support',
      'Budget-friendly plans',
    ],
    badge: 'Made in India',
    hindi: 'स्वस्थ भारत, सशक्त भारत',
  },
  {
    id: 'diet',
    title: 'Eat what you love,',
    subtitle: 'but smarter 🍛',
    description:
      'Personalised Indian meal plans — roti, dal, paneer, khichdi — calculated to your exact calorie goals.',
    emoji: '🥘',
    accentColor: Colors.accentColorB,
    gradientColors: Colors.gradientColorsB,
    features: [
      '7-day AI meal plans',
      'Veg, Non-veg & Jain',
      'Under ₹150 per meal',
    ],
    badge: 'AI Powered',
    hindi: 'देसी खाना, फिट जीवन',
  },
  {
    id: 'workout',
    title: 'Workouts built',
    subtitle: 'for YOU 🏋️',
    description:
      'Home or gym, beginner or advanced — AI generates the perfect workout matching your body, goal and schedule.',
    emoji: '⚡',
    accentColor: Colors.accentColorC,
    gradientColors: Colors.gradientColorsC,
    features: [
      'Home & gym plans',
      'Beginner to advanced',
      'Auto-adjusts weekly',
    ],
    badge: 'Smart Training',
    hindi: 'हर रोज़ एक कदम आगे',
  },
  {
    id: 'reminders',
    title: 'Never miss a',
    subtitle: 'day again 📲',
    description:
      'WhatsApp and push reminders for meals, water and workouts — at the right time, every single day.',
    emoji: '🔔',
    accentColor: Colors.accentColorD,
    gradientColors: Colors.gradientColorsD,
    features: [
      'WhatsApp reminders',
      'Morning meal nudges',
      'Evening workout alerts',
    ],
    badge: 'Smart Reminders',
    hindi: 'सही समय, सही याद',
  },
  {
    id: 'progress',
    title: 'Track every',
    subtitle: 'milestone 📊',
    description:
      'Log weight, see charts, celebrate streaks. Watch your transformation with clear visual progress.',
    emoji: '🏆',
    accentColor: Colors.accentColorE,
    gradientColors: Colors.gradientColorsE,
    features: ['Weight & body tracking', 'Streak & badges', 'Weekly reports'],
    badge: 'Progress Tracking',
    hindi: 'हर दिन, हर कदम',
  },
];

export const fields = [
  'age',
  'gender',
  'weight',
  'height',
  'goal',
  'dietType',
  'activityLevel',
  'fitnessLevel',
];

export const goalLabels: Record<string, string> = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  muscle_gain: 'Muscle Gain',
  maintenance: 'Maintenance',
};

export const dietLabels: Record<string, string> = {
  veg: 'Vegetarian',
  non_veg: 'Non-Veg',
  jain: 'Jain',
  vegan: 'Vegan',
};

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: '#64748B',
    gradient: ['#1E293B', '#334155'] as [string, string],
    features: [
      { icon: 'check', label: 'Basic 7-day diet plan', included: true },
      { icon: 'check', label: 'Template workouts', included: true },
      { icon: 'check', label: 'Weight tracking', included: true },
      { icon: 'close', label: 'AI-personalised plans', included: false },
      { icon: 'close', label: 'WhatsApp reminders', included: false },
      { icon: 'close', label: 'Weekly progress reports', included: false },
      { icon: 'close', label: 'Custom meal preferences', included: false },
      { icon: 'close', label: 'Priority support', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '₹199',
    period: 'per month',
    color: '#3B82F6',
    gradient: ['#1E3A8A', '#1D4ED8'] as [string, string],
    badge: 'Popular',
    features: [
      { icon: 'check', label: 'Everything in Free', included: true },
      { icon: 'check', label: 'AI diet plans', included: true },
      { icon: 'check', label: 'AI workout generation', included: true },
      { icon: 'check', label: 'WhatsApp reminders', included: true },
      { icon: 'check', label: 'Nutrition targets', included: true },
      { icon: 'close', label: 'Weekly progress reports', included: false },
      { icon: 'close', label: 'PDF diet plans', included: false },
      { icon: 'close', label: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹499',
    period: 'per month',
    color: '#F59E0B',
    gradient: ['#78350F', '#D97706'] as [string, string],
    badge: 'Best value',
    features: [
      { icon: 'check', label: 'Everything in Basic', included: true },
      { icon: 'check', label: 'Weekly progress reports', included: true },
      { icon: 'check', label: 'PDF diet plans download', included: true },
      { icon: 'check', label: 'AI body scan (beta)', included: true },
      { icon: 'check', label: 'Supplement suggestions', included: true },
      { icon: 'check', label: 'Grocery list generation', included: true },
      { icon: 'check', label: 'WhatsApp AI coaching', included: true },
      { icon: 'check', label: 'Priority support', included: true },
    ],
  },
];

export const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner'] as const;

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export const MEAL_META: Record<
  MealType,
  {
    icon: string;
    emoji: string;
    color: string;
    time: string;
    label: string;
    desc: string;
  }
> = {
  breakfast: {
    icon: 'white-balance-sunny',
    emoji: '🌅',
    color: '#F59E0B',
    time: '7-9 AM',
    label: 'Breakfast',
    desc: 'Start your day with this energising Indian breakfast',
  },
  lunch: {
    icon: 'food-variant',
    emoji: '☀️',
    color: '#10B981',
    time: '12-2 PM',
    label: 'Lunch',
    desc: 'Balanced midday meal to keep you fuelled and focused',
  },
  snack: {
    icon: 'food-apple',
    emoji: '🍎',
    color: '#8B5CF6',
    time: '4-5 PM',
    label: 'Snack',
    desc: 'Light snack to bridge the gap before dinner',
  },
  dinner: {
    icon: 'weather-night',
    emoji: '🌙',
    color: '#3B82F6',
    time: '7-9 PM',
    label: 'Dinner',
    desc: 'Light, nutritious dinner to end your day well',
  },
};

export const GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Fat Loss',
  weight_gain: 'Weight Gain',
  muscle_gain: 'Muscle',
  maintenance: 'Maintain',
};

export const DIET_LABELS: Record<string, string> = {
  veg: 'Veg',
  non_veg: 'Non-Veg',
  jain: 'Jain',
  vegan: 'Vegan',
};

export const DietLabel: Record<string, string> = {
  veg: '🥦 Vegetarian',
  non_veg: '🍗 Non-Veg',
  jain: '🌿 Jain',
  vegan: '🌱 Vegan',
};

export const GoalLabel: Record<string, string> = {
  weight_loss: '🔥 Fat Loss',
  weight_gain: '⬆️ Weight Gain',
  muscle_gain: '💪 Muscle',
  maintenance: '⚖️ Maintain',
};

export const TIPS = [
  '🥗 Selecting the best Indian ingredients...',
  '🔢 Calculating your calorie targets...',
  '🧠 AI is crafting your personalised plan...',
  '🍛 Adding roti, dal, paneer & more...',
  '✅ Almost done — finalising your meals!',
];

export const WORKOUT_TIPS = [
  '💪 Building your workout split...',
  '🏋️ Selecting the right exercises...',
  '⏱️ Setting rest times for your level...',
  '🔥 Calculating calories burned...',
  '✅ Your plan is almost ready!',
];

export const FOCUS_META: Record<
  string,
  { emoji: string; color: string; gradient: [string, string]; label: string }
> = {
  chest: {
    emoji: '💪',
    color: '#EF4444',
    gradient: ['#EF444420', '#EF444408'],
    label: 'Chest Day',
  },
  back: {
    emoji: '🏋️',
    color: '#3B82F6',
    gradient: ['#3B82F620', '#3B82F608'],
    label: 'Back Day',
  },
  legs: {
    emoji: '🦵',
    color: '#10B981',
    gradient: ['#10B98120', '#10B98108'],
    label: 'Leg Day',
  },
  shoulders: {
    emoji: '🎯',
    color: '#F59E0B',
    gradient: ['#F59E0B20', '#F59E0B08'],
    label: 'Shoulder Day',
  },
  arms: {
    emoji: '💪',
    color: '#8B5CF6',
    gradient: ['#8B5CF620', '#8B5CF608'],
    label: 'Arms Day',
  },
  core: {
    color: '#EC4899',
    emoji: '⚡',
    gradient: ['#EC489920', '#EC489908'],
    label: 'Core Day',
  },
  full_body: {
    emoji: '⚡',
    color: '#22C55E',
    gradient: ['#22C55E20', '#22C55E08'],
    label: 'Full Body',
  },
  cardio: {
    emoji: '🏃',
    color: '#F97316',
    gradient: ['#F9731620', '#F9731608'],
    label: 'Cardio Day',
  },
  rest: {
    emoji: '😴',
    color: '#64748B',
    gradient: ['#64748B20', '#64748B08'],
    label: 'Rest Day',
  },
  default: {
    emoji: '🏋️',
    color: '#22C55E',
    gradient: ['#22C55E20', '#22C55E08'],
    label: 'Back Day',
  },
};

export const MUSCLE_COLORS: Record<string, string> = {
  chest: '#EF4444',
  back: '#3B82F6',
  legs: '#10B981',
  shoulders: '#F59E0B',
  arms: '#8B5CF6',
  core: '#EC4899',
  full_body: '#22C55E',
  cardio: '#F97316',
  calves: '#14B8A6',
  glutes: '#F43F5E',
  triceps: '#A855F7',
  biceps: '#06B6D4',
  rest: '#64748B',
  default: '#22C55E',
};

export const MUSCLE_ICONS: Record<string, string> = {
  chest: 'arm-flex-outline',
  back: 'human-handsup',
  legs: 'run-fast',
  shoulders: 'account-arrow-up',
  arms: 'arm-flex',
  core: 'lightning-bolt',
  full_body: 'human',
  cardio: 'heart-pulse',
  default: 'dumbbell',
};

export const CONFETTI_COLORS = [
  '#22C55E',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#F97316',
];

export const PERIOD_OPTIONS = [
  { label: '1W', value: 'week' },
  { label: '1M', value: 'month' },
  { label: '3M', value: '3months' },
  { label: '1Y', value: 'year' },
] as const;

export type PERIOD_TYPES = 'week' | 'month' | '3months' | 'year';

export const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'bad', emoji: '😔', label: 'Bad' },
] as const;

export interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  color: string;
  unlockedAt?: string;
}

interface Achievement {
  totalLogs: number;
  longest: number;
  goalMet: boolean;
  colors: AppColors;
}

export const getAchievements = ({
  totalLogs,
  longest,
  goalMet,
  colors,
}: Achievement): AchievementBadgeProps[] => [
  {
    icon: '🌱',
    name: 'First Step',
    description: 'Log your weight for the first time',
    unlocked: totalLogs >= 1,
    color: colors.success,
  },
  {
    icon: '🔥',
    name: '7-Day Streak',
    description: 'Log weight 7 days in a row',
    unlocked: longest >= 7,
    color: '#F97316',
  },
  {
    icon: '⚡',
    name: '30-Day Warrior',
    description: 'Maintain a 30-day logging streak',
    unlocked: longest >= 30,
    color: '#F59E0B',
  },
  {
    icon: '💪',
    name: 'Consistent',
    description: 'Log weight at least 10 times',
    unlocked: totalLogs >= 10,
    color: '#8B5CF6',
  },
  {
    icon: '🏆',
    name: 'Century Club',
    description: 'Log weight 100 times total',
    unlocked: totalLogs >= 100,
    color: '#F59E0B',
  },
  {
    icon: '🎯',
    name: 'Goal Getter',
    description: 'Hit your primary fitness goal',
    unlocked: goalMet,
    color: colors.primary,
  },
  {
    icon: '📏',
    name: 'Measure Up',
    description: 'Log all body measurements once',
    unlocked: false,
    color: colors.info,
  },
  {
    icon: '🌟',
    name: 'FitIndia Legend',
    description: 'Reach a 60-day streak',
    unlocked: longest >= 60,
    color: '#EF4444',
  },
];

export type Period = (typeof PERIODS)[number]['value'];

export type ChartTab = 'weight' | 'measurements' | 'bmi';

export const PERIODS = [
  { label: '1W', value: 'week', days: 7 },
  { label: '1M', value: 'month', days: 30 },
  { label: '3M', value: '3months', days: 90 },
  { label: '1Y', value: 'year', days: 365 },
] as const;

export const getGreeting = (): { text: string; emoji: string } => {
  const h = new Date().getHours();
  if (h < 6) return { text: 'Good night', emoji: '🌙' };
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌅' };
  return { text: 'Good night', emoji: '🌙' };
};

export const QUOTES: Record<string, string[]> = {
  weight_loss: [
    'Every step counts. Keep going! 🔥',
    'Small steps lead to big changes 💪',
    "You're doing amazing — stay consistent!",
  ],
  muscle_gain: [
    'Muscles are built one rep at a time 💪',
    'Push harder today than yesterday! ⚡',
    'Strength is earned, not given 🏋️',
  ],
  maintenance: [
    'Consistency is your superpower ⚡',
    "Stay the course — you've got this! 🎯",
    'Balance is the key to longevity 🧘',
  ],
  weight_gain: [
    'Fuel your body — eat, grow, repeat 🌱',
    'Building a stronger you, one meal at a time 🍽️',
  ],
};

export const DEFAULT_QUOTES = [
  'Stay consistent, stay strong! 💪',
  'One day at a time 🌟',
  'FitIndia — your health journey starts now 🇮🇳',
];

export const FOCUS_OPTIONS = [
  { value: 'full_body', label: 'Full Body', emoji: '⚡', color: '#F97316' },
  { value: 'chest', label: 'Chest', emoji: '💪', color: '#EF4444' },
  { value: 'back', label: 'Back', emoji: '🔙', color: '#3B82F6' },
  { value: 'legs', label: 'Legs', emoji: '🦵', color: '#10B981' },
  { value: 'shoulders', label: 'Shoulders', emoji: '🏋️', color: '#8B5CF6' },
  { value: 'arms', label: 'Arms', emoji: '💪', color: '#F59E0B' },
  { value: 'cardio', label: 'Cardio', emoji: '🏃', color: '#EC4899' },
  { value: 'core', label: 'Core', emoji: '🎯', color: '#14B8A6' },
];

export const TYPE_OPTIONS = [
  { value: 'home', label: 'Home', emoji: '🏠', desc: 'Bodyweight only' },
  { value: 'gym', label: 'Gym', emoji: '🏋️', desc: 'Full equipment' },
];

export const quickTips = [
  'Finding best exercises...',
  'Calculating intensity...',
  'Building your session...',
];
