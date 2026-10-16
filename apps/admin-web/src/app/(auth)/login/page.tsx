'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminApi.login(email.trim(), password);
      if (res.user.role !== 'ADMIN') {
        throw new Error('Unauthorized. Superadmin administrative privileges required.');
      }
      localStorage.setItem('ftw_admin_token', res.token);
      localStorage.setItem('ftw_admin_user', JSON.stringify(res.user));
      router.push('/analytics');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#070D1F] text-slate-100 antialiased font-sans">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mb-4">
          <img
            src="/brand/logo.png"
            alt="Fresher2Work"
            className="h-11 w-auto mx-auto object-contain brightness-105"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0C1633] px-3.5 py-1 text-xs font-semibold text-[#4ad1c7] border border-[#3e7aa7]/40 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ad1c7] animate-pulse" />
          <span>Superadmin Security Layer</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Executive Platform Operations & Talent Moderation
        </p>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800">
          <form className="space-y-4.5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-950/80 p-3 text-xs text-red-300 border border-red-800/80 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@freshertowork.com"
                  className="w-full rounded-xl border border-slate-700 bg-[#080B10] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-[#080B10] pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#3e7aa7] focus:outline-none focus:ring-1 focus:ring-[#3e7aa7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f357c] via-[#243e8f] to-[#3e7aa7] hover:from-[#17285c] hover:to-[#326489] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-[#1f357c]/40 disabled:opacity-60 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Superadmin</span>
                  <ArrowRight className="w-4 h-4 text-[#4ad1c7]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@freshertowork.com');
                setPassword('SuperAdmin@Pass2026#');
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-[#1f357c]/30 border border-slate-700 hover:border-[#3e7aa7]/60 text-slate-400 hover:text-[#4ad1c7] text-xs font-medium transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Quick-fill Admin: admin@freshertowork.com</span>
              <span className="text-[10px] text-[#4ad1c7] font-mono">1-Click</span>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ad1c7]" />
              <span>Session encrypted with 256-bit JWT authorization</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
