import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

const getOnlineStatus = (state: NetInfoState): boolean => {
  return Boolean(
    state.isConnected &&
      (state.isInternetReachable === null ||
        state.isInternetReachable === true),
  );
};

export const useIsOnline = (): boolean | null => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    NetInfo.fetch().then(state => setIsOnline(getOnlineStatus(state)));

    const unsub = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(getOnlineStatus(state));
    });

    return () => unsub();
  }, []);

  return isOnline;
};

export const checkIsOnline = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return Boolean(
      state.isConnected &&
        (state.isInternetReachable === null ||
          state.isInternetReachable === true),
    );
  } catch {
    return false;
  }
};
