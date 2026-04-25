import { useAuthStore } from '../store';
import { logger } from '../utils';
import { REFRESH_BUFFER_MS } from './contants';
import { verifyToken } from './verify';

type RefreshFn = () => Promise<void>;

let timerId: ReturnType<typeof setTimeout> | null = null;
let isRefreshing = false;

export const scheduleRefresh = (
  token: string | null | undefined,
  onRefresh: RefreshFn,
): void => {
  cancelRefresh();

  const { valid, expiresInMs } = verifyToken(token);
  if (!valid || !expiresInMs) {
    logger.warn('Skipping refresh scheduling (invalid token)', {
      tag: 'Scheduler',
    });
    return;
  }

  const delay = Math.max(5000, expiresInMs - REFRESH_BUFFER_MS);
  logger.info(`Token refresh scheduled in ${Math.round(delay / 1000)}s`, {
    tag: 'Scheduler',
  });

  timerId = setTimeout(async () => {
    if (isRefreshing) {
      logger.warn('Refresh already in progress, skipping', {
        tag: 'Scheduler',
      });
      return;
    }

    isRefreshing = true;

    try {
      logger.info('Refreshing token...', { tag: 'Scheduler' });

      await onRefresh();

      const newToken = useAuthStore.getState().accessToken;

      logger.info('Token refreshed successfully', {
        tag: 'Scheduler',
      });

      scheduleRefresh(newToken, onRefresh);
    } catch (err) {
      logger.error('Refresh failed', {
        tag: 'Scheduler',
        data: err,
      });
    } finally {
      isRefreshing = false;
    }
  }, delay);
};

export const cancelRefresh = (): void => {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
    logger.debug('Refresh timer cleared', { tag: 'Scheduler' });
  }
};
