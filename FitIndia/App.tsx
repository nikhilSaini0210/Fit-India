import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
import { ErrorBoundary, OfflineBanner } from './src/components';
import { ModalProvider, ToastProvider } from './src/context';

enableScreens();

export default function App() {
  return (
    <ErrorBoundary>
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
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
