import { create } from 'zustand';
import { ProgressState } from './interface';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandMMKVStorage } from './mmkv';
import { STORAGE_KEYS } from '../constants';

export const useProgressStore = create<ProgressState>()(
  persist(
    set => ({
      summary: null,
      latestLog: null,
      streak: { current: 0, longest: 0 },
      lastFetched: null,

      setSummary: summary => set({ summary, lastFetched: Date.now() }),
      setLatestLog: log => set({ latestLog: log }),
      setStreak: streak => set({ streak }),

      addLog: log =>
        set(s => ({
          latestLog: log,
          streak: {
            ...s.streak,
            current: s.streak.current + 1,
            longest: Math.max(s.streak.longest, s.streak.current + 1),
          },
          summary: s.summary
            ? {
                ...s.summary,
                currentWeight: log.weight,
                weightChange: parseFloat(
                  (log.weight - s.summary.startWeight).toFixed(1),
                ),
                lastLogDate: log.logDate,
              }
            : null,
        })),

      clearProgress: () =>
        set({
          summary: null,
          latestLog: null,
          streak: { current: 0, longest: 0 },
          lastFetched: null,
        }),
    }),
    {
      name: STORAGE_KEYS.PROGRESS_STORE,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

export const selectSummary = (s: ProgressState) => s.summary;
export const selectStreak = (s: ProgressState) => s.streak;
export const selectLatestLog = (s: ProgressState) => s.latestLog;
