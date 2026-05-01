import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../../utils';
import { fonts } from '../../../constants';
import { universalStyles } from '../../../components';

interface Props {
  exercise: any;
  index: number;
  color: string;
  colors: any;
}

const ExerciseRow: FC<Props> = ({ exercise, index, color, colors }) => {
  return (
    <View style={[ex.row, { borderBottomColor: colors.borderMuted }]}>
      <View style={[ex.num, { backgroundColor: color + '18' }]}>
        <Text style={[ex.numText, { color, fontFamily: fonts.Bold }]}>
          {index + 1}
        </Text>
      </View>
      <View style={universalStyles.flex}>
        <Text
          style={[
            ex.name,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
        >
          {exercise.exercise}
        </Text>
        <Text
          style={[
            ex.detail,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {exercise.sets && exercise.reps
            ? `${exercise.sets} sets × ${exercise.reps}`
            : exercise.duration ?? ''}
          {exercise.rest ? ` · ${exercise.rest}s rest` : ''}
        </Text>
      </View>
      {exercise.muscle && (
        <View style={[ex.muscle, { backgroundColor: color + '12' }]}>
          <Text style={[ex.muscleText, { color, fontFamily: fonts.Medium }]}>
            {exercise.muscle}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ExerciseRow;

const ex = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(12),
    paddingVertical: rs.verticalScale(10),
    borderBottomWidth: 0.5,
  },
  num: {
    width: rs.scale(28),
    height: rs.scale(28),
    borderRadius: rs.scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: { fontSize: rs.font(13) },
  name: { fontSize: rs.font(14) },
  detail: { fontSize: rs.font(12), marginTop: rs.verticalScale(1) },
  muscle: {
    paddingHorizontal: rs.scale(8),
    paddingVertical: rs.verticalScale(3),
    borderRadius: rs.scale(6),
  },
  muscleText: { fontSize: rs.font(11) },
});
