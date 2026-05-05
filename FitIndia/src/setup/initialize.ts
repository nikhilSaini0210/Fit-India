import { Appearance } from 'react-native';
import { useAppStore, useAuthStore } from '../store';
import {
  cancelRefresh,
  doRefresh,
  logoutFn,
  scheduleRefresh,
  verifyToken,
} from '../core';
import { authApi } from '../services/api';
import { logger } from '../utils';

const MIN_SPLASH_MS = 4500;
const API_TIMEOUT = 8000;

const isAuthError = (err: any) =>
  err?.code === 'SESSION_EXPIRED' || err?.response?.status === 401;

const withTimeout = <T>(promise: Promise<T>, ms = API_TIMEOUT) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms),
    ),
  ]);

export const initializeApp = async (): Promise<void> => {
  logger.info('Starting...', { tag: 'Init' });

  const { setLoadingStep } = useAppStore.getState();

  setLoadingStep(0.05);

  const minDelay = new Promise<void>(resolve =>
    setTimeout(resolve, MIN_SPLASH_MS),
  );

  setLoadingStep(0.1);

  const runBlocking = async () => {
    try {
      logger.info('Token validation start', { tag: 'Init' });

      setLoadingStep(0.2);

      const { accessToken, refreshToken } = useAuthStore.getState();

      logger.debug('Tokens received', {
        tag: 'Auth',
        data: {
          accessToken: accessToken?.slice(0, 10) + '...',
          refreshToken: refreshToken?.slice(0, 10) + '...',
        },
      });

      if (accessToken) {
        const { valid } = verifyToken(accessToken);

        if (valid) {
          logger.info('Token valid (local check)', { tag: 'Init' });

          if (refreshToken) {
            scheduleRefresh(accessToken, async () => {
              await doRefresh();
            });
          }

          setLoadingStep(0.4);

          logger.info('Token valid', { tag: 'Init' });
        } else {
          if (!refreshToken) {
            cancelRefresh();
            await logoutFn().catch(() => {});
            return;
          }

          logger.info('Access expired → refreshing', { tag: 'Init' });

          try {
            await withTimeout(doRefresh());
            setLoadingStep(0.4);
          } catch (err) {
            if (isAuthError(err)) {
              await logoutFn().catch(() => {});
              return;
            }
            logger.warn('Refresh failed but keeping session', { tag: 'Init' });
          }

          logger.debug('New tokens received', {
            tag: 'Auth',
            data: {
              accessToken: accessToken?.slice(0, 10) + '...',
              refreshToken: refreshToken?.slice(0, 10) + '...',
            },
          });

          setLoadingStep(0.4);
        }
      } else {
        setLoadingStep(0.4);
      }
    } catch (err: any) {
      cancelRefresh();

      logger.warn('Token step failed', {
        tag: 'Init',
        data: {
          message: err?.message,
          code: err?.code,
          status: err?.response?.status,
        },
      });
      if (isAuthError(err)) {
        await logoutFn().catch(() => {});
      }
    }

    try {
      setLoadingStep(0.5);
      const { isLoggedIn, setAuth, accessToken, refreshToken } =
        useAuthStore.getState();

      if (!isLoggedIn) {
        setLoadingStep(0.7);
        return;
      }

      const res = await withTimeout(authApi.getMe());

      const user = res.data?.data?.user;
      if (!user) {
        throw new Error('Invalid user');
      }

      setAuth(user, {
        accessToken: accessToken ?? '',
        refreshToken: refreshToken ?? '',
      });

      setLoadingStep(0.7);
      logger.info('User loaded', { tag: 'Init' });
    } catch (err: any) {
      logger.warn('User fetch failed', {
        tag: 'Init',
        data: {
          message: err?.message,
          status: err?.response?.status,
        },
      });

      if (isAuthError(err)) {
        await logoutFn().catch(() => {});
      }
    }
  };

  try {
    await Promise.all([
      runBlocking(),
      (async () => {
        await minDelay;
        setLoadingStep(0.85);
      })(),
    ]);
  } catch (err) {
    logger.error('Blocking phase error', { tag: 'Init', data: err });
  }

  Promise.allSettled([
    (async () => {
      const { theme, language } = useAppStore.getState();

      if (theme !== 'system') {
        const system =
          Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';

        if (system !== theme) {
          Appearance.setColorScheme(theme);
        }
      }
      // i18n.changeLanguage(language);

      logger.info('Settings applied', {
        tag: 'Init',
        data: { theme, language },
      });
    })(),
  ]);

  setLoadingStep(0.9);

  logger.info('Done', { tag: 'Init' });
};
