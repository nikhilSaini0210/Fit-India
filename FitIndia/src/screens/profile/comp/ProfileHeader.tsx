import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { FC, useEffect, useRef } from 'react';
import { useColors } from '../../../store';
import { rs, useSafeInsets } from '../../../utils';
import { fonts } from '../../../constants';
import { Badge, Icon } from '../../../components';
import { User } from '../../../types';
import LinearGradient from 'react-native-linear-gradient';
import { dietLabels, goalLabels } from '../../../helper';

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}



const ProfileHeader: FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  const colors = useColors();
  const insets = useSafeInsets();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const bmi =
    user.weight && user.height
      ? (user.weight / (user.height / 100) ** 2).toFixed(1)
      : null;

  useEffect(() => {
    const anim = Animated.spring(headerAnim, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    });

    anim.start();
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{ transform: [{ scale: headerAnim }], opacity: headerAnim }}
    >
      <LinearGradient
        colors={[colors.primary + 'CC', colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          s.headerCard,
          { paddingTop: insets.top + rs.verticalScale(20) },
        ]}
      >
        <Pressable onPress={onEdit} style={s.avatarWrap}>
          <LinearGradient
            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
            style={s.avatarBg}
          >
            <Text style={s.avatarInitial}>
              {user.name?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </LinearGradient>
          <View style={[s.editBadge, { backgroundColor: colors.secondary }]}>
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="pencil"
              size={rs.scale(10)}
              color={colors.white}
            />
          </View>
        </Pressable>

        <Text style={[s.name, { fontFamily: fonts.Bold }]}>{user.name}</Text>
        <Text style={[s.email, { fontFamily: fonts.Regular }]}>
          {user.email}
        </Text>

        <View style={s.planRow}>
          {user.isPremium ? (
            <Badge label="⭐ Premium" variant="premium" style={s.planBadge} />
          ) : (
            <Badge label="Free Plan" variant="default" style={s.planBadge} />
          )}
          {user.goal && (
            <Badge
              label={goalLabels[user.goal] ?? user.goal}
              variant="success"
              style={s.planBadge}
            />
          )}
          {user.dietType && (
            <Badge
              label={dietLabels[user.dietType] ?? user.dietType}
              style={[
                s.planBadge,
                { backgroundColor: 'rgba(255,255,255,0.2)' },
              ]}
            />
          )}
        </View>

        <View style={s.statsRow}>
          {[
            { label: 'Weight', value: user.weight ? `${user.weight} kg` : '—' },
            { label: 'Height', value: user.height ? `${user.height} cm` : '—' },
            { label: 'BMI', value: bmi ?? '—' },
            { label: 'Age', value: user.age ? `${user.age} yrs` : '—' },
          ].map(stat => (
            <View key={stat.label} style={s.statItem}>
              <Text style={[s.statVal, { fontFamily: fonts.Bold }]}>
                {stat.value}
              </Text>
              <Text style={[s.statLbl, { fontFamily: fonts.Regular }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default ProfileHeader;

const s = StyleSheet.create({
  headerCard: {
    paddingHorizontal: rs.scale(20),
    paddingBottom: rs.verticalScale(24),
    alignItems: 'center',
    gap: rs.verticalScale(8),
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: rs.verticalScale(4),
  },
  avatarBg: {
    width: rs.scale(80),
    height: rs.scale(80),
    borderRadius: rs.scale(40),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarInitial: {
    fontSize: rs.font(32),
    color: '#FFF',
    fontFamily: fonts.Bold,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: rs.scale(22),
    height: rs.scale(22),
    borderRadius: rs.scale(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  name: {
    fontSize: rs.font(20),
    color: '#FFF',
  },
  email: {
    fontSize: rs.font(13),
    color: 'rgba(255,255,255,0.7)',
  },
  planRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs.scale(6),
    justifyContent: 'center',
    marginTop: rs.verticalScale(4),
  },
  planBadge: {},
  statsRow: {
    flexDirection: 'row',
    gap: rs.scale(1),
    marginTop: rs.verticalScale(12),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: rs.scale(14),
    overflow: 'hidden',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rs.verticalScale(10),
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.15)',
  },
  statVal: {
    fontSize: rs.font(14),
    color: '#FFF',
  },
  statLbl: {
    fontSize: rs.font(10),
    color: 'rgba(255,255,255,0.6)',
    marginTop: rs.verticalScale(2),
  },
});
