import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { FC, useState } from 'react';
import { useAppStore, useColors } from '../../store';
import { useApiError, useAuth } from '../../hooks';
import { authApi, userApi } from '../../services/api';
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  Input,
  ScreenWrapper,
  SegmentControl,
  universalStyles,
} from '../../components';
import { rs } from '../../utils';
import { fonts, ThemeType } from '../../constants';

const AppSettingsScreen: FC = () => {
  const colors = useColors();
  const { theme, units, language, setTheme, setUnits, setLanguage } =
    useAppStore();
  const { logout } = useAuth();
  const handleError = useApiError();

  // Change password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const changePassword = async () => {
    const e: Record<string, string> = {};
    if (!currentPw) e.currentPw = 'Required';
    if (!newPw) e.newPw = 'Required';
    else if (newPw.length < 6) e.newPw = 'Min 6 characters';
    if (newPw !== confirmPw) e.confirmPw = 'Passwords do not match';
    setPwErrors(e);
    if (Object.keys(e).length) return;

    setPwLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: currentPw,
        newPassword: newPw,
        confirmPassword: confirmPw,
      });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      Alert.alert(
        'Password changed',
        'Your password has been updated successfully.',
      );
    } catch (err) {
      handleError(err);
    } finally {
      setPwLoading(false);
    }
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'All your data — diet plans, workouts, progress — will be permanently deleted. This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete permanently',
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              await userApi.deleteAccount();
              logout();
            } catch (err) {
              handleError(err);
              setDeleteLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScreenWrapper>
      <Header title="App Settings" showBack />

      <ScreenWrapper scroll contentStyle={styles.scroll} keyboard>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          APPEARANCE
        </Text>
        <Card style={styles.card}>
          <Text
            style={[
              styles.label,
              { color: colors.textSecondary, fontFamily: fonts.Medium },
            ]}
          >
            Theme
          </Text>
          <SegmentControl
            options={[
              { value: 'light', label: 'Light', icon: '☀️' },
              { value: 'dark', label: 'Dark', icon: '🌙' },
              { value: 'system', label: 'System', icon: '📱' },
            ]}
            selected={theme}
            onSelect={v => setTheme(v as ThemeType)}
            colors={colors}
          />

          <Divider
            height={0.5}
            marginV={rs.verticalScale(16)}
            backgroundColor={'transparent'}
          />

          <Text
            style={[
              styles.label,
              { color: colors.textSecondary, fontFamily: fonts.Medium },
            ]}
          >
            Units
          </Text>
          <SegmentControl
            options={[
              { value: 'metric', label: 'Metric (kg, cm)' },
              { value: 'imperial', label: 'Imperial (lbs, ft)' },
            ]}
            selected={units}
            onSelect={v => setUnits(v as 'metric' | 'imperial')}
            colors={colors}
          />

          <Divider
            height={0.5}
            marginV={rs.verticalScale(16)}
            backgroundColor={'transparent'}
          />

          <Text
            style={[
              styles.label,
              { color: colors.textSecondary, fontFamily: fonts.Medium },
            ]}
          >
            Language
          </Text>
          <SegmentControl
            options={[
              { value: 'en', label: '🇬🇧 English' },
              { value: 'hi', label: '🇮🇳 हिन्दी' },
            ]}
            selected={language}
            onSelect={v => setLanguage(v as 'en' | 'hi')}
            colors={colors}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          SECURITY
        </Text>
        <Card style={styles.card}>
          <Input
            label="Current password"
            iconLeft="lock-outline"
            secure
            value={currentPw}
            onChangeText={setCurrentPw}
            error={pwErrors.currentPw}
          />
          <Input
            label="New password"
            iconLeft="lock-plus-outline"
            secure
            value={newPw}
            onChangeText={setNewPw}
            error={pwErrors.newPw}
          />
          <Input
            label="Confirm password"
            iconLeft="lock-check-outline"
            secure
            value={confirmPw}
            onChangeText={setConfirmPw}
            error={pwErrors.confirmPw}
            containerStyle={styles.input}
          />
          <Button
            label="Update password"
            onPress={changePassword}
            loading={pwLoading}
            variant="secondary"
            size="md"
            style={{ marginTop: rs.verticalScale(14) }}
          />
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textTertiary, fontFamily: fonts.SemiBold },
          ]}
        >
          ABOUT
        </Text>
        <Card style={styles.card}>
          {[
            { label: 'App version', value: '1.0.0' },
            { label: 'Privacy Policy', value: '' },
            { label: 'Terms of Service', value: '' },
            { label: 'Open source licences', value: '' },
          ].map((row, i, arr) => (
            <React.Fragment key={row.label}>
              <View style={styles.aboutRow}>
                <Text
                  style={[
                    styles.aboutLabel,
                    { color: colors.textPrimary, fontFamily: fonts.Regular },
                  ]}
                >
                  {row.label}
                </Text>
                {row.value ? (
                  <Text
                    style={[
                      styles.aboutValue,
                      { color: colors.textTertiary, fontFamily: fonts.Regular },
                    ]}
                  >
                    {row.value}
                  </Text>
                ) : (
                  <Icon
                    iconFamily="MaterialCommunityIcons"
                    name="chevron-right"
                    size={rs.scale(18)}
                    color={colors.textTertiary}
                  />
                )}
              </View>
              {i < arr.length - 1 && (
                <Divider
                  height={0.5}
                  marginV={0}
                  backgroundColor={colors.borderMuted}
                />
              )}
            </React.Fragment>
          ))}
        </Card>

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.error, fontFamily: fonts.SemiBold },
          ]}
        >
          DANGER ZONE
        </Text>
        <Card
          style={[
            styles.card,
            styles.cardBorder,
            { borderColor: colors.error + '30' },
          ]}
        >
          <View style={styles.dangerRow}>
            <View style={universalStyles.flex}>
              <Text
                style={[
                  styles.dangerTitle,
                  { color: colors.error, fontFamily: fonts.SemiBold },
                ]}
              >
                Delete Account
              </Text>
              <Text
                style={[
                  styles.dangerSub,
                  { color: colors.textTertiary, fontFamily: fonts.Regular },
                ]}
              >
                Permanently delete all your data. Cannot be undone.
              </Text>
            </View>
            <Button
              label="Delete"
              onPress={confirmDeleteAccount}
              loading={deleteLoading}
              variant="danger"
              size="sm"
              fullWidth={false}
            />
          </View>
        </Card>
      </ScreenWrapper>
    </ScreenWrapper>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: rs.scale(16),
    paddingBottom: rs.verticalScale(48),
  },
  sectionTitle: {
    fontSize: rs.font(11),
    letterSpacing: 0.8,
    marginTop: rs.verticalScale(20),
    marginBottom: rs.verticalScale(8),
    paddingHorizontal: rs.scale(4),
  },
  card: { padding: rs.scale(16), marginBottom: rs.verticalScale(4) },
  cardBorder: {
    borderWidth: 1,
  },
  label: { fontSize: rs.font(13), marginBottom: rs.verticalScale(8) },
  input: {
    marginBottom: 0,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: rs.verticalScale(12),
  },
  aboutLabel: { fontSize: rs.font(14) },
  aboutValue: { fontSize: rs.font(14) },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: rs.scale(12) },
  dangerTitle: { fontSize: rs.font(14) },
  dangerSub: { fontSize: rs.font(12), marginTop: rs.verticalScale(2) },
});
