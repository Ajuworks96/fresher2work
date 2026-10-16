'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { recruiterApi } from '@/lib/api';

export default function RecruiterRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await recruiterApi.register({
        fullName,
        email: workEmail,
        password,
        phone,
        role: 'RECRUITER' as any,
        companyName,
        designation,
      });
      localStorage.setItem('ftw_recruiter_token', res.token);
      localStorage.setItem('ftw_recruiter_user', JSON.stringify(res.user));
      router.replace('/discover');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-3 group">
          <img
            src="/brand/logo.png"
            alt="Fresher2Work"
            className="h-10 w-auto mx-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f357c]/10 px-3.5 py-1 text-xs font-semibold text-[#1f357c] border border-[#3e7aa7]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ad1c7]" />
            Fresher2Work Recruiter Onboarding
          </span>
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Create Recruiter Account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Discover verified fresher talent with real proof-of-work.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Anjali Menon"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Designation
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Talent Lead / Founder"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Company Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="RazorScale Technologies"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
                />
              </div>
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
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full justify-center rounded-xl bg-gradient-to-r from-[#1f357c] via-[#243e8f] to-[#3e7aa7] hover:from-[#17285c] hover:to-[#326489] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#1f357c]/20 focus:outline-none focus:ring-2 focus:ring-[#3e7aa7] disabled:opacity-60 transition-all cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Register as Recruiter'}
            </button>
          </form>

          <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col gap-2 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/recruiter" className="font-semibold text-[#1f357c] hover:text-[#3e7aa7] hover:underline">
                Go to Recruiter Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
