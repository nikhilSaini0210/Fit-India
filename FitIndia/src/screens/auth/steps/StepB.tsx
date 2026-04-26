import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { Input } from '../../../components';

interface StepBProps {
  age: string;
  setAge: (age: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  height: string;
  setHeight: (height: string) => void;
}

const StepB: FC<StepBProps> = ({
  age,
  setAge,
  weight,
  setWeight,
  height,
  setHeight,
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
        Body stats 📏
      </Text>
      <Text
        style={[
          s.stepSub,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        Used to calculate your personalised nutrition targets
      </Text>
      <View style={s.row}>
        <View style={s.root}>
          <Input
            label="Age (years)"
            iconLeft="calendar-outline"
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
          />
        </View>
        <View style={s.root}>
          <Input
            label="Weight (kg)"
            iconLeft="weight"
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
      </View>
      <Input
        label="Height (cm)"
        iconLeft="human-male-height"
        keyboardType="decimal-pad"
        value={height}
        onChangeText={setHeight}
      />
    </View>
  );
};

export default StepB;

const s = StyleSheet.create({
  root: { flex: 1 },
  row: { flexDirection: 'row', gap: rs.scale(12) },
  stepContent: { paddingBottom: rs.verticalScale(20) },
  stepTitle: { fontSize: rs.font(20), marginBottom: rs.verticalScale(6) },
  stepSub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
});
