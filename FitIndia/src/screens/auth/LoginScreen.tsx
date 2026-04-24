import {
  Animated,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Divider, Input, ScreenWrapper } from '../../components';
import LinearGradient from 'react-native-linear-gradient';
import { getDeviceInfo, navigate, rs } from '../../utils';
import { AUTH_ROUTES, fonts, ROOT_ROUTES } from '../../constants';
import { useApiError, useAuth, useOnboarding, useStagger } from '../../hooks';
import { loginValidate } from '../../helper';
import { useToast } from '../../context';
import { useColors } from '../../store';

const LoginScreen: FC = () => {
  const colors = useColors();
  const { login, loading } = useAuth();
  const handleError = useApiError();
  const toast = useToast();
  const { isComplete } = useOnboarding();
  const [av, setAv] = useState<{ appVersion?: string; buildNumber?: string }>({
    appVersion: '1.0.0',
    buildNumber: '1',
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const { anims, start } = useStagger(4, 80, 500);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const { appVersion, buildNumber } = await getDeviceInfo();
      setAv({ appVersion, buildNumber });
    };

    fetchDeviceInfo();
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleForgetPass = useCallback(() => {
    navigate(ROOT_ROUTES.AUTH, {
      screen: AUTH_ROUTES.FORGOT_PW,
    });
  }, []);

  const handleRegister = useCallback(() => {
    navigate(ROOT_ROUTES.AUTH, {
      screen: AUTH_ROUTES.REGISTER,
    });
  }, []);

  const handleLogin = useCallback(async () => {
    Keyboard.dismiss();
    const isValid = loginValidate({
      email,
      password,
      setErrors,
    });

    if (!isValid) return;

    const result = await login(email.trim().toLowerCase(), password);
    if (result.ok) {
      toast({
        type: 'success',
        title: 'Logged in',
        message: result.msg || 'Logged in successfully.',
      });
    } else {
      handleError({
        code: result.code ?? 'UNKNOWN',
        message: result.error ?? 'Login failed',
        isAppError: true,
      });
    }
  }, [email, handleError, login, password, toast]);

  return (
    <ScreenWrapper scroll keyboard padding edges={['top']}>
      <LinearGradient
        colors={[colors.primary + '18', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />
      <View style={styles.top}>
        <Image
          source={require('../../assets/images/app_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Image
          source={require('../../assets/images/app_name.png')}
          style={styles.appName}
          resizeMode="contain"
        />
      </View>

      <Animated.View
        style={{
          opacity: anims[0].opacity,
          transform: [{ translateY: anims[0].translateY }],
        }}
      >
        <Text
          style={[
            styles.headline,
            { color: colors.textPrimary, fontFamily: fonts.Bold },
          ]}
        >
          {`Welcome ${isComplete() ? 'back' : ''} 👋`}
        </Text>
        <Text
          style={[
            styles.sub,
            { color: colors.textTertiary, fontFamily: fonts.Regular },
          ]}
        >
          Login to continue your fitness journey
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.form,
          {
            opacity: anims[1].opacity,
            transform: [{ translateY: anims[1].translateY }],
          },
        ]}
      >
        <Input
          label="Email"
          iconLeft="email-outline"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={t => {
            setEmail(t);
            setErrors(e => ({ ...e, email: undefined }));
          }}
          error={errors.email}
          returnKeyType="next"
        />
        <Input
          label="Password"
          iconLeft="lock-outline"
          secure
          value={password}
          onChangeText={t => {
            setPassword(t);
            setErrors(e => ({ ...e, password: undefined }));
          }}
          error={errors.password}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          onPress={handleForgetPass}
          hitSlop={8}
          style={styles.forgotWrap}
        >
          <Text
            style={[
              styles.forgot,
              { color: colors.primary, fontFamily: fonts.Medium },
            ]}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          opacity: anims[2].opacity,
          transform: [{ translateY: anims[2].translateY }],
        }}
      >
        <Button
          label="Login"
          onPress={handleLogin}
          loading={loading}
          iconRight="arrow-right"
          size="lg"
        />
      </Animated.View>

      <Divider label="or" marginV={rs.verticalScale(24)} />

      <Animated.View
        style={[styles.registerRow, { opacity: anims[3].opacity }]}
      >
        <Text
          style={[
            styles.registerText,
            { color: colors.textSecondary, fontFamily: fonts.Regular },
          ]}
        >
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={handleRegister} hitSlop={8}>
          <Text
            style={[
              styles.registerLink,
              { color: colors.primary, fontFamily: fonts.SemiBold },
            ]}
          >
            Sign up free
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Text
        style={[
          styles.bottomNote,
          { color: colors.textTertiary, fontFamily: fonts.Regular },
        ]}
      >
        {`Made in India 🇮🇳 — FitSutra v${av.appVersion} (${av.buildNumber})`}
      </Text>
    </ScreenWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: rs.verticalScale(200),
  },
  top: {
    alignItems: 'center',
    marginTop: rs.verticalScale(40),
  },
  logo: {
    width: rs.scale(120),
    height: rs.scale(120),
  },
  appName: {
    width: rs.scale(220),
    height: rs.scale(80),
    marginTop: rs.verticalScale(-10),
  },
  headline: {
    fontSize: rs.font(26),
    marginBottom: rs.verticalScale(6),
  },
  sub: {
    fontSize: rs.font(14),
    marginBottom: rs.verticalScale(32),
    lineHeight: rs.font(21),
  },
  form: {
    marginBottom: rs.verticalScale(8),
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: rs.verticalScale(-8),
    marginBottom: rs.verticalScale(12),
  },
  forgot: {
    fontSize: rs.font(14),
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rs.verticalScale(32),
  },
  registerText: {
    fontSize: rs.font(14),
  },
  registerLink: {
    fontSize: rs.font(14),
    marginLeft: rs.moderateScale(4),
  },
  bottomNote: {
    textAlign: 'center',
    fontSize: rs.font(11),
    marginBottom: rs.verticalScale(16),
  },
});
