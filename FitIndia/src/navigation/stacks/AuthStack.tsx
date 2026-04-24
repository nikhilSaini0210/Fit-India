import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FC } from 'react';
import { AuthStackParamList } from '../../types';
import { AUTH_ROUTES } from '../../constants';
import {
  ForgotPasswordScreen,
  LoginScreen,
  OnBoardingScreen,
  ProfileSetupScreen,
  RegisterScreen,
} from '../../screens';
import { useOnboarding } from '../../hooks';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: FC = () => {
  const { isComplete } = useOnboarding();

  return (
    <Stack.Navigator
      initialRouteName={
        isComplete() ? AUTH_ROUTES.LOGIN : AUTH_ROUTES.ONBOARDING
      }
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
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
