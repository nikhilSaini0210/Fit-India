import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../../store';
import { rs } from '../../../utils';
import { Icon } from '../../../components';
import { fonts } from '../../../constants';

interface Props {
  mealType: string;
  meal: any;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}

const MealPreviewCard: FC<Props> = ({ mealType, meal, onPress, colors }) => {
  const ICONS: Record<string, { icon: string; color: string; emoji: string }> =
    {
      breakfast: { icon: 'coffee-outline', color: '#F59E0B', emoji: '🌅' },
      lunch: { icon: 'silverware-fork-knife', color: '#10B981', emoji: '☀️' },
      snack: { icon: 'food-apple-outline', color: '#8B5CF6', emoji: '🍎' },
      dinner: { icon: 'weather-night', color: '#3B82F6', emoji: '🌙' },
    };
  const cfg = ICONS[mealType] || {
    icon: 'food',
    color: colors.primary,
    emoji: '🍽️',
  };
  const label = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: colors.primary + '15' }}
      style={[mp.wrap, { borderBottomColor: colors.borderMuted }]}
    >
      <View style={[mp.iconBg, { backgroundColor: cfg.color + '15' }]}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name={cfg.icon}
          size={rs.scale(18)}
          color={cfg.color}
        />
      </View>
      <View style={mp.info}>
        <Text
          style={[
            mp.type,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            mp.name,
            { color: colors.textPrimary, fontFamily: fonts.Medium },
          ]}
          numberOfLines={1}
        >
          {meal?.name ?? 'No meal planned'}
        </Text>
      </View>
      {meal?.calories ? (
        <Text
          style={[mp.cal, { color: cfg.color, fontFamily: fonts.SemiBold }]}
        >
          {meal.calories} kcal
        </Text>
      ) : null}
      <Icon
        iconFamily="MaterialCommunityIcons"
        name="chevron-right"
        size={rs.scale(16)}
        color={colors.textTertiary}
      />
    </Pressable>
  );
};

export default MealPreviewCard;

const mp = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    paddingVertical: rs.verticalScale(10),
    borderBottomWidth: 0.5,
  },
  iconBg: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  type: { fontSize: rs.font(11) },
  name: { fontSize: rs.font(14), marginTop: rs.verticalScale(1) },
  cal: { fontSize: rs.font(13) },
});
