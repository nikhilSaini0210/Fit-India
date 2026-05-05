import {  Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { MEAL_META, MealType } from '../../../helper';
import { MealItem } from '../../../types';
import { useColors } from '../../../store';
import { usePressScale } from '../../../hooks';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';
import { Icon } from '../../../components';
import Animated from 'react-native-reanimated';

interface MealCardProps {
  type: MealType;
  meal: MealItem | null | undefined;
  onPress?: () => void;
  compact?: boolean;
  eaten?: boolean;
}

const MealCard: FC<MealCardProps> = ({
  type,
  meal,
  onPress,
  compact = false,
  eaten = false,
}) => {
  const colors = useColors();
  const meta = MEAL_META[type];
  const { pressStyle, onPressIn, onPressOut } = usePressScale(0.97);

  const isEmpty = !meal?.name;

  const dynamicStyle = {
    backgroundColor: colors.backgroundCard,
    borderColor: eaten ? meta.color + '50' : colors.border,
    borderWidth: eaten ? 1.5 : 0.5,
  };

  return (
    <Animated.View style={pressStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!onPress}
        android_ripple={{ color: meta.color + '15' }}
        style={[s.card, dynamicStyle]}
      >
        {/* Left accent bar */}
        <View style={[s.accentBar, { backgroundColor: meta.color }]} />

        <View style={s.body}>
          {/* Header row */}
          <View style={s.headerRow}>
            <View
              style={[s.mealIconWrap, { backgroundColor: meta.color + '18' }]}
            >
              <Text style={{ fontSize: rs.scale(16) }}>{meta.emoji}</Text>
            </View>

            <View style={s.mealInfo}>
              <View style={s.mealTitleRow}>
                <Text
                  style={[
                    s.mealType,
                    { color: meta.color, fontFamily: fonts.SemiBold },
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                <Text
                  style={[
                    s.mealTime,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {meta.time}
                </Text>
              </View>
              <Text
                style={[
                  s.mealName,
                  {
                    color: isEmpty ? colors.textTertiary : colors.textPrimary,
                    fontFamily: isEmpty ? fonts.Regular : fonts.Medium,
                  },
                ]}
                numberOfLines={1}
              >
                {isEmpty ? 'No meal planned' : meal!.name}
              </Text>
            </View>

            {/* Status / arrow */}
            <View style={s.rightCol}>
              {eaten ? (
                <View
                  style={[s.eatenBadge, { backgroundColor: meta.color + '18' }]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="check-circle"
                    size={rs.scale(16)}
                    color={meta.color}
                  />
                </View>
              ) : onPress && !isEmpty ? (
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="chevron-right"
                  size={rs.scale(18)}
                  color={colors.textTertiary}
                />
              ) : null}
            </View>
          </View>

          {/* Macro chips — hidden when empty */}
          {!isEmpty && !compact && (
            <View style={s.macroRow}>
              {[
                { label: 'Cal', value: meal!.calories, color: meta.color },
                { label: 'P', value: `${meal!.protein}g`, color: '#10B981' },
                { label: 'C', value: `${meal!.carbs}g`, color: '#F59E0B' },
                { label: 'F', value: `${meal!.fat}g`, color: '#EF4444' },
              ].map(m => (
                <View
                  key={m.label}
                  style={[s.chip, { backgroundColor: m.color + '12' }]}
                >
                  <Text
                    style={[
                      s.chipLabel,
                      { color: m.color, fontFamily: fonts.Regular },
                    ]}
                  >
                    {m.label}
                  </Text>
                  <Text
                    style={[
                      s.chipVal,
                      { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                    ]}
                  >
                    {m.value}
                  </Text>
                </View>
              ))}
              {meal!.prepTime > 0 && (
                <View
                  style={[
                    s.chip,
                    { backgroundColor: colors.backgroundSurface },
                  ]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="clock-outline"
                    size={rs.scale(11)}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[
                      s.chipVal,
                      { color: colors.textTertiary, fontFamily: fonts.Regular },
                    ]}
                  >
                    {meal!.prepTime}m
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default MealCard;

const s = StyleSheet.create({
  card: {
    borderRadius: rs.scale(14),
    marginBottom: rs.verticalScale(10),
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rs.verticalScale(1) },
    shadowOpacity: 0.05,
    shadowRadius: rs.scale(4),
    elevation: 2,
  },
  accentBar: { width: 3 },
  body: { flex: 1, padding: rs.scale(12), gap: rs.verticalScale(8) },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(10) },
  mealIconWrap: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealInfo: { flex: 1 },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(6),
  },
  mealType: { fontSize: rs.font(12) },
  mealTime: { fontSize: rs.font(11) },
  mealName: { fontSize: rs.font(14), marginTop: rs.verticalScale(1) },
  rightCol: { alignItems: 'center', justifyContent: 'center' },
  eatenBadge: {
    width: rs.scale(28),
    height: rs.scale(28),
    borderRadius: rs.scale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(6) },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(3),
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(3),
    borderRadius: rs.scale(6),
  },
  chipLabel: { fontSize: rs.font(10) },
  chipVal: { fontSize: rs.font(11) },
});
