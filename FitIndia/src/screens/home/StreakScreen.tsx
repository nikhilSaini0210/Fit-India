import React, { FC } from 'react';
import { ScreenWrapper } from '../../components';
import StreakBadgesScreen from '../progress/StreakBadgesScreen';

const StreakScreen: FC = () => {
  return (
    <ScreenWrapper>
      <StreakBadgesScreen />
    </ScreenWrapper>
  );
};

export default StreakScreen;
