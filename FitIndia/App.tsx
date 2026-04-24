import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { ErrorBoundary, OfflineBanner } from './src/components';
import { ModalProvider, ToastProvider } from './src/context';
import { useColors } from './src/store';

enableScreens();

const App = () => {
  const colors = useColors();

  return (
    <ErrorBoundary Colors={colors}>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <ToastProvider>
            <ModalProvider>
              <AppNavigator />
              <OfflineBanner />
            </ModalProvider>
          </ToastProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
