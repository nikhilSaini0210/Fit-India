import React, { FC } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { useColors } from '../../store/appStore';
import { fonts } from '../../constants/fonts';
import { goBack, rs, useSafeInsets } from '../../utils';
import Icon from './Icon';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  rightLabel?: string;
  transparent?: boolean;
  style?: ViewStyle;
}

const Header: FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightIcon,
  onRightPress,
  rightLabel,
  transparent = false,
  style,
}) => {
  const colors = useColors();
  const insets = useSafeInsets();

  const handleBack = onBack ?? (() => goBack());

  const rootStyle = {
    paddingTop: insets.top + rs.verticalScale(8),
    backgroundColor: transparent ? 'transparent' : colors.background,
    borderBottomColor: transparent ? 'transparent' : colors.borderMuted,
  };

  return (
    <View style={[s.root, rootStyle, style]}>
      <View style={s.left}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={[s.iconBtn, { backgroundColor: colors.backgroundSurface }]}
            android_ripple={{ color: colors.primary + '20', borderless: true }}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="arrow-left"
              size={rs.scale(20)}
              color={colors.textPrimary}
            />
          </Pressable>
        )}
      </View>

      <View style={s.center}>
        <Text
          style={[
            s.title,
            { color: colors.textPrimary, fontFamily: fonts.SemiBold },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              s.subtitle,
              { color: colors.textTertiary, fontFamily: fonts.Regular },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={s.right}>
        {(rightIcon || rightLabel) && (
          <Pressable
            onPress={onRightPress}
            hitSlop={12}
            style={({ pressed }) => [
              s.actionBtn,
              {
                backgroundColor: colors.backgroundSurface,
                opacity: pressed ? 0.5 : 1,
              },
            ]}
          >
            {rightIcon ? (
              <Icon
                iconFamily="MaterialCommunityIcons"
                name={rightIcon}
                size={rs.scale(20)}
                color={colors.primary}
              />
            ) : (
              <Text
                numberOfLines={1}
                style={[
                  s.rightLabel,
                  { color: colors.primary, fontFamily: fonts.SemiBold },
                ]}
              >
                {rightLabel}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default Header;

const s = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(12),
    borderBottomWidth: 0.5,
  },
  left: {
    width: rs.scale(44),
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    minWidth: rs.scale(44),
    alignItems: 'flex-end',
  },
  title: {
    fontSize: rs.font(17),
  },
  subtitle: {
    fontSize: rs.font(12),
    marginTop: rs.verticalScale(1),
  },
  iconBtn: {
    width: rs.scale(36),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    justifyContent: 'center',
  },
  actionBtn: {
    paddingHorizontal: rs.scale(10),
    height: rs.scale(36),
    borderRadius: rs.scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightLabel: {
    fontSize: rs.font(14),
    includeFontPadding: false,
  },
});
