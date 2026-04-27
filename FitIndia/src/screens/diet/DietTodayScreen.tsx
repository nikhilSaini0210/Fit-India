import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback } from 'react';
import { selectUser, useAuthStore, useColors } from '../../store';
import { navigate, rs, useSafeInsets } from '../../utils';
import {
  useActiveDietPlan,
  useTodaysMeals,
} from '../../hooks';
import {
  Badge,
  Button,
  CardSkeleton,
  Icon,
  ScreenWrapper,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { DIET_ROUTES, fonts, ROOT_ROUTES } from '../../constants';
import { MEAL_TYPES, MealType } from '../../helper';
import { CalorieRingFallback, MacroBar, MealCard } from './components';

const DietTodayScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
//   const handleError = useApiError();

  const {
    data: todayData,
    loading,
    refreshing,
    error,
    refresh,
  } = useTodaysMeals();

  const { data: planData } = useActiveDietPlan();

//   const { anims, start } = useStagger(6, 80, 450);

//   useEffect(() => {
//     if (!loading) {
//       start();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loading]);

  // Edge case: no plan exists
  const hasPlan = !!planData?.plan || !!todayData?.meals;
  const todayMeals = todayData?.meals;

  // Calorie totals
  const totalCalories = todayMeals
    ? MEAL_TYPES.reduce(
        (acc, t) => acc + (todayMeals.meals?.[t]?.calories ?? 0),
        0,
      )
    : 0;

  const plan = planData?.plan;
  const targetCalories =
    plan?.targetCalories ?? user?.weight
      ? Math.round(user!.weight! * 33)
      : 2000;
  const remaining = Math.max(0, targetCalories - totalCalories);

  // Date greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const onDietPlan = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.DIET_PLAN,
      },
    });
  }, []);

  const onGenerateDietPlan = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.GENERATE,
      },
    });
  }, []);

  const onDietHistory = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.HISTORY,
      },
    });
  }, []);

  const onMealDetail = useCallback(
    (type: MealType) => {
      navigate(ROOT_ROUTES.MAIN, {
        screen: 'Diet',
        params: {
          screen: DIET_ROUTES.MEAL_DETAIL,
          params: {
            mealType: type,
            dayIndex: todayMeals?.day ? todayMeals?.day - 1 : 0,
          },
        },
      });
    },
    [todayMeals?.day],
  );

  if (error && !todayMeals) {
    return (
      <View
        style={[
          s.errorScreen,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="wifi-off"
          size={rs.scale(48)}
          color={colors.textTertiary}
        />
        <Text
          style={[
            s.errorTitle,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
        >
          Could not load your diet plan
        </Text>
        <Text
          style={[
            s.errorSub,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {error}
        </Text>
        <Button
          label="Try again"
          onPress={refresh}
          variant="secondary"
          fullWidth={false}
          iconLeft="refresh"
        />
      </View>
    );
  }

  return (
    <ScreenWrapper
      scroll
      contentStyle={{ paddingBottom: insets.bottom + rs.verticalScale(100) }}
      refreshing={refreshing}
      onRefresh={refresh}
    >
      <LinearGradient
        colors={[colors.primary + '22', 'transparent']}
        style={[s.header, { paddingTop: insets.top + rs.verticalScale(16) }]}
      >
        <View style={s.headerTop}>
          <View>
            <Text
              style={[
                s.greeting,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </Text>
            <Text
              style={[
                s.dateLabel,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              {dateLabel}
            </Text>
          </View>
          <Pressable
            onPress={onDietPlan}
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
              size={rs.scale(18)}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* Plan badge */}
        {plan && (
          <View style={s.planBadgeRow}>
            <Badge
              label={
                plan.generatedBy === 'ai'
                  ? '🤖 AI Generated'
                  : '📋 Template plan'
              }
              variant="info"
              small
            />
            <Badge
              label={plan.dietType.replace('_', '-')}
              variant="success"
              small
            />
          </View>
        )}
      </LinearGradient>

      <View style={{ paddingHorizontal: rs.scale(16) }}>
        {!hasPlan && !loading && (
          <View
            style={[
              s.noPlanCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={{ fontSize: rs.scale(40) }}>🥗</Text>
            <Text
              style={[
                s.noPlanTitle,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              No diet plan yet
            </Text>
            <Text
              style={[
                s.noPlanSub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              Generate your personalised Indian diet plan in seconds
            </Text>
            <Button
              label="Generate my plan"
              onPress={onGenerateDietPlan}
              iconRight="arrow-right"
              size="md"
              fullWidth={false}
            />
          </View>
        )}

        {loading && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}

        {hasPlan && !loading && (
          <View
            style={[
              s.calorieCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <CalorieRingFallback
              consumed={totalCalories}
              target={targetCalories}
            />

            {/* Remaining / burned */}
            <View style={s.calorieStats}>
              <View style={s.calorieStat}>
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="fire"
                  size={rs.scale(18)}
                  color={colors.secondary}
                />
                <Text
                  style={[
                    s.calorieStatVal,
                    { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  {totalCalories}
                </Text>
                <Text
                  style={[
                    s.calorieStatLabel,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  consumed
                </Text>
              </View>
              <View
                style={[s.calorieDivider, { backgroundColor: colors.border }]}
              />
              <View style={s.calorieStat}>
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="lightning-bolt"
                  size={rs.scale(18)}
                  color={colors.primary}
                />
                <Text
                  style={[
                    s.calorieStatVal,
                    { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  {remaining}
                </Text>
                <Text
                  style={[
                    s.calorieStatLabel,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  remaining
                </Text>
              </View>
              <View
                style={[s.calorieDivider, { backgroundColor: colors.border }]}
              />
              <View style={s.calorieStat}>
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="bullseye-arrow"
                  size={rs.scale(18)}
                  color={colors.info}
                />
                <Text
                  style={[
                    s.calorieStatVal,
                    { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  {targetCalories}
                </Text>
                <Text
                  style={[
                    s.calorieStatLabel,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  target
                </Text>
              </View>
            </View>
          </View>
        )}

        {hasPlan && !loading && plan && (
          <View
            style={[
              s.macroCard,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                s.sectionTitle,
                { color: colors.textSecondary, fontFamily: fonts.SemiBold },
              ]}
            >
              Macros today
            </Text>
            {[
              {
                label: 'Protein',
                current: todayMeals
                  ? MEAL_TYPES.reduce(
                      (a, t) => a + (todayMeals.meals?.[t]?.protein ?? 0),
                      0,
                    )
                  : 0,
                target: plan.targetProtein,
                color: '#10B981',
              },
              {
                label: 'Carbohydrates',
                current: todayMeals
                  ? MEAL_TYPES.reduce(
                      (a, t) => a + (todayMeals.meals?.[t]?.carbs ?? 0),
                      0,
                    )
                  : 0,
                target: plan.targetCarbs,
                color: '#F59E0B',
              },
              {
                label: 'Fat',
                current: todayMeals
                  ? MEAL_TYPES.reduce(
                      (a, t) => a + (todayMeals.meals?.[t]?.fat ?? 0),
                      0,
                    )
                  : 0,
                target: plan.targetFat,
                color: '#EF4444',
              },
            ].map(m => (
              <MacroBar key={m.label} {...m} />
            ))}
          </View>
        )}

        {hasPlan && !loading && (
          <View style={s.mealsSection}>
            <View style={s.sectionHeader}>
              <Text
                style={[
                  s.sectionTitle,
                  { color: colors.textSecondary, fontFamily: fonts.SemiBold },
                ]}
              >
                Today's meals
              </Text>
              <Pressable onPress={onDietHistory}>
                <Text
                  style={[
                    s.seeAll,
                    { color: colors.primary, fontFamily: fonts.Medium },
                  ]}
                >
                  History
                </Text>
              </Pressable>
            </View>

            {MEAL_TYPES.map((type, i) => (
              <MealCard
                key={i}
                type={type}
                meal={todayMeals?.meals?.[type]}
                onPress={() => onMealDetail(type)}
              />
            ))}
          </View>
        )}

        {hasPlan && (
          <View style={s.quickActions}>
            <Button
              label="View 7-day plan"
              onPress={onDietPlan}
              variant="secondary"
              iconLeft="calendar-week"
              size="md"
            />
            <Button
              label="Generate new plan"
              onPress={onGenerateDietPlan}
              variant="ghost"
              iconLeft="refresh"
              size="md"
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default DietTodayScreen;

const s = StyleSheet.create({
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(16),
    padding: rs.scale(24),
  },
  errorTitle: { fontSize: rs.font(18), textAlign: 'center' },
  errorSub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
  header: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(16),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: rs.font(13) },
  dateLabel: { fontSize: rs.font(20), marginTop: rs.verticalScale(2) },
  planBtn: {
    width: rs.scale(40),
    height: rs.scale(40),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  planBadgeRow: {
    flexDirection: 'row',
    gap: rs.scale(8),
    marginTop: rs.verticalScale(10),
  },
  noPlanCard: {
    borderRadius: rs.scale(16),
    borderWidth: 0.5,
    padding: rs.scale(24),
    alignItems: 'center',
    gap: rs.verticalScale(12),
    marginVertical: rs.verticalScale(16),
  },
  noPlanTitle: { fontSize: rs.font(20) },
  noPlanSub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(21),
  },
  calorieCard: {
    borderRadius: rs.scale(16),
    borderWidth: 0.5,
    padding: rs.scale(16),
    marginBottom: rs.verticalScale(12),
    gap: rs.verticalScale(16),
  },
  calorieStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  calorieStat: { alignItems: 'center', gap: rs.verticalScale(2) },
  calorieStatVal: { fontSize: rs.font(18) },
  calorieStatLabel: { fontSize: rs.font(11) },
  calorieDivider: { width: 0.5, height: rs.verticalScale(32) },
  macroCard: {
    borderRadius: rs.scale(16),
    borderWidth: 0.5,
    padding: rs.scale(16),
    marginBottom: rs.verticalScale(12),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs.verticalScale(12),
  },
  sectionTitle: {
    fontSize: rs.font(12),
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  mealsSection: { marginBottom: rs.verticalScale(12) },
  seeAll: { fontSize: rs.font(13) },
  quickActions: {
    gap: rs.verticalScale(10),
    marginBottom: rs.verticalScale(8),
  },
});
