import { TAB_ROUTES } from '../../constants';

export const LABEL_MAX_WIDTH = 72;

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
