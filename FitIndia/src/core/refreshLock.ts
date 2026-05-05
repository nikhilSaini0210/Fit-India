let refreshPromise: Promise<void> | null = null;

export const getOrStartRefresh = (
  refreshFn: () => Promise<void>,
): Promise<void> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = refreshFn().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};
