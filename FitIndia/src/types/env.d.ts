declare module 'react-native-config' {
  export interface NativeConfig {
    // API
    API_BASE_URL: string;
    API_PREFIX: string;
    API_TIMEOUT: string;

    // Storage Keys
    ENCRYPTION_KEY: string;
    ENCRYPTION_ID: string;
    AUTH_STORE: string;
    SETTINGS_STORE: string;

    GOOGLE_WEB_CLIENT_ID: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
