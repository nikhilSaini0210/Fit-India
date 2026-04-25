import { Component, ErrorInfo, ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppColors, fonts } from '../constants';
import { logger, rs } from '../utils';

interface Props {
  children: ReactNode;
  Colors: AppColors;
  fallback?: (err: Error, reset: () => void) => ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(e: Error): State {
    return { error: e };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: send to Sentry / Crashlytics
    logger.error('Unhandled render error', {
      tag: 'ErrorBoundary',
      data: { error, componentStack: errorInfo.componentStack },
    });
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback, Colors } = this.props;

    if (!error) return children;
    if (fallback) return fallback(error, this.reset);

    return (
      <View style={[styles.root, { backgroundColor: Colors.background }]}>
        <Text style={styles.emoji}>😕</Text>
        <Text style={[styles.title, { color: Colors.textPrimary }]}>
          Something went wrong
        </Text>
        <Text style={[styles.subtitle, { color: Colors.textSecondary }]}>
          The app hit an unexpected error. Your data is safe.
        </Text>
        {__DEV__ && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={[styles.devBox, { backgroundColor: Colors.backgroundCard }]}
            contentContainerStyle={{ paddingBottom: rs.verticalScale(12) }}
          >
            <Text style={[styles.devText, { color: Colors.textSecondary }]}>
              {this.state.error?.message}
            </Text>
            <Text style={[styles.devText, { color: Colors.textSecondary }]}>
              {this.state.error?.stack}
            </Text>
          </ScrollView>
        )}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Colors.primary }]}
          onPress={this.reset}
          activeOpacity={0.85}
        >
          <Text style={[styles.btnText, { color: Colors.textPrimary }]}>
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rs.moderateScale(32),
  },
  emoji: {
    fontSize: rs.font(48),
    marginBottom: rs.verticalScale(16),
  },
  title: {
    fontSize: rs.font(22),
    fontFamily: fonts.SemiBold,
    marginBottom: rs.verticalScale(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: rs.font(15),
    fontFamily: fonts.Regular,
    textAlign: 'center',
    lineHeight: rs.verticalScale(22),
    marginBottom: rs.verticalScale(32),
  },
  devBox: {
    borderRadius: rs.scale(8),
    padding: rs.moderateScale(12),
    maxHeight: rs.verticalScale(250),
    marginBottom: rs.verticalScale(24),
    width: '100%',
  },
  devText: {
    fontSize: rs.font(11),
    fontFamily: fonts.Italic,
  },
  btn: {
    borderRadius: rs.scale(12),
    paddingVertical: rs.verticalScale(14),
    paddingHorizontal: rs.moderateScale(40),
  },
  btnText: {
    fontFamily: fonts.SemiBold,
    fontSize: rs.font(16),
  },
});
