import Constants from 'expo-constants';

export const MOBILE_ENV = {
  API_URL:
    Constants.expoConfig?.extra?.apiUrl ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://localhost:4000',
  APP_NAME: 'FresherToWork',
};
