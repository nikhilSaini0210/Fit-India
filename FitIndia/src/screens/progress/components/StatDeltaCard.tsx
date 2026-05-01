import React, { useRef, useEffect, FC } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { Icon } from '../../../components';
import { rs } from '../../../utils';

interface StatDeltaCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number | null; // positive = up, negative = down
  deltaLabel?: string; // e.g. "vs last week"
  icon: string;
  iconColor: string;
  positiveIsGood?: boolean; // false for weight if goal is loss
  style?: object;
}

const StatDeltaCard: FC<StatDeltaCardProps> = ({
  label,
  value,
  unit = '',
  delta,
  deltaLabel = 'change',
  icon,
  iconColor,
  positiveIsGood = true,
  style,
}) => {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPositive = (delta ?? 0) >= 0;
  const isNeutral = delta === null || delta === undefined || delta === 0;
  const isGoodChange = positiveIsGood ? isPositive : !isPositive;

  const deltaColor = isNeutral
    ? colors.textTertiary
    : isGoodChange
    ? colors.success
    : colors.error;

  const deltaIcon = isNeutral
    ? 'minus'
    : isPositive
    ? 'trending-up'
    : 'trending-down';

  return (
    <Animated.View
      style={[
        s.card,
        {
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      {/* Icon */}
      <View style={[s.iconWrap, { backgroundColor: iconColor + '18' }]}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name={icon}
          size={rs.scale(20)}
          color={iconColor}
        />
      </View>

      {/* Value */}
      <Text
        style={[
          s.value,
          { color: colors.textPrimary, fontFamily: fonts.ExtraBold },
        ]}
      >
        {value}
        {unit && (
          <Text
            style={[
              s.unit,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            {' '}
            {unit}
          </Text>
        )}
      </Text>

      {/* Label */}
      <Text
        style={[
          s.label,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {label}
      </Text>

      {/* Delta */}
      {!isNeutral && (
        <View
          style={[
            s.deltaRow,
            {
              backgroundColor: deltaColor + '15',
              borderColor: deltaColor + '30',
            },
          ]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name={deltaIcon}
            size={rs.scale(12)}
            color={deltaColor}
          />
          <Text
            style={[
              s.deltaText,
              { color: deltaColor, fontFamily: fonts.SemiBold },
            ]}
          >
            {Math.abs(delta ?? 0)}
            {unit} {deltaLabel}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default StatDeltaCard;

const s = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: rs.scale(16),
    borderWidth: 0.5,
    padding: rs.scale(14),
    gap: rs.verticalScale(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: rs.scale(38),
    height: rs.scale(38),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: rs.verticalScale(2),
  },
  value: { fontSize: rs.font(22) },
  unit: { fontSize: rs.font(13) },
  label: { fontSize: rs.font(12) },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(4),
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(3),
    borderRadius: rs.scale(20),
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: rs.verticalScale(2),
  },
  deltaText: { fontSize: rs.font(11) },
});
