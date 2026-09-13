import { FresherToWorkApiClient } from '@fresher2work/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const recruiterApi = new FresherToWorkApiClient({
  baseUrl: API_BASE_URL,
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ftw_recruiter_token');
    }
    return null;
  },
  onUnauthorized: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ftw_recruiter_token');
      window.location.href = '/login';
    }
  },
});
