import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect } from 'react';
import { WorkoutStackScreenProps } from '../../types';
import { useColors } from '../../store';
import { goBack, navigate, rs, useSafeInsets } from '../../utils';
import { useActiveWorkoutPlan, useStagger } from '../../hooks';
import {
  Badge,
  Button,
  Card,
  CardSkeleton,
  Header,
  Icon,
  ScreenWrapper,
  StatChip,
} from '../../components';
import { fonts, ROOT_ROUTES, WORKOUT_ROUTES } from '../../constants';
import { FOCUS_META } from '../../helper';
import LinearGradient from 'react-native-linear-gradient';
import { ExerciseCard } from './components';

type Props = WorkoutStackScreenProps<'WorkoutDayDetail'>;

const WorkoutDayDetailScreen: FC<Props> = ({ route }) => {
  const { dayNumber } = route.params;
  const colors = useColors();
  const insets = useSafeInsets();
  const { data, loading } = useActiveWorkoutPlan();

  const plan = (data as any)?.plan;
  const workout =
    plan?.weeklyPlan?.find((d: any) => d.day === dayNumber) ??
    plan?.weeklyPlan?.[0];

  const { anims, start } = useStagger(4, 80, 400);

  useEffect(() => {
    if (workout) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout]);

  const onWorkoutPlan = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Workout',
      params: {
        screen: WORKOUT_ROUTES.WORKOUT_PLAN,
      },
    });
  }, []);

  const onActiveWorkoutPlan = useCallback((dNo: number, planId: string) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Workout',
      params: {
        screen: WORKOUT_ROUTES.ACTIVE_WORKOUT,
        params: {
          dayNumber: dNo,
          planId,
        },
      },
    });
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Workout Details" showBack onBack={goBack} />
        <View style={s.skeletonWrap}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      </ScreenWrapper>
    );
  }

  if (!workout) {
    return (
      <ScreenWrapper>
        <Header title="Workout Details" showBack onBack={goBack} />
        <View style={s.emptyWrap}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="dumbbell"
            size={rs.scale(44)}
            color={colors.textTertiary}
          />
          <Text
            style={[
              s.emptyTitle,
              { color: colors.textPrimary, fontFamily: fonts.SemiBold },
            ]}
          >
            No workout found
          </Text>
          <Button
            label="Generate a plan"
            variant="ghost"
            onPress={onWorkoutPlan}
            fullWidth={false}
          />
        </View>
      </ScreenWrapper>
    );
  }

  const isRest = workout.type === 'rest';
  const focus = workout.focus?.toLowerCase() ?? 'full_body';
  const meta = FOCUS_META[focus] ?? FOCUS_META.full_body;
  const totalSets =
    workout.exercises?.reduce((a: number, e: any) => a + (e.sets ?? 1), 0) ?? 0;

  return (
    <ScreenWrapper>
      <Header
        title="Workout Details"
        showBack
        onBack={goBack}
        rightIcon={workout?.isCompleted ? 'check-circle' : undefined}
      />

      <ScreenWrapper
        scroll
        contentStyle={{
          paddingBottom: insets.bottom + rs.verticalScale(100),
        }}
      >
        <Animated.View
          style={{
            opacity: anims[0].opacity,
            transform: [{ translateY: anims[0].translateY }],
          }}
        >
          <LinearGradient
            colors={[meta.color + '30', meta.color + '08']}
            style={s.hero}
          >
            <Text style={s.focusEmoji}>{meta.emoji}</Text>
            <Text
              style={[
                s.focusTitle,
                { color: colors.textPrimary, fontFamily: fonts.ExtraBold },
              ]}
            >
              Day {workout.day} — {meta.label}
            </Text>
            <Text
              style={[
                s.focusSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {isRest
                ? 'Take it easy. Active recovery and rest are essential for growth.'
                : `${workout.exercises?.length ?? 0} exercises · ${
                    workout.duration
                  } min`}
            </Text>
            {workout.isCompleted && (
              <Badge
                label="✅ Completed"
                variant="success"
                style={{ marginTop: rs.verticalScale(8) }}
              />
            )}
          </LinearGradient>
        </Animated.View>

        {!isRest && (
          <Animated.View
            style={[
              s.chipsRow,
              {
                opacity: anims[1].opacity,
                transform: [{ translateY: anims[1].translateY }],
              },
            ]}
          >
            <StatChip
              icon="clock-outline"
              value={`${workout.duration} min`}
              label="Duration"
              color={meta.color}
            />
            <StatChip
              icon="fire"
              value={`${workout.caloriesBurned} kcal`}
              label="Burns"
              color={colors.secondary}
            />
            <StatChip
              icon="weight-lifter"
              value={`${totalSets}`}
              label="Total sets"
              color={colors.info}
            />
            <StatChip
              icon="dumbbell"
              value={`${workout.exercises?.length ?? 0}`}
              label="Exercises"
              color="#8B5CF6"
            />
          </Animated.View>
        )}

        <View style={s.sections}>
          {/* ── Warm-up ── */}
          {workout.warmup?.length > 0 && (
            <Animated.View
              style={{
                opacity: anims[1].opacity,
                transform: [{ translateY: anims[1].translateY }],
              }}
            >
              <Text
                style={[
                  s.sectionTitle,
                  { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                ]}
              >
                WARM UP
              </Text>
              <Card style={s.warmCoolCard}>
                {workout.warmup.map((w: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      s.warmRow,
                      i > 0 && {
                        borderTopWidth: 0.5,
                        borderTopColor: colors.borderMuted,
                        marginTop: rs.verticalScale(8),
                        paddingTop: rs.verticalScale(8),
                      },
                    ]}
                  >
                    <View style={[s.warmDot, { backgroundColor: '#F59E0B' }]} />
                    <Text
                      style={[
                        s.warmExercise,
                        { color: colors.textPrimary, fontFamily: fonts.Medium },
                      ]}
                    >
                      {w.exercise}
                    </Text>
                    <Text
                      style={[
                        s.warmDuration,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      {w.duration}
                    </Text>
                  </View>
                ))}
              </Card>
            </Animated.View>
          )}

          {/* ── Main exercises ── */}
          {!isRest && workout.exercises?.length > 0 && (
            <Animated.View
              style={{
                opacity: anims[2].opacity,
                transform: [{ translateY: anims[2].translateY }],
              }}
            >
              <Text
                style={[
                  s.sectionTitle,
                  { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                ]}
              >
                EXERCISES — {workout.exercises.length}
              </Text>
              {workout.exercises.map((exercise: any, i: number) => (
                <ExerciseCard key={i} exercise={exercise} index={i} />
              ))}
            </Animated.View>
          )}

          {/* ── Rest day illustration ── */}
          {isRest && (
            <Animated.View
              style={[
                s.restCard,
                {
                  opacity: anims[2].opacity,
                  transform: [{ translateY: anims[2].translateY }],
                },
              ]}
            >
              <Card>
                <View style={s.restContent}>
                  <Text style={s.restEmoji}>😴</Text>
                  <Text
                    style={[
                      s.restTitle,
                      { color: colors.textPrimary, fontFamily: fonts.Bold },
                    ]}
                  >
                    Rest & Recover
                  </Text>
                  {[
                    { icon: 'sleep', text: 'Get 7–9 hours of quality sleep' },
                    {
                      icon: 'water-outline',
                      text: 'Stay hydrated — 8+ glasses of water',
                    },
                    {
                      icon: 'food-apple-outline',
                      text: 'Eat protein-rich foods to aid recovery',
                    },
                    {
                      icon: 'walk',
                      text: 'Light walking is encouraged on rest days',
                    },
                    {
                      icon: 'meditation',
                      text: 'Stretch or do yoga for 10–15 minutes',
                    },
                  ].map((tip, i) => (
                    <View key={i} style={s.restTip}>
                      <Icon
                        iconFamily="MaterialCommunityIcons"
                        name={tip.icon}
                        size={rs.scale(16)}
                        color={colors.primary}
                      />
                      <Text
                        style={[
                          s.restTipText,
                          {
                            color: colors.textSecondary,
                            fontFamily: fonts.Regular,
                          },
                        ]}
                      >
                        {tip.text}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {/* ── Cool-down ── */}
          {workout.cooldown?.length > 0 && (
            <Animated.View
              style={{
                opacity: anims[3].opacity,
                transform: [{ translateY: anims[3].translateY }],
              }}
            >
              <Text
                style={[
                  s.sectionTitle,
                  { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                ]}
              >
                COOL DOWN
              </Text>
              <Card style={s.warmCoolCard}>
                {workout.cooldown.map((c: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      s.warmRow,
                      i > 0 && {
                        borderTopWidth: 0.5,
                        borderTopColor: colors.borderMuted,
                        marginTop: rs.verticalScale(8),
                        paddingTop: rs.verticalScale(8),
                      },
                    ]}
                  >
                    <View style={[s.warmDot, { backgroundColor: '#3B82F6' }]} />
                    <Text
                      style={[
                        s.warmExercise,
                        { color: colors.textPrimary, fontFamily: fonts.Medium },
                      ]}
                    >
                      {c.exercise}
                    </Text>
                    <Text
                      style={[
                        s.warmDuration,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      {c.duration}
                    </Text>
                  </View>
                ))}
              </Card>
            </Animated.View>
          )}
        </View>
      </ScreenWrapper>

      {!isRest && !workout.isCompleted && (
        <View
          style={[
            s.ctaWrap,
            {
              paddingBottom: insets.bottom + rs.verticalScale(16),
              backgroundColor: colors.background,
              borderTopColor: colors.borderMuted,
            },
          ]}
        >
          <Button
            label="Start Workout 💪"
            onPress={() => onActiveWorkoutPlan(workout.day, plan._id)}
            iconRight="play"
            size="lg"
          />
        </View>
      )}

      {workout.isCompleted && (
        <View
          style={[
            s.ctaWrap,
            {
              paddingBottom: insets.bottom + rs.verticalScale(16),
              backgroundColor: colors.background,
              borderTopColor: colors.borderMuted,
            },
          ]}
        >
          <Button
            label="Completed ✅  — Redo workout"
            onPress={() => onActiveWorkoutPlan(workout.day, plan._id)}
            variant="secondary"
            size="lg"
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default WorkoutDayDetailScreen;

const s = StyleSheet.create({
  skeletonWrap: { padding: rs.scale(16), gap: rs.verticalScale(12) },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(16),
    padding: rs.scale(32),
  },
  emptyTitle: { fontSize: rs.font(20), textAlign: 'center' },
  hero: {
    padding: rs.scale(24),
    alignItems: 'center',
    gap: rs.verticalScale(8),
    marginBottom: rs.verticalScale(4),
  },
  focusEmoji: { fontSize: rs.scale(52) },
  focusTitle: { fontSize: rs.font(24), textAlign: 'center' },
  focusSub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(21),
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: rs.scale(12),
    gap: rs.scale(8),
    marginBottom: rs.verticalScale(4),
    flexWrap: 'wrap',
  },

  sections: { paddingHorizontal: rs.scale(16), gap: rs.verticalScale(16) },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(8),
  },
  warmCoolCard: { gap: 0 },
  warmRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(10) },
  warmDot: {
    width: rs.scale(8),
    height: rs.scale(8),
    borderRadius: rs.scale(4),
  },
  warmExercise: { flex: 1, fontSize: rs.font(14) },
  warmDuration: { fontSize: rs.font(13) },
  restCard: {},
  restContent: { alignItems: 'center', gap: rs.verticalScale(14) },
  restEmoji: { fontSize: rs.scale(48) },
  restTitle: { fontSize: rs.font(20) },
  restTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    width: '100%',
  },
  restTipText: { flex: 1, fontSize: rs.font(13), lineHeight: rs.font(20) },
  ctaWrap: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(12),
    borderTopWidth: 0.5,
  },
});
