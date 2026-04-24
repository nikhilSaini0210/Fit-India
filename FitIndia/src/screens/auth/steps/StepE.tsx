import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../../store';
import { rs } from '../../../utils';
import { OptionGrid } from '../../../components';
import { fonts } from '../../../constants';

interface StepEProps {
  fitnessLevel: string;
  setFitnessLevel: (level: string) => void;
  workoutType: string;
  setWorkoutType: (type: string) => void;
}

const StepE: FC<StepEProps> = ({
  fitnessLevel,
  setFitnessLevel,
  workoutType,
  setWorkoutType,
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
        Fitness level & preference 🏋️
      </Text>
      <Text
        style={[
          s.stepSub,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        We'll match workout intensity to your level
      </Text>
      <OptionGrid
        options={[
          {
            value: 'beginner',
            label: 'Beginner',
            icon: '🌱',
            desc: 'Just getting started',
          },
          {
            value: 'intermediate',
            label: 'Intermediate',
            icon: '🔥',
            desc: 'Some experience',
          },
          {
            value: 'advanced',
            label: 'Advanced',
            icon: '⚡',
            desc: 'Serious athlete',
          },
        ]}
        selected={fitnessLevel}
        onSelect={setFitnessLevel}
        columns={3}
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
        Where do you work out?
      </Text>
      <OptionGrid
        options={[
          {
            value: 'home',
            label: 'Home',
            icon: '🏠',
            desc: 'Bodyweight & minimal equipment',
          },
          {
            value: 'gym',
            label: 'Gym',
            icon: '🏋️',
            desc: 'Full gym equipment',
          },
        ]}
        selected={workoutType}
        onSelect={setWorkoutType}
        columns={2}
      />
    </View>
  );
};

export default StepE;

const s = StyleSheet.create({
  stepContent: { paddingBottom: rs.verticalScale(20) },
  stepTitle: { fontSize: rs.font(20), marginBottom: rs.verticalScale(6) },
  stepSub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
});
