import { useEffect, useCallback, useRef } from 'react';
import { BackHandler } from 'react-native';

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
        console.error('[useBackPress] Handler threw an error:', error);
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
