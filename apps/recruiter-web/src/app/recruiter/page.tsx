'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Sparkles,
  LogOut,
  UserCheck,
} from 'lucide-react';

export default function RecruiterPortalPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active session check state
  const [activeUser, setActiveUser] = useState<any | null>(null);
  const [checkingExistingSession, setCheckingExistingSession] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    // Check if an existing, valid recruiter session exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ftw_recruiter_token');
      const stored = localStorage.getItem('ftw_recruiter_user');
      if (token && stored) {
        try {
          const parsed = JSON.parse(stored);
          setActiveUser(parsed.recruiter || parsed);
        } catch (_) {
          localStorage.removeItem('ftw_recruiter_token');
          localStorage.removeItem('ftw_recruiter_user');
        }
      }
      setCheckingExistingSession(false);
    }
  }, []);

  const handleRecruiterLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      // Ensure user has recruiter or admin role
      const userRole = data.user?.role;
      if (userRole !== 'RECRUITER' && userRole !== 'ADMIN') {
        throw new Error('Access Denied: This portal is exclusively for verified corporate recruiters.');
      }

      const recruiterObj = data.recruiter || data.user;
      localStorage.setItem('ftw_recruiter_token', data.token);
      localStorage.setItem('ftw_recruiter_user', JSON.stringify(recruiterObj));

      router.replace('/discover');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofillRecruiter = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage(null);
  };

  const handleSignOutCurrent = () => {
    localStorage.removeItem('ftw_recruiter_token');
    localStorage.removeItem('ftw_recruiter_user');
    setActiveUser(null);
  };

  if (checkingExistingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#1f357c]" />
          <span className="text-sm font-medium text-slate-500">Checking recruiter session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-[#4ad1c7]/20 selection:text-[#1f357c]">
      
      {/* 1. TOP BRAND HEADER */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/brand/logo.png"
                alt="Fresher2Work"
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500 font-medium hidden sm:inline">Recruiter Enterprise Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f357c]/5 border border-[#3e7aa7]/30 text-[11px] text-[#1f357c] font-bold shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ad1c7] animate-pulse" />
              <span>Verified Employer Portal</span>
            </div>
            <Link
              href="/superadmin"
              className="text-[11px] font-semibold text-slate-500 hover:text-[#1f357c] transition-colors hidden md:inline"
            >
              Super Admin Console ↗
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN AUTHENTICATION CONTAINER (Identical to Super Admin Color Pattern) */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 relative">
        <div className="w-full max-w-md space-y-6">

          {/* ACTIVE SESSION BANNER (if user already logged in) */}
          {activeUser && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#1f357c] flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#3e7aa7]" />
                    Existing Active Session
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {activeUser.fullName || 'Verified Recruiter'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {activeUser.company?.name || activeUser.companyName || 'Corporate Partner'} • {activeUser.businessEmail || activeUser.email}
                  </p>
                </div>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => router.push('/discover')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1f357c] via-[#243e8f] to-[#3e7aa7] hover:from-[#17285c] hover:to-[#326489] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#1f357c]/20"
                >
                  <span>Go to Discovery Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#4ad1c7]" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOutCurrent}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN LOGIN CARD (Matches Super Admin's white card and typography) */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-8 space-y-6">
            
            {/* Card Header with Centered Logo */}
            <div className="text-center space-y-2">
              <Link href="/" className="inline-block mb-1">
                <img
                  src="/brand/logo.png"
                  alt="Fresher2Work"
                  className="h-10 w-auto mx-auto object-contain"
                />
              </Link>
              <h2 className="text-2xl font-black tracking-tight text-[#1f357c]">Recruiter Portal Login</h2>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                Fresher2Work Corporate Hiring & Talent Discovery
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleRecruiterLogin} className="space-y-4">
              
              {/* Work Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Work Email</span>
                  <span className="text-[10px] text-slate-400 font-normal">Corporate domain</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="arjunworks96@gmail.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#3e7aa7] focus:outline-none focus:ring-2 focus:ring-[#3e7aa7]/15 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Encrypted TLS</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:border-[#3e7aa7] focus:outline-none focus:ring-2 focus:ring-[#3e7aa7]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-100 border-slate-300 text-[#1f357c] focus:ring-[#1f357c]/20 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <Link
                  href="/contact"
                  className="text-[11px] text-[#3e7aa7] hover:underline transition-colors font-medium"
                >
                  Need access help?
                </Link>
              </div>

              {/* Submit Button (Identical to Super Admin Gradient Button) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1f357c] via-[#243e8f] to-[#3e7aa7] hover:from-[#17285c] hover:to-[#326489] text-white text-xs font-bold transition-all shadow-md shadow-[#1f357c]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in to portal...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 stroke-[2]" />
                    <span>Sign In to Recruiter Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#4ad1c7]" />
                  </>
                )}
              </button>
            </form>

            {/* QUICK AUTOFILL CREDENTIALS FOR TESTING / DEMO */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold flex items-center gap-1 text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-[#3e7aa7]" /> Quick Demo Recruiter Accounts:
                </span>
                <span className="text-[10px] text-[#1f357c] font-bold">1-Click Fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleAutofillRecruiter('arjunworks96@gmail.com', 'Recruiter@123')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#1f357c]/5 border border-slate-200 hover:border-[#3e7aa7]/50 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-slate-900 group-hover:text-[#1f357c] transition-colors flex items-center justify-between">
                    <span>Arjun (CEO)</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-200">Active</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">arjunworks96@gmail.com</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Pass: Recruiter@123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutofillRecruiter('recruiter@freshertowork.com', 'Recruiter@123')}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#1f357c]/5 border border-slate-200 hover:border-[#3e7aa7]/50 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-slate-900 group-hover:text-[#1f357c] transition-colors flex items-center justify-between">
                    <span>Lead Partner</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-200">Active</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">recruiter@freshertowork.com</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">Pass: Recruiter@123</div>
                </button>
              </div>
            </div>

            {/* Footer Links & Registration */}
            <div className="pt-2 flex flex-col gap-2.5 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span>New employer or hiring manager?</span>
                <Link href="/register" className="text-[#1f357c] hover:underline font-bold transition-colors">
                  Create Recruiter Account →
                </Link>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link href="/" className="hover:text-slate-900 transition-colors">
                  ← Back to Home
                </Link>
                <Link href="/superadmin" className="text-[#3e7aa7] hover:text-[#1f357c] font-semibold transition-colors">
                  Super Admin Console ↗
                </Link>
              </div>
            </div>
          </div>

          {/* Security Assurance footer pill */}
          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#1f357c]" />
            <span>End-to-End Enterprise Encryption • Authorized Corporate Access</span>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 bg-white">
        © 2026 Fresher2Work Inc. Enterprise Talent Acquisition System. All rights reserved.
      </footer>
    </div>
  );
}
