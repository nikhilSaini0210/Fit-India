// ─── Brand palette ────────────────────────────────────────────────────────────
const brand = {
  primary: '#22C55E', // FitIndia green
  primaryLight: '#4ADE80',
  primaryDark: '#16A34A',
  secondary: '#F97316', // Orange accent
  secondaryLight: '#FB923C',
  secondaryDark: '#EA580C',
  progressGradient: ['#2e9e18', '#5bb843', '#78cc10'],
  loading: '#2E9E18',
  line: '#78cc10',
  progressBg: '#E5E7EB',
  white: '#FFFFFF',
  black: '#000000',
  dangerA: '#EF4444',
  dangerB: '#DC2626',
  whiteTr: 'rgba(255,255,255,0.15)',
  premium: '#D97706',
  premiumLight: '#FBBF24',
};

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

  // onboarding
  accentColorA: '#16A34A',
  gradientColorsA: ['#F8FAFC', '#ECFDF5', '#F0FDF4'] as string[],
  accentColorB: '#EA580C',
  gradientColorsB: ['#FFF7ED', '#FFEDD5', '#FFFBF7'] as string[],
  accentColorC: '#7C3AED',
  gradientColorsC: ['#FAF5FF', '#F3E8FF', '#FFFFFF'] as string[],
  accentColorD: '#0891B2',
  gradientColorsD: ['#F0FDFF', '#E0F7FA', '#FFFFFF'] as string[],
  accentColorE: '#CA8A04',
  gradientColorsE: ['#FFFBEB', '#FEF3C7', '#FFFFFF'] as string[],
  iconSecondary: 'rgba(0,0,0,0.55)',
  textHighEmphasis: 'rgba(0,0,0,0.72)',
  borderSubtle: 'rgba(0,0,0,0.2)',
  iconPrimary: 'rgba(0,0,0,0.8)',
  textStrong: 'rgba(0,0,0,0.4)',
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

  // onboarding
  accentColorA: '#22C55E',
  gradientColorsA: ['#0F172A', '#0D2318', '#0A1A0F'] as string[],
  accentColorB: '#F97316',
  gradientColorsB: ['#0F172A', '#1A0D06', '#0F0A02'] as string[],
  accentColorC: '#8B5CF6',
  gradientColorsC: ['#0F172A', '#120D1A', '#0C0A12'] as string[],
  accentColorD: '#06B6D4',
  gradientColorsD: ['#0F172A', '#071318', '#050F13'] as string[],
  accentColorE: '#EAB308',
  gradientColorsE: ['#0F172A', '#141006', '#0F0C03'] as string[],
  iconSecondary: 'rgba(255,255,255,0.55)',
  textHighEmphasis: 'rgba(255,255,255,0.72)',
  borderSubtle: 'rgba(255,255,255,0.2)',
  iconPrimary: 'rgba(255,255,255,0.8)',
  textStrong: 'rgba(255,255,255,0.4)',
};

export type AppColors = typeof lightColors;
export type ThemeType = 'light' | 'dark' | 'system';
