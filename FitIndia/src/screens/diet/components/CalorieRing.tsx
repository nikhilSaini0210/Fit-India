import React, { FC, useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { rs } from '../../../utils';

interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
}

export const CalorieRing: FC<CalorieRingProps> = ({
  consumed,
  target,
  size = rs.scale(140),
}) => {
  const colors = useColors();
  const strokeW = size * 0.08;
  const radius = (size - strokeW * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumf = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const over = consumed > target;
  const ringColor = over ? colors.error : colors.primary;

  const animPct = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animPct, {
        toValue: pct,
        duration: 900,
        useNativeDriver: false,
      }),
      Animated.timing(countAnim, {
        toValue: consumed,
        duration: 900,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct, consumed]);

  // Animated strokeDashoffset
  const dashOffset = animPct.interpolate({
    inputRange: [0, 1],
    outputRange: [circumf, 0],
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[s.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Background track */}
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={ringColor + '20'}
          strokeWidth={strokeW}
          fill="transparent"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeW}
          fill="transparent"
          strokeDasharray={`${circumf} ${circumf}`}
          strokeDashoffset={dashOffset as any}
          strokeLinecap="round"
          transform={`rotate(-90, ${cx}, ${cy})`}
        />
      </Svg>

      {/* Center label */}
      <View style={s.center}>
        <Animated.Text
          style={[
            s.consumed,
            {
              color: over ? colors.error : colors.textPrimary,
              fontFamily: fonts.Bold,
            },
          ]}
        >
          {
            countAnim.interpolate({
              inputRange: [0, consumed],
              outputRange: ['0', String(Math.round(consumed))],
            }) as any
          }
        </Animated.Text>
        <Text
          style={[
            s.unit,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          / {target} kcal
        </Text>
        <Text
          style={[
            s.label,
            {
              color: over ? colors.error : colors.textTertiary,
              fontFamily: fonts.Medium,
            },
          ]}
        >
          {over ? 'Over target' : 'consumed'}
        </Text>
      </View>
    </View>
  );
};

// Fallback without SVG — uses plain View bars
export const CalorieRingFallback: FC<CalorieRingProps> = ({
  consumed,
  target,
}) => {
  const colors = useColors();
  const over = consumed > target;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  return (
    <View style={s.fallbackWrap}>
      <Text
        style={[
          s.consumed,
          {
            color: over ? colors.error : colors.textPrimary,
            fontFamily: fonts.Bold,
            fontSize: rs.font(36),
          },
        ]}
      >
        {consumed}
      </Text>
      <Text
        style={[
          s.unit,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        / {target} kcal
      </Text>
      <View
        style={[s.fallbackTrack, { backgroundColor: colors.backgroundMuted }]}
      >
        <Animated.View
          style={[
            s.fallbackFill,
            {
              backgroundColor: over ? colors.error : colors.primary,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', gap: rs.verticalScale(2) },
  consumed: { fontSize: rs.font(28) },
  unit: { fontSize: rs.font(12) },
  label: { fontSize: rs.font(11) },
  fallbackWrap: { alignItems: 'center', gap: rs.verticalScale(4) },
  fallbackTrack: {
    height: rs.verticalScale(6),
    borderRadius: 4,
    width: rs.scale(160),
    overflow: 'hidden',
  },
  fallbackFill: { height: '100%', borderRadius: 4 },
});
