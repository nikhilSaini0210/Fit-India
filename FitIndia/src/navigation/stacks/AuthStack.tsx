import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FC } from 'react';
import { View, Text } from 'react-native';
import { AuthStackParamList } from '../../types';
import { AUTH_ROUTES } from '../../constants';
import OnBoardingScreen from '../../screens/OnBoardingScreen';
import { LoginScreen, SplashScreen } from '../../screens';

const Placeholder: FC = ({ route }: any) => (
  <View
    style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
    }}
  >
    <Text style={{ color: '#fff' }}>{route.name}</Text>
  </View>
);

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
        component={Placeholder}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.PROFILE_SETUP}
        component={Placeholder}
        options={{
          animation: 'slide_from_right',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={AUTH_ROUTES.FORGOT_PW}
        component={Placeholder}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
