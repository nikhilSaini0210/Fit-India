import React, { FC, useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text, type ViewStyle } from 'react-native';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface StepProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const StepProgressBar: FC<StepProgressBarProps> = ({
  current,
  total,
  showLabel = false,
  color,
  height = 4,
  style,
}) => {
  const colors = useColors();
  const barColor = color ?? colors.primary;

  const progress = useRef(
    new Animated.Value(current / Math.max(total - 1, 1)),
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: current / Math.max(total - 1, 1),
      duration: 380,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  return (
    <View style={[s.wrapper, style]}>
      {showLabel && (
        <Text
          style={[
            s.label,
            { color: colors.textTertiary, fontFamily: fonts.Medium },
          ]}
        >
          Step {current + 1} of {total}
        </Text>
      )}

      <View style={[s.track, { height, gap: rs.scale(4) }]}>
        {Array.from({ length: total }).map((_, i) => {
          const isDone = i < current;
          const isCurrent = i === current;

          return (
            <View
              key={i}
              style={[
                s.segment,
                {
                  height,
                  borderRadius: height / 2,
                  backgroundColor: isDone ? barColor : colors.backgroundMuted,
                },
              ]}
            >
              {isCurrent && (
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: barColor,
                      borderRadius: height / 2,
                      width: progress.interpolate({
                        inputRange: [
                          i / Math.max(total - 1, 1),
                          (i + 1) / Math.max(total - 1, 1),
                        ],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

interface StepDotsProps {
  current: number;
  total: number;
  color?: string;
  style?: ViewStyle;
}

export const StepDots: FC<StepDotsProps> = ({
  current,
  total,
  color,
  style,
}) => {
  const colors = useColors();
  const dotColor = color ?? colors.primary;

  return (
    <View style={[s.dotsRow, style]}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <Animated.View
            key={i}
            style={[
              s.dot,
              {
                width: isActive ? rs.scale(22) : rs.scale(7),
                height: rs.scale(7),
                borderRadius: rs.scale(4),
                backgroundColor:
                  isActive || isDone ? dotColor : dotColor + '30',
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: { gap: rs.verticalScale(8) },
  label: { fontSize: rs.font(12) },
  track: { flexDirection: 'row', alignItems: 'center' },
  segment: {
    flex: 1,
    overflow: 'hidden',
  },
  dotsRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(6) },
  dot: {},
});
