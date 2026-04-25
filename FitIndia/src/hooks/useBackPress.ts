import { useEffect, useCallback, useRef } from 'react';
import { BackHandler } from 'react-native';
import { logger } from '../utils';

export type BackPressHandler = () => boolean | null | undefined;

export interface UseBackPressOptions {
  handler: BackPressHandler;
  enabled?: boolean;
  priority?: 'default' | 'high';
}

export function useBackPress({
  handler,
  enabled = true,
  priority = 'default',
}: UseBackPressOptions): void {
  const handlerRef = useRef<BackPressHandler>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const stableCallback = useCallback(() => {
    if (!handlerRef.current) return false;

    try {
      const result = handlerRef.current();
      return result === true;
    } catch (error) {
      if (__DEV__) {
        logger.error('Handler threw an error', {
          tag: 'BackPress',
          data: error,
        });
      }
      return false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let noopSubscription: { remove: () => void } | null = null;

    if (priority === 'high') {
      const noop = () => false;

      noopSubscription = BackHandler.addEventListener(
        'hardwareBackPress',
        noop,
      );
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      stableCallback,
    );

    return () => {
      subscription.remove();
      noopSubscription?.remove();
    };
  }, [enabled, priority, stableCallback]);
}
