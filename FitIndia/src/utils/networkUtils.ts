import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

const getOnlineStatus = (state: NetInfoState): boolean => {
  return Boolean(
    state.isConnected &&
      (state.isInternetReachable === null ||
        state.isInternetReachable === true),
  );
};

export const useIsOnline = (): boolean => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
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
