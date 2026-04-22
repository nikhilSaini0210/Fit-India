import { create } from 'zustand';
import { DietState } from './interface';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from './mmkv';
import { STORAGE_KEYS } from '../constants';

export const useDietStore = create<DietState>()(
  persist(
    set => ({
      activePlan: null,
      todaysMeals: null,
      lastFetched: null,

      setActivePlan: plan => set({ activePlan: plan, lastFetched: Date.now() }),
      setTodaysMeals: day => set({ todaysMeals: day }),
      clearDiet: () =>
        set({ activePlan: null, todaysMeals: null, lastFetched: null }),
    }),
    {
      name: STORAGE_KEYS.DIET_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export const selectActivePlan = (s: DietState) => s.activePlan;
export const selectTodaysMeals = (s: DietState) => s.todaysMeals;
