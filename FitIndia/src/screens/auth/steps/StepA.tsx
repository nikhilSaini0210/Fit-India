import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../../store';
import { fonts } from '../../../constants';
import { rs } from '../../../utils';
import { Input, OptionGrid } from '../../../components';

interface StepAProps {
  name: string;
  setName: (name: string) => void;
  gender: string;
  setGender: (gender: string) => void;
}

const StepA: FC<StepAProps> = ({ name, setName, gender, setGender }) => {
  const colors = useColors();

  return (
    <View style={s.stepContent}>
      <Text
        style={[
          s.stepTitle,
          { color: colors.textPrimary, fontFamily: fonts.Bold },
        ]}
      >
        What should we call you? 👋
      </Text>
      <Text
        style={[
          s.stepSub,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        Your name helps us personalise your experience
      </Text>
      <Input
        label="Your name"
        iconLeft="account-outline"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <Text
        style={[
          s.stepTitle,
          {
            color: colors.textPrimary,
            fontFamily: fonts.Bold,
            marginTop: rs.verticalScale(16),
          },
        ]}
      >
        Your gender
      </Text>
      <OptionGrid
        options={[
          { value: 'male', label: 'Male', icon: '👨', desc: 'He/Him' },
          {
            value: 'female',
            label: 'Female',
            icon: '👩',
            desc: 'She/Her',
          },
          {
            value: 'other',
            label: 'Other',
            icon: '🧑',
            desc: 'They/Them',
          },
        ]}
        selected={gender}
        onSelect={setGender}
        columns={3}
      />
    </View>
  );
};

export default StepA;

const s = StyleSheet.create({
  stepContent: { paddingBottom: rs.verticalScale(20) },
  stepTitle: { fontSize: rs.font(20), marginBottom: rs.verticalScale(6) },
  stepSub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
});
