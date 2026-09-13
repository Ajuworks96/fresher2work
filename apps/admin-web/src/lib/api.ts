import { FresherToWorkApiClient } from '@fresher2work/api-client';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_BASE_URL = rawUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

export const adminApi = new FresherToWorkApiClient({
  baseUrl: API_BASE_URL,
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ftw_admin_token');
    }
    return null;
  },
  onUnauthorized: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ftw_admin_token');
      window.location.href = '/login';
    }
  },
});
