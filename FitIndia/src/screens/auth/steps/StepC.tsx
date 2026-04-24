import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { OptionGrid } from '../../../components';

interface StepCProps {
  goal: string;
  setGoal: (goal: string) => void;
  activityLevel: string;
  setActivityLevel: (level: string) => void;
}

const StepC: FC<StepCProps> = ({
  goal,
  setGoal,
  activityLevel,
  setActivityLevel,
}) => {
  const colors = useColors();

  return (
    <View style={s.stepContent}>
      <Text
        style={[
          s.stepTitle,
          { color: colors.textPrimary, fontFamily: fonts.Bold },
        ]}
      >
        What's your goal? 🎯
      </Text>
      <Text
        style={[
          s.stepSub,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        We'll build your plan around this
      </Text>
      <OptionGrid
        options={[
          {
            value: 'weight_loss',
            label: 'Lose weight',
            icon: '🔥',
            desc: 'Burn fat, feel lighter',
          },
          {
            value: 'weight_gain',
            label: 'Gain weight',
            icon: '⬆️',
            desc: 'Healthy bulk up',
          },
          {
            value: 'muscle_gain',
            label: 'Build muscle',
            icon: '💪',
            desc: 'Lean and strong',
          },
          {
            value: 'maintenance',
            label: 'Stay fit',
            icon: '⚖️',
            desc: 'Maintain current shape',
          },
        ]}
        selected={goal}
        onSelect={setGoal}
        columns={2}
      />
      <Text
        style={[
          s.stepTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.Bold,
            marginTop: rs.verticalScale(20),
          },
        ]}
      >
        Activity level
      </Text>
      <OptionGrid
        options={[
          {
            value: 'sedentary',
            label: 'Sedentary',
            icon: '🛋️',
            desc: 'Desk job, little exercise',
          },
          {
            value: 'light',
            label: 'Light',
            icon: '🚶',
            desc: '1-3 days/week',
          },
          {
            value: 'moderate',
            label: 'Moderate',
            icon: '🏃',
            desc: '3-5 days/week',
          },
          {
            value: 'active',
            label: 'Active',
            icon: '⚡',
            desc: '6-7 days/week',
          },
        ]}
        selected={activityLevel}
        onSelect={setActivityLevel}
        columns={2}
      />
    </View>
  );
};

export default StepC;

const s = StyleSheet.create({
  stepContent: { paddingBottom: rs.verticalScale(20) },
  stepTitle: { fontSize: rs.font(20), marginBottom: rs.verticalScale(6) },
  stepSub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
});
