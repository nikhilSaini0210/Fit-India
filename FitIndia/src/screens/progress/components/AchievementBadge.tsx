import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect } from 'react';
import { AchievementBadgeProps } from '../../../helper';
import { rs } from '../../../utils';
import { useColors } from '../../../store';
import { useScalePop } from '../../../hooks';
import { Icon } from '../../../components';
import { fonts } from '../../../constants';

const AchievementBadge: FC<AchievementBadgeProps> = ({
  icon,
  name,
  description,
  unlocked,
  color,
  unlockedAt,
}) => {
  const colors = useColors();
  const { scale, start } = useScalePop(400);

  useEffect(() => {
    if (unlocked) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const dynamicStyle = {
    backgroundColor: unlocked
      ? colors.backgroundCard
      : colors.backgroundSurface,
    borderColor: unlocked ? color + '40' : colors.borderMuted,
    transform: [{ scale }],
    opacity: unlocked ? 1 : 0.45,
  };

  return (
    <Animated.View style={[styles.wrap, dynamicStyle]}>
      <View
        style={[
          styles.iconBg,
          { backgroundColor: unlocked ? color + '20' : colors.backgroundMuted },
        ]}
      >
        <Text style={{ fontSize: rs.scale(26) }}>{icon}</Text>
        {unlocked && (
          <View style={[styles.checkBadge, { backgroundColor: color }]}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="check"
              size={rs.scale(9)}
              color={colors.white}
            />
          </View>
        )}
      </View>
      <Text
        style={[
          styles.name,
          {
            color: unlocked ? colors.textPrimary : colors.textTertiary,
            fontFamily: fonts.SemiBold,
          },
        ]}
      >
        {name}
      </Text>
      <Text
        style={[
          styles.desc,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
        numberOfLines={2}
      >
        {description}
      </Text>
      {unlocked && unlockedAt && (
        <Text style={[styles.date, { color: color, fontFamily: fonts.Medium }]}>
          ✓{' '}
          {new Date(unlockedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>
      )}
    </Animated.View>
  );
};

export default AchievementBadge;

const styles = StyleSheet.create({
  wrap: {
    width: (rs.screenWidth - rs.scale(48)) / 2,
    borderRadius: rs.scale(16),
    borderWidth: 1.5,
    padding: rs.scale(14),
    alignItems: 'center',
    gap: rs.verticalScale(6),
    position: 'relative',
  },
  iconBg: {
    width: rs.scale(56),
    height: rs.scale(56),
    borderRadius: rs.scale(16),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: rs.verticalScale(2),
  },
  checkBadge: {
    position: 'absolute',
    bottom: -rs.scale(3),
    right: -rs.scale(3),
    width: rs.scale(18),
    height: rs.scale(18),
    borderRadius: rs.scale(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: rs.font(13), textAlign: 'center' },
  desc: { fontSize: rs.font(11), textAlign: 'center', lineHeight: rs.font(16) },
  date: { fontSize: rs.font(10) },
});
