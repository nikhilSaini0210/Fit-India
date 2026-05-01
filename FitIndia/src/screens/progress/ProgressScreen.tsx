import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  selectStreak,
  selectSummary,
  selectUser,
  useAuthStore,
  useColors,
  useProgressStore,
} from '../../store';
import { navigate, rs, useSafeInsets } from '../../utils';
import {
  useApiError,
  useProgressHistory,
  useProgressSummary,
  useStagger,
  useStreak,
} from '../../hooks';
import { ProgressLog } from '../../types';
import {
  Button,
  Card,
  CardSkeleton,
  EmptyState,
  Icon,
  ScreenWrapper,
  universalStyles,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts, PROGRESS_ROUTES, ROOT_ROUTES } from '../../constants';
import { BMIGauge, StatDeltaCard, StreakCalendar, WeightChart } from './components';
import { PERIOD_OPTIONS, PERIOD_TYPES } from '../../helper';

const ProgressScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const summary = useProgressStore(selectSummary);
  const streak = useProgressStore(selectStreak);
  const handleError = useApiError();
  const { anims, start } = useStagger(5, 80, 400);

  const [period, setPeriod] = useState<'week' | 'month' | '3months' | 'year'>(
    'month',
  );

  const {
    loading: loadingSummary,
    refreshing: refreshingSummary,
    refresh: refreshSummary,
  } = useProgressSummary();
  const { refresh: refreshStreak } = useStreak();
  const {
    data: histData,
    loading: loadingHist,
    refreshing: refreshingHist,
    refresh: refreshHist,
  } = useProgressHistory(period);

  const isLoading = loadingSummary || loadingHist;
  const isRefreshing = refreshingSummary || refreshingHist;

  const logs: ProgressLog[] = useMemo(
    () => ((histData as any)?.data ?? (histData as any) ?? []) as ProgressLog[],
    [histData],
  );

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    refreshSummary();
    refreshStreak();
    refreshHist();
  }, [refreshSummary, refreshStreak, refreshHist]);

  const onLogWeight = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Progress',
      params: {
        screen: PROGRESS_ROUTES.LOG_WEIGHT,
      },
    });
  }, []);

  const onStreakBadges = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Progress',
      params: {
        screen: PROGRESS_ROUTES.STREAK,
      },
    });
  }, []);

  const onProgressCharts = useCallback((p: PERIOD_TYPES) => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Progress',
      params: {
        screen: PROGRESS_ROUTES.CHARTS,
        params: {
          period: p,
        },
      },
    });
  }, []);

  // Calculate week-over-week delta for weight
  const weekDelta = useMemo(() => {
    if (logs.length < 2) return null;
    const sorted = [...logs].sort(
      (a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime(),
    );
    const recent = sorted.slice(-7);
    const prev = sorted.slice(-14, -7);
    if (!recent.length || !prev.length) return null;
    const avgRecent = recent.reduce((s, l) => s + l.weight, 0) / recent.length;
    const avgPrev = prev.reduce((s, l) => s + l.weight, 0) / prev.length;
    return parseFloat((avgRecent - avgPrev).toFixed(1));
  }, [logs]);

  const bmi =
    user?.weight && user?.height
      ? parseFloat((user.weight / Math.pow(user.height / 100, 2)).toFixed(1))
      : null;

  const goalIsWeightLoss = user?.goal === 'weight_loss';

  // ── Empty state ────────────────────────────────────────────────────────────
  const hasAnyData = summary || logs.length > 0;

  return (
    <ScreenWrapper
      scroll
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      contentStyle={{ paddingBottom: insets.bottom + rs.verticalScale(32) }}
    >
      <Animated.View
        style={{
          opacity: anims[0].opacity,
          transform: [{ translateY: anims[0].translateY }],
        }}
      >
        <LinearGradient
          colors={[colors.primary + '20', colors.background]}
          style={[
            styles.hero,
            { paddingTop: insets.top + rs.verticalScale(16) },
          ]}
        >
          <View style={styles.heroTop}>
            <View>
              <Text
                style={[
                  styles.heroTitle,
                  { color: colors.textPrimary, fontFamily: fonts.Bold },
                ]}
              >
                Progress 📊
              </Text>
              <Text
                style={[
                  styles.heroSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                {summary
                  ? `${summary.totalLogs} check-ins so far`
                  : 'Start logging your weight'}
              </Text>
            </View>
            <Button
              label="Log weight"
              onPress={onLogWeight}
              iconLeft="plus-circle-outline"
              size="sm"
              fullWidth={false}
            />
          </View>

          {/* Streak pills */}
          <View style={styles.streakRow}>
            <Pressable
              onPress={onStreakBadges}
              style={[
                styles.streakPill,
                {
                  backgroundColor: colors.warning + '18',
                  borderColor: colors.warning + '40',
                },
              ]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="fire"
                size={rs.scale(16)}
                color={colors.warning}
              />
              <Text
                style={[
                  styles.streakNum,
                  { color: colors.warning, fontFamily: fonts.Bold },
                ]}
              >
                {streak.current}
              </Text>
              <Text
                style={[
                  styles.streakLabel,
                  { color: colors.warning, fontFamily: fonts.Regular },
                ]}
              >
                day streak
              </Text>
            </Pressable>

            <Pressable
              onPress={onStreakBadges}
              style={[
                styles.streakPill,
                {
                  backgroundColor: colors.info + '18',
                  borderColor: colors.info + '40',
                },
              ]}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="trophy-outline"
                size={rs.scale(16)}
                color={colors.info}
              />
              <Text
                style={[
                  styles.streakNum,
                  { color: colors.info, fontFamily: fonts.Bold },
                ]}
              >
                {streak.longest}
              </Text>
              <Text
                style={[
                  styles.streakLabel,
                  { color: colors.info, fontFamily: fonts.Regular },
                ]}
              >
                best streak
              </Text>
            </Pressable>

            {summary && (
              <View
                style={[
                  styles.streakPill,
                  {
                    backgroundColor: colors.primary + '18',
                    borderColor: colors.primary + '40',
                  },
                ]}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="scale-bathroom"
                  size={rs.scale(16)}
                  color={colors.primary}
                />
                <Text
                  style={[
                    styles.streakNum,
                    { color: colors.primary, fontFamily: fonts.Bold },
                  ]}
                >
                  {summary.currentWeight}
                </Text>
                <Text
                  style={[
                    styles.streakLabel,
                    { color: colors.primary, fontFamily: fonts.Regular },
                  ]}
                >
                  kg now
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={{ paddingHorizontal: rs.scale(16) }}>
        {!isLoading && !hasAnyData && (
          <EmptyState
            iconName="chart-line"
            title="No data yet"
            subTitle="Log your weight daily to start tracking your progress journey."
            btnTitle="Log your first weight"
            onPress={onLogWeight}
          />
        )}

        {(isLoading || summary) && (
          <Animated.View
            style={{
              opacity: anims[1].opacity,
              transform: [{ translateY: anims[1].translateY }],
            }}
          >
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              STATS
            </Text>
            {isLoading ? (
              <View style={styles.statsRow}>
                <CardSkeleton style={universalStyles.flex} />
                <CardSkeleton style={universalStyles.flex} />
              </View>
            ) : (
              <>
                <View style={styles.statsRow}>
                  <StatDeltaCard
                    label="Current weight"
                    value={summary!.currentWeight}
                    unit="kg"
                    delta={weekDelta}
                    deltaLabel="this week"
                    icon="scale-bathroom"
                    iconColor={colors.primary}
                    positiveIsGood={!goalIsWeightLoss}
                  />
                  <StatDeltaCard
                    label="Total change"
                    value={Math.abs(summary!.weightChange)}
                    unit="kg"
                    delta={summary!.weightChange}
                    deltaLabel="from start"
                    icon="trending-up"
                    iconColor={
                      summary!.weightTrend === 'loss'
                        ? colors.success
                        : colors.warning
                    }
                    positiveIsGood={!goalIsWeightLoss}
                  />
                </View>

                {user?.height && (
                  <View
                    style={[
                      styles.statsRow,
                      { marginTop: rs.verticalScale(10) },
                    ]}
                  >
                    {bmi && (
                      <StatDeltaCard
                        label="BMI"
                        value={bmi}
                        icon="heart-pulse"
                        iconColor={bmi < 25 ? colors.success : colors.warning}
                      />
                    )}
                    <StatDeltaCard
                      label="Total check-ins"
                      value={summary!.totalLogs}
                      icon="calendar-check-outline"
                      iconColor={colors.info}
                    />
                  </View>
                )}
              </>
            )}
          </Animated.View>
        )}

        <Animated.View
          style={{
            opacity: anims[2].opacity,
            transform: [{ translateY: anims[2].translateY }],
          }}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              WEIGHT CHART
            </Text>
            <Pressable onPress={() => onProgressCharts(period)}>
              <Text
                style={[
                  styles.seeAll,
                  { color: colors.primary, fontFamily: fonts.Medium },
                ]}
              >
                Full chart →
              </Text>
            </Pressable>
          </View>

          {/* Period selector */}
          <View
            style={[
              styles.periodRow,
              { backgroundColor: colors.backgroundSurface },
            ]}
          >
            {PERIOD_OPTIONS.map(opt => (
              <Pressable
                key={opt.value}
                onPress={() => setPeriod(opt.value)}
                style={[
                  styles.periodBtn,
                  {
                    backgroundColor:
                      period === opt.value ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color:
                        period === opt.value
                          ? colors.white
                          : colors.textTertiary,
                      fontFamily:
                        period === opt.value ? fonts.SemiBold : fonts.Regular,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Card style={styles.chartCard}>
            {loadingHist ? (
              <View
                style={[
                  styles.chartPlaceholder,
                  { backgroundColor: colors.backgroundSurface },
                ]}
              />
            ) : (
              <WeightChart logs={logs} />
            )}
          </Card>
        </Animated.View>

        {bmi && !isLoading && (
          <Animated.View
            style={{
              opacity: anims[3].opacity,
              transform: [{ translateY: anims[3].translateY }],
            }}
          >
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              BMI
            </Text>
            <Card>
              <BMIGauge bmi={bmi} />
            </Card>
          </Animated.View>
        )}

        <Animated.View
          style={{
            opacity: anims[4].opacity,
            transform: [{ translateY: anims[4].translateY }],
          }}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              LOG STREAK
            </Text>
            <Pressable onPress={onStreakBadges}>
              <Text
                style={[
                  styles.seeAll,
                  { color: colors.primary, fontFamily: fonts.Medium },
                ]}
              >
                Badges →
              </Text>
            </Pressable>
          </View>
          <Card>
            <StreakCalendar logs={logs} weeks={16} />
          </Card>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(20),
    gap: rs.verticalScale(16),
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroTitle: { fontSize: rs.font(24) },
  heroSub: { fontSize: rs.font(13), marginTop: rs.verticalScale(2) },
  streakRow: { flexDirection: 'row', gap: rs.scale(10) },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(6),
    paddingHorizontal: rs.scale(12),
    paddingVertical: rs.verticalScale(8),
    borderRadius: rs.scale(20),
    borderWidth: 1,
  },
  streakNum: { fontSize: rs.font(15) },
  streakLabel: { fontSize: rs.font(11) },
  sectionLabel: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(10),
    marginTop: rs.verticalScale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rs.verticalScale(20),
    marginBottom: rs.verticalScale(10),
  },
  seeAll: { fontSize: rs.font(13) },
  statsRow: { flexDirection: 'row', gap: rs.scale(12) },
  periodRow: {
    flexDirection: 'row',
    borderRadius: rs.scale(12),
    padding: rs.scale(4),
    marginBottom: rs.verticalScale(12),
  },
  periodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rs.verticalScale(7),
    borderRadius: rs.scale(9),
  },
  periodText: { fontSize: rs.font(13) },
  chartCard: { padding: rs.scale(16) },
  chartPlaceholder: {
    height: rs.verticalScale(180),
    borderRadius: rs.scale(8),
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: rs.verticalScale(48),
    gap: rs.verticalScale(12),
  },
  emptyIconBg: {
    width: rs.scale(80),
    height: rs.scale(80),
    borderRadius: rs.scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: rs.font(20), textAlign: 'center' },
  emptySub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
    maxWidth: rs.wp(75),
  },
});
