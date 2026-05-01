import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect } from 'react';
import { useStagger, useStreak } from '../../hooks';
import {
  selectLatestLog,
  selectStreak,
  selectSummary,
  selectUser,
  useAuthStore,
  useColors,
  useProgressStore,
} from '../../store';
import { goBack, rs, useSafeInsets } from '../../utils';
import { AchievementBadgeProps, getAchievements } from '../../helper';
import {
  Badge,
  Card,
  Header,
  Icon,
  ScreenWrapper,
  Skeleton,
  universalStyles,
} from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { fonts } from '../../constants';
import { AchievementBadge, StreakCalendar, StreakRing } from './components';

const StreakBadgesScreen: FC = () => {
  const colors = useColors();
  const insets = useSafeInsets();
  const user = useAuthStore(selectUser);
  const streak = useProgressStore(selectStreak);
  const summary = useProgressStore(selectSummary);
  const latestLog = useProgressStore(selectLatestLog);
  const { loading } = useStreak();
  const { anims, start } = useStagger(5, 90, 450);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalLogs = summary?.totalLogs ?? 0;
  const current = streak.current;
  const longest = streak.longest;
  const goalMet = !!(
    user?.goal &&
    summary?.weightTrend === 'loss' &&
    user.goal === 'weight_loss'
  );

  const achievements: AchievementBadgeProps[] = getAchievements({
    totalLogs,
    longest,
    goalMet,
    colors,
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <ScreenWrapper>
      <Header title="Streaks & Badges" showBack onBack={goBack} />

      <ScreenWrapper
        scroll
        contentStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + rs.verticalScale(32) },
        ]}
      >
        <Animated.View
          style={{
            opacity: anims[0].opacity,
            transform: [{ translateY: anims[0].translateY }],
          }}
        >
          <LinearGradient
            colors={[colors.primary + '18', colors.background]}
            style={styles.hero}
          >
            {loading ? (
              <Skeleton
                width={rs.scale(160)}
                height={rs.scale(160)}
                radius={rs.scale(80)}
              />
            ) : (
              <StreakRing current={current} longest={longest} />
            )}

            <Text
              style={[
                styles.motivText,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              {current === 0
                ? 'Log today to start your streak! 🚀'
                : current === 1
                ? 'Day 1 — great start! 💪 Log tomorrow to build momentum.'
                : current < 7
                ? `${current} days in a row! Keep going 🔥`
                : current < 30
                ? `🔥 ${current} day streak! You're on fire!`
                : `🏆 ${current} days! You're unstoppable!`}
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[1].opacity,
            transform: [{ translateY: anims[1].translateY }],
          }}
        >
          <Card style={styles.statsCard}>
            {[
              {
                icon: 'fire',
                color: '#F97316',
                label: 'Current streak',
                val: `${current} days`,
              },
              {
                icon: 'trophy-outline',
                color: colors.warning,
                label: 'Best streak',
                val: `${longest} days`,
              },
              {
                icon: 'calendar-check',
                color: colors.success,
                label: 'Total logs',
                val: `${totalLogs}`,
              },
              {
                icon: 'weight-lifter',
                color: '#8B5CF6',
                label: 'Goal',
                val: user?.goal?.replace('_', ' ') ?? '—',
              },
            ].map((item, i) => (
              <View
                key={i}
                style={[
                  styles.statRow,
                  i > 0 && {
                    borderTopWidth: 0.5,
                    borderTopColor: colors.borderMuted,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statIcon,
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
                    styles.statLabel,
                    { color: colors.textSecondary, fontFamily: fonts.Medium },
                  ]}
                >
                  {item.label}
                </Text>
                <Text
                  style={[
                    styles.statVal,
                    { color: colors.textPrimary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  {item.val}
                </Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[2].opacity,
            transform: [{ translateY: anims[2].translateY }],
          }}
        >
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.textTertiary, fontFamily: fonts.SemiBold },
            ]}
          >
            ACTIVITY CALENDAR
          </Text>
          {/* {latestLog && (
            <Card style={styles.calendarCard}>
              <StreakCalendar logs={latestLog} />
            </Card>
          )} */}
        </Animated.View>

        <Animated.View
          style={{
            opacity: anims[3].opacity,
            transform: [{ translateY: anims[3].translateY }],
          }}
        >
          <View style={styles.badgesHeader}>
            <Text
              style={[
                styles.sectionLabel,
                { color: colors.textTertiary, fontFamily: fonts.SemiBold },
              ]}
            >
              ACHIEVEMENTS
            </Text>
            <Badge
              label={`${unlockedCount}/${achievements.length}`}
              variant={
                unlockedCount === achievements.length ? 'premium' : 'default'
              }
              small
            />
          </View>
          <View style={styles.badgesGrid}>
            {achievements.map((a, i) => (
              <AchievementBadge key={i} {...a} />
            ))}
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: anims[4].opacity }}>
          <Card
            gradient
            gradientColors={[colors.primary + '20', colors.primary + '08']}
            style={styles.tipCard}
          >
            <View style={styles.tipRow}>
              <Text style={{ fontSize: rs.scale(20) }}>💡</Text>
              <View style={universalStyles.flex}>
                <Text
                  style={[
                    styles.tipTitle,
                    { color: colors.primary, fontFamily: fonts.SemiBold },
                  ]}
                >
                  Pro tip
                </Text>
                <Text
                  style={[
                    styles.tipText,
                    { color: colors.textSecondary, fontFamily: fonts.Regular },
                  ]}
                >
                  Log your weight at the same time each morning for the most
                  accurate trends. Consistency matters more than perfection.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default StreakBadgesScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(12),
    gap: rs.verticalScale(16),
  },
  hero: {
    borderRadius: rs.scale(20),
    padding: rs.scale(24),
    alignItems: 'center',
    gap: rs.verticalScale(16),
  },
  motivText: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
  statsCard: { padding: 0, overflow: 'hidden' },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    padding: rs.scale(14),
  },
  statIcon: {
    width: rs.scale(34),
    height: rs.scale(34),
    borderRadius: rs.scale(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { flex: 1, fontSize: rs.font(14) },
  statVal: { fontSize: rs.font(15), textTransform: 'capitalize' },
  sectionLabel: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginBottom: rs.verticalScale(8),
  },
  calendarCard: { padding: rs.scale(12) },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs.verticalScale(8),
  },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rs.scale(12) },
  tipCard: { marginTop: rs.verticalScale(4), elevation: 0 },
  tipRow: { flexDirection: 'row', gap: rs.scale(12), alignItems: 'flex-start' },
  tipTitle: { fontSize: rs.font(14), marginBottom: rs.verticalScale(4) },
  tipText: { fontSize: rs.font(13), lineHeight: rs.font(20) },
});
