import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { useColors } from '../../../store';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
  compact?: boolean;
}

const MacroBar: FC<MacroBarProps> = ({
  label,
  current,
  target,
  color,
  unit = 'g',
  compact = false,
}) => {
  const colors = useColors();
  const progress = useRef(new Animated.Value(0)).current;
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const over = current > target;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 700,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  if (compact) {
    return (
      <View style={styles.compactWrap}>
        <View style={[styles.compactTrack, { backgroundColor: color + '22' }]}>
          <Animated.View
            style={[
              styles.compactFill,
              {
                backgroundColor: over ? colors.error : color,
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.compactLabel,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {label}: {current}
          {unit}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary, fontFamily: fonts.Medium },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.values,
            {
              color: over ? colors.error : colors.textPrimary,
              fontFamily: fonts.SemiBold,
            },
          ]}
        >
          {current}
          <Text style={[styles.target, { color: colors.textTertiary }]}>
            /{target}
            {unit}
          </Text>
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: color + '22' }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: over ? colors.error : color,
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.pctLabel,
          {
            color: over ? colors.error : colors.textTertiary,
            fontFamily: fonts.Regular,
          },
        ]}
      >
        {Math.round(pct * 100)}% {over ? '(over target)' : 'of daily target'}
      </Text>
    </View>
  );
};

export default MacroBar;

const styles = StyleSheet.create({
  wrap: { gap: rs.verticalScale(4), marginBottom: rs.verticalScale(10) },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: rs.font(13) },
  values: { fontSize: rs.font(14) },
  target: { fontFamily: fonts.Regular, fontSize: rs.font(12) },
  track: { height: rs.verticalScale(6), borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  pctLabel: { fontSize: rs.font(11) },
  // compact
  compactWrap: { gap: rs.verticalScale(3) },
  compactTrack: {
    height: rs.verticalScale(4),
    borderRadius: 2,
    overflow: 'hidden',
  },
  compactFill: { height: '100%', borderRadius: 2 },
  compactLabel: { fontSize: rs.font(11) },
});
