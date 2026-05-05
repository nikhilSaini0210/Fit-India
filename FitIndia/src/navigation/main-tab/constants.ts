import { TAB_ROUTES } from '../../constants';
import { rs } from '../../utils';

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
