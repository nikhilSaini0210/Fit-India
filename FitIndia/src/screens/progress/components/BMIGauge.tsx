import React, { useRef, useEffect, FC } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { rs } from '../../../utils';

interface BMIGaugeProps {
  bmi: number;
  style?: object;
}

const CATEGORIES = [
  { label: 'Underweight', min: 0, max: 18.5, color: '#3B82F6' },
  { label: 'Healthy', min: 18.5, max: 25, color: '#22C55E' },
  { label: 'Overweight', min: 25, max: 30, color: '#F59E0B' },
  { label: 'Obese', min: 30, max: 40, color: '#EF4444' },
];

const BMIGauge: FC<BMIGaugeProps> = ({ bmi, style }) => {
  const colors = useColors();
  const barAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const category =
    CATEGORIES.find(c => bmi >= c.min && bmi < c.max) ??
    CATEGORIES[CATEGORIES.length - 1];
  const pct = Math.min(Math.max((bmi - 10) / 30, 0), 1); // 10–40 range

  useEffect(() => {
    Animated.parallel([
      Animated.spring(barAnim, {
        toValue: pct,
        friction: 6,
        tension: 80,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmi]);

  const gaugeWidth = rs.screenWidth - rs.scale(64);

  return (
    <Animated.View style={[s.wrap, { opacity: fadeAnim }, style]}>
      {/* Segment bar */}
      <View style={[s.track, { backgroundColor: colors.backgroundMuted }]}>
        {CATEGORIES.map((cat, i) => (
          <View
            key={i}
            style={[
              s.segment,
              {
                flex: cat.max - cat.min,
                backgroundColor: cat.color + '40',
                borderLeftWidth: i > 0 ? 1 : 0,
                borderColor: colors.background,
              },
            ]}
          />
        ))}

        {/* Needle */}
        <Animated.View
          style={[
            s.needle,
            {
              backgroundColor: category.color,
              left: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, gaugeWidth - rs.scale(3)],
              }),
            },
          ]}
        />
      </View>

      {/* Min / Max labels */}
      <View style={s.rangeRow}>
        <Text
          style={[
            s.rangeText,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          10
        </Text>
        <Text
          style={[
            s.rangeText,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          40+
        </Text>
      </View>

      {/* BMI value + category */}
      <View style={s.infoRow}>
        <Text
          style={[
            s.bmiVal,
            { color: category.color, fontFamily: fonts.ExtraBold },
          ]}
        >
          {bmi.toFixed(1)}
        </Text>
        <View
          style={[
            s.categoryChip,
            {
              backgroundColor: category.color + '18',
              borderColor: category.color + '40',
            },
          ]}
        >
          <Text
            style={[
              s.categoryText,
              { color: category.color, fontFamily: fonts.SemiBold },
            ]}
          >
            {category.label}
          </Text>
        </View>
      </View>

      {/* Category bands legend */}
      <View style={s.legend}>
        {CATEGORIES.map((cat, i) => (
          <View key={i} style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: cat.color }]} />
            <Text
              style={[
                s.legendLabel,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {cat.label}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default BMIGauge;

const s = StyleSheet.create({
  wrap: { gap: rs.verticalScale(10) },
  track: {
    height: rs.verticalScale(14),
    borderRadius: rs.verticalScale(7),
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  segment: { height: '100%' },
  needle: {
    position: 'absolute',
    top: 0,
    width: rs.scale(3),
    height: '100%',
    borderRadius: rs.scale(2),
  },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rangeText: { fontSize: rs.font(10) },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(12) },
  bmiVal: { fontSize: rs.font(32) },
  categoryChip: {
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(5),
    borderRadius: rs.scale(20),
    borderWidth: 1,
  },
  categoryText: { fontSize: rs.font(14) },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(12) },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(5) },
  legendDot: {
    width: rs.scale(8),
    height: rs.scale(8),
    borderRadius: rs.scale(4),
  },
  legendLabel: { fontSize: rs.font(11) },
});
