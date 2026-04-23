import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FC } from 'react';
import { AuthStackParamList } from '../../types';
import { AUTH_ROUTES } from '../../constants';
import OnBoardingScreen from '../../screens/OnBoardingScreen';
import {
  ForgotPasswordScreen,
  LoginScreen,
  ProfileSetupScreen,
  RegisterScreen,
  SplashScreen,
} from '../../screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={AUTH_ROUTES.SPLASH}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name={AUTH_ROUTES.SPLASH} component={SplashScreen} />
      <Stack.Screen
        name={AUTH_ROUTES.ONBOARDING}
        component={OnBoardingScreen}
      />
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={AUTH_ROUTES.REGISTER}
        component={RegisterScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.PROFILE_SETUP}
        component={ProfileSetupScreen}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.FORGOT_PW}
        component={ForgotPasswordScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
