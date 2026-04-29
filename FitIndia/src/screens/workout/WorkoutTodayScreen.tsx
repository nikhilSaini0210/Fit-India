import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect } from 'react';
import { selectUser, useAuthStore, useColors } from '../../store';
import { navigate, rs, useSafeInsets } from '../../utils';
import {
  useActiveWorkoutPlan,
  //   useApiError,
  useStagger,
  useTodaysWorkout,
} from '../../hooks';
import { DAYS, FOCUS_META } from '../../helper';
import {
  Badge,
  Button,
  Card,
  CardSkeleton,
  Icon,
  ScreenWrapper,
  universalStyles,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts, ROOT_ROUTES, WORKOUT_ROUTES } from '../../constants';
import { ExerciseCard } from './components';

const WorkoutTodayScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  //   const handleError = useApiError();
  const { anims, start } = useStagger(4, 80, 450);

  const {
    data: todayData,
    loading,
    refreshing,
    // error,
    refresh,
  } = useTodaysWorkout();

  const { data: planData } = useActiveWorkoutPlan();

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const workout = (todayData as any)?.workout ?? todayData;
  const plan = (planData as any)?.plan ?? planData;
  const hasPlan = !!plan || !!workout;
  const isRest = workout?.type === 'rest';
  const focus = workout?.focus ?? 'default';
  const meta = FOCUS_META[focus] ?? FOCUS_META.default;

  const today = new Date();
  const dayName = DAYS[today.getDay()];
  const dateStr = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
  });

  // Edge case: workout already completed today
  const alreadyDone = workout?.isCompleted;

  const exercises = workout?.exercises ?? [];
  const previewCount = 3;

  const onWorkoutPlan = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Workout',
      params: {
        screen: WORKOUT_ROUTES.WORKOUT_PLAN,
      },
    });
  }, []);

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

  return (
    <ScreenWrapper
      scroll
      refreshing={refreshing}
      onRefresh={refresh}
      contentStyle={{ paddingBottom: insets.bottom + rs.verticalScale(32) }}
    >
      <Animated.View
        style={{
          opacity: anims[0].opacity,
          transform: [{ translateY: anims[0].translateY }],
        }}
      >
        <LinearGradient
          colors={
            hasPlan
              ? meta.gradient
              : [colors.backgroundSurface, colors.background]
          }
          style={[s.hero, { paddingTop: insets.top + rs.verticalScale(20) }]}
        >
          <View style={s.heroTop}>
            <View>
              <Text
                style={[
                  s.greeting,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                {dayName}, {dateStr}
              </Text>
              <Text
                style={[
                  s.heroTitle,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                {isRest
                  ? 'Rest Day 😴'
                  : workout
                  ? `${focus.replace('_', ' ')} Day`
                  : "Today's Workout"}
              </Text>
            </View>
            <Pressable
              onPress={onWorkoutPlan}
              style={[
                s.planBtn,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.border,
                },
              ]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="calendar-week"
                size={rs.scale(20)}
                color={colors.textSecondary}
              />
            </Pressable>
          </View>

          {workout && !isRest && (
            <View style={s.statsRow}>
              {[
                {
                  icon: 'clock-outline',
                  val: `${workout.duration ?? 0} min`,
                  color: colors.info,
                },
                {
                  icon: 'fire',
                  val: `${workout.caloriesBurned ?? 0}`,
                  color: colors.warning,
                },
                {
                  icon: 'dumbbell',
                  val: `${exercises.length} exercises`,
                  color: meta.color,
                },
              ].map((stat, i) => (
                <View key={i} style={s.stat}>
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name={stat.icon}
                    size={rs.scale(15)}
                    color={stat.color}
                  />
                  <Text
                    style={[
                      s.statVal,
                      { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                    ]}
                  >
                    {stat.val}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {workout && (
            <View style={s.badgeRow}>
              {alreadyDone && <Badge label="✅ Completed" variant="success" />}
              {user?.workoutType && (
                <Badge
                  label={user.workoutType === 'home' ? '🏠 Home' : '🏋️ Gym'}
                  variant="default"
                />
              )}
              {user?.fitnessLevel && (
                <Badge
                  label={`${
                    user.fitnessLevel.charAt(0).toUpperCase() +
                    user.fitnessLevel.slice(1)
                  }`}
                  variant="info"
                />
              )}
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      <View style={{ paddingHorizontal: rs.scale(16) }}>
        {loading && (
          <Animated.View style={{ opacity: anims[1].opacity }}>
            <CardSkeleton />
            <CardSkeleton />
          </Animated.View>
        )}

        {!loading && !hasPlan && (
          <Animated.View
            style={{
              opacity: anims[1].opacity,
              transform: [{ translateY: anims[1].translateY }],
            }}
          >
            <Card style={s.noPlanCard}>
              <View
                style={[
                  s.noPlanIcon,
                  { backgroundColor: colors.primary + '15' },
                ]}
              >
                <Text style={{ fontSize: rs.scale(40) }}>🏋️</Text>
              </View>
              <Text
                style={[
                  s.noPlanTitle,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                No workout plan yet
              </Text>
              <Text
                style={[
                  s.noPlanSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Generate a personalised workout plan tailored to your fitness
                level and goals
              </Text>
              <Button
                label="Generate workout plan"
                onPress={onWorkoutPlan}
                iconRight="arrow-right"
                size="md"
              />
            </Card>
          </Animated.View>
        )}

        {!loading && hasPlan && isRest && (
          <Animated.View
            style={{
              opacity: anims[1].opacity,
              transform: [{ translateY: anims[1].translateY }],
            }}
          >
            <Card style={s.restCard}>
              <Text
                style={[universalStyles.textCenter, { fontSize: rs.scale(56) }]}
              >
                😴
              </Text>
              <Text
                style={[
                  s.restTitle,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                Rest & Recovery
              </Text>
              <Text
                style={[
                  s.restSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Your muscles grow during rest. Take it easy today — hydrate,
                stretch, and sleep well. 💪
              </Text>
              <Button
                label="Do a quick workout anyway"
                onPress={onWorkoutPlan}
                variant="ghost"
                iconLeft="lightning-bolt"
                size="md"
              />
            </Card>
          </Animated.View>
        )}

        {!loading && hasPlan && !isRest && (
          <Animated.View
            style={{
              opacity: anims[2].opacity,
              transform: [{ translateY: anims[2].translateY }],
            }}
          >
            {/* Warmup */}
            {workout?.warmup?.length > 0 && (
              <View style={s.section}>
                <Text
                  style={[
                    s.sectionTitle,
                    { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  WARM UP
                </Text>
                {workout.warmup.slice(0, 3).map((w: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      s.warmupRow,
                      {
                        backgroundColor: colors.backgroundSurface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Icon
                      iconFamily="MaterialCommunityIcons"
                      name="fire-circle"
                      size={rs.scale(16)}
                      color={colors.warning}
                    />
                    <Text
                      style={[
                        s.warmupText,
                        {
                          color: colors.textSecondary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      {w.exercise}
                    </Text>
                    <Text
                      style={[
                        s.warmupDur,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Medium,
                        },
                      ]}
                    >
                      {w.duration}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Exercises preview */}
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text
                  style={[
                    s.sectionTitle,
                    { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  EXERCISES
                </Text>
                {exercises.length > previewCount && (
                  <Text
                    style={[
                      s.moreText,
                      { color: colors.primary, fontFamily: fonts.Medium },
                    ]}
                  >
                    +{exercises.length - previewCount} more
                  </Text>
                )}
              </View>
              {exercises.slice(0, previewCount).map((ex: any, i: number) => (
                <ExerciseCard key={i} exercise={ex} index={i} compact />
              ))}
            </View>
          </Animated.View>
        )}

        {!loading && hasPlan && !isRest && (
          <Animated.View
            style={{
              opacity: anims[3].opacity,
              transform: [{ translateY: anims[3].translateY }],
            }}
          >
            <View style={s.ctaWrap}>
              {alreadyDone ? (
                <>
                  <View
                    style={[
                      s.doneCard,
                      {
                        backgroundColor: colors.successLight,
                        borderColor: colors.success + '40',
                      },
                    ]}
                  >
                    <Icon
                      iconFamily="MaterialCommunityIcons"
                      name="check-circle"
                      size={rs.scale(24)}
                      color={colors.success}
                    />
                    <Text
                      style={[
                        s.doneText,
                        { color: colors.success, fontFamily: fonts.SemiBold },
                      ]}
                    >
                      Workout completed today! 🎉
                    </Text>
                  </View>
                  <Button
                    label="View full workout"
                    onPress={() => workout && onWorkoutDayDetail(workout.day)}
                    variant="secondary"
                    size="md"
                  />
                </>
              ) : (
                <>
                  <Button
                    label="Start Workout 🔥"
                    onPress={() =>
                      workout &&
                      plan &&
                      onActiveWorkoutPlan(workout.day, plan._id)
                    }
                    iconRight="play-circle-outline"
                    size="lg"
                  />
                  <Button
                    label="View full workout"
                    onPress={() => workout && onWorkoutDayDetail(workout.day)}
                    variant="ghost"
                    size="md"
                  />
                </>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default WorkoutTodayScreen;

const s = StyleSheet.create({
  hero: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(20),
    gap: rs.verticalScale(12),
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: rs.font(12) },
  heroTitle: { fontSize: rs.font(24), marginTop: rs.verticalScale(2) },
  planBtn: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  statsRow: { flexDirection: 'row', gap: rs.scale(16) },
  stat: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(5) },
  statVal: { fontSize: rs.font(13) },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(8) },
  section: { marginBottom: rs.verticalScale(16) },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs.verticalScale(10),
  },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  moreText: { fontSize: rs.font(13) },
  warmupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(10),
    borderWidth: 0.5,
    marginBottom: rs.verticalScale(6),
  },
  warmupText: { flex: 1, fontSize: rs.font(13) },
  warmupDur: { fontSize: rs.font(12) },
  ctaWrap: {
    gap: rs.verticalScale(10),
    marginTop: rs.verticalScale(8),
    paddingTop: rs.verticalScale(4),
  },
  noPlanCard: {
    alignItems: 'center',
    gap: rs.verticalScale(14),
    padding: rs.scale(24),
  },
  noPlanIcon: {
    width: rs.scale(80),
    height: rs.scale(80),
    borderRadius: rs.scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPlanTitle: { fontSize: rs.font(20), textAlign: 'center' },
  noPlanSub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
  restCard: {
    alignItems: 'center',
    gap: rs.verticalScale(12),
    padding: rs.scale(24),
    marginTop: rs.verticalScale(16),
  },
  restTitle: { fontSize: rs.font(22) },
  restSub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    padding: rs.scale(16),
    borderRadius: rs.scale(14),
    borderWidth: 1,
  },
  doneText: { fontSize: rs.font(15), flex: 1 },
});
