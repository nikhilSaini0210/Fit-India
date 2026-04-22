import { CACHE_TTL, STORAGE_KEYS } from '../constants';
import { dietApi } from '../services/api';
import { useDietStore } from '../store';
import { DietPlan } from '../types';
import { useMutation, useQuery } from './useQuery';

export const useTodaysMeals = () => {
  const setTodaysMeals = useDietStore(s => s.setTodaysMeals);

  return useQuery(() => dietApi.getToday(), [], {
    cacheKey: STORAGE_KEYS.CACHE_DIET_PLAN,
    cacheTTL: CACHE_TTL.DIET_PLAN,
    onSuccess: (data: any) => {
      if (data?.meals) setTodaysMeals(data);
    },
  });
};

export const useActiveDietPlan = () => {
  const setActivePlan = useDietStore(s => s.setActivePlan);

  return useQuery(() => dietApi.getActive(), [], {
    cacheKey: STORAGE_KEYS.CACHE_DIET_PLAN,
    cacheTTL: CACHE_TTL.DIET_PLAN,
    onSuccess: (data: any) => {
      if (data?.plan) setActivePlan(data.plan);
    },
  });
};

export const useGenerateDietPlan = () => {
  const setActivePlan = useDietStore(s => s.setActivePlan);

  return useMutation<{ days?: number; useAI?: boolean }, { plan: DietPlan }>(
    vars => dietApi.generate(vars),
    {
      onSuccess: data => {
        if (data?.plan) setActivePlan(data.plan);
      },
    },
  );
};
