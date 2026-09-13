import { FresherToWorkApiClient } from '@fresher2work/api-client';
import { MOBILE_ENV } from '../config/env';
import { secureStorage } from '../lib/secureStorage';

export const apiClient = new FresherToWorkApiClient({
  baseUrl: MOBILE_ENV.API_URL,
  getToken: async () => {
    return await secureStorage.getAuthToken();
  },
  onUnauthorized: () => {
    secureStorage.deleteAuthToken();
  },
});
