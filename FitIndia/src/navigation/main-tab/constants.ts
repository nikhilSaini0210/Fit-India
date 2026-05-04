import { TAB_ROUTES } from '../../constants';
import { rs } from '../../utils';
import { Easing } from 'react-native-reanimated';

export const LABEL_MAX_WIDTH = rs.scale(62);

export const TAB_CONFIG: Record<
  string,
  { icon: string; iconFocused: string; label: string }
> = {
  [TAB_ROUTES.HOME]: {
    icon: 'home-outline',
    iconFocused: 'home',
    label: 'Home',
  },
  [TAB_ROUTES.DIET]: {
    icon: 'food-apple-outline',
    iconFocused: 'food-apple',
    label: 'Diet',
  },
  [TAB_ROUTES.WORKOUT]: {
    icon: 'dumbbell',
    iconFocused: 'dumbbell',
    label: 'Workout',
  },
  [TAB_ROUTES.PROGRESS]: {
    icon: 'chart-line-variant',
    iconFocused: 'chart-line',
    label: 'Progress',
  },
  [TAB_ROUTES.PROFILE]: {
    icon: 'account-circle-outline',
    iconFocused: 'account-circle',
    label: 'Profile',
  },
};

export const TAB_ACCENT: Record<string, string> = {
  [TAB_ROUTES.HOME]: '#22C55E',
  [TAB_ROUTES.DIET]: '#F97316',
  [TAB_ROUTES.WORKOUT]: '#EF4444',
  [TAB_ROUTES.PROGRESS]: '#3B82F6',
  [TAB_ROUTES.PROFILE]: '#8B5CF6',
};

export const LABEL_MAX_WIDTH_MAP: Record<string, number> = {
  [TAB_ROUTES.HOME]: rs.scale(44),
  [TAB_ROUTES.DIET]: rs.scale(34),
  [TAB_ROUTES.WORKOUT]: rs.scale(58),
  [TAB_ROUTES.PROGRESS]: rs.scale(56),
  [TAB_ROUTES.PROFILE]: rs.scale(46),
};

// --- Spring configs ---
// Bouncier initial overshoot for icon pop-in
export const SPRING_BOUNCE = { damping: 9, stiffness: 240 } as const;
// Smooth settle after bounce
export const SPRING_SETTLE = { damping: 14, stiffness: 180 } as const;
// Dot: fast snap in
export const SPRING_DOT = { damping: 14, stiffness: 260 } as const;
// Tap: quick compress + release
export const SPRING_TAP = { damping: 11, stiffness: 260 } as const;

// --- Timing configs ---
// Pill expansion: slightly longer for a more deliberate feel
export const TIMING_IN = {
  duration: 240,
  easing: Easing.out(Easing.exp),
} as const;
// Pill collapse: faster exit so it doesn't linger
export const TIMING_OUT = {
  duration: 180,
  easing: Easing.in(Easing.quad),
} as const;
