import { Component, ErrorInfo, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: send to Sentry / Crashlytics
    console.error('[ErrorBoundary]', error, errorInfo.componentStack);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    if (!this.props.fallback) return this.props.fallback;

    return (
      <View style={styles.root}>
        <Text style={styles.emoji}>😕</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.subtitle}>
          The app hit an unexpected error. Your data is safe.
        </Text>
        {__DEV__ && (
          <ScrollView style={styles.devBox}>
            <Text style={styles.devText}>{this.state.error?.message}</Text>
            <Text style={styles.devText}>{this.state.error?.stack}</Text>
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.btn}
          onPress={this.reset}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  devBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
    marginBottom: 24,
    width: '100%',
  },
  devText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  btn: {
    backgroundColor: '#22C55E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
