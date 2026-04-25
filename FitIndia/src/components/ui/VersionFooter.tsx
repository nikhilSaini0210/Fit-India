import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { getDeviceInfo, rs } from '../../utils';
import { useColors } from '../../store';
import { fonts } from '../../constants';

interface VersionFooterProps {
  style?: StyleProp<ViewStyle>;
}

const VersionFooter: FC<VersionFooterProps> = ({ style }) => {
  const colors = useColors();
  const [av, setAv] = useState<{ appVersion?: string; buildNumber?: string }>({
    appVersion: '1.0.0',
    buildNumber: '1',
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const { appVersion, buildNumber } = await getDeviceInfo();
      setAv({ appVersion, buildNumber });
    };

    fetchDeviceInfo();
  }, []);

  return (
    <Text
      style={[
        styles.version,
        style,
        { color: colors.textTertiary, fontFamily: fonts.Regular },
      ]}
    >
      {`Made in India 🇮🇳 — FitSutra v${av.appVersion} (${av.buildNumber})`}
    </Text>
  );
};

export default VersionFooter;

const styles = StyleSheet.create({
  version: {
    textAlign: 'center',
    fontSize: rs.font(12),
  },
});
