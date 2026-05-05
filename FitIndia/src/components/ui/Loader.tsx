import React, { FC, useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useColors } from '../../store';
import { rs } from '../../utils';
import { useShimmer } from '../../hooks';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export const FullScreenLoader: FC = () => {
  const colors = useColors();
  const opacity = useSharedValue(0.4);
  const rotate = useSharedValue(0);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const spinStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${rotate.value * 360}deg` }],
  }));

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    rotate.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={[s.fullScreen, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          s.spinnerOuter,
          { borderColor: colors.primary + '30' },
          opacityStyle,
        ]}
      />
      <Animated.View
        style={[s.spinnerInner, { borderTopColor: colors.primary }, spinStyle]}
      />
    </View>
  );
};

interface SkeletonProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export const Skeleton: FC<SkeletonProps> = ({
  width = '100%',
  height = rs.verticalScale(16),
  radius = rs.scale(8),
  style,
}) => {
  const colors = useColors();
  const w = typeof width === 'number' ? width : rs.screenWidth - rs.scale(40);
  const { shimmerStyle, start } = useShimmer(w);

  useEffect(() => {
    start();
  }, [start]);

  return (
    <View
      style={[
        s.skeletonWrap,
        {
          width: width as any,
          height,
          borderRadius: radius,
          backgroundColor: colors.shimmer,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          s.opacity,
          shimmerStyle,
          {
            backgroundColor: colors.shimmerHighlight,
          },
        ]}
      />
    </View>
  );
};

export const CardSkeleton: FC<{ style?: ViewStyle }> = ({ style }) => {
  const colors = useColors();
  return (
    <View
      style={[
        s.cardSkeleton,
        { backgroundColor: colors.backgroundCard, borderColor: colors.border },
        style,
      ]}
    >
      <View style={s.skelRow}>
        <Skeleton
          width={rs.scale(40)}
          height={rs.scale(40)}
          radius={rs.scale(10)}
        />
        <View style={[s.flex, { gap: rs.verticalScale(8) }]}>
          <Skeleton width="70%" height={rs.verticalScale(14)} />
          <Skeleton width="45%" height={rs.verticalScale(12)} />
        </View>
      </View>
      <Skeleton
        height={rs.verticalScale(12)}
        style={{ marginTop: rs.verticalScale(12) }}
      />
      <Skeleton
        width="80%"
        height={rs.verticalScale(12)}
        style={{ marginTop: rs.verticalScale(8) }}
      />
    </View>
  );
};

const s = StyleSheet.create({
  flex: { flex: 1 },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerOuter: {
    position: 'absolute',
    width: rs.scale(48),
    height: rs.scale(48),
    borderRadius: rs.scale(24),
    borderWidth: 3,
  },
  spinnerInner: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(20),
    borderWidth: 3,
    borderColor: 'transparent',
  },
  skeletonWrap: {
    overflow: 'hidden',
  },
  cardSkeleton: {
    borderRadius: rs.scale(16),
    borderWidth: 0.5,
    padding: rs.scale(16),
    marginBottom: rs.verticalScale(12),
  },
  skelRow: {
    flexDirection: 'row',
    gap: rs.scale(12),
    alignItems: 'center',
  },
  opacity: {
    opacity: 0.6,
  },
});
