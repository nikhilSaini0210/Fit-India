import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useRef, useState } from 'react';
import { useColors } from '../../store';
import { goBack, navigate, rs, useSafeInsets } from '../../utils';
import {
  useActiveWorkoutPlan,
  useApiError,
  useGenerateWorkoutPlan,
} from '../../hooks';
import { WorkoutDay } from '../../types';
import { DAYS, FOCUS_META, MUSCLE_COLORS } from '../../helper';
import {
  Badge,
  Button,
  CardSkeleton,
  EmptyState,
  Header,
  Icon,
  ScreenWrapper,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts, ROOT_ROUTES, WORKOUT_ROUTES } from '../../constants';
import { ExerciseCard } from './components';

const WorkoutPlanScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const handleError = useApiError();

  const { data, loading, error, refresh } = useActiveWorkoutPlan();
  const { mutate: generate, loading: generating } = useGenerateWorkoutPlan();

  const plan = (data as any)?.plan ?? data;

  // Determine today's day number in plan
  const todayDayNum = (() => {
    if (!plan?.createdAt) return 1;
    const start = new Date(plan.createdAt);
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(1, Math.min(diff + 1, plan.weeklyPlan?.length ?? 7));
  })();

  const [selectedDay, setSelectedDay] = useState(todayDayNum - 1);
  const scaleAnims = useRef(
    Array.from(
      { length: 7 },
      (_, i) => new Animated.Value(i === selectedDay ? 1 : 0.8),
    ),
  ).current;

  const selectDay = (idx: number) => {
    Animated.spring(scaleAnims[idx], {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
    if (selectedDay !== idx) {
      Animated.spring(scaleAnims[selectedDay], {
        toValue: 0.8,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
    setSelectedDay(idx);
  };

  const weeklyPlan: WorkoutDay[] = plan?.weeklyPlan ?? [];
  const selectedWorkout = weeklyPlan[selectedDay];
  const focus = selectedWorkout?.focus ?? 'default';
  const color = MUSCLE_COLORS[focus] ?? colors.primary;
  const isRest = selectedWorkout?.type === 'rest';
  const isToday = selectedDay === todayDayNum - 1;

  const handleGenerate = useCallback(async () => {
    const result = await generate({ days: 7, useAI: true });
    if (!result.ok)
      handleError({
        code: result?.code ?? 'UNKNOWN',
        message: result.error ?? 'Failed',
        isAppError: true,
      });
  }, [generate, handleError]);

  const onActiveWorkoutPlan = useCallback(
    (dayNumber: number, planId: string) => {
      navigate(ROOT_ROUTES.MAIN, {
        screen: 'Workout',
        params: {
          screen: WORKOUT_ROUTES.ACTIVE_WORKOUT,
          params: {
            dayNumber,
            planId,
          },
        },
      });
    },
    [],
  );

  const onWorkoutDayDetail = useCallback((dayNumber: number) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Workout',
      params: {
        screen: WORKOUT_ROUTES.DAY_DETAIL,
        params: {
          dayNumber,
        },
      },
    });
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <Header title="Workout Plan" showBack onBack={goBack} />
        <View style={{ padding: rs.scale(16) }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <Header
        title="Workout Plan"
        showBack
        onBack={goBack}
        rightLabel="Generate"
        onRightPress={handleGenerate}
      />

      {!plan ? (
        <EmptyState
          iconName="weight-lifter"
          title="No plan yet"
          subTitle="Generate a workout plan to get started"
          btnTitle="Generate 7-day plan"
          onPress={handleGenerate}
          loading={generating}
        />
      ) : (
        <ScreenWrapper
          scroll
          contentStyle={{ paddingBottom: insets.bottom + rs.verticalScale(24) }}
        >
          <LinearGradient
            colors={[color + '18', colors.background]}
            style={s.planHeader}
          >
            <View style={s.planHeaderRow}>
              <View>
                <Text
                  style={[
                    s.planTitle,
                    { color: colors.textPrimary, fontFamily: fonts.Bold },
                  ]}
                >
                  Week 1 • 7 Days
                </Text>
                <Text
                  style={[
                    s.planSub,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {weeklyPlan.filter(d => d.type === 'workout').length} workout
                  days • {weeklyPlan.filter(d => d.type === 'rest').length} rest
                  days
                </Text>
              </View>
              <Badge
                label={plan.generatedBy === 'ai' ? 'AI Plan' : 'Template'}
                variant={plan.generatedBy === 'ai' ? 'info' : 'default'}
                icon={plan.generatedBy === 'ai' ? 'brain' : 'lightning-bolt'}
              />
            </View>

            <View
              style={[
                s.progressTrack,
                { backgroundColor: colors.backgroundMuted },
              ]}
            >
              <View
                style={[
                  s.progressFill,
                  {
                    backgroundColor: color,
                    width: `${
                      (weeklyPlan.filter(d => d.isCompleted).length /
                        Math.max(weeklyPlan.length, 1)) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                s.progressLabel,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {weeklyPlan.filter(d => d.isCompleted).length}/{weeklyPlan.length}{' '}
              days completed
            </Text>
          </LinearGradient>

          <View style={s.dayStrip}>
            {weeklyPlan.slice(0, 7).map((day, i) => {
              const fc = MUSCLE_COLORS[day.focus] ?? colors.primary;
              const isAct = i === selectedDay;
              const isDone = day.isCompleted;
              const isTod = i === todayDayNum - 1;

              return (
                <Pressable
                  key={i}
                  onPress={() => selectDay(i)}
                  style={s.dayItem}
                >
                  <Animated.View
                    style={[
                      s.dayCircle,
                      {
                        backgroundColor: isAct
                          ? fc
                          : isDone
                          ? colors.success + '20'
                          : colors.backgroundSurface,
                        borderColor:
                          isTod && !isAct
                            ? fc
                            : isAct
                            ? fc
                            : isDone
                            ? colors.success
                            : colors.border,
                        borderWidth: isTod || isAct || isDone ? 2 : 1,
                        transform: [{ scale: scaleAnims[i] }],
                      },
                    ]}
                  >
                    {isDone ? (
                      <Icon
                        iconFamily="MaterialCommunityIcons"
                        name="check"
                        size={rs.scale(16)}
                        color={isAct ? '#FFF' : colors.success}
                      />
                    ) : (
                      <Text style={{ fontSize: rs.scale(16) }}>
                        {FOCUS_META[day.focus]?.emoji ?? '🔥'}
                      </Text>
                    )}
                  </Animated.View>
                  <Text
                    style={[
                      s.dayLabel,
                      {
                        color: isAct ? fc : colors.textTertiary,
                        fontFamily: isAct ? fonts.Bold : fonts.Regular,
                      },
                    ]}
                  >
                    {DAYS[i]}
                  </Text>
                  {isTod && (
                    <View style={[s.todayDot, { backgroundColor: fc }]} />
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={{ paddingHorizontal: rs.scale(16) }}>
            {selectedWorkout && (
              <>
                {/* Focus card */}
                <LinearGradient
                  colors={[color + '20', color + '08']}
                  style={[s.focusCard, { borderColor: color + '30' }]}
                >
                  <View style={s.focusRow}>
                    <Text style={{ fontSize: rs.scale(36) }}>
                      {FOCUS_META[focus]?.emoji ?? '🔥'}
                    </Text>
                    <View>
                      <Text
                        style={[
                          s.focusTitle,
                          { color: colors.textPrimary, fontFamily: fonts.Bold },
                        ]}
                      >
                        {isRest
                          ? 'Rest Day'
                          : focus
                              .replace('_', ' ')
                              .replace(/\b\w/g, c => c.toUpperCase())}
                      </Text>
                      {!isRest && (
                        <View style={s.focusStats}>
                          <Icon
                            iconFamily="MaterialCommunityIcons"
                            name="clock-outline"
                            size={rs.scale(13)}
                            color={colors.textTertiary}
                          />
                          <Text
                            style={[
                              s.focusStat,
                              {
                                color: colors.textTertiary,
                                fontFamily: fonts.Regular,
                              },
                            ]}
                          >
                            {selectedWorkout.duration} min
                          </Text>
                          <Icon
                            iconFamily="MaterialCommunityIcons"
                            name="fire"
                            size={rs.scale(13)}
                            color={colors.warning}
                          />
                          <Text
                            style={[
                              s.focusStat,
                              {
                                color: colors.textTertiary,
                                fontFamily: fonts.Regular,
                              },
                            ]}
                          >
                            {selectedWorkout.caloriesBurned} kcal
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={s.focusBadges}>
                      {isToday && (
                        <Badge label="Today" variant="success" small />
                      )}
                      {selectedWorkout.isCompleted && (
                        <Badge label="Done ✅" variant="success" small />
                      )}
                    </View>
                  </View>
                </LinearGradient>

                {/* Exercises */}
                {!isRest && selectedWorkout.exercises?.length > 0 && (
                  <View style={s.exercisesSection}>
                    <Text
                      style={[
                        s.sectionTitle,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.SemiBold,
                        },
                      ]}
                    >
                      EXERCISES
                    </Text>
                    {selectedWorkout.exercises.map((ex, i) => (
                      <ExerciseCard
                        key={i}
                        exercise={ex}
                        index={i}
                        isCompleted={selectedWorkout.isCompleted}
                      />
                    ))}
                  </View>
                )}

                {/* CTA */}
                <View style={s.ctaWrap}>
                  {!isRest && (
                    <Button
                      label={
                        selectedWorkout.isCompleted
                          ? 'Workout done ✅'
                          : isToday
                          ? 'Start this workout 🔥'
                          : 'View workout details'
                      }
                      onPress={() => {
                        if (!selectedWorkout.isCompleted && plan) {
                          onActiveWorkoutPlan(selectedWorkout.day, plan._id);
                        } else {
                          onWorkoutDayDetail(selectedWorkout.day);
                        }
                      }}
                      variant={
                        selectedWorkout.isCompleted ? 'secondary' : 'primary'
                      }
                      iconRight={
                        selectedWorkout.isCompleted
                          ? undefined
                          : 'play-circle-outline'
                      }
                      size="lg"
                    />
                  )}
                </View>
              </>
            )}
          </View>
        </ScreenWrapper>
      )}
    </ScreenWrapper>
  );
};

export default WorkoutPlanScreen;

const s = StyleSheet.create({
  planHeader: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(16),
    paddingTop: rs.verticalScale(8),
    gap: rs.verticalScale(10),
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planTitle: { fontSize: rs.font(18) },
  planSub: { fontSize: rs.font(13), marginTop: rs.verticalScale(2) },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: rs.font(12) },
  dayStrip: {
    flexDirection: 'row',
    paddingHorizontal: rs.scale(16),
    marginBottom: rs.verticalScale(16),
    gap: rs.scale(6),
  },
  dayItem: { flex: 1, alignItems: 'center', gap: rs.verticalScale(5) },
  dayCircle: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: { fontSize: rs.font(11) },
  todayDot: {
    width: rs.scale(4),
    height: rs.scale(4),
    borderRadius: rs.scale(2),
  },
  focusCard: {
    borderRadius: rs.scale(16),
    padding: rs.scale(16),
    borderWidth: 1,
    marginBottom: rs.verticalScale(16),
  },
  focusRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(14) },
  focusTitle: { fontSize: rs.font(20) },
  focusStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(5),
    marginTop: rs.verticalScale(4),
  },
  focusStat: { fontSize: rs.font(13) },
  focusBadges: { gap: rs.verticalScale(5), marginLeft: 'auto' },
  exercisesSection: { marginBottom: rs.verticalScale(12) },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.7,
    marginBottom: rs.verticalScale(10),
  },
  ctaWrap: { gap: rs.verticalScale(10), marginBottom: rs.verticalScale(8) },
});
