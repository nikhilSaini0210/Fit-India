import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

const verticalScale = (size: number) =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor: number = 0.5) =>
  size + (scale(size) - size) * factor;

const font = (size: number) => RFValue(size);

const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

export const rs = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  /* Layout */
  scale,
  verticalScale,
  moderateScale,

  /* Percentage Layout */
  wp,
  hp,

  /* Fonts */
  font,
};
