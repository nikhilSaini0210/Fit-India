import React, { FC, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import {
  OnboardingStorage,
  selectIsLoggedIn,
  selectProfileComplete,
  storage,
  useAuthStore,
} from '../../store';
import { resetAndNavigate, rs } from '../../utils';
import { AUTH_ROUTES, fonts, ROOT_ROUTES, STORAGE_KEYS } from '../../constants';
import ImageBackgroundView from './ImageBackgroundView';
// import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const SplashScreen: FC = () => {
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  const profileComplete = useAuthStore(selectProfileComplete);

  // useEffect(() => {
  //   const resolve = async () => {
  //     await new Promise<void>(r => setTimeout(r, 600));

  //     if (!isLoggedIn) {
  //       const onboarded = OnboardingStorage.isComplete();
  //       resetAndNavigate(ROOT_ROUTES.AUTH, {
  //         screen: onboarded ? AUTH_ROUTES.LOGIN : AUTH_ROUTES.ONBOARDING,
  //       });
  //       return;
  //     }

  //     if (!profileComplete) {
  //       resetAndNavigate(ROOT_ROUTES.AUTH, {
  //         screen: AUTH_ROUTES.PROFILE_SETUP,
  //       });
  //       return;
  //     }

  //     resetAndNavigate(ROOT_ROUTES.MAIN);
  //   };

  //   resolve();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <ImageBackgroundView>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/applogo.png')}
          resizeMode="contain"
        />

        {/* FitSutra AI Title */}
        <View style={styles.titleRow}>
          <Text style={styles.titleFit}>Fit</Text>
          <Text style={styles.titleSutra}>Sutra </Text>

          {/* AI with leaf on i */}
          <View style={styles.aiWrapper}>
            <Text style={styles.titleAI}>A</Text>

            {/* "i" with leaf replacing the dot */}
            <View style={styles.iWrapper}>
              {/* Leaf dot above */}
              <Svg
                width={rs.scale(10)}
                height={rs.scale(13)}
                viewBox="0 0 10 13"
                style={styles.leafSvg}
              >
                <Path
                  d="M5 0 C5 0 10 3 10 7 C10 10 7.5 12 5 12 C2.5 12 0 10 0 7 C0 3 5 0 5 0 Z"
                  fill="#22C55E"
                />
              </Svg>
              {/* i stem only, lineHeight hides the font dot */}
              <Text style={styles.iStem}>i</Text>
            </View>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>FITNESS • DIET • AI COACH</Text>

        {/* Curved SVG underline with proper react-native-svg gradient */}
        <Svg
          width={rs.scale(220)}
          height={rs.verticalScale(18)}
          viewBox="0 0 220 18"
          style={styles.curveSvg}
        >
          <Defs>
            <LinearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#22C55E" stopOpacity="1" />
              <Stop offset="1" stopColor="#F97316" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M10 14 Q110 2 210 14"
            stroke="url(#curveGrad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </ImageBackgroundView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // gap: rs.verticalScale(12),
  },

  logo: {
    width: rs.scale(180),
    height: rs.scale(180),
    marginBottom: rs.verticalScale(4),
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  titleFit: {
    fontFamily: fonts.ExtraBold,
    fontSize: rs.font(42),
    color: '#16A34A',
    letterSpacing: -0.5,
  },

  titleSutra: {
    fontFamily: fonts.ExtraBold,
    fontSize: rs.font(42),
    color: '#F97316',
    letterSpacing: -0.5,
  },

  aiWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  titleAI: {
    fontFamily: fonts.ExtraBold,
    fontSize: rs.font(42),
    color: '#22C55E',
    letterSpacing: -0.5,
  },

  iWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: rs.verticalScale(17),
  },

  leafSvg: {
    marginBottom: rs.verticalScale(-2),
  },

  iStem: {
    fontFamily: fonts.ExtraBold,
    fontSize: rs.font(42),
    color: '#22C55E',
    letterSpacing: -0.5,
    lineHeight: rs.font(38),
  },

  subtitle: {
    fontFamily: fonts.Medium,
    fontSize: rs.font(13),
    color: '#94A3B8',
    letterSpacing: 2.5,
    marginTop: rs.verticalScale(2),
  },

  curveSvg: {
    marginTop: rs.verticalScale(4),
  },
});
