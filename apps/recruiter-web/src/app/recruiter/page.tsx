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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#FF5A36]" />
          <span className="text-sm font-medium text-slate-300">Checking recruiter session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex flex-col justify-between selection:bg-orange-500/20 selection:text-orange-300">
      
      {/* 1. TOP BRAND HEADER */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A36] font-black text-white text-xs shadow-md shadow-orange-500/30">
                F
              </span>
              <span className="font-extrabold tracking-tight text-white text-sm">
                Fresher<span className="text-[#FF5A36]">ToWork</span>
              </span>
            </Link>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400 font-medium hidden sm:inline">Recruiter Enterprise Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Employer Portal</span>
            </div>
            <Link
              href="/superadmin"
              className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors hidden md:inline"
            >
              Super Admin Console ↗
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN AUTHENTICATION CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/10 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">

          {/* ACTIVE SESSION BANNER (if user already logged in) */}
          {activeUser && (
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    Existing Active Session
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    {activeUser.fullName || 'Verified Recruiter'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {activeUser.company?.name || activeUser.companyName || 'Corporate Partner'} • {activeUser.businessEmail || activeUser.email}
                  </p>
                </div>
                <span className="p-1.5 rounded-lg bg-emerald-900/80 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => router.push('/discover')}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Go to Discovery Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOutCurrent}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* MAIN LOGIN CARD */}
          <div className="rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl shadow-black/60 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            
            {/* Card Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF5A36] to-orange-600 text-white shadow-lg shadow-orange-500/25 mx-auto">
                <Building2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Recruiter Portal Login</h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Enter your work credentials to discover verified fresher talent and hire directly.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleRecruiterLogin} className="space-y-4">
              
              {/* Work Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Work Email</span>
                  <span className="text-[10px] text-slate-500 font-normal">Corporate domain</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="arjunworks96@gmail.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-sm text-white font-medium placeholder:text-slate-500 focus:bg-slate-800 focus:border-[#FF5A36] focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[10px] text-slate-500 font-normal">Encrypted TLS</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-sm text-white font-medium placeholder:text-slate-500 focus:bg-slate-800 focus:border-[#FF5A36] focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-[#FF5A36] focus:ring-0 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <Link
                  href="/contact"
                  className="text-[11px] text-slate-400 hover:text-[#FF5A36] transition-colors"
                >
                  Need access help?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#FF5A36] hover:bg-[#e64c29] text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
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
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* QUICK AUTOFILL CREDENTIALS FOR TESTING / DEMO */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF5A36]" /> Quick Demo Recruiter Accounts:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">1-Click Fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleAutofillRecruiter('arjunworks96@gmail.com', 'Recruiter@123')}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-white group-hover:text-[#FF5A36] transition-colors flex items-center justify-between">
                    <span>Arjun (CEO)</span>
                    <span className="text-[9px] text-emerald-400 font-mono">Active</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">arjunworks96@gmail.com</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Pass: Recruiter@123</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAutofillRecruiter('recruiter@freshertowork.com', 'Recruiter@123')}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group cursor-pointer"
                >
                  <div className="font-bold text-white group-hover:text-[#FF5A36] transition-colors flex items-center justify-between">
                    <span>Lead Partner</span>
                    <span className="text-[9px] text-emerald-400 font-mono">Active</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">recruiter@freshertowork.com</div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">Pass: Recruiter@123</div>
                </button>
              </div>
            </div>

            {/* Footer Links & Registration */}
            <div className="pt-2 flex flex-col gap-2.5 text-[11px] text-slate-400">
              <div className="flex items-center justify-between">
                <span>New employer or hiring manager?</span>
                <Link href="/register" className="text-[#FF5A36] hover:underline font-bold transition-colors">
                  Create Recruiter Account →
                </Link>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <Link href="/" className="hover:text-white transition-colors">
                  ← Back to Home
                </Link>
                <Link href="/superadmin" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  Super Admin Console ↗
                </Link>
              </div>
            </div>
          </div>

          {/* Security Assurance footer pill */}
          <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-End Enterprise Encryption • Authorized Corporate Access</span>
          </div>

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        © 2026 FresherToWork Inc. Enterprise Talent Acquisition System. All rights reserved.
      </footer>
    </div>
  );
}
