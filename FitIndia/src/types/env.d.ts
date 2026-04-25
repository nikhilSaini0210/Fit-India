declare module 'react-native-config' {
  export interface NativeConfig {
    // API
    API_BASE_URL_DEV: string;
    API_BASE_URL_PROD: string;
    APP_ENV: string;
    API_PREFIX:string;
    API_TIMEOUT: string;

    // Storage
    ENCRYPTION_KEY: string;
  }

  const Config: NativeConfig;
  export default Config;
}
