import { progressApi } from '../services/api';
import { useProgressStore } from '../store';
import { ProgressLog } from '../types';
import { useMutation, useQuery } from './useQuery';

export const useProgressSummary = () => {
  const setSummary = useProgressStore(s => s.setSummary);

  return useQuery(() => progressApi.getSummary(), [], {
    onSuccess: (data: any) => {
      if (data?.summary) setSummary(data.summary);
    },
  });
};

export const useStreak = () => {
  const setStreak = useProgressStore(s => s.setStreak);

  return useQuery(() => progressApi.getStreak(), [], {
    onSuccess: (data: any) => {
      if (data?.streak) setStreak(data.streak);
    },
  });
};

export const useProgressHistory = (period = 'month') =>
  useQuery(() => progressApi.getHistory({ period }), [period]);

export const useLogProgress = () => {
  const addLog = useProgressStore(s => s.addLog);

  return useMutation<
    Parameters<typeof progressApi.log>[0],
    { log: ProgressLog }
  >(vars => progressApi.log(vars), {
    onSuccess: data => {
      if (data?.log) addLog(data.log);
    },
  });
};
