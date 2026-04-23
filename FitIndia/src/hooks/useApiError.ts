import { useCallback } from 'react';
import { isAppError } from '../utils';
import { useModal, useToast } from '../context';

export const useApiError = () => {
  const toast = useToast();
  const modal = useModal();
  return useCallback(
    (err: unknown, fallback = 'Something went wrong.') => {
      if (!isAppError(err)) {
        toast({ type: 'error', title: 'Error', message: fallback });
        return;
      }

      switch (err.code) {
        case 'NO_NETWORK':
          modal({
            title: 'No internet connection',
            message: 'Check your Wi-Fi or mobile data and try again.',
            buttons: [
              { label: 'Retry', variant: 'primary', onPress: () => {} },
              { label: 'Cancel', variant: 'ghost', onPress: () => {} },
            ],
          });
          break;
        case 'TIMEOUT':
          toast({
            type: 'warning',
            title: 'Request timed out',
            message: 'Took too long.',
            action: { label: 'Retry', onPress: () => {} },
          });
          break;
        case 'VALIDATION':
          modal({
            title: 'Check your input',
            message: 'Please fix the following errors:',
            errors: err.errors?.map(e => e.message) ?? [err.message],
            buttons: [
              { label: 'Got it', variant: 'primary', onPress: () => {} },
            ],
          });
          break;
        case 'RATE_LIMIT':
          toast({
            type: 'warning',
            title: 'Slow down',
            message: 'Too many requests. Wait a moment.',
          });
          break;
        case 'SESSION_EXPIRED':
          // Navigation is handled by the interceptor — just show a toast/alert
          modal({
            title: 'Session expired',
            message: 'Please log in again to continue.',
            buttons: [
              { label: 'Log in', variant: 'primary', onPress: () => {} },
              { label: 'Cancel', variant: 'ghost', onPress: () => {} },
            ],
          });
          break;
        case 'SERVER_ERROR':
          toast({
            type: 'error',
            title: 'Server error',
            message: 'Try again later.',
            action: { label: 'Retry', onPress: () => {} },
          });
          break;
        default:
          toast({
            type: 'error',
            title: 'Error',
            message: err.message || fallback,
          });
      }
    },
    [modal, toast],
  );
};
