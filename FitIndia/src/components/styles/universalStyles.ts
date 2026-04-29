import { StyleSheet } from 'react-native';
import { rs } from '../../utils';

export const universalStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  paddingTop: {
    paddingTop: rs.verticalScale(52),
  },
  flexEnd: {
    alignSelf: 'flex-end',
  },
  borderWidthOne: { borderWidth: 1 },
  textCenter: {
    textAlign: 'center',
  },
  absolute: {
    position: 'absolute',
  },
  topZero: {
    top: 0,
  },
});
