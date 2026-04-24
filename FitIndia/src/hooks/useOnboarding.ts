import { useCallback } from 'react';
import { storage } from '../store';
import { AUTH_ROUTES, ROOT_ROUTES, STORAGE_KEYS } from '../constants';
import { resetAndNavigate } from '../utils';

export const useOnboarding = () => {
  const finish = useCallback(() => {
    storage.set(STORAGE_KEYS.ONBOARDING_DONE, true);
    resetAndNavigate(ROOT_ROUTES.AUTH, { screen: AUTH_ROUTES.LOGIN });
  }, []);

  const skip = finish;

  const isComplete = useCallback(
    () => storage.getBoolean(STORAGE_KEYS.ONBOARDING_DONE) ?? false,
    [],
  );

  const reset = useCallback(() => {
    storage.remove(STORAGE_KEYS.ONBOARDING_DONE);
  }, []);

  return { finish, skip, isComplete, reset };
};
