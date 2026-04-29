import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { Exercise } from '../../../types';
import { useColors } from '../../../store';
import { usePressScale } from '../../../hooks';
import { MUSCLE_COLORS, MUSCLE_ICONS } from '../../../helper';
import { Icon } from '../../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../../constants';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  isActive?: boolean;
  isCompleted?: boolean;
  onPress?: () => void;
  showIndex?: boolean;
  compact?: boolean;
}

const ExerciseCard: FC<ExerciseCardProps> = ({
  exercise,
  index,
  isActive = false,
  isCompleted = false,
  onPress,
  showIndex = true,
  compact = false,
}) => {
  const colors = useColors();
  const { scale, onPressIn, onPressOut } = usePressScale(0.97);
  const muscle = exercise.muscle?.toLowerCase() ?? 'default';
  const color = MUSCLE_COLORS[muscle] ?? colors.primary;
  const iconName = MUSCLE_ICONS[muscle] ?? MUSCLE_ICONS.default;

  const cardBg = isActive ? color + '15' : colors.backgroundCard;
  const borderColor = isCompleted
    ? colors.success
    : isActive
    ? color
    : colors.border;
  const borderWidth = isActive || isCompleted ? 2 : 1;
  const textDecorationLine = isCompleted ? 'line-through' : 'none';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        android_ripple={{ color: color + '20' }}
        style={[
          s.card,
          { backgroundColor: cardBg, borderColor, borderWidth },
          compact && s.cardCompact,
        ]}
      >
        {/* Index + icon */}
        <View style={[s.iconCol, compact && s.iconColCompact]}>
          {isCompleted ? (
            <View
              style={[s.doneCircle, { backgroundColor: colors.success + '20' }]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="check"
                size={rs.scale(compact ? 14 : 18)}
                color={colors.success}
              />
            </View>
          ) : (
            <LinearGradient
              colors={[color + '30', color + '15']}
              style={[
                s.iconBox,
                compact && s.iconBoxCompact,
                { borderColor: color + '40' },
              ]}
            >
              {showIndex ? (
                <Text
                  style={[
                    s.indexText,
                    {
                      color,
                      fontFamily: fonts.Bold,
                      fontSize: rs.font(compact ? 12 : 14),
                    },
                  ]}
                >
                  {String(index + 1).padStart(2, '0')}
                </Text>
              ) : (
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name={iconName}
                  size={rs.scale(compact ? 16 : 20)}
                  color={color}
                />
              )}
            </LinearGradient>
          )}
        </View>

        {/* Content */}
        <View style={s.content}>
          <Text
            style={[
              s.name,
              {
                color: isCompleted ? colors.textTertiary : colors.textPrimary,
                fontFamily: fonts.SemiBold,
                fontSize: rs.font(compact ? 13 : 15),
                textDecorationLine,
              },
            ]}
            numberOfLines={2}
          >
            {exercise.exercise}
          </Text>

          {/* Sets / reps / rest chips */}
          {!compact && (
            <View style={s.chips}>
              {exercise.sets && (
                <View style={[s.chip, { backgroundColor: color + '15' }]}>
                  <Text
                    style={[s.chipText, { color, fontFamily: fonts.SemiBold }]}
                  >
                    {exercise.sets} sets
                  </Text>
                </View>
              )}
              {exercise.reps && (
                <View style={[s.chip, { backgroundColor: colors.info + '15' }]}>
                  <Text
                    style={[
                      s.chipText,
                      { color: colors.info, fontFamily: fonts.SemiBold },
                    ]}
                  >
                    {exercise.reps} reps
                  </Text>
                </View>
              )}
              {exercise.duration && (
                <View
                  style={[s.chip, { backgroundColor: colors.secondary + '15' }]}
                >
                  <Text
                    style={[
                      s.chipText,
                      { color: colors.secondary, fontFamily: fonts.SemiBold },
                    ]}
                  >
                    {exercise.duration}
                  </Text>
                </View>
              )}
              {exercise.rest && (
                <View
                  style={[s.chip, { backgroundColor: colors.backgroundMuted }]}
                >
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="timer-outline"
                    size={rs.scale(11)}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[
                      s.chipText,
                      { color: colors.textTertiary, fontFamily: fonts.Regular },
                    ]}
                  >
                    {exercise.rest}s rest
                  </Text>
                </View>
              )}
            </View>
          )}

          {exercise.notes && !compact && (
            <Text
              style={[
                s.notes,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {exercise.notes}
            </Text>
          )}
        </View>

        {/* Muscle tag */}
        {!compact && exercise.muscle && (
          <View style={[s.muscleTag, { backgroundColor: color + '15' }]}>
            <Text style={[s.muscleText, { color, fontFamily: fonts.Medium }]}>
              {exercise.muscle}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default ExerciseCard;

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: rs.scale(14),
    padding: rs.scale(14),
    marginBottom: rs.verticalScale(10),
    alignItems: 'center',
    gap: rs.scale(12),
    overflow: 'hidden',
  },
  cardCompact: {
    padding: rs.scale(10),
    marginBottom: rs.verticalScale(6),
    borderRadius: rs.scale(10),
  },
  iconCol: { alignItems: 'center', justifyContent: 'center' },
  iconColCompact: {},
  iconBox: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconBoxCompact: {
    width: rs.scale(32),
    height: rs.scale(32),
    borderRadius: rs.scale(8),
  },
  doneCircle: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {},
  content: { flex: 1, gap: rs.verticalScale(5) },
  name: { lineHeight: rs.font(20) },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(5) },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(3),
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(2),
    borderRadius: rs.scale(6),
  },
  chipText: { fontSize: rs.font(11) },
  notes: { fontSize: rs.font(11), lineHeight: rs.font(16) },
  muscleTag: {
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(3),
    borderRadius: rs.scale(6),
  },
  muscleText: { fontSize: rs.font(10) },
});
