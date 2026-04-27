import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useColors } from '../../store';
import { navigate, rs, useSafeInsets } from '../../utils';
import { useActiveDietPlan } from '../../hooks';
import { DAYS, MEAL_TYPES } from '../../helper';
import {
  Badge,
  Button,
  CardSkeleton,
  Header,
  Icon,
  ScreenWrapper,
} from '../../components';
import { DIET_ROUTES, fonts, ROOT_ROUTES } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import { MealCard } from './components';

const DietPlanScreen: FC = () => {
  const colors = useColors();
   const insets  = useSafeInsets();
  const { data, loading, error, refresh } = useActiveDietPlan();

  const plan = data?.plan;

  const todayIndex = (() => {
    if (!plan?.startDate) return 0;
    const start = new Date(plan.startDate);
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, Math.min(diff, (plan.days?.length ?? 1) - 1));
  })();

  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const scrollRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-scroll day selector to today on mount
  useEffect(() => {
    if (!loading) {
      setTimeout(
        () =>
          scrollRef.current?.scrollToIndex({
            index: todayIndex,
            animated: true,
            viewPosition: 0.5,
          }),
        300,
      );
    }
  }, [loading, todayIndex]);

  const selectDay = (index: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedDay(index);
  };

  const selectedDayData = plan?.days?.[selectedDay];
  const totalDays = plan?.days?.length ?? 7;
  const dayLabels = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(plan?.startDate ?? Date.now());
    d.setDate(d.getDate() + i);
    return {
      dayNum: d.getDate(),
      dayName: DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1],
      date: d,
    };
  });

  const onGenerateDietPlan = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.GENERATE,
      },
    });
  }, []);

  const onDietDayDetail = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.DAY_DETAIL,
        params: {
          dayIndex: selectedDay,
        },
      },
    });
  }, [selectedDay]);

  return (
    <ScreenWrapper>
      <Header
        title="Diet Plan"
        subtitle={plan ? `${totalDays}-day plan` : undefined}
        showBack
        rightIcon="refresh-circle"
        onRightPress={onGenerateDietPlan}
      />
      {loading && (
        <View style={{ padding: rs.scale(16) }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      )}

      {!loading && !plan && (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: rs.scale(52) }}>🗓️</Text>
          <Text
            style={[
              styles.emptyTitle,
              { color: colors.textPrimary, fontFamily: fonts.Bold },
            ]}
          >
            No active plan
          </Text>
          <Text
            style={[
              styles.emptySub,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            Generate a personalised plan to see your full week
          </Text>
          <Button
            label="Generate plan"
            onPress={onGenerateDietPlan}
            fullWidth={false}
          />
        </View>
      )}

      {!loading && plan && (
        <>
          {/* Plan header card */}
          <LinearGradient
            colors={[colors.primary + '18', 'transparent']}
            style={styles.planHeader}
          >
            <View style={styles.planHeaderRow}>
              <View>
                <Text
                  style={[
                    styles.planTitle,
                    { color: colors.textPrimary, fontFamily: fonts.Bold },
                  ]}
                >
                  {plan.title}
                </Text>
                <Text
                  style={[
                    styles.planSub,
                    { color: colors.textTertiary, fontFamily: fonts.Regular },
                  ]}
                >
                  {new Date(plan.startDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                  {' – '}
                  {new Date(plan.endDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              </View>
              <View style={styles.planBadges}>
                <Badge
                  label={`${plan.targetCalories} kcal`}
                  variant="success"
                  small
                  icon="fire"
                />
                <Badge
                  label={plan.generatedBy === 'ai' ? 'AI' : 'Template'}
                  variant="info"
                  small
                />
              </View>
            </View>
          </LinearGradient>

          {/* Day selector strip */}
          <FlatList
            ref={scrollRef}
            data={dayLabels}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={styles.dayStrip}
            getItemLayout={(_, i) => ({
              length: rs.scale(60),
              offset: rs.scale(60) * i,
              index: i,
            })}
            renderItem={({ item, index }) => {
              const isToday = index === todayIndex;
              const isSelected = index === selectedDay;
              return (
                <Pressable
                  onPress={() => selectDay(index)}
                  style={[
                    styles.dayItem,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : isToday
                        ? colors.primary + '15'
                        : colors.backgroundCard,
                      borderColor: isSelected
                        ? colors.primary
                        : isToday
                        ? colors.primary + '40'
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayName,
                      {
                        color: isSelected ? colors.white : colors.textTertiary,
                        fontFamily: fonts.Medium,
                      },
                    ]}
                  >
                    {item.dayName}
                  </Text>
                  <Text
                    style={[
                      styles.dayNum,
                      {
                        color: isSelected ? colors.white : colors.textPrimary,
                        fontFamily: fonts.Bold,
                      },
                    ]}
                  >
                    {item.dayNum}
                  </Text>
                  {isToday && !isSelected && (
                    <View
                      style={[
                        styles.todayDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </Pressable>
              );
            }}
          />

          <ScreenWrapper
            contentStyle={[
              styles.dayContent,
              { paddingBottom: insets.bottom + rs.verticalScale(32) },
            ]}
            scroll
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {/* Day calorie summary */}
              {selectedDayData && (
                <View
                  style={[
                    styles.daySummary,
                    {
                      backgroundColor: colors.backgroundCard,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.daySummaryItem}>
                    <Icon
                      iconFamily="MaterialCommunityIcons"
                      name="fire"
                      size={rs.scale(16)}
                      color={colors.secondary}
                    />
                    <Text
                      style={[
                        styles.daySummaryVal,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.SemiBold,
                        },
                      ]}
                    >
                      {selectedDayData.totalCalories ?? 0}
                    </Text>
                    <Text
                      style={[
                        styles.daySummaryLabel,
                        {
                          color: colors.textTertiary,
                          fontFamily: fonts.Regular,
                        },
                      ]}
                    >
                      kcal
                    </Text>
                  </View>
                  {[
                    {
                      label: 'P',
                      value: selectedDayData.totalProtein ?? 0,
                      color: '#10B981',
                    },
                    {
                      label: 'C',
                      value: selectedDayData.totalCarbs ?? 0,
                      color: '#F59E0B',
                    },
                    {
                      label: 'F',
                      value: selectedDayData.totalFat ?? 0,
                      color: '#EF4444',
                    },
                  ].map(m => (
                    <View key={m.label} style={styles.daySummaryItem}>
                      <View
                        style={[
                          styles.macroChip,
                          { backgroundColor: m.color + '20' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.macroChipText,
                            { color: m.color, fontFamily: fonts.Bold },
                          ]}
                        >
                          {m.label}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.daySummaryVal,
                          {
                            color: colors.textPrimary,
                            fontFamily: fonts.SemiBold,
                          },
                        ]}
                      >
                        {m.value}g
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Meal cards for selected day */}
              <View style={{ paddingHorizontal: rs.scale(16) }}>
                {!selectedDayData ? (
                  <Text
                    style={[
                      styles.noDataText,
                      { color: colors.textTertiary, fontFamily: fonts.Regular },
                    ]}
                  >
                    No data for this day
                  </Text>
                ) : (
                  MEAL_TYPES.map(type => (
                    <MealCard
                      key={type}
                      type={type}
                      meal={selectedDayData.meals?.[type]}
                      onPress={onDietDayDetail}
                    />
                  ))
                )}
              </View>
            </Animated.View>
          </ScreenWrapper>
        </>
      )}
    </ScreenWrapper>
  );
};

export default DietPlanScreen;

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(14),
    padding: rs.scale(32),
  },
  emptyTitle: { fontSize: rs.font(20) },
  emptySub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
  planHeader: {
    paddingHorizontal: rs.scale(16),
    paddingVertical: rs.verticalScale(12),
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planTitle: { fontSize: rs.font(16) },
  planSub: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
  planBadges: { gap: rs.verticalScale(4), alignItems: 'flex-end' },
  dayStrip: {
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(8),
    gap: rs.scale(8),
  },
  dayItem: {
    width: rs.scale(56),
    alignItems: 'center',
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(12),
    borderWidth: 1,
    position: 'relative',
  },
  dayName: { fontSize: rs.font(11) },
  dayNum: { fontSize: rs.font(18) },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: rs.verticalScale(4),
  },
  dayContent: { paddingTop: rs.verticalScale(4) },
  daySummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: rs.scale(12),
    marginHorizontal: rs.scale(16),
    marginBottom: rs.verticalScale(12),
    borderRadius: rs.scale(12),
    borderWidth: 0.5,
  },
  daySummaryItem: { alignItems: 'center', gap: rs.verticalScale(2) },
  daySummaryVal: { fontSize: rs.font(15) },
  daySummaryLabel: { fontSize: rs.font(11) },
  macroChip: {
    width: rs.scale(22),
    height: rs.scale(22),
    borderRadius: rs.scale(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  macroChipText: { fontSize: rs.font(11) },
  noDataText: {
    textAlign: 'center',
    padding: rs.scale(24),
    fontSize: rs.font(14),
  },
});
