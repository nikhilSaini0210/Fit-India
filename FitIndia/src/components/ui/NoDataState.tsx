import { StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { rs } from '../../utils';
import { useColors } from '../../store';
import Icon from './Icon';
import { fonts } from '../../constants';

interface Props {
  iconName: string;
  message: string;
}

const NoDataState: FC<Props> = ({ iconName, message }) => {
  const colors = useColors();

  return (
    <View style={ns.wrap}>
      <Icon
        iconFamily="MaterialCommunityIcons"
        name={iconName}
        size={rs.scale(36)}
        color={colors.textTertiary}
      />
      <Text
        style={[
          ns.text,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {message}
      </Text>
    </View>
  );
};

export default NoDataState;

const ns = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: rs.verticalScale(32),
    gap: rs.verticalScale(10),
  },
  text: { fontSize: rs.font(13), textAlign: 'center', lineHeight: rs.font(20) },
});
