import React, { FC, useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useColors } from '../../store/appStore';
import {
  TAB_CONFIG,
  TAB_ACCENT,
  LABEL_MAX_WIDTH,
  LABEL_MAX_WIDTH_MAP,
} from './constants';
import { fonts } from '../../constants/fonts';
import { rs } from '../../utils';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from '../../components';
import { DURATION, SPRING, TIMING } from '../../constants';

interface TabItemProps {
  route: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: FC<TabItemProps> = ({
  route,
  isFocused,
  onPress,
  onLongPress,
}) => {
  const colors = useColors();
  const cfg = TAB_CONFIG[route];
  const accent = TAB_ACCENT[route] ?? colors.primary;
  const maxLabelW = LABEL_MAX_WIDTH_MAP[route] ?? LABEL_MAX_WIDTH;

  const progress = useSharedValue(isFocused ? 1 : 0);
  const iconScale = useSharedValue(1);
  const dotScale = useSharedValue(isFocused ? 1 : 0);
  const dotOpacity = useSharedValue(isFocused ? 1 : 0);
  const pillGlow = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    if (isFocused) {
      progress.value = withTiming(1, TIMING.in);
      dotScale.value = withSpring(1, SPRING.dot_in);
      dotOpacity.value = withTiming(1, DURATION.dot_in);
      pillGlow.value = withTiming(1, DURATION.glow_in);
    } else {
      progress.value = withTiming(0, TIMING.out);
      dotScale.value = withSpring(0, SPRING.dot_out);
      dotOpacity.value = withTiming(0, DURATION.dot_out);
      pillGlow.value = withTiming(0, DURATION.glow_out);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // Finger down → shrink
  const handlePressIn = useCallback(() => {
    iconScale.value = withSpring(0.68, {
      damping: 12,
      stiffness: 600,
      mass: 0.5,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePressOut = useCallback(() => {
    iconScale.value = withSpring(1, { damping: 8, stiffness: 250, mass: 0.5 });
    onPress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPress]);

  const pillBgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      { scaleX: interpolate(progress.value, [0, 1], [0.5, 1]) },
      { scaleY: interpolate(progress.value, [0, 1], [0.85, 1]) },
    ],
  }));

  const pillGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pillGlow.value, [0, 1], [0, 0.12]),
    transform: [{ scale: interpolate(pillGlow.value, [0, 1], [0.6, 1.08]) }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const labelWrapStyle = useAnimatedStyle(() => ({
    maxWidth: interpolate(progress.value, [0, 1], [0, maxLabelW]),
    opacity: interpolate(progress.value, [0, 0.45, 1], [0, 0, 1], 'clamp'),
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotOpacity.value,
  }));

  const iconColor = isFocused ? accent : colors.tabInactive;

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      style={s.tabItem}
      android_ripple={null}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={cfg?.label}
    >
      <Animated.View style={s.pill}>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            s.pillBg,
            { backgroundColor: accent + '30', borderRadius: rs.scale(28) },
            pillGlowStyle,
          ]}
        />
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            s.pillBg,
            { backgroundColor: accent + '18' },
            pillBgStyle,
          ]}
        />

        <Animated.View style={iconStyle}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={isFocused ? cfg?.iconFocused ?? cfg?.icon : cfg?.icon ?? ''}
            size={rs.scale(20)}
            color={iconColor}
          />
        </Animated.View>

        <Animated.View style={[s.labelWrap, labelWrapStyle]}>
          <Text
            numberOfLines={1}
            style={[s.label, { color: accent, fontFamily: fonts.SemiBold }]}
          >
            {cfg?.label}
          </Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[s.dot, { backgroundColor: accent }, dotStyle]} />
    </Pressable>
  );
};

export default TabItem;

const s = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: rs.verticalScale(2),
    minHeight: 50,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(7),
    borderRadius: rs.scale(24),
    overflow: 'hidden',
  },
  pillBg: {
    borderRadius: rs.scale(24),
  },
  labelWrap: {
    overflow: 'hidden',
    marginLeft: rs.scale(5),
  },
  label: {
    fontSize: rs.font(9),
    flexShrink: 1,
    letterSpacing: 0.2,
  },
  dot: {
    width: rs.scale(4),
    height: rs.scale(4),
    borderRadius: rs.scale(2),
    marginTop: rs.verticalScale(3),
  },
});
