import { StyleSheet, ImageBackground } from 'react-native';
import React, { FC, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rs } from '../../utils';
import { useColors, useIsDark } from '../../store';
interface Props {
  children: ReactNode;
}
const ImageBackgroundView: FC<Props> = ({ children }) => {
  const isDark = useIsDark();
  const colors = useColors();
  const backgroundImage = isDark
    ? require('../../assets/images/splashBgDark.png')
    : require('../../assets/images/splashBgLight.png');
  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.container, { backgroundColor: colors.background }]}
      resizeMode="stretch"
    >
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </ImageBackground>
  );
};
export default ImageBackgroundView;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: rs.screenWidth,
    height: rs.screenHeight,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
  },
});
