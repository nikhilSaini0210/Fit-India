import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '../../store';
import { rs } from '../../utils';
import Icon from './Icon';
import { fonts } from '../../constants';
import Button from './Button';
import { FC } from 'react';

interface EmptyProps {
  iconName: string;
  title: string;
  subTitle?: string;
  onPress?: () => void;
  btnTitle?: string;
  loading?: boolean;
}

export const EmptyState: FC<EmptyProps> = ({
  iconName,
  title,
  subTitle,
  onPress,
  btnTitle,
  loading = false,
}) => {
  const colors = useColors();

  return (
    <View style={s.emptyWrap}>
      <View
        style={[s.emptyIconBg, { backgroundColor: colors.backgroundSurface }]}
      >
        <Icon
          iconFamily="MaterialCommunityIcons"
          name={iconName}
          size={rs.scale(40)}
          color={colors.textTertiary}
        />
      </View>
      <Text
        style={[
          s.emptyTitle,
          { color: colors.textPrimary, fontFamily: fonts.SemiBold },
        ]}
      >
        {title}
      </Text>
      {subTitle && (
        <Text
          style={[
            s.emptySub,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          {subTitle}
        </Text>
      )}
      {onPress && btnTitle && (
        <Button
          label={btnTitle}
          onPress={onPress}
          iconRight="arrow-right"
          loading={loading}
          size="md"
          fullWidth={false}
          style={{ marginTop: rs.verticalScale(8) }}
        />
      )}
    </View>
  );
};

interface ErrorProps {
  iconName: string;
  title: string;
  onPress?: () => void;
  btnLable?: string;
}

export const ErrorState: FC<ErrorProps> = ({
  iconName,
  title,
  onPress,
  btnLable,
}) => {
  const colors = useColors();

  return (
    <View style={s.emptyWrap}>
      <Icon
        iconFamily="MaterialCommunityIcons"
        name={iconName}
        size={rs.scale(40)}
        color={colors.error}
      />
      <Text
        style={[
          s.emptyTitle,
          { color: colors.textPrimary, fontFamily: fonts.SemiBold },
        ]}
      >
        {title}
      </Text>
      {onPress && btnLable && (
        <Button
          label={btnLable}
          onPress={onPress}
          variant="ghost"
          size="md"
          fullWidth={false}
        />
      )}
    </View>
  );
};

const s = StyleSheet.create({
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rs.scale(32),
    gap: rs.verticalScale(12),
    marginTop: rs.verticalScale(80),
  },
  emptyIconBg: {
    width: rs.scale(80),
    height: rs.scale(80),
    borderRadius: rs.scale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: rs.font(20), textAlign: 'center' },
  emptySub: {
    fontSize: rs.font(14),
    textAlign: 'center',
    lineHeight: rs.font(22),
  },
});
