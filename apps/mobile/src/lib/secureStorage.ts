import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'fresher2work_auth_token';
const USER_KEY = 'fresher2work_user_data';

export const secureStorage = {
  async saveAuthToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn('Failed to save auth token to secure storage', e);
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(TOKEN_KEY);
        }
        return null;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to get auth token from secure storage', e);
      return null;
    }
  },

  async deleteAuthToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Failed to delete auth token from secure storage', e);
    }
  },

  async saveUserData(userData: any): Promise<void> {
    try {
      const json = JSON.stringify(userData);
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_KEY, json);
        }
      } else {
        await SecureStore.setItemAsync(USER_KEY, json);
      }
    } catch (e) {
      console.warn('Failed to save user data', e);
    }
  },

  async getUserData(): Promise<any | null> {
    try {
      let raw: string | null = null;
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          raw = localStorage.getItem(USER_KEY);
        }
      } else {
        raw = await SecureStore.getItemAsync(USER_KEY);
      }
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Failed to read user data', e);
      return null;
    }
  },
};
