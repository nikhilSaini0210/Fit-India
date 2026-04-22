import DeviceInfo from 'react-native-device-info';

export const getDeviceInfo = async () => {
  const deviceId = await DeviceInfo.getUniqueId();

  return {
    appVersion: DeviceInfo.getVersion(),
    buildNumber: DeviceInfo.getBuildNumber(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    deviceId,
    deviceName: DeviceInfo.getDeviceNameSync(),
    isEmulator: DeviceInfo.isEmulatorSync(),
  };
};
