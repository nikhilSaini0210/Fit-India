import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { OptionGrid } from '../../../components';
import { fonts } from '../../../constants';
import { useColors } from '../../../store';

interface StepDProps {
  dietType: string;
  setDietType: (dietType: string) => void;
}

const StepD: FC<StepDProps> = ({ dietType, setDietType }) => {
  const colors = useColors();

  return (
    <View style={s.stepContent}>
      <Text
        style={[
          s.stepTitle,
          { color: colors.textPrimary, fontFamily: fonts.Bold },
        ]}
      >
        Your diet preference 🍽️
      </Text>
      <Text
        style={[
          s.stepSub,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        All plans use authentic Indian ingredients
      </Text>
      <OptionGrid
        options={[
          {
            value: 'veg',
            label: 'Vegetarian',
            icon: '🥦',
            desc: 'No meat, eggs ok',
          },
          {
            value: 'non_veg',
            label: 'Non-Veg',
            icon: '🍗',
            desc: 'Includes meat & eggs',
          },
          {
            value: 'jain',
            label: 'Jain',
            icon: '🌿',
            desc: 'No root vegetables',
          },
          {
            value: 'vegan',
            label: 'Vegan',
            icon: '🌱',
            desc: 'No animal products',
          },
        ]}
        selected={dietType}
        onSelect={setDietType}
        columns={2}
      />
    </View>
  );
};

export default StepD;

const s = StyleSheet.create({
  stepContent: { paddingBottom: rs.verticalScale(20) },
  stepTitle: { fontSize: rs.font(20), marginBottom: rs.verticalScale(6) },
  stepSub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
});
