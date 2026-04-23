import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useColors } from '../../store';
import { useFadeIn, useSlideUp } from '../../hooks';
import { goBack, navigate, rs } from '../../utils';
import { Button, Header, Icon, Input, ScreenWrapper } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { AUTH_ROUTES, fonts, ROOT_ROUTES } from '../../constants';

const ForgotPasswordScreen: FC = () => {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { opacity: fadeOp, start: fadeStart } = useFadeIn(500, 100);
  const {
    opacity: slideOp,
    translateY,
    start: slideStart,
  } = useSlideUp(30, 500, 200);

  useEffect(() => {
    fadeStart();
    slideStart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setLoading(true);
    // TODO: call real API endpoint
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  const handleLogin = useCallback(() => {
    navigate(ROOT_ROUTES.AUTH, {
      screen: AUTH_ROUTES.LOGIN,
    });
  }, []);

  return (
    <ScreenWrapper scroll keyboard padding edges={['top']}>
      <Header
        style={s.header}
        title="Reset password"
        showBack
        onBack={goBack}
        transparent
      />

      <Animated.View style={[s.flex, { opacity: fadeOp }]}>
        {!sent ? (
          <Animated.View
            style={{ opacity: slideOp, transform: [{ translateY }] }}
          >
            <View style={s.iconWrap}>
              <LinearGradient
                colors={[colors.info + '20', colors.info + '08']}
                style={s.iconBg}
              >
                <Icon
                  iconFamily="MaterialCommunityIcons"
                  name="lock-reset"
                  size={rs.scale(36)}
                  color={colors.info}
                />
              </LinearGradient>
            </View>

            <Text
              style={[
                s.title,
                { color: colors.textPrimary, fontFamily: fonts.Bold },
              ]}
            >
              Forgot your password?
            </Text>
            <Text
              style={[
                s.sub,
                { color: colors.textTertiary, fontFamily: fonts.Regular },
              ]}
            >
              Enter your email and we'll send a reset link to your inbox.
            </Text>

            <Input
              label="Email address"
              iconLeft="email-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={t => {
                setEmail(t);
                setError(null);
              }}
              error={error}
              returnKeyType="done"
              onSubmitEditing={handleSend}
            />

            <Button
              label="Send reset link"
              onPress={handleSend}
              loading={loading}
              iconRight="send-outline"
              size="lg"
            />
          </Animated.View>
        ) : (
          <View style={s.successWrap}>
            <LinearGradient
              colors={[colors.success + '20', colors.success + '08']}
              style={s.successIconBg}
            >
              <Icon
                iconFamily="MaterialCommunityIcons"
                name="email-check-outline"
                size={rs.scale(40)}
                color={colors.success}
              />
            </LinearGradient>
            <Text
              style={[
                s.title,
                {
                  color: colors.textPrimary,
                  fontFamily: fonts.Bold,
                },
              ]}
            >
              Check your email!
            </Text>
            <Text
              style={[
                s.sub,
                {
                  color: colors.textTertiary,
                  fontFamily: fonts.Regular,
                },
              ]}
            >
              We sent a reset link to{'\n'}
              <Text
                style={{
                  color: colors.textPrimary,
                  fontFamily: fonts.SemiBold,
                }}
              >
                {email}
              </Text>
            </Text>
            <Button
              label="Back to login"
              onPress={handleLogin}
              variant="ghost"
              iconLeft="arrow-left"
              size="lg"
            />
          </View>
        )}
      </Animated.View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;

const s = StyleSheet.create({
  header: { paddingHorizontal: 0 },
  flex: { flex: 1 },
  iconWrap: {
    marginTop: rs.verticalScale(24),
    marginBottom: rs.verticalScale(24),
  },
  iconBg: {
    width: rs.scale(80),
    height: rs.scale(80),
    borderRadius: rs.scale(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: rs.font(24),
    marginBottom: rs.verticalScale(8),
    textAlign: 'center',
  },
  sub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(22),
    marginBottom: rs.verticalScale(28),
    textAlign: 'center',
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: rs.verticalScale(20),
    paddingHorizontal: rs.scale(16),
  },
  successIconBg: {
    width: rs.scale(96),
    height: rs.scale(96),
    borderRadius: rs.scale(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
