import { StyleSheet, Text } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { rs, useIsOnline, useSafeInsets } from '../utils';
import { fonts, DURATION_MS, TIMING } from '../constants';
import { useColors } from '../store';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const OfflineBanner: FC = () => {
  const insets = useSafeInsets();
  const height = 44 + insets.top;
  const colors = useColors();
  const isOnline = useIsOnline();
  const translateY = useSharedValue(-height);
  const initialized = useRef(false);

  const [visibleText, setVisibleText] = useState('No internet connection');

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isOnline === null) return;

    if (!initialized.current) {
      initialized.current = true;
      return;
    }

    if (!isOnline) {
      runOnJS(setVisibleText)('No internet connection');

      translateY.value = withTiming(0, TIMING.slide);
    } else {
      runOnJS(setVisibleText)('Back online');

      translateY.value = withTiming(0, TIMING.slide, () => {
        translateY.value = withDelay(
          DURATION_MS.show,
          withTiming(-height, TIMING.hide),
        );
      });
    }
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  const dynamicStyle = {
    paddingTop: insets.top,
    height,
    backgroundColor: isOnline ? colors.success : colors.error,
  };

  return (
    <Animated.View style={[styles.banner, animStyle, dynamicStyle]}>
      <Text style={[styles.text, { color: colors.white }]}>{visibleText}</Text>
    </Animated.View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  text: {
    fontFamily: fonts.SemiBold,
    fontSize: rs.font(13),
  },
});
