import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { rs } from '../../../utils';
import { useColors } from '../../../store';
import { usePulse } from '../../../hooks';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../../constants';
import { Icon } from '../../../components';

interface Props {
  current: number;
  longest: number;
}

const StreakRing: FC<Props> = ({ longest, current }) => {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const { scale: pulseScale, start: startPulse } = usePulse(0.97, 1.03, 1000);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
    if (current > 0) startPulse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const flameColor =
    current >= 7 ? '#F97316' : current >= 3 ? '#F59E0B' : colors.primary;

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
          <LinearGradient
            colors={[flameColor + '30', flameColor + '10']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.ring, { borderColor: flameColor + '40' }]}
          >
            <Text style={{ fontSize: rs.scale(42) }}>
              {current >= 30
                ? '🔥'
                : current >= 7
                ? '⚡'
                : current >= 3
                ? '✨'
                : '💪'}
            </Text>
            <Text
              style={[
                styles.count,
                { color: flameColor, fontFamily: fonts.ExtraBold },
              ]}
            >
              {current}
            </Text>
            <Text
              style={[
                styles.label,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              day streak
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>

      <View style={styles.longestWrap}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="trophy-outline"
          size={rs.scale(14)}
          color={colors.warning}
        />
        <Text
          style={[
            styles.longestText,
            { color: colors.textSecondary, fontFamily: fonts.Medium },
          ]}
        >
          Best: {longest} days
        </Text>
      </View>
    </View>
  );
};

export default StreakRing;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: rs.verticalScale(12) },
  ring: {
    width: rs.scale(160),
    height: rs.scale(160),
    borderRadius: rs.scale(80),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(2),
  },
  count: { fontSize: rs.font(44), lineHeight: rs.font(50) },
  label: { fontSize: rs.font(13) },
  longestWrap: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(5) },
  longestText: { fontSize: rs.font(13) },
});
