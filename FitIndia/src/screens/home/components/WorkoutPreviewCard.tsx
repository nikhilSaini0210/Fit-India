import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../../store';
import { rs } from '../../../utils';
import { Icon, universalStyles } from '../../../components';
import { fonts } from '../../../constants';

interface Props {
  workout: any;
  onPress: () => void;
}

const WorkoutPreviewCard: FC<Props> = ({ workout, onPress }) => {
  const colors = useColors();
  const FOCUS_COLORS: Record<string, string> = {
    chest: '#EF4444',
    back: '#3B82F6',
    legs: '#10B981',
    shoulders: '#8B5CF6',
    arms: '#F59E0B',
    full_body: '#F97316',
    cardio: '#EC4899',
    rest: '#94A3B8',
  };
  const focusColor =
    FOCUS_COLORS[workout?.focus ?? 'full_body'] ?? colors.secondary;

  if (workout?.type === 'rest') {
    return (
      <Pressable
        onPress={onPress}
        style={[
          wp.wrap,
          {
            backgroundColor: colors.backgroundSurface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={{ fontSize: rs.scale(28) }}>🛋️</Text>
        <View style={universalStyles.flex}>
          <Text
            style={[
              wp.title,
              { color: colors.textPrimary, fontFamily: fonts.SemiBold },
            ]}
          >
            Rest day
          </Text>
          <Text
            style={[
              wp.sub,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            Recovery is part of the plan 💪
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: focusColor + '15' }}
      style={[
        wp.wrap,
        { backgroundColor: focusColor + '12', borderColor: focusColor + '30' },
      ]}
    >
      <View style={[wp.iconBg, { backgroundColor: focusColor + '20' }]}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="dumbbell"
          size={rs.scale(22)}
          color={focusColor}
        />
      </View>
      <View style={universalStyles.flex}>
        <Text
          style={[
            wp.title,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
        >
          {(workout?.focus ?? 'workout')
            .replace('_', ' ')
            .replace(/\b\w/g, (c: string) => c.toUpperCase())}
        </Text>
        <Text
          style={[
            wp.sub,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {workout?.exercises?.length ?? 0} exercises ·{' '}
          {workout?.duration ?? 45} min · ~{workout?.caloriesBurned ?? 0} kcal
        </Text>
      </View>
      <View style={[wp.startBtn, { backgroundColor: focusColor }]}>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="play"
          size={rs.scale(14)}
          color={colors.white}
        />
      </View>
    </Pressable>
  );
};

export default WorkoutPreviewCard;

const wp = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    borderRadius: rs.scale(16),
    borderWidth: 1.5,
    padding: rs.scale(14),
  },
  iconBg: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: rs.font(15) },
  sub: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
  startBtn: {
    width: rs.scale(32),
    height: rs.scale(32),
    borderRadius: rs.scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
