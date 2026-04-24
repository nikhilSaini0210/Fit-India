import React, { FC, useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useColors } from '../../store';
import { rs } from '../../utils';

interface ShimmerProps {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export const Shimmer:FC<ShimmerProps> = ({
  width = '100%',
  height = rs.verticalScale(16),
  radius = rs.scale(8),
  style,
}) => {
  const colors = useColors();
  const translateX = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 300,
        duration: 1100,
        useNativeDriver: true,
      }),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        s.base,
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
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={[
            'transparent',
            colors.shimmerHighlight + 'CC',
            'transparent',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const CardSkeleton:FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[s.card, style]}>
    <View style={s.row}>
      <Shimmer
        width={rs.scale(48)}
        height={rs.scale(48)}
        radius={rs.scale(12)}
      />
      <View style={[s.flex, { gap: rs.verticalScale(6) }]}>
        <Shimmer width="65%" height={rs.verticalScale(14)} />
        <Shimmer width="40%" height={rs.verticalScale(11)} />
      </View>
    </View>
    <Shimmer
      height={rs.verticalScale(12)}
      style={{ marginTop: rs.verticalScale(12) }}
    />
    <Shimmer
      width="80%"
      height={rs.verticalScale(12)}
      style={{ marginTop: rs.verticalScale(6) }}
    />
  </View>
);

export const MealCardSkeleton:FC = () => (
  <View style={s.card}>
    <View style={s.row}>
      <Shimmer
        width={rs.scale(40)}
        height={rs.scale(40)}
        radius={rs.scale(10)}
      />
      <View style={[s.flex, { gap: rs.verticalScale(6) }]}>
        <Shimmer width="50%" height={rs.verticalScale(13)} />
        <Shimmer width="30%" height={rs.verticalScale(10)} />
      </View>
      <Shimmer
        width={rs.scale(44)}
        height={rs.verticalScale(20)}
        radius={rs.scale(8)}
      />
    </View>
  </View>
);

export const ListSkeleton:FC<{ count?: number }> = ({ count = 4 }) => (
  <View style={{ gap: rs.verticalScale(10) }}>
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </View>
);

const s = StyleSheet.create({
  flex: { flex: 1 },
  base: {
    overflow: 'hidden',
  },
  card: {
    padding: rs.scale(16),
    borderRadius: rs.scale(16),
    gap: rs.verticalScale(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
  },
});
