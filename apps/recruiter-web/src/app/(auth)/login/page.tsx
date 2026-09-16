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
  const [successBanner, setSuccessBanner] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const handleRequestForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setForgotLoading(true);

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset code');

      setForgotMsg(`✓ ${data.message || 'Verification code sent to your email'}`);
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset code');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setForgotLoading(true);

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: forgotOtp.trim(),
          newPassword: forgotNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      // Update local storage cache of recruiters if present
      if (typeof window !== 'undefined') {
        try {
          const cachedList: any[] = JSON.parse(localStorage.getItem('ftw_admin_recruiters_cache') || '[]');
          const target = forgotEmail.trim().toLowerCase();
          const updated = cachedList.map((r: any) => {
            if ((r.businessEmail || r.email)?.toLowerCase() === target) {
              return { ...r, password: forgotNewPassword };
            }
            return r;
          });
          localStorage.setItem('ftw_admin_recruiters_cache', JSON.stringify(updated));
        } catch (_) {}
      }

      setShowForgotModal(false);
      setEmail(forgotEmail);
      setPassword(forgotNewPassword);
      setSuccessBanner('✓ Password updated successfully! You can now sign in.');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

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
            {successBanner && (
              <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-2">
                <span>{successBanner}</span>
              </div>
            )}

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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email || '');
                    setForgotStep(1);
                    setForgotError('');
                    setForgotMsg('');
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Reset Recruiter Password</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {forgotStep === 1
                    ? 'Enter your work email to receive a 4-digit verification code'
                    : 'Enter the code received on your email & set a new password'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {forgotError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                {forgotError}
              </div>
            )}
            {forgotMsg && (
              <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 border border-emerald-200">
                {forgotMsg}
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleRequestForgotOtp} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {forgotLoading ? 'Sending Code...' : 'Send Reset Code →'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <input
                    type="email"
                    disabled
                    value={forgotEmail}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">4-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm tracking-widest font-black text-center text-lg focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 6 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                  >
                    ← Change email
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {forgotLoading ? 'Updating...' : 'Set New Password'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
