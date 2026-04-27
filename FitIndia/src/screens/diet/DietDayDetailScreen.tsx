import { StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback } from 'react';
import { useColors } from '../../store';
import { navigate, rs, useSafeInsets } from '../../utils';
import { useActiveDietPlan } from '../../hooks';
import { DietStackScreenProps } from '../../types';
import { CardSkeleton, Header, ScreenWrapper } from '../../components';
import { DIET_ROUTES, fonts, ROOT_ROUTES } from '../../constants';
import { MacroBar, MealCard } from './components';
import { MEAL_TYPES, MealType } from '../../helper';

type Props = DietStackScreenProps<'DietDayDetail'>;

const DietDayDetailScreen: FC<Props> = ({ route }) => {
  const { dayIndex } = route.params;
  const colors = useColors();
  const insets = useSafeInsets();
  const { data, loading } = useActiveDietPlan();

  const plan = data?.plan;
  const dayData = plan?.days?.[dayIndex];

  const onMealDetail = useCallback(
    (type: MealType) => {
      navigate(ROOT_ROUTES.MAIN, {
        screen: 'Diet',
        params: {
          screen: DIET_ROUTES.MEAL_DETAIL,
          params: {
            mealType: type,
            dayIndex,
          },
        },
      });
    },
    [dayIndex],
  );

  if (!loading && plan && !dayData) {
    return (
      <ScreenWrapper>
        <Header title="Day Detail" showBack />
        <View style={styles.center}>
          <Text
            style={[
              styles.errorText,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            Day {dayIndex + 1} not found in plan
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  const startDate = plan?.startDate ? new Date(plan.startDate) : null;
  const dayDate = startDate
    ? new Date(startDate.getTime() + dayIndex * 86400000)
    : null;
  const dayLabel = dayDate
    ? dayDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : `Day ${dayIndex + 1}`;

  return (
    <ScreenWrapper>
      <Header
        title={dayLabel}
        subtitle={`Day ${dayIndex + 1} of ${plan?.totalDays ?? 7}`}
        showBack
      />
      {loading && (
        <View style={{ padding: rs.scale(16) }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      )}
      {!loading && dayData && (
        <ScreenWrapper
          contentStyle={[
            styles.content,
            { paddingBottom: insets.bottom + rs.verticalScale(32) },
          ]}
          scroll
        >
          <View
            style={[
              styles.summaryRow,
              {
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              },
            ]}
          >
            {[
              {
                label: 'Calories',
                value: `${dayData.totalCalories ?? 0}`,
                unit: 'kcal',
                color: colors.secondary,
              },
              {
                label: 'Protein',
                value: `${dayData.totalProtein ?? 0}`,
                unit: 'g',
                color: '#10B981',
              },
              {
                label: 'Carbs',
                value: `${dayData.totalCarbs ?? 0}`,
                unit: 'g',
                color: '#F59E0B',
              },
              {
                label: 'Fat',
                value: `${dayData.totalFat ?? 0}`,
                unit: 'g',
                color: '#EF4444',
              },
            ].map(item => (
              <View key={item.label} style={styles.summaryItem}>
                <Text
                  style={[
                    styles.summaryVal,
                    { color: item.color, fontFamily: fonts.Bold },
                  ]}
                >
                  {item.value}
                  <Text
                    style={[styles.summaryUnit, { color: colors.textTertiary }]}
                  >
                    {item.unit}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Macro progress */}
          {plan && (
            <View
              style={[
                styles.macroCard,
                {
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.sectionLabel,
                  { color: colors.textTertiary, fontFamily: fonts.SemiBold },
                ]}
              >
                MACRO BREAKDOWN
              </Text>
              <MacroBar
                label="Protein"
                current={dayData.totalProtein ?? 0}
                target={plan.targetProtein}
                color="#10B981"
              />
              <MacroBar
                label="Carbohydrates"
                current={dayData.totalCarbs ?? 0}
                target={plan.targetCarbs}
                color="#F59E0B"
              />
              <MacroBar
                label="Fat"
                current={dayData.totalFat ?? 0}
                target={plan.targetFat}
                color="#EF4444"
              />
            </View>
          )}

          {/* Meals */}
          <Text
            style={[
              styles.sectionLabel,
              {
                color: colors.textTertiary,
                fontFamily: fonts.SemiBold,
                paddingHorizontal: rs.scale(4),
                marginBottom: rs.verticalScale(8),
              },
            ]}
          >
            MEALS
          </Text>
          {MEAL_TYPES.map(type => (
            <MealCard
              key={type}
              type={type}
              meal={dayData.meals?.[type]}
              onPress={() => onMealDetail(type)}
            />
          ))}
        </ScreenWrapper>
      )}
    </ScreenWrapper>
  );
};

export default DietDayDetailScreen;

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: rs.font(14), textAlign: 'center' },
  content: { paddingHorizontal: rs.scale(16), gap: rs.verticalScale(12) },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: rs.scale(14),
    borderWidth: 0.5,
    paddingVertical: rs.verticalScale(14),
  },
  summaryItem: { alignItems: 'center', gap: rs.verticalScale(2) },
  summaryVal: { fontSize: rs.font(18) },
  summaryUnit: { fontSize: rs.font(12) },
  summaryLabel: { fontSize: rs.font(11) },
  macroCard: {
    borderRadius: rs.scale(14),
    borderWidth: 0.5,
    padding: rs.scale(14),
    gap: rs.verticalScale(4),
  },
  sectionLabel: { fontSize: rs.font(11), letterSpacing: 0.6 },
});
