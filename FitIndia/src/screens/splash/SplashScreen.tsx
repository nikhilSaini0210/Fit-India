import React, { FC, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {
  selectIsLoggedIn,
  selectProfileComplete,
  useAuthStore,
  useColors,
  useLoadingStep,
} from '../../store';
import { resetAndNavigate, rs } from '../../utils';
import { AUTH_ROUTES, fonts, ROOT_ROUTES } from '../../constants';
import ImageBackgroundView from './ImageBackgroundView';
import Features from './Features';
import { GradientProgressBar, RunningLoader } from '../../components';
import { useOnboarding } from '../../hooks';

interface SplashScreenProps {
  canNavigate: boolean;
}

const SplashScreen: FC<SplashScreenProps> = ({ canNavigate }) => {
  const colors = useColors();
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const profileComplete = useAuthStore(selectProfileComplete);
  const loadingSteps = useLoadingStep();
  const { isComplete } = useOnboarding();

  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!canNavigate) return;

    if (hasNavigated.current) return;
    hasNavigated.current = true;

    if (!isLoggedIn) {
      resetAndNavigate(ROOT_ROUTES.AUTH, {
        screen: isComplete() ? AUTH_ROUTES.LOGIN : AUTH_ROUTES.ONBOARDING,
      });
      return;
    }

    if (!profileComplete) {
      resetAndNavigate(ROOT_ROUTES.AUTH, {
        screen: AUTH_ROUTES.PROFILE_SETUP,
      });
      return;
    }

    resetAndNavigate(ROOT_ROUTES.MAIN);
  }, [isComplete, isLoggedIn, canNavigate, profileComplete]);

  return (
    <ImageBackgroundView>
      <View style={styles.container}>
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

          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            FITNESS • DIET • AI COACH
          </Text>
        </View>

        <View style={styles.middle}>
          <Image
            source={require('../../assets/images/running_man.png')}
            style={styles.runner}
            resizeMode="contain"
          />

          <View style={styles.featuresContainer}>
            <Features />
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Your Health Journey Begins...
          </Text>

          <View style={styles.loaderWrapper}>
            <View style={styles.loaderView}>
              <GradientProgressBar
                progress={loadingSteps}
                height={12}
                gradientColors={colors.progressGradient}
              />
            </View>

            <View style={styles.runnerOverlay}>
              <RunningLoader width={rs.scale(60)} height={rs.scale(60)} />
            </View>
          </View>

          <Text style={[styles.loading, { color: colors.loading }]}>
            Loading...
          </Text>
        </View>
      </View>
    </ImageBackgroundView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: rs.moderateScale(20),
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

  subtitle: {
    fontFamily: fonts.Medium,
    fontSize: rs.font(13),
    letterSpacing: rs.font(2),
  },

  middle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  runner: {
    width: '50%',
    height: rs.verticalScale(300),
  },

  featuresContainer: {
    width: '50%',
    justifyContent: 'center',
  },

  bottom: {
    alignItems: 'center',
    marginBottom: rs.verticalScale(20),
  },

  loadingText: {
    fontSize: rs.font(15),
    fontFamily: fonts.SemiBold,
    letterSpacing: rs.font(0.2),
  },

  loaderWrapper: {
    width: '70%',
    justifyContent: 'center',
  },

  loaderView: {
    width: '100%',
    paddingVertical: rs.verticalScale(10),
  },

  runnerOverlay: {
    position: 'absolute',
    right: -rs.scale(50),
    bottom: -rs.scale(10),
  },

  loading: {
    fontSize: rs.font(13),
    fontFamily: fonts.SemiBold,
    letterSpacing: rs.font(0.2),
  },
});
