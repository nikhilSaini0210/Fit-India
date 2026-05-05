import {
  Animated as RNAnimated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect } from 'react';
import {
  selectStreak,
  selectSummary,
  selectTodaysMeals,
  selectTodaysWorkout,
  selectUser,
  useAuthStore,
  useColors,
  useDietStore,
  useProgressStore,
  useWorkoutStore,
} from '../../store';
import { getDayOfWeek, navigate, rs, useSafeInsets } from '../../utils';
import {
  useProgressSummary,
  usePulse,
  useScalePop,
  useStagger,
  useStreak,
  useTodaysMeals,
  useTodaysWorkout,
} from '../../hooks';
import {
  Card,
  Icon,
  NoPlanState,
  QuickAction,
  ScreenWrapper,
  Shimmer,
  universalStyles,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts, ROOT_ROUTES } from '../../constants';
import { getGreeting } from '../../helper';
import {
  CalorieMiniRing,
  MealPreviewCard,
  MotivationalBanner,
  WorkoutPreviewCard,
} from './components';
import Animated from 'react-native-reanimated';

const HomeScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const todaysMeals = useDietStore(selectTodaysMeals);
  const todaysWorkout = useWorkoutStore(selectTodaysWorkout);
  const summary = useProgressStore(selectSummary);
  const streak = useProgressStore(selectStreak);

  const { anims, start } = useStagger(7, 60, 400);
  const { scaleStyle, start: streakPop } = useScalePop(300);
  const { pulseStyle, start: startPulse } = usePulse(0.97, 1.03, 1400);

  // Data fetching
  const {
    loading: loadingDiet,
    refreshing: refDiet,
    refresh: refreshDiet,
  } = useTodaysMeals();
  const {
    loading: loadingWork,
    refreshing: refWork,
    refresh: refreshWork,
  } = useTodaysWorkout();
  const {
    loading: loadingProg,
    refreshing: refProg,
    refresh: refreshProg,
  } = useProgressSummary();
  useStreak();

  const isLoading = loadingDiet || loadingWork || loadingProg;
  const isRefreshing = refDiet || refWork || refProg;

  const refresh = useCallback(() => {
    refreshDiet();
    refreshWork();
    refreshProg();
  }, [refreshDiet, refreshWork, refreshProg]);

  useEffect(() => {
    start();
    if (streak.current > 0) {
      streakPop();
      startPulse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak.current]);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  // Calorie totals
  const meals = todaysMeals?.meals;
  const consumed = meals
    ? Object.values(meals).reduce(
        (s: number, m: any) => s + (m?.calories ?? 0),
        0,
      )
    : 0;
  const target = summary?.currentWeight
    ? Math.round(2000) // fallback; real target comes from nutrition targets
    : 0;

  // Navigate helpers (cross-tab)
  const goToDiet = (screen: any, params?: any) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen,
        params,
      },
    });
  };

  const goToWorkout = (screen: any, params?: any) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Workout',
      params: {
        screen,
        params,
      },
    });
  };

  const goToProgress = (screen: any, params?: any) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Progress',
      params: {
        screen,
        params,
      },
    });
  };

  const goToQuickWorkout = (screen: any, params?: any) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Home',
      params: {
        screen,
        params,
      },
    });
  };

  return (
    <ScreenWrapper
      scroll
      contentStyle={{ paddingBottom: insets.bottom + rs.verticalScale(32) }}
      refreshing={isRefreshing}
      onRefresh={refresh}
    >
      <RNAnimated.View
        style={{
          opacity: anims[0].opacity,
          transform: [{ translateY: anims[0].translateY }],
        }}
      >
        <LinearGradient
          colors={[colors.primary + '22', colors.background]}
          style={[s.hero, { paddingTop: insets.top + rs.verticalScale(16) }]}
        >
          <View style={s.heroRow}>
            <View style={universalStyles.flex}>
              <Text style={[s.greetEmoji]}>{greeting.emoji}</Text>
              <Text
                style={[
                  s.greetText,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                {greeting.text}
              </Text>
              <Text
                style={[
                  s.userName,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                {firstName}!
              </Text>
              <Text
                style={[
                  s.date,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                {getDayOfWeek()}
              </Text>
            </View>

            <Pressable onPress={() => goToProgress('StreakBadges')}>
              <Animated.View style={[s.streakBubble, scaleStyle]}>
                <Animated.View style={pulseStyle}>
                  <LinearGradient
                    colors={
                      streak.current >= 7
                        ? ['#F97316', '#F59E0B']
                        : [colors.primary, colors.primaryDark]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.streakGradient}
                  >
                    <Text style={s.streakEmoji}>
                      {streak.current >= 7 ? '🔥' : '⚡'}
                    </Text>
                    <Text
                      style={[s.streakCount, { fontFamily: fonts.ExtraBold }]}
                    >
                      {streak.current}
                    </Text>
                    <Text
                      style={[s.streakLabel, { fontFamily: fonts.Regular }]}
                    >
                      streak
                    </Text>
                  </LinearGradient>
                </Animated.View>
              </Animated.View>
            </Pressable>
          </View>
          {user && !user.profileComplete && (
            <Pressable
              onPress={() =>
                navigate('Profile' as any, { screen: 'EditProfile' })
              }
              style={[
                s.profileBanner,
                {
                  backgroundColor: colors.warning + '18',
                  borderColor: colors.warning + '40',
                },
              ]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="alert-circle-outline"
                size={rs.scale(16)}
                color={colors.warning}
              />
              <Text
                style={[
                  s.profileBannerText,
                  { color: colors.warning, fontFamily: fonts.Medium },
                ]}
              >
                Complete your profile to unlock personalised plans
              </Text>
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="chevron-right"
                size={rs.scale(14)}
                color={colors.warning}
              />
            </Pressable>
          )}
        </LinearGradient>
      </RNAnimated.View>

      <View style={s.content}>
        <RNAnimated.View
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
            QUICK ACTIONS
          </Text>
          <View style={s.quickRow}>
            <QuickAction
              icon="food-apple-outline"
              label="Diet Today"
              color="#10B981"
              onPress={() => goToDiet('DietToday')}
            />
            <QuickAction
              icon="dumbbell"
              label="Workout"
              color={colors.secondary}
              onPress={() => goToWorkout('WorkoutToday')}
            />
            <QuickAction
              icon="scale-bathroom"
              label="Log Weight"
              color={colors.info}
              onPress={() => goToProgress('LogWeight', {})}
            />
            <QuickAction
              icon="lightning-bolt"
              label="Quick Workout"
              color="#8B5CF6"
              onPress={() => goToQuickWorkout('QuickWorkout')}
            />
          </View>
        </RNAnimated.View>

        <RNAnimated.View
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
            TODAY'S NUTRITION
          </Text>
          <Pressable onPress={() => goToDiet('DietToday')}>
            <Card style={s.calorieCard}>
              <LinearGradient
                colors={[colors.primary + '15', colors.primary + '05']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  ...StyleSheet.absoluteFill,
                }}
              />
              <View style={s.calorieGrad}>
                <View
                  style={[universalStyles.flex, { gap: rs.verticalScale(12) }]}
                >
                  <View>
                    <Text
                      style={[
                        s.calorieTitle,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.SemiBold,
                        },
                      ]}
                    >
                      Calories
                    </Text>
                    {isLoading ? (
                      <Shimmer
                        height={rs.verticalScale(14)}
                        width="60%"
                        style={{ marginTop: rs.verticalScale(4) }}
                      />
                    ) : (
                      <>
                        <Text
                          style={[
                            s.calorieVal,
                            {
                              color: colors.primary,
                              fontFamily: fonts.ExtraBold,
                            },
                          ]}
                        >
                          {consumed}
                          <Text
                            style={[
                              s.calorieTarget,
                              {
                                color: colors.textTertiary,
                                fontFamily: fonts.Regular,
                              },
                            ]}
                          >
                            {target > 0 ? ` / ${target} kcal` : ' kcal today'}
                          </Text>
                        </Text>
                      </>
                    )}
                  </View>

                  {/* Macro pills */}
                  {!isLoading && meals && (
                    <View style={s.macroPills}>
                      {[
                        {
                          label: 'P',
                          val: Object.values(meals).reduce(
                            (s: number, m: any) => s + (m?.protein ?? 0),
                            0,
                          ),
                          color: '#3B82F6',
                        },
                        {
                          label: 'C',
                          val: Object.values(meals).reduce(
                            (s: number, m: any) => s + (m?.carbs ?? 0),
                            0,
                          ),
                          color: '#F59E0B',
                        },
                        {
                          label: 'F',
                          val: Object.values(meals).reduce(
                            (s: number, m: any) => s + (m?.fat ?? 0),
                            0,
                          ),
                          color: '#EF4444',
                        },
                      ].map(macro => (
                        <View
                          key={macro.label}
                          style={[
                            s.macroPill,
                            {
                              backgroundColor: macro.color + '15',
                              borderColor: macro.color + '30',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              s.macroPillText,
                              {
                                color: macro.color,
                                fontFamily: fonts.SemiBold,
                              },
                            ]}
                          >
                            {macro.label} {macro.val}g
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                {isLoading ? (
                  <Shimmer
                    width={rs.scale(72)}
                    height={rs.scale(72)}
                    radius={rs.scale(36)}
                  />
                ) : (
                  <CalorieMiniRing
                    consumed={consumed}
                    target={target || 2000}
                  />
                )}
              </View>
            </Card>
          </Pressable>
        </RNAnimated.View>

        <RNAnimated.View
          style={{
            opacity: anims[3].opacity,
            transform: [{ translateY: anims[3].translateY }],
          }}
        >
          <View style={s.sectionRow}>
            <Text
              style={[
                s.sectionTitle,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              TODAY'S MEALS
            </Text>
            <Pressable onPress={() => goToDiet('DietPlan')}>
              <Text
                style={[
                  s.seeAll,
                  { color: colors.primary, fontFamily: fonts.Medium },
                ]}
              >
                View plan →
              </Text>
            </Pressable>
          </View>
          <Card style={s.mealsCard}>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <View
                  key={i}
                  style={{
                    gap: rs.verticalScale(6),
                    marginBottom: rs.verticalScale(12),
                  }}
                >
                  <Shimmer width="40%" height={rs.verticalScale(11)} />
                  <Shimmer width="70%" height={rs.verticalScale(14)} />
                </View>
              ))
            ) : !meals ? (
              <NoPlanState
                icon="food-apple-outline"
                message="No diet plan yet"
                action="Generate diet plan"
                onAction={() => goToDiet('GenerateDiet')}
                colors={colors}
              />
            ) : (
              (['breakfast', 'lunch', 'snack', 'dinner'] as const).map(type => (
                <MealPreviewCard
                  key={type}
                  mealType={type}
                  meal={(meals as any)[type]}
                  onPress={() =>
                    goToDiet('MealDetail', { mealType: type, dayIndex: 0 })
                  }
                  colors={colors}
                />
              ))
            )}
          </Card>
        </RNAnimated.View>

        <RNAnimated.View
          style={{
            opacity: anims[4].opacity,
            transform: [{ translateY: anims[4].translateY }],
          }}
        >
          <View style={s.sectionRow}>
            <Text
              style={[
                s.sectionTitle,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              TODAY'S WORKOUT
            </Text>
            <Pressable onPress={() => goToWorkout('WorkoutPlan')}>
              <Text
                style={[
                  s.seeAll,
                  { color: colors.secondary, fontFamily: fonts.Medium },
                ]}
              >
                View plan →
              </Text>
            </Pressable>
          </View>
          {isLoading ? (
            <Shimmer height={rs.verticalScale(72)} radius={rs.scale(16)} />
          ) : !todaysWorkout ? (
            <Card style={s.noWorkoutCard}>
              <NoPlanState
                icon="dumbbell"
                message="No workout plan"
                action="Generate workout"
                onAction={() => goToWorkout('GenerateWorkout')}
                colors={colors}
                horizontal
              />
            </Card>
          ) : (
            <WorkoutPreviewCard
              workout={todaysWorkout}
              onPress={() =>
                todaysWorkout.type !== 'rest'
                  ? goToWorkout('WorkoutDayDetail', {
                      dayNumber: todaysWorkout.day,
                    })
                  : null
              }
            />
          )}
        </RNAnimated.View>

        <RNAnimated.View
          style={{
            opacity: anims[5].opacity,
            transform: [{ translateY: anims[5].translateY }],
          }}
        >
          <View style={s.sectionRow}>
            <Text
              style={[
                s.sectionTitle,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              PROGRESS
            </Text>
            <Pressable onPress={() => goToProgress('ProgressCharts', {})}>
              <Text
                style={[
                  s.seeAll,
                  { color: colors.info, fontFamily: fonts.Medium },
                ]}
              >
                View charts →
              </Text>
            </Pressable>
          </View>
          <View style={s.progressRow}>
            {[
              {
                label: 'Current weight',
                value: summary?.currentWeight
                  ? `${summary.currentWeight} kg`
                  : '—',
                icon: 'scale-bathroom',
                color: colors.info,
              },
              {
                label: 'Change',
                value:
                  summary?.weightChange !== undefined
                    ? `${summary.weightChange >= 0 ? '+' : ''}${
                        summary.weightChange
                      } kg`
                    : '—',
                icon:
                  summary?.weightTrend === 'loss'
                    ? 'trending-down'
                    : 'trending-up',
                color:
                  summary?.weightTrend === 'loss'
                    ? colors.success
                    : colors.warning,
              },
              {
                label: 'Streak',
                value: `${streak.current} days`,
                icon: 'fire',
                color: '#F97316',
              },
            ].map((item, i) => (
              <Pressable
                key={i}
                onPress={() => goToProgress('ProgressCharts', {})}
                style={[
                  s.progressCard,
                  {
                    backgroundColor: colors.backgroundCard,
                    borderColor: colors.border,
                  },
                ]}
              >
                {isLoading ? (
                  <Shimmer
                    width="80%"
                    height={rs.verticalScale(32)}
                    radius={rs.scale(6)}
                  />
                ) : (
                  <>
                    <View
                      style={[
                        s.progIconWrap,
                        { backgroundColor: item.color + '15' },
                      ]}
                    >
                      <Icon
                        iconFamily="MaterialCommunityIcons"
                        name={item.icon}
                        size={rs.scale(16)}
                        color={item.color}
                      />
                    </View>
                    <Text
                      style={[
                        s.progVal,
                        { color: item.color, fontFamily: fonts.Bold },
                      ]}
                    >
                      {item.value}
                    </Text>
                    <Text
                      style={[
                        s.progLabel,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </>
                )}
              </Pressable>
            ))}
          </View>
        </RNAnimated.View>

        <RNAnimated.View
          style={{
            opacity: anims[6].opacity,
            transform: [{ translateY: anims[6].translateY }],
          }}
        >
          <MotivationalBanner streak={streak.current} goal={user?.goal} />
        </RNAnimated.View>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const s = StyleSheet.create({
  hero: {
    paddingHorizontal: rs.scale(20),
    paddingBottom: rs.verticalScale(20),
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: rs.scale(16),
  },
  greetEmoji: { fontSize: rs.scale(20), marginBottom: rs.verticalScale(2) },
  greetText: { fontSize: rs.font(14) },
  userName: { fontSize: rs.font(28), marginTop: rs.verticalScale(2) },
  date: { fontSize: rs.font(13), marginTop: rs.verticalScale(2) },

  // Streak bubble
  streakBubble: {},
  streakGradient: {
    width: rs.scale(76),
    height: rs.scale(76),
    borderRadius: rs.scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(0),
  },
  streakEmoji: { fontSize: rs.scale(18) },
  streakCount: {
    fontSize: rs.font(22),
    color: '#FFF',
    lineHeight: rs.font(26),
  },
  streakLabel: { fontSize: rs.font(10), color: 'rgba(255,255,255,0.8)' },

  // Profile banner
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(8),
    borderWidth: 1,
    borderRadius: rs.scale(12),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(8),
    marginTop: rs.verticalScale(12),
  },
  profileBannerText: { flex: 1, fontSize: rs.font(13) },

  // Content
  content: {
    paddingHorizontal: rs.scale(16),
    gap: rs.verticalScale(20),
    paddingTop: rs.verticalScale(16),
  },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(10),
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs.verticalScale(10),
  },
  seeAll: { fontSize: rs.font(13) },

  // Quick actions
  quickRow: { flexDirection: 'row', gap: rs.scale(8) },

  // Calorie card
  calorieCard: { padding: 0, overflow: 'hidden' },
  calorieGrad: {
    // ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    padding: rs.scale(16),
    gap: rs.scale(16),
  },
  calorieTitle: { fontSize: rs.font(14), marginBottom: rs.verticalScale(2) },
  calorieVal: { fontSize: rs.font(28) },
  calorieTarget: { fontSize: rs.font(16) },
  macroPills: { flexDirection: 'row', gap: rs.scale(6), flexWrap: 'wrap' },
  macroPill: {
    borderWidth: 1,
    borderRadius: rs.scale(20),
    paddingHorizontal: rs.scale(10),
    paddingVertical: rs.verticalScale(3),
  },
  macroPillText: { fontSize: rs.font(12) },

  // Meals
  mealsCard: { padding: rs.scale(14), gap: rs.verticalScale(0) },
  noWorkoutCard: { padding: rs.scale(14) },

  // Progress
  progressRow: { flexDirection: 'row', gap: rs.scale(10) },
  progressCard: {
    flex: 1,
    borderRadius: rs.scale(14),
    borderWidth: 1,
    padding: rs.scale(12),
    alignItems: 'center',
    gap: rs.verticalScale(4),
  },
  progIconWrap: {
    width: rs.scale(32),
    height: rs.scale(32),
    borderRadius: rs.scale(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progVal: { fontSize: rs.font(16) },
  progLabel: { fontSize: rs.font(11), textAlign: 'center' },
});
