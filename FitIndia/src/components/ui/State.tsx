import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '../../store';
import { rs } from '../../utils';
import Icon from './Icon';
import { fonts } from '../../constants';
import Button from './Button';
import { FC } from 'react';

interface EmptyProps {
  iconName: string;
  title?: string;
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
      {title && (
        <Text
          style={[
            s.emptyTitle,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
        >
          {title}
        </Text>
      )}
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

interface NoPlanStateProps {
  icon: string;
  message: string;
  action: string;
  onAction: () => void;
  colors: ReturnType<typeof useColors>;
  horizontal?: boolean;
}

export const NoPlanState: FC<NoPlanStateProps> = ({
  icon,
  message,
  action,
  onAction,
  colors,
  horizontal = false,
}) => (
  <View style={[np.wrap, horizontal && { flexDirection: 'row' }]}>
    <Icon
      iconFamily="MaterialCommunityIcons"
      name={icon}
      size={rs.scale(28)}
      color={colors.textTertiary}
    />
    <View style={horizontal ? { flex: 1 } : { alignItems: 'center' }}>
      <Text
        style={[
          np.message,
          {
            color: colors.textTertiary,
            fontFamily: fonts.Regular,
            textAlign: horizontal ? 'left' : 'center',
          },
        ]}
      >
        {message}
      </Text>
    </View>
    <Pressable
      onPress={onAction}
      style={[
        np.btn,
        {
          backgroundColor: colors.primary + '15',
          borderColor: colors.primary + '30',
        },
      ]}
    >
      <Text
        style={[
          np.btnText,
          { color: colors.primary, fontFamily: fonts.SemiBold },
        ]}
      >
        {action}
      </Text>
      <Icon
        iconFamily="MaterialCommunityIcons"
        name="arrow-right"
        size={rs.scale(12)}
        color={colors.primary}
      />
    </Pressable>
  </View>
);
const np = StyleSheet.create({
  wrap: { alignItems: 'center', gap: rs.scale(10), padding: rs.scale(8) },
  message: { fontSize: rs.font(13) },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rs.scale(4),
    borderWidth: 1,
    borderRadius: rs.scale(20),
    paddingHorizontal: rs.scale(14),
    paddingVertical: rs.verticalScale(6),
  },
  btnText: { fontSize: rs.font(13) },
});
