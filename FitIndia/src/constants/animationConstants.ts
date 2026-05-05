import { Easing } from 'react-native-reanimated';

export const TIMING = {
  slide: { duration: 300, easing: Easing.out(Easing.exp) },
  hide: { duration: 260, easing: Easing.in(Easing.exp) },
  in: { duration: 240, easing: Easing.out(Easing.exp) },
  out: { duration: 180, easing: Easing.out(Easing.quad) },
} as const;

export const SPRING = {
  bounce: { damping: 9, stiffness: 240 },
  settle: { damping: 14, stiffness: 180 },
  dot_in: { damping: 14, stiffness: 260 },
  dot_out: { damping: 18, stiffness: 220 },
  tap: { damping: 11, stiffness: 260 },
} as const;

export const DURATION_MS = {
  show: 1400,
} as const;

export const DURATION = {
  dot_in: { duration: 160 },
  dot_out: { duration: 100 },
  glow_in: { duration: 220 },
  glow_out: { duration: 150 },
} as const;
