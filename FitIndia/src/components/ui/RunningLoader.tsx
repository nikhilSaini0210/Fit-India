import React, { FC } from 'react';
import LottieView from 'lottie-react-native';
import { rs } from '../../utils';

interface Props {
  width: number;
  height: number;
}

const RunningLoader: FC<Props> = ({
  width = rs.scale(60),
  height = rs.scale(60),
}) => {
  return (
    <LottieView
      source={require('../../assets/lottie/running.json')}
      autoPlay
      loop
      style={{ width, height }}
    />
  );
};

export default RunningLoader;
