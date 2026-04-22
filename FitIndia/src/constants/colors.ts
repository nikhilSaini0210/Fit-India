// ─── Brand palette ────────────────────────────────────────────────────────────
const brand = {
  primary: '#22C55E', // FitIndia green
  primaryLight: '#4ADE80',
  primaryDark: '#16A34A',
  secondary: '#F97316', // Orange accent
  secondaryLight: '#FB923C',
  secondaryDark: '#EA580C',
} as const;

// ─── Light theme ──────────────────────────────────────────────────────────────
export const lightColors = {
  // Brand
  ...brand,

  // Backgrounds
  background: '#F8FAFC',
  backgroundCard: '#FFFFFF',
  backgroundSurface: '#F1F5F9',
  backgroundMuted: '#E2E8F0',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Border
  border: '#E2E8F0',
  borderFocus: '#22C55E',
  borderMuted: '#F1F5F9',

  // Semantic
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Tab bar
  tabBar: '#FFFFFF',
  tabBarBorder: '#F1F5F9',
  tabActive: '#22C55E',
  tabInactive: '#94A3B8',

  // Gradient stops
  splashGradient: ['#0F172A', '#1E3A2F', '#0F172A'] as string[],
  cardGradient: ['#22C55E', '#16A34A'] as string[],

  // Misc
  overlay: 'rgba(0,0,0,0.5)',
  shadow: '#000000',
  shimmer: '#F1F5F9',
  shimmerHighlight: '#FFFFFF',
};

// ─── Dark theme ───────────────────────────────────────────────────────────────
export const darkColors = {
  // Brand (same)
  ...brand,

  // Backgrounds
  background: '#0F172A',
  backgroundCard: '#1E293B',
  backgroundSurface: '#1E293B',
  backgroundMuted: '#334155',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  textInverse: '#0F172A',
  textOnPrimary: '#FFFFFF',

  // Border
  border: '#334155',
  borderFocus: '#22C55E',
  borderMuted: '#1E293B',

  // Semantic
  success: '#22C55E',
  successLight: '#14532D',
  warning: '#F59E0B',
  warningLight: '#451A03',
  error: '#EF4444',
  errorLight: '#450A0A',
  info: '#3B82F6',
  infoLight: '#1E3A8A',

  // Tab bar
  tabBar: '#1E293B',
  tabBarBorder: '#334155',
  tabActive: '#22C55E',
  tabInactive: '#475569',

  // Gradient stops
  splashGradient: ['#0F172A', '#1A2F1A', '#0F172A'] as string[],
  cardGradient: ['#22C55E', '#16A34A'] as string[],

  // Misc
  overlay: 'rgba(0,0,0,0.7)',
  shadow: '#000000',
  shimmer: '#1E293B',
  shimmerHighlight: '#334155',
};

export type AppColors = typeof lightColors;
export type ThemeType = 'light' | 'dark' | 'system';
