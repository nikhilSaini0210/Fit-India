import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { DietPlan } from '../../../types';
import { useColors } from '../../../store';
import { formatDate, rs } from '../../../utils';
import { fonts } from '../../../constants';
import { Badge, Icon } from '../../../components';
import { DIET_LABELS, GOAL_LABELS } from '../../../helper';

interface Props {
  plan: DietPlan;
  onView: () => void;
}

const PlanCard: FC<Props> = ({ plan, onView }) => {
  const colors = useColors();
  const isActive = plan.isActive;
  const byAI = plan.generatedBy === 'ai';

  const avgCal = plan.days?.length
    ? Math.round(
        plan.days.reduce((s, d) => s + (d.totalCalories ?? 0), 0) /
          plan.days.length,
      )
    : plan.targetCalories;

  const dynamicStyles = {
    backgroundColor: colors.backgroundCard,
    borderColor: isActive ? colors.primary : colors.border,
    borderWidth: isActive ? 2 : 1,
  };

  return (
    <Pressable
      onPress={onView}
      android_ripple={{ color: colors.primary + '12' }}
      style={[s.planCard, dynamicStyles]}
    >
      {/* Top row */}
      <View style={s.planTop}>
        <View style={s.planIconWrap}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="food-apple-outline"
            size={rs.scale(22)}
            color={colors.primary}
          />
        </View>
        <View style={s.planMeta}>
          <Text
            style={[
              s.planTitle,
              { color: colors.textPrimary, fontFamily: fonts.SemiBold },
            ]}
          >
            {plan.totalDays}-Day Plan
          </Text>
          <Text
            style={[
              s.planDate,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            {formatDate(plan.startDate)} — {formatDate(plan.endDate)}
          </Text>
        </View>
        {isActive && (
          <View style={[s.activeDot, { backgroundColor: colors.success }]} />
        )}
      </View>

      {/* Stats row */}
      <View style={[s.statsRow, { borderTopColor: colors.borderMuted }]}>
        <View style={s.statItem}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="fire"
            size={rs.scale(14)}
            color={colors.secondary}
          />
          <Text
            style={[
              s.statVal,
              { color: colors.textPrimary, fontFamily: fonts.SemiBold },
            ]}
          >
            {avgCal}
          </Text>
          <Text
            style={[
              s.statLabel,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            avg kcal/day
          </Text>
        </View>
        <View
          style={[s.statDivider, { backgroundColor: colors.borderMuted }]}
        />
        <View style={s.statItem}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="dumbbell"
            size={rs.scale(14)}
            color="#10B981"
          />
          <Text
            style={[
              s.statVal,
              { color: colors.textPrimary, fontFamily: fonts.SemiBold },
            ]}
          >
            {plan.targetProtein}g
          </Text>
          <Text
            style={[
              s.statLabel,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            protein/day
          </Text>
        </View>
        <View
          style={[s.statDivider, { backgroundColor: colors.borderMuted }]}
        />
        <View style={s.statItem}>
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="calendar-check-outline"
            size={rs.scale(14)}
            color={colors.info}
          />
          <Text
            style={[
              s.statVal,
              { color: colors.textPrimary, fontFamily: fonts.SemiBold },
            ]}
          >
            {plan.totalDays}
          </Text>
          <Text
            style={[
              s.statLabel,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            days
          </Text>
        </View>
      </View>

      {/* Badge row */}
      <View style={s.badgeRow}>
        {isActive && <Badge label="Active" variant="success" small />}
        {byAI && (
          <Badge label="AI Generated" variant="info" small icon="brain" />
        )}
        {plan.dietType && (
          <Badge
            label={DIET_LABELS[plan.dietType] ?? plan.dietType}
            variant="default"
            small
          />
        )}
        {plan.goal && (
          <Badge
            label={GOAL_LABELS[plan.goal] ?? plan.goal}
            variant="default"
            small
          />
        )}
      </View>

      <View style={s.arrowWrap}>
        <Text
          style={[
            s.viewText,
            { color: colors.primary, fontFamily: fonts.Medium },
          ]}
        >
          View plan
        </Text>
        <Icon
          iconFamily="MaterialCommunityIcons"
          name="arrow-right"
          size={rs.scale(14)}
          color={colors.primary}
        />
      </View>
    </Pressable>
  );
};

export default PlanCard;

const s = StyleSheet.create({
  planCard: {
    borderRadius: rs.scale(16),
    marginBottom: rs.verticalScale(12),
    overflow: 'hidden',
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    padding: rs.scale(14),
    paddingBottom: rs.verticalScale(10),
  },
  planIconWrap: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    backgroundColor: '#22C55E15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planMeta: { flex: 1 },
  planTitle: { fontSize: rs.font(16) },
  planDate: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
  activeDot: {
    width: rs.scale(8),
    height: rs.scale(8),
    borderRadius: rs.scale(4),
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    paddingVertical: rs.verticalScale(10),
    paddingHorizontal: rs.scale(14),
  },
  statItem: { flex: 1, alignItems: 'center', gap: rs.verticalScale(2) },
  statVal: { fontSize: rs.font(15) },
  statLabel: { fontSize: rs.font(10) },
  statDivider: { width: 0.5 },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs.scale(6),
    paddingHorizontal: rs.scale(14),
    paddingBottom: rs.verticalScale(4),
  },
  arrowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: rs.scale(4),
    paddingHorizontal: rs.scale(14),
    paddingBottom: rs.verticalScale(12),
  },
  viewText: { fontSize: rs.font(13) },
});
