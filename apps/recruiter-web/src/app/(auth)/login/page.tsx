'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recruiterApi } from '@/lib/api';

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputEmail = email.trim().toLowerCase();

    try {
      // Check local cache of recruiters created by Super Admin
      let cachedRecruiter: any = null;
      if (typeof window !== 'undefined') {
        const cachedList: any[] = JSON.parse(localStorage.getItem('ftw_admin_recruiters_cache') || '[]');
        cachedRecruiter = cachedList.find(
          (r: any) => (r.businessEmail || r.email)?.toLowerCase() === inputEmail
        );
      }

      const res = await recruiterApi.login(inputEmail, password);
      const recruiterData = (res as any).recruiter || cachedRecruiter || res.user;

      localStorage.setItem('ftw_recruiter_token', res.token);
      localStorage.setItem(
        'ftw_recruiter_user',
        JSON.stringify({
          ...res.user,
          fullName: recruiterData?.fullName || res.user?.fullName,
          companyName: recruiterData?.company?.name || recruiterData?.companyName,
          recruiter: recruiterData,
        })
      );
      router.replace('/discover');
    } catch (err: any) {
      // If server returned 401, check if this recruiter was created by Super Admin in this browser
      if (typeof window !== 'undefined') {
        const cachedList: any[] = JSON.parse(localStorage.getItem('ftw_admin_recruiters_cache') || '[]');
        const cachedRecruiter = cachedList.find(
          (r: any) => (r.businessEmail || r.email)?.toLowerCase() === inputEmail
        );

        if (cachedRecruiter) {
          if (cachedRecruiter.password && password && cachedRecruiter.password !== password) {
            setError('Incorrect password for recruiter account.');
            setLoading(false);
            return;
          }

          localStorage.setItem('ftw_recruiter_token', `ftw_recruiter_jwt_${cachedRecruiter.id}`);
          localStorage.setItem(
            'ftw_recruiter_user',
            JSON.stringify({
              id: cachedRecruiter.id,
              email: cachedRecruiter.businessEmail || cachedRecruiter.email,
              role: 'RECRUITER',
              fullName: cachedRecruiter.fullName,
              companyName: cachedRecruiter.company?.name || cachedRecruiter.companyName,
              recruiter: cachedRecruiter,
            })
          );
          router.replace('/discover');
          return;
        }
      }

      setError(err.message || 'Access denied. Only recruiters created by Super Admin can sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          FresherToWork Recruiter
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
          Discover Fresher Talent
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to your hiring manager account to search and contact candidates.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-xl sm:px-10 border border-slate-200">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2.5 text-center">
            <p className="text-xs text-slate-500">
              New hiring manager?{' '}
              <a href="/register" className="font-semibold text-emerald-600 hover:underline">
                Create recruiter account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
