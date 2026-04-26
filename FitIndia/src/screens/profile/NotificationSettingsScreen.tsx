import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import { selectUser, useAuthStore, useColors } from '../../store';
import { useApiError, useProfile } from '../../hooks';
import { User } from '../../types';
import { goBack, navigate, rs } from '../../utils';
import { fonts, PROFILE_ROUTES, ROOT_ROUTES } from '../../constants';
import { useToast } from '../../context';
import { pushApi } from '../../services/api';
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  ScreenWrapper,
  ToggleRow,
  universalStyles,
} from '../../components';

type Notifs = NonNullable<User['notifications']>;

const NotificationSettingsScreen:FC = () => {
  const colors = useColors();
  const user = useAuthStore(selectUser);
  const toast = useToast();
  const { updateNotifications, loading } = useProfile();
  const handleError = useApiError();
  const [testLoading, setTestLoading] = useState(false);

  const defaults: Notifs = {
    whatsapp: false,
    sms: false,
    morning: true,
    afternoon: true,
    evening: true,
  };

  const [notifs, setNotifs] = useState<Notifs>({
    ...defaults,
    ...user?.notifications,
  });

  // Edge case: no phone number set
  const hasPhone = !!user?.phone;

  const toggle = useCallback(
    (key: keyof Notifs) => (val: boolean) => {
      setNotifs(prev => ({ ...prev, [key]: val }));
    },
    [],
  );

  const onEdit = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Profile',
      params: {
        screen: PROFILE_ROUTES.EDIT_PROFILE,
      },
    });
  }, []);

  const save = useCallback(async () => {
    if ((notifs.whatsapp || notifs.sms) && !hasPhone) {
      Alert.alert(
        'Phone number required',
        'Add a phone number in Edit Profile to enable WhatsApp or SMS reminders.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add phone',
            onPress: onEdit,
          },
        ],
      );
      return;
    }
    const result = await updateNotifications(notifs);
    if (result.ok) {
      toast({
        type: 'success',
        title: 'Notifications Updated',
        message:
          result.msg ||
          'Your notification preferences have been saved successfully.',
      });
      goBack();
    } else {
      handleError({
        code: result?.code ?? 'UNKNOWN',
        message: result.error ?? 'Failed to update notification preferences.',
        isAppError: true,
      });
    }
  }, [handleError, hasPhone, notifs, onEdit, toast, updateNotifications]);

  const sendTest = async () => {
    setTestLoading(true);
    try {
      await pushApi.sendTest({ type: 'morning' });
      Alert.alert(
        'Test sent!',
        'Check your WhatsApp, SMS or push notification.',
      );
    } catch {
      Alert.alert(
        'Test failed',
        'Make sure at least one notification channel is enabled.',
      );
    } finally {
      setTestLoading(false);
    }
  };

  const hasAnyEnabled = notifs.whatsapp || notifs.sms;

  return (
    <ScreenWrapper>
      <Header
        title="Notifications"
        showBack
        rightLabel={loading ? 'saving...' : 'save'}
        onRightPress={save}
      />
      <ScreenWrapper scroll contentStyle={styles.scroll}>
        <View
          style={[
            styles.infoBanner,
            {
              backgroundColor: colors.infoLight,
              borderColor: colors.info + '30',
            },
          ]}
        >
          <Icon
            iconFamily="MaterialCommunityIcons"
            name="information-outline"
            size={rs.scale(16)}
            color={colors.info}
          />
          <Text
            style={[
              styles.infoText,
              { color: colors.info, fontFamily: fonts.Regular },
            ]}
          >
            Reminders help you stay on track with your diet and workout plan.
          </Text>
        </View>

        {!hasPhone && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onEdit}
            style={[
              styles.warnBanner,
              {
                backgroundColor: colors.warningLight,
                borderColor: colors.warning + '30',
              },
            ]}
          >
            <Icon
              iconFamily="MaterialCommunityIcons"
              name="alert-circle-outline"
              size={rs.scale(16)}
              color={colors.warning}
            />
            <Text
              style={[
                styles.warnText,
                { color: colors.warning, fontFamily: fonts.Regular },
              ]}
            >
              No phone number added. WhatsApp & SMS won't work.{' '}
              <Text style={{ fontFamily: fonts.SemiBold }}>Add phone →</Text>
            </Text>
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          CHANNELS
        </Text>
        <Card style={styles.card}>
          <ToggleRow
            icon="whatsapp"
            label="WhatsApp"
            subtitle={
              hasPhone
                ? `Messages to +91 ${user!.phone}`
                : 'Add phone number first'
            }
            value={notifs.whatsapp}
            onToggle={toggle('whatsapp')}
            colors={colors}
            disabled={!hasPhone}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(48)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <ToggleRow
            icon="message-text-outline"
            label="SMS"
            subtitle={
              hasPhone ? 'Text messages via MSG91' : 'Add phone number first'
            }
            value={notifs.sms}
            onToggle={toggle('sms')}
            colors={colors}
            disabled={!hasPhone}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(48)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <ToggleRow
            icon="bell-outline"
            label="Push Notifications"
            subtitle="In-app alerts (always free)"
            value={true}
            onToggle={() => {}}
            colors={colors}
            disabled
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          REMINDER TIMES (IST)
        </Text>
        <Card style={styles.card}>
          <ToggleRow
            icon="white-balance-sunny"
            label="Morning reminder"
            subtitle="7:00 AM · Breakfast plan + water reminder"
            value={notifs.morning}
            onToggle={toggle('morning')}
            colors={colors}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(48)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <ToggleRow
            icon="weather-sunny"
            label="Afternoon reminder"
            subtitle="1:00 PM · Lunch plan reminder"
            value={notifs.afternoon}
            onToggle={toggle('afternoon')}
            colors={colors}
          />
          <Divider
            height={0.5}
            marginL={rs.scale(48)}
            marginV={0}
            backgroundColor={colors.borderMuted}
          />
          <ToggleRow
            icon="weather-sunset"
            label="Evening reminder"
            subtitle="6:00 PM · Workout + dinner reminder"
            value={notifs.evening}
            onToggle={toggle('evening')}
            colors={colors}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          TEST
        </Text>
        <Card style={[styles.card, styles.testCard]}>
          <View style={styles.testRow}>
            <View style={universalStyles.flex}>
              <Text
                style={[
                  styles.testTitle,
                  { color: colors.textPrimary, fontFamily: fonts.Medium },
                ]}
              >
                Send a test notification
              </Text>
              <Text
                style={[
                  styles.testSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Verify your notifications are working
              </Text>
            </View>
            <Pressable
              onPress={sendTest}
              disabled={testLoading}
              style={[styles.testBtn, { backgroundColor: colors.primary }]}
            >
              {testLoading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="send-outline"
                  size={rs.scale(16)}
                  color={colors.white}
                />
              )}
            </Pressable>
          </View>
        </Card>

        <Button
          label="Save settings"
          onPress={save}
          loading={loading}
          iconLeft="content-save-outline"
          size="lg"
          style={{
            marginTop: rs.verticalScale(8),
            marginBottom: rs.verticalScale(32),
          }}
        />
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(40),
  },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginTop: rs.verticalScale(20),
    marginBottom: rs.verticalScale(8),
    paddingHorizontal: rs.scale(4),
  },
  card: { padding: rs.scale(16), marginBottom: rs.verticalScale(4) },
  infoBanner: {
    flexDirection: 'row',
    gap: rs.scale(10),
    padding: rs.scale(12),
    borderRadius: rs.scale(12),
    borderWidth: 1,
    marginTop: rs.verticalScale(16),
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: rs.font(13), lineHeight: rs.font(19) },
  warnBanner: {
    flexDirection: 'row',
    gap: rs.scale(10),
    padding: rs.scale(12),
    borderRadius: rs.scale(12),
    borderWidth: 1,
    marginTop: rs.verticalScale(8),
    alignItems: 'flex-start',
  },
  warnText: { flex: 1, fontSize: rs.font(13), lineHeight: rs.font(19) },
  testCard: {},
  testRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(12) },
  testTitle: { fontSize: rs.font(14) },
  testSub: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
  testBtn: {
    width: rs.scale(44),
    height: rs.scale(44),
    borderRadius: rs.scale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
