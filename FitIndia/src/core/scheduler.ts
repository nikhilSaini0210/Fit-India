import { logger } from '../utils';
import { REFRESH_BUFFER_MS } from './contants';
import { verifyToken } from './verify';

type RefreshFn = () => Promise<void>;

let timerId: ReturnType<typeof setTimeout> | null = null;

export const scheduleRefresh = (
  token: string | null | undefined,
  onRefresh: RefreshFn,
): void => {
  cancelRefresh();

  const { valid, expiresInMs } = verifyToken(token);
  if (!valid) {
    return;
  }

  const delay = Math.max(0, expiresInMs - REFRESH_BUFFER_MS);
  logger.info(`[Scheduler] Token refresh in ${Math.round(delay / 1_000)}s`);

  timerId = setTimeout(async () => {
    try {
      await onRefresh();
    } catch (err) {
      logger.error('Refresh failed', { tag: 'Scheduler', data: err });
    }
  }, delay);
};

export const cancelRefresh = (): void => {
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
};
