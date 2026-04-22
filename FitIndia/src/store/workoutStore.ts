import { createJSONStorage, persist } from 'zustand/middleware';
import { WorkoutState } from './interface';
import { zustandMMKVStorage } from './mmkv';
import { STORAGE_KEYS } from '../constants';
import { create } from 'zustand';

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    set => ({
      activePlan: null,
      todaysWorkout: null,
      lastFetched: null,

      setActivePlan: plan => set({ activePlan: plan, lastFetched: Date.now() }),
      setTodaysWorkout: day => set({ todaysWorkout: day }),

      markDayComplete: dayNumber =>
        set(s => {
          if (!s.activePlan) return s;
          const updatedPlan = {
            ...s.activePlan,
            weeklyPlan: s.activePlan.weeklyPlan.map(d =>
              d.day === dayNumber
                ? {
                    ...d,
                    isCompleted: true,
                    completedAt: new Date().toISOString(),
                  }
                : d,
            ),
          };
          return {
            activePlan: updatedPlan,
            todaysWorkout:
              s.todaysWorkout?.day === dayNumber
                ? { ...s.todaysWorkout, isCompleted: true }
                : s.todaysWorkout,
          };
        }),

      clearWorkout: () =>
        set({ activePlan: null, todaysWorkout: null, lastFetched: null }),
    }),
    {
      name: STORAGE_KEYS.WORKOUT_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export const selectActiveWorkoutPlan = (s: WorkoutState) => s.activePlan;
export const selectTodaysWorkout = (s: WorkoutState) => s.todaysWorkout;
