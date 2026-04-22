import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeInsets = () => {
  try {
    return useSafeAreaInsets();
  } catch {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
};
