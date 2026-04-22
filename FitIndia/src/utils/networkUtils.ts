import { useState, useEffect } from 'react';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';

export const useIsOnline = (): boolean => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    NetInfo.fetch().then((state: NetInfoState) => {
      setIsOnline(
        state.isConnected === true && state.isInternetReachable !== false,
      );
    });

    const unsub = NetInfo.addEventListener((state: NetInfoState) => {
      setIsOnline(
        state.isConnected === true && state.isInternetReachable !== false,
      );
    });

    return () => unsub();
  }, []);

  return isOnline;
};

export const checkIsOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected === true && state.isInternetReachable !== false;
};
