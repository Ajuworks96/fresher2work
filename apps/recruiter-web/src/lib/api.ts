import { FresherToWorkApiClient } from '@fresher2work/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
      localStorage.setItem('ftw_recruiter_token', 'ftw_recruiter_jwt_demo');
    }
  },
});
