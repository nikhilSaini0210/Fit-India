import { CACHE_TTL, STORAGE_KEYS } from '../constants';
import { workoutApi } from '../services/api';
import { useWorkoutStore } from '../store';
import { WorkoutPlan } from '../types';
import { useMutation, useQuery } from './useQuery';

export const useTodaysWorkout = () => {
  const setTodaysWorkout = useWorkoutStore(s => s.setTodaysWorkout);

  return useQuery(() => workoutApi.getToday(), [], {
    cacheKey: STORAGE_KEYS.CACHE_WORKOUT_PLAN,
    cacheTTL: CACHE_TTL.WORKOUT_PLAN,
    onSuccess: (data: any) => {
      if (data?.workout) setTodaysWorkout(data.workout);
    },
  });
};

export const useActiveWorkoutPlan = () => {
  const setActivePlan = useWorkoutStore(s => s.setActivePlan);

  return useQuery(() => workoutApi.getActive(), [], {
    cacheKey: STORAGE_KEYS.CACHE_WORKOUT_PLAN,
    cacheTTL: CACHE_TTL.WORKOUT_PLAN,
    onSuccess: (data: any) => {
      if (data?.plan) setActivePlan(data.plan);
    },
  });
};

export const useGenerateWorkoutPlan = () => {
  const setActivePlan = useWorkoutStore(s => s.setActivePlan);

  return useMutation<{ days?: number; useAI?: boolean }, { plan: WorkoutPlan }>(
    vars => workoutApi.generate(vars),
    {
      onSuccess: data => {
        if (data?.plan) setActivePlan(data.plan);
      },
    },
  );
};

export const useMarkWorkoutComplete = () => {
  const markDayComplete = useWorkoutStore(s => s.markDayComplete);

  return useMutation<{ planId: string; dayNumber: number }>(
    vars => workoutApi.markComplete(vars),
    {
      onSuccess: (_data, vars) => markDayComplete(vars.dayNumber),
    },
  );
};
