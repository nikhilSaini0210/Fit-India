import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { storage } from '../../store';
import {
  DIET_ROUTES,
  PROGRESS_ROUTES,
  ROOT_ROUTES,
  STORAGE_KEYS,
  TAB_ROUTES,
  WORKOUT_ROUTES,
} from '../../constants';
import { pushApi } from '../api';
import {
  getDeviceInfo,
  isAppError,
  logger,
  resetAndNavigate,
} from '../../utils';

const normalizeNotificationData = (data?: {
  [key: string]: any;
}): Record<string, string> | undefined => {
  if (!data) return undefined;

  const result: Record<string, string> = {};

  Object.keys(data).forEach(key => {
    const value = data[key];

    if (typeof value === 'string') {
      result[key] = value;
    } else if (value != null) {
      result[key] = JSON.stringify(value);
    }
  });

  return result;
};

const requestAndroidPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const handleNotificationOpen = (data?: Record<string, string>) => {
  const validScreens = ['DietToday', 'WorkoutToday', 'LogWeight', 'Home'];

  if (!data?.screen || !validScreens.includes(data.screen)) {
    resetAndNavigate(ROOT_ROUTES.MAIN);
    return;
  }

  switch (data.screen) {
    case 'DietToday':
      resetAndNavigate(ROOT_ROUTES.MAIN, {
        screen: TAB_ROUTES.DIET,
        params: { screen: DIET_ROUTES.DIET_TODAY },
      });
      break;
    case 'WorkoutToday':
      resetAndNavigate(ROOT_ROUTES.MAIN, {
        screen: TAB_ROUTES.WORKOUT,
        params: { screen: WORKOUT_ROUTES.WORKOUT_TODAY },
      });
      break;
    case 'LogWeight':
      resetAndNavigate(ROOT_ROUTES.MAIN, {
        screen: TAB_ROUTES.PROGRESS,
        params: { screen: PROGRESS_ROUTES.LOG_WEIGHT },
      });
      break;
    case 'Home':
    default:
      resetAndNavigate(ROOT_ROUTES.MAIN);
      break;
  }
};

const registerToken = async (token: string, retry = 0) => {
  const stored = storage.getString(STORAGE_KEYS.FCM_TOKEN);
  if (stored === token) return;
  const { deviceId, deviceName, appVersion } = await getDeviceInfo();

  try {
    await pushApi.registerToken({
      fcmToken: token,
      platform: Platform.OS as 'android' | 'ios',
      deviceId,
      deviceName,
      appVersion,
    });
    storage.set(STORAGE_KEYS.FCM_TOKEN, token);
  } catch (e) {
    if (retry < 3) {
      setTimeout(() => registerToken(token, retry + 1), 2000);
    } else if (isAppError(e)) {
      logger.warn('registerToken failed', {
        tag: 'Push',
        data: e,
      });
    }
  }
};

export const initPushNotifications = async () => {
  try {
    const androidGranted = await requestAndroidPermission();
    if (!androidGranted) {
      logger.info('Android permission denied', {
        tag: 'Push',
      });
      return;
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      logger.info('Permission denied', {
        tag: 'Push',
      });
      return;
    }

    const token = await messaging().getToken();
    await registerToken(token);

    messaging().onTokenRefresh((newToken: string) => {
      registerToken(newToken);
    });

    const initial = await messaging().getInitialNotification();
    if (initial) {
      handleNotificationOpen(normalizeNotificationData(initial.data));
    }

    messaging().onNotificationOpenedApp((msg: any) =>
      handleNotificationOpen(normalizeNotificationData(msg.data)),
    );

    messaging().onMessage(async (msg: any) => {
      // TODO: replace with your in-app toast/snackbar component
      // 🔥 Replace with your UI
      // showToast({
      //   title: msg.notification?.title,
      //   description: msg.notification?.body,
      // });
      logger.info('Foreground message', {
        tag: 'Push',
        data: msg.notification,
      });
    });
  } catch (e) {
    logger.warn('Firebase not installed, skipping push setup', {
      tag: 'Push',
      data: e,
    });
  }
};

// ─── Cleanup on logout ────────────────────────────────────────────────────────
export const cleanupPushNotifications = async () => {
  const stored = storage.getString(STORAGE_KEYS.FCM_TOKEN);
  if (!stored) return;

  try {
    await pushApi.removeToken(stored);
    storage.remove(STORAGE_KEYS.FCM_TOKEN);
  } catch {
    // Best-effort — token will expire server-side anyway
  }
};
