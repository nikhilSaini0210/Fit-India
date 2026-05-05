import { Alert } from 'react-native';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useAuth, useSlideUp } from '../../hooks';
import {
  Divider,
  MenuItem,
  ScreenWrapper,
  Section,
  VersionFooter,
} from '../../components';

import { selectUser, useAuthStore, useColors } from '../../store';
import { navigate, rs } from '../../utils';
import { PROFILE_ROUTES, ROOT_ROUTES } from '../../constants';
import { ProfileCompletionDialogue, ProfileHeader } from './comp';
import { fields } from '../../helper';
import Animated from 'react-native-reanimated';

const ProfileScreen: FC = () => {
  const user = useAuthStore(selectUser);
  const colors = useColors();
  const { logout } = useAuth();

  const { slideStyle, start: slideStart } = useSlideUp(30, 500, 200);

  useEffect(() => {
    slideStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEdit = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Profile',
      params: {
        screen: PROFILE_ROUTES.EDIT_PROFILE,
      },
    });
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => await logout(),
      },
    ]);
  }, [logout]);

  const onNotification = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Profile',
      params: {
        screen: PROFILE_ROUTES.NOTIFICATIONS,
      },
    });
  }, []);

  const onAppSettings = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Profile',
      params: {
        screen: PROFILE_ROUTES.SETTINGS,
      },
    });
  }, []);

  const onSubscription = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Profile',
      params: {
        screen: PROFILE_ROUTES.SUBSCRIPTION,
      },
    });
  }, []);

  const filled = useMemo(
    () => fields.filter(f => (user as any)?.[f]).length,
    [user],
  );
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <ScreenWrapper scroll>
      {user && <ProfileHeader user={user} onEdit={onEdit} />}

      {pct < 100 && <ProfileCompletionDialogue pct={pct} onEdit={onEdit} />}
      <Animated.View style={slideStyle}>
        <Section title="ACCOUNT" colors={colors}>
          <MenuItem
            colors={colors}
            icon="account-edit-outline"
            label="Edit Profile"
            subtitle="Name, weight, height, goal"
            onPress={onEdit}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(62)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <MenuItem
            colors={colors}
            icon="bell-outline"
            label="Notifications"
            subtitle="WhatsApp, SMS, Push reminders"
            onPress={onNotification}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(62)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <MenuItem
            colors={colors}
            icon="lock-outline"
            label="Change Password"
            subtitle="Update your account password"
            onPress={onAppSettings}
          />
        </Section>

        {user && (
          <Section title="SUBSCRIPTION" colors={colors}>
            <MenuItem
              colors={colors}
              icon="crown-outline"
              label={user.isPremium ? 'Premium Active' : 'Upgrade to Premium'}
              subtitle={
                user.isPremium
                  ? 'Access all features'
                  : '₹199/mo · AI diet + workout + coaching'
              }
              onPress={onSubscription}
              badge={user.isPremium ? undefined : 'Upgrade'}
            />
          </Section>
        )}

        <Section title="APP" colors={colors}>
          <MenuItem
            colors={colors}
            icon="cog-outline"
            label="App Settings"
            subtitle="Theme, units, language"
            onPress={onAppSettings}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(62)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <MenuItem
            colors={colors}
            icon="help-circle-outline"
            label="Help & Support"
            subtitle="FAQs, contact us"
            onPress={() => {}}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(62)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <MenuItem
            colors={colors}
            icon="star-outline"
            label="Rate FitSutra"
            subtitle="Enjoying the app? Let us know"
            onPress={() => {}}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(62)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <MenuItem
            colors={colors}
            icon="share-variant-outline"
            label="Share App"
            subtitle="Invite friends to FitSutra"
            onPress={() => {}}
          />
        </Section>

        <Section title="ACCOUNT ACTIONS" colors={colors}>
          <MenuItem
            colors={colors}
            icon="logout"
            label="Logout"
            onPress={handleLogout}
            danger
          />
          <Divider
            height={0.5}
            marginL={rs.scale(62)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
        </Section>

        <VersionFooter style={{ marginTop: rs.verticalScale(24) }} />
      </Animated.View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
