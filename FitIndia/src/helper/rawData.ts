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
