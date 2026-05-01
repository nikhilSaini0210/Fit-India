import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ProgressLog, ProgressStackScreenProps } from '../../types';
import { selectSummary, useColors, useProgressStore } from '../../store';
import { goBack, navigate, rs, useSafeInsets } from '../../utils';
import {
  useApiError,
  useFadeIn,
  useProgressHistory,
  useStagger,
} from '../../hooks';
import { ChartTab, Period, PERIODS } from '../../helper';
import {
  Badge,
  Card,
  Header,
  Icon,
  NoDataState,
  ScreenWrapper,
  Skeleton,
} from '../../components';
import { fonts, PROGRESS_ROUTES, ROOT_ROUTES } from '../../constants';
import {
  BMIGauge,
  MeasurementRow,
  StatDeltaCard,
  WeightChart,
} from './components';

type Props = ProgressStackScreenProps<'ProgressCharts'>;

const ProgressChartsScreen: FC<Props> = ({ route }) => {
  const colors = useColors();
  const insets = useSafeInsets();
  const summary = useProgressStore(selectSummary);
  const handleError = useApiError();

  const initialPeriod = (route.params?.period ?? 'month') as Period;
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [chartTab, setChartTab] = useState<ChartTab>('weight');

  const { opacity, start } = useFadeIn(500);
  const { anims, start: staggerStart } = useStagger(4, 80, 400);

  useEffect(() => {
    start();
    staggerStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: histData,
    loading,
    refreshing,
    refresh,
  } = useProgressHistory(period);

  const logs: ProgressLog[] = (histData as any)?.data ?? [];

  // Edge case: not enough data
  const hasData = logs.length >= 2;
  const latestLog = logs[logs.length - 1];
  const earliestLog = logs[0];

  const weightDelta = hasData
    ? parseFloat(
        ((latestLog?.weight ?? 0) - (earliestLog?.weight ?? 0)).toFixed(1),
      )
    : null;

  const bmi =
    latestLog?.weight && summary
      ? parseFloat(
          (latestLog.weight / Math.pow(/* height cm → m */ 1.7, 2)).toFixed(1),
        )
      : null;

  const tabIndicatorX = useRef(new Animated.Value(0)).current;
  const tabWidth = (rs.screenWidth - rs.scale(32)) / 3;

  const switchTab = useCallback(
    (tab: ChartTab, idx: number) => {
      setChartTab(tab);
      Animated.spring(tabIndicatorX, {
        toValue: idx * tabWidth,
        friction: 8,
        tension: 100,
        useNativeDriver: false,
      }).start();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabWidth],
  );

  const onLogWeight = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Progress',
      params: {
        screen: PROGRESS_ROUTES.LOG_WEIGHT,
      },
    });
  }, []);

  return (
    <ScreenWrapper>
      <Header
        title="Progress Charts"
        showBack
        onBack={goBack}
        rightIcon="share-variant-outline"
        onRightPress={() => {}}
      />

      <Animated.ScrollView
        style={{ opacity }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.scroll,
          { paddingBottom: insets.bottom + rs.verticalScale(32) },
        ]}
        refreshing={refreshing}
        onRefresh={refresh}
      >
        {/* ── Period selector ── */}
        <Animated.View
          style={{
            opacity: anims[0].opacity,
            transform: [{ translateY: anims[0].translateY }],
          }}
        >
          <View
            style={[s.periodRow, { backgroundColor: colors.backgroundSurface }]}
          >
            {PERIODS.map(p => {
              const isActive = period === p.value;
              return (
                <Pressable
                  key={p.value}
                  onPress={() => setPeriod(p.value)}
                  style={[
                    s.periodBtn,
                    isActive && [
                      s.periodBtnActive,
                      { backgroundColor: colors.primary },
                    ],
                  ]}
                >
                  <Text
                    style={[
                      s.periodLabel,
                      {
                        fontFamily: isActive ? fonts.Bold : fonts.Regular,
                        color: isActive ? '#FFF' : colors.textTertiary,
                      },
                    ]}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* ── Delta cards ── */}
        <Animated.View
          style={[
            s.deltaRow,
            {
              opacity: anims[1].opacity,
              transform: [{ translateY: anims[1].translateY }],
            },
          ]}
        >
          <StatDeltaCard
            label="Weight change"
            value={
              weightDelta !== null
                ? `${weightDelta > 0 ? '+' : ''}${weightDelta} kg`
                : '—'
            }
            icon="scale-bathroom"
            trend={
              weightDelta !== null
                ? weightDelta < 0
                  ? 'down'
                  : weightDelta > 0
                  ? 'up'
                  : 'neutral'
                : 'neutral'
            }
            subtitle={`Over ${
              PERIODS.find(p => p.value === period)?.days
            } days`}
            style={{ flex: 1 }}
          />
          <StatDeltaCard
            label="Logs recorded"
            value={String(logs.length)}
            icon="calendar-check-outline"
            trend="neutral"
            subtitle="Total entries"
            style={{ flex: 1 }}
          />
        </Animated.View>

        {/* ── Chart tab switcher ── */}
        <Animated.View style={{ opacity: anims[2].opacity }}>
          <View style={[s.tabRow, { borderBottomColor: colors.border }]}>
            {(['weight', 'measurements', 'bmi'] as ChartTab[]).map((tab, i) => {
              const labels = {
                weight: '⚖️ Weight',
                measurements: '📏 Measurements',
                bmi: '❤️ BMI',
              };
              const isAct = chartTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => switchTab(tab, i)}
                  style={s.tabBtn}
                >
                  <Text
                    style={[
                      s.tabBtnText,
                      {
                        color: isAct ? colors.primary : colors.textTertiary,
                        fontFamily: isAct ? fonts.SemiBold : fonts.Regular,
                      },
                    ]}
                  >
                    {labels[tab]}
                  </Text>
                </Pressable>
              );
            })}

            {/* Sliding underline */}
            <Animated.View
              style={[
                s.tabIndicator,
                {
                  backgroundColor: colors.primary,
                  width: tabWidth,
                  left: tabIndicatorX,
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* ── Chart content ── */}
        <Animated.View
          style={{
            opacity: anims[3].opacity,
            transform: [{ translateY: anims[3].translateY }],
          }}
        >
          {/* Weight chart */}
          {chartTab === 'weight' && (
            <Card style={s.chartCard}>
              <View style={s.chartHeader}>
                <Text
                  style={[
                    s.chartTitle,
                    { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  Weight over time
                </Text>
                {latestLog?.weight && (
                  <Badge
                    label={`${latestLog.weight} kg now`}
                    variant="success"
                    small
                  />
                )}
              </View>

              {loading ? (
                <Skeleton
                  height={rs.verticalScale(180)}
                  radius={rs.scale(12)}
                />
              ) : !hasData ? (
                <NoDataState
                  iconName="chart-line-variant"
                  message="Log weight at least twice to see your progress chart"
                />
              ) : (
                <WeightChart logs={logs} />
              )}

              {/* Stats below chart */}
              {hasData && !loading && (
                <View
                  style={[s.chartStats, { borderTopColor: colors.borderMuted }]}
                >
                  {[
                    {
                      label: 'Highest',
                      val: `${Math.max(...logs.map(l => l.weight))} kg`,
                      color: colors.error,
                    },
                    {
                      label: 'Lowest',
                      val: `${Math.min(...logs.map(l => l.weight))} kg`,
                      color: colors.success,
                    },
                    {
                      label: 'Average',
                      val: `${(
                        logs.reduce((s, l) => s + l.weight, 0) / logs.length
                      ).toFixed(1)} kg`,
                      color: colors.info,
                    },
                  ].map(st => (
                    <View key={st.label} style={s.chartStatItem}>
                      <Text
                        style={[
                          s.chartStatVal,
                          { color: st.color, fontFamily: fonts.Bold },
                        ]}
                      >
                        {st.val}
                      </Text>
                      <Text
                        style={[
                          s.chartStatLabel,
                          {
                            color: colors.textTertiary,
                            fontFamily: fonts.Regular,
                          },
                        ]}
                      >
                        {st.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          )}

          {/* Measurements */}
          {chartTab === 'measurements' && (
            <Card style={s.chartCard}>
              <Text
                style={[
                  s.chartTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.SemiBold,
                    marginBottom: rs.verticalScale(12),
                  },
                ]}
              >
                Latest body measurements
              </Text>
              {!latestLog ? (
                <NoDataState
                  iconName="chart-line-variant"
                  message="Log measurements to see them here"
                />
              ) : (
                <View>
                  <MeasurementRow
                    label="Chest"
                    current={latestLog.chest}
                    unit="cm"
                    icon="emoticon-outline"
                    color={colors.error}
                  />
                  <MeasurementRow
                    label="Waist"
                    current={latestLog.waist}
                    unit="cm"
                    icon="human-male"
                    color={colors.warning}
                  />
                  <MeasurementRow
                    label="Hips"
                    current={latestLog.hips}
                    unit="cm"
                    icon="human-female"
                    color="#EC4899"
                  />
                  <MeasurementRow
                    label="Arms"
                    current={latestLog.arms}
                    unit="cm"
                    icon="arm-flex-outline"
                    color="#8B5CF6"
                  />
                  <MeasurementRow
                    label="Thighs"
                    current={latestLog.thighs}
                    unit="cm"
                    icon="run-fast"
                    color="#10B981"
                  />
                  <MeasurementRow
                    label="Body fat"
                    current={latestLog.bodyFat}
                    unit="%"
                    icon="percent-outline"
                    color={colors.secondary}
                  />
                  {!latestLog.chest && !latestLog.waist && !latestLog.hips && (
                    <NoDataState
                      iconName="chart-line-variant"
                      message="No measurements recorded yet. Add them when logging weight."
                    />
                  )}
                </View>
              )}
            </Card>
          )}

          {/* BMI */}
          {chartTab === 'bmi' && (
            <Card style={s.chartCard}>
              <Text
                style={[
                  s.chartTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.SemiBold,
                    marginBottom: rs.verticalScale(16),
                  },
                ]}
              >
                Body Mass Index
              </Text>
              {!bmi ? (
                <NoDataState
                  iconName="chart-line-variant"
                  message="Log your weight to see your BMI"
                />
              ) : (
                <>
                  <BMIGauge bmi={bmi} />
                  <View
                    style={[
                      s.bmiLegend,
                      { borderTopColor: colors.borderMuted },
                    ]}
                  >
                    {[
                      {
                        range: '< 18.5',
                        label: 'Underweight',
                        color: colors.info,
                      },
                      {
                        range: '18.5-24.9',
                        label: 'Healthy',
                        color: colors.success,
                      },
                      {
                        range: '25-29.9',
                        label: 'Overweight',
                        color: colors.warning,
                      },
                      { range: '≥ 30', label: 'Obese', color: colors.error },
                    ].map(item => (
                      <View key={item.label} style={s.bmiRow}>
                        <View
                          style={[s.bmiDot, { backgroundColor: item.color }]}
                        />
                        <Text
                          style={[
                            s.bmiRange,
                            {
                              color: colors.textTertiary,
                              fontFamily: fonts.Regular,
                            },
                          ]}
                        >
                          {item.range}
                        </Text>
                        <Text
                          style={[
                            s.bmiLabel,
                            {
                              color: colors.textSecondary,
                              fontFamily: fonts.Medium,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </Card>
          )}
        </Animated.View>

        {/* Log weight CTA */}
        <Pressable
          onPress={onLogWeight}
          style={[
            s.logCta,
            {
              backgroundColor: colors.primary + '15',
              borderColor: colors.primary + '30',
            },
          ]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="plus-circle-outline"
            size={rs.scale(20)}
            color={colors.primary}
          />
          <Text
            style={[
              s.logCtaText,
              { color: colors.primary, fontFamily: fonts.SemiBold },
            ]}
          >
            Log today's weight
          </Text>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="arrow-right"
            size={rs.scale(16)}
            color={colors.primary}
          />
        </Pressable>
      </Animated.ScrollView>
    </ScreenWrapper>
  );
};

export default ProgressChartsScreen;

const s = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(12),
    gap: rs.verticalScale(16),
  },

  // Period
  periodRow: {
    flexDirection: 'row',
    borderRadius: rs.scale(14),
    padding: rs.scale(4),
    gap: rs.scale(2),
  },
  periodBtn: {
    flex: 1,
    paddingVertical: rs.verticalScale(8),
    alignItems: 'center',
    borderRadius: rs.scale(10),
  },
  periodBtnActive: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  periodLabel: { fontSize: rs.font(14) },

  // Delta
  deltaRow: { flexDirection: 'row', gap: rs.scale(12) },

  // Tabs
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, position: 'relative' },
  tabBtn: {
    flex: 1,
    paddingVertical: rs.verticalScale(12),
    alignItems: 'center',
  },
  tabBtnText: { fontSize: rs.font(12) },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    height: 2.5,
    borderRadius: 2,
  },

  // Chart
  chartCard: { padding: rs.scale(16), gap: rs.verticalScale(4) },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs.verticalScale(12),
  },
  chartTitle: { fontSize: rs.font(16) },
  chartStats: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingTop: rs.verticalScale(12),
    marginTop: rs.verticalScale(12),
  },
  chartStatItem: { flex: 1, alignItems: 'center', gap: rs.verticalScale(2) },
  chartStatVal: { fontSize: rs.font(16) },
  chartStatLabel: { fontSize: rs.font(11) },

  // BMI
  bmiLegend: {
    paddingTop: rs.verticalScale(16),
    marginTop: rs.verticalScale(16),
    borderTopWidth: 0.5,
    gap: rs.verticalScale(8),
  },
  bmiRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(10) },
  bmiDot: {
    width: rs.scale(10),
    height: rs.scale(10),
    borderRadius: rs.scale(5),
  },
  bmiRange: { width: rs.scale(70), fontSize: rs.font(13) },
  bmiLabel: { fontSize: rs.font(13) },

  // CTA
  logCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(10),
    borderWidth: 1,
    borderRadius: rs.scale(16),
    padding: rs.scale(16),
  },
  logCtaText: { flex: 1, fontSize: rs.font(15) },
});
