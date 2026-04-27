import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { FC } from 'react';
import { useColors } from '../../store';
import { fonts } from '../../constants';
import { rs } from '../../utils';

interface Props {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  header: string;
}

const ListHeader: FC<Props> = ({ style, textStyle, header }) => {
  const colors = useColors();

  return (
    <View style={[styles.listHeader, style]}>
      <Text
        style={[
          styles.headerText,
          textStyle,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {header}
      </Text>
    </View>
  );
};

export default ListHeader;

const styles = StyleSheet.create({
  listHeader: { marginBottom: rs.verticalScale(12) },
  headerText: { fontSize: rs.font(13) },
});
