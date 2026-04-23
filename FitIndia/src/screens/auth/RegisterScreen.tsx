import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useColors } from '../../store';
import { useApiError, useAuth, useStagger } from '../../hooks';
import { registerValidate } from '../../helper';
import { Button, Header, Input, ScreenWrapper } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { goBack, navigate, rs } from '../../utils';
import { AUTH_ROUTES, fonts, ROOT_ROUTES } from '../../constants';

const RegisterScreen: FC = () => {
  const colors = useColors();
  const { register, loading } = useAuth();
  const handleError = useApiError();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { anims, start } = useStagger(5, 70, 450);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async () => {
    Keyboard.dismiss();
    const isValid = registerValidate({
      name,
      email,
      phone,
      password,
      confirm,
      setErrors,
    });

    if (!isValid) return;

    const result = await register(
      name.trim(),
      email.trim().toLowerCase(),
      password,
      phone || undefined,
    );
    if (!result.ok) {
      handleError({
        code: result.code ?? 'UNKNOWN',
        message: result.error ?? 'Registration failed',
        isAppError: true,
      });
      return;
    }
  };

  const handleLogin = useCallback(() => {
    navigate(ROOT_ROUTES.AUTH, {
      screen: AUTH_ROUTES.LOGIN,
    });
  }, []);

  const err = (field: string) => errors[field];
  const clearErr = (field: string) =>
    setErrors(e => {
      const n = { ...e };
      delete n[field];
      return n;
    });

  return (
    <ScreenWrapper scroll keyboard padding edges={['top']}>
      <Header
        title="Create account"
        showBack
        onBack={goBack}
        transparent
        style={s.header}
      />

      <LinearGradient
        colors={[colors.secondary + '14', 'transparent']}
        style={s.topGradient}
        pointerEvents="none"
      />

      <Animated.View
        style={{
          opacity: anims[0].opacity,
          transform: [{ translateY: anims[0].translateY }],
        }}
      >
        <Text
          style={[
            s.headline,
            { color: colors.textPrimary, fontFamily: fonts.Bold },
          ]}
        >
          Join FitSutra 🏋️
        </Text>
        <Text
          style={[
            s.sub,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          Start your personalised Indian fitness journey today
        </Text>
      </Animated.View>

      <Animated.View style={[s.pillsRow, { opacity: anims[0].opacity }]}>
        {['🥗 Indian diet plans', '💪 AI workouts', '📊 Progress tracking'].map(
          (t, i) => (
            <View
              key={i}
              style={[
                s.pill,
                {
                  backgroundColor: colors.primary + '12',
                  borderColor: colors.primary + '25',
                },
              ]}
            >
              <Text
                style={[
                  s.pillText,
                  { color: colors.primary, fontFamily: fonts.Medium },
                ]}
              >
                {t}
              </Text>
            </View>
          ),
        )}
      </Animated.View>

      <Animated.View
        style={{
          opacity: anims[1].opacity,
          transform: [{ translateY: anims[1].translateY }],
        }}
      >
        <Input
          label="Full name"
          iconLeft="account-outline"
          autoCapitalize="words"
          value={name}
          onChangeText={t => {
            setName(t);
            clearErr('name');
          }}
          error={err('name')}
          returnKeyType="next"
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: anims[2].opacity,
          transform: [{ translateY: anims[2].translateY }],
        }}
      >
        <Input
          label="Email address"
          iconLeft="email-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={t => {
            setEmail(t);
            clearErr('email');
          }}
          error={err('email')}
          returnKeyType="next"
        />
        <Input
          label="Mobile number (optional)"
          iconLeft="phone-outline"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={t => {
            setPhone(t);
            clearErr('phone');
          }}
          error={err('phone')}
          hint="Used for WhatsApp reminders"
          returnKeyType="next"
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: anims[3].opacity,
          transform: [{ translateY: anims[3].translateY }],
        }}
      >
        <Input
          label="Password"
          iconLeft="lock-outline"
          secure
          value={password}
          onChangeText={t => {
            setPassword(t);
            clearErr('password');
          }}
          error={err('password')}
          returnKeyType="next"
        />
        <Input
          label="Confirm password"
          iconLeft="lock-check-outline"
          secure
          value={confirm}
          onChangeText={t => {
            setConfirm(t);
            clearErr('confirm');
          }}
          error={err('confirm')}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
      </Animated.View>

      <Animated.View style={{ opacity: anims[3].opacity }}>
        <Text
          style={[
            s.terms,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          By signing up you agree to our{' '}
          <Text style={{ color: colors.primary }}>Terms of Service</Text> and{' '}
          <Text style={{ color: colors.primary }}>Privacy Policy</Text>.
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          s.btnWrap,
          {
            opacity: anims[4].opacity,
            transform: [{ translateY: anims[4].translateY }],
          },
        ]}
      >
        <Button
          label="Create free account"
          onPress={handleRegister}
          loading={loading}
          iconRight="arrow-right"
          size="lg"
        />

        <TouchableOpacity onPress={handleLogin} hitSlop={8} style={s.loginRow}>
          <Text
            style={[
              s.loginText,
              { color: colors.textSecondary, fontFamily: fonts.Regular },
            ]}
          >
            Already have an account?{' '}
            <Text style={{ color: colors.primary, fontFamily: fonts.SemiBold }}>
              Login
            </Text>
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </ScreenWrapper>
  );
};

export default RegisterScreen;

const s = StyleSheet.create({
  header: { paddingHorizontal: 0 },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: rs.verticalScale(180),
  },
  headline: {
    fontSize: rs.font(26),
    marginTop: rs.verticalScale(16),
    marginBottom: rs.verticalScale(6),
  },
  sub: {
    fontSize: rs.font(14),
    lineHeight: rs.font(21),
    marginBottom: rs.verticalScale(20),
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rs.scale(8),
    marginBottom: rs.verticalScale(28),
  },
  pill: {
    borderWidth: 1,
    borderRadius: rs.scale(20),
    paddingHorizontal: rs.scale(10),
    paddingVertical: rs.verticalScale(4),
  },
  pillText: { fontSize: rs.font(12) },
  terms: {
    fontSize: rs.font(12),
    lineHeight: rs.font(18),
    marginBottom: rs.verticalScale(20),
    textAlign: 'center',
  },
  btnWrap: { gap: rs.verticalScale(16), marginBottom: rs.verticalScale(32) },
  loginRow: { alignItems: 'center' },
  loginText: { fontSize: rs.font(14), textAlign: 'center' },
});
