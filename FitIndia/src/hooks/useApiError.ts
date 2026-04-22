import { useCallback } from 'react';
import { Alert } from 'react-native';
import { isAppError } from '../utils';

export const useApiError = () =>
  useCallback((err: unknown, fallback = 'Something went wrong.') => {
    if (!isAppError(err)) {
      Alert.alert('Error', fallback);
      return;
    }

    switch (err.code) {
      case 'NO_NETWORK':
        Alert.alert('No internet', 'Check your connection and try again.');
        break;
      case 'TIMEOUT':
        Alert.alert('Timeout', 'Request took too long. Try again.');
        break;
      case 'VALIDATION':
        Alert.alert(
          'Check your input',
          err.errors?.map(e => `• ${e.message}`).join('\n') ?? err.message,
        );
        break;
      case 'RATE_LIMIT':
        Alert.alert('Slow down', 'Too many requests. Wait a moment.');
        break;
      case 'SESSION_EXPIRED':
        // Navigation is handled by the interceptor — just show a toast/alert
        Alert.alert('Session expired', 'Please login again.');
        break;
      case 'SERVER_ERROR':
        Alert.alert(
          'Server error',
          'Our servers are having issues. Try again later.',
        );
        break;
      default:
        Alert.alert('Error', err.message || fallback);
    }
  }, []);
