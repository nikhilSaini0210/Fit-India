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
