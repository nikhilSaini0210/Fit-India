import { useCallback, useEffect, useRef, useState } from 'react';
import { CACHE_TTL, StorageKey } from '../constants';
import { getCached, setCached } from '../store';
import { isAppError } from '../utils';
import { sleep } from '../helper';
import { AppState, AppStateStatus } from 'react-native';

interface QueryOptions<T> {
  cacheKey?: StorageKey;
  cacheTTL?: number;
  refetchOnFocus?: boolean;
  delay?: number;
  onSuccess?: (data: T) => void;
  onError?: (err: unknown) => void;
  enabled?: boolean;
}

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  refreshing: boolean; // pull-to-refresh in progress
  error: string | null;
  isStale: boolean; // showing cached data while re-fetching
  refetch: () => Promise<void>;
  refresh: () => Promise<void>; // pull-to-refresh (sets refreshing flag)
}

interface MutationOptions<TData, TResult> {
  onSuccess?: (result: TResult, vars: TData) => void;
  onError?: (err: unknown, vars: TData) => void;
}

interface MutationState<TData, TResult> {
  mutate: (
    vars: TData,
  ) => Promise<{ ok: boolean; data?: TResult; error?: string }>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

const DEFAULT_CACHE_TTL = CACHE_TTL.DEFAULT_TTL;

export function useQuery<T>(
  fetcher: () => Promise<{ data: { data: T } | T }>,
  deps: unknown[],
  opts: QueryOptions<T> = {},
): QueryState<T> {
  const {
    cacheKey,
    cacheTTL = DEFAULT_CACHE_TTL,
    refetchOnFocus = true,
    delay = 0,
    onSuccess,
    onError,
    enabled = true,
  } = opts;

  const cached = cacheKey ? getCached<T>(cacheKey) : null;

  const [data, setData] = useState<T | null>(cached);
  const [loading, setLoading] = useState(!cached && enabled);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(!!cached);
  const mountedRef = useRef(true);

  const unwrap = (res: { data: { data: T } | T }): T => {
    const inner = (res as any)?.data?.data;
    return inner !== undefined ? inner : (res as any)?.data ?? res;
  };

  const execute = useCallback(
    async (isRefresh = false) => {
      if (!enabled) return;

      if (isRefresh) setRefreshing(true);
      else if (!data) setLoading(true);
      else setIsStale(true); // has old data, silently re-fetching

      setError(null);

      try {
        if (delay && !isRefresh) await sleep(delay);

        const res = await fetcher();
        const value = unwrap(res as any);

        if (!mountedRef.current) return;

        setData(value);
        setIsStale(false);

        if (cacheKey) setCached(cacheKey, value, cacheTTL);
        onSuccess?.(value);
      } catch (e) {
        if (!mountedRef.current) return;
        const msg = isAppError(e) ? e.message : 'Something went wrong';
        setError(msg);
        onError?.(e);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, cacheKey, cacheTTL, ...deps],
  );

  useEffect(() => {
    mountedRef.current = true;
    execute();
    return () => {
      mountedRef.current = false;
    };
  }, [execute]);

  useEffect(() => {
    if (!refetchOnFocus) return;
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active') execute();
    });
    return () => sub.remove();
  }, [execute, refetchOnFocus]);

  return {
    data,
    loading,
    refreshing,
    error,
    isStale,
    refetch: () => execute(false),
    refresh: () => execute(true),
  };
}

export function useMutation<TData, TResult = unknown>(
  mutator: (vars: TData) => Promise<unknown>,
  opts: MutationOptions<TData, TResult> = {},
): MutationState<TData, TResult> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (vars: TData) => {
      setLoading(true);
      setError(null);
      try {
        const res = await mutator(vars);
        const result = (res as any)?.data?.data ?? (res as any)?.data ?? res;
        opts.onSuccess?.(result, vars);
        return { ok: true, data: result as TResult };
      } catch (e) {
        const msg = isAppError(e) ? e.message : 'Operation failed';
        setError(msg);
        opts.onError?.(e, vars);
        return { ok: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutator],
  );

  return { mutate, loading, error, reset: () => setError(null) };
}
