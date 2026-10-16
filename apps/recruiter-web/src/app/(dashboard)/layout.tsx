'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, BookmarkCheck, Building2, LogOut, ShieldCheck } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ftw_recruiter_token');
      const stored = localStorage.getItem('ftw_recruiter_user');

      // STRICT AUTH GUARD: Without a valid token and recruiter session, NEVER allow dashboard access!
      if (!token || !stored || token.trim() === '') {
        setIsAuthVerified(false);
        router.replace('/recruiter');
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        const r = parsed.recruiter || parsed;
        const name = r.fullName || parsed.fullName || 'Partner Recruiter';
        const comp = r.company?.name || r.companyName || parsed.companyName || 'Corporate Partner';
        setUserName(name);
        setCompanyName(comp);
        setIsAuthVerified(true);
      } catch (e) {
        // Corrupted session -> clear credentials and redirect to login
        localStorage.removeItem('ftw_recruiter_token');
        localStorage.removeItem('ftw_recruiter_user');
        setIsAuthVerified(false);
        router.replace('/recruiter');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ftw_recruiter_token');
    localStorage.removeItem('ftw_recruiter_user');
    setIsAuthVerified(false);
    router.replace('/recruiter');
  };

  // NEVER render dashboard children until recruiter authentication is verified!
  if (!isAuthVerified) {
    return (
      <div className="min-h-screen bg-[#070D1F] flex flex-col items-center justify-center p-6 text-white font-sans">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0C1633] border border-[#3e7aa7]/40 text-xs font-semibold text-[#4ad1c7]">
            <span className="w-2 h-2 rounded-full bg-[#4ad1c7] animate-pulse" />
            <span>Fresher2Work • Verifying Recruiter Session</span>
          </div>
          <div className="h-10 w-10 border-2 border-[#3e7aa7]/30 border-t-[#4ad1c7] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-200">Verifying Recruiter Access...</p>
          <p className="text-xs text-slate-400">Checking enterprise session authorization</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Talent Discovery', href: '/discover', icon: Compass },
    { label: 'Saved Shortlists', href: '/shortlists', icon: BookmarkCheck },
    { label: 'Company Profile', href: '/company', icon: Building2 },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <Link href="/discover" className="flex items-center gap-2">
              <img
                src="/brand/logo.png"
                alt="Fresher2Work"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="rounded-md bg-[#1f357c]/10 px-2 py-0.5 text-[9px] font-extrabold text-[#1f357c] border border-[#3e7aa7]/30 uppercase tracking-wide">
              RECRUITER
            </span>
          </div>

          <div className="p-4">
            <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
            <nav className="space-y-1 mt-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#1f357c]/10 to-[#3e7aa7]/10 text-[#1f357c] shadow-xs border-l-4 border-[#4ad1c7] font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-[#1f357c]' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div className="truncate mr-2">
              <p className="text-xs font-bold text-[#1f357c] truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{companyName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2]" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-base font-extrabold text-[#1f357c]">
              {pathname === '/discover'
                ? 'Talent Discovery Hub'
                : pathname === '/shortlists'
                ? 'Saved Candidates'
                : 'Company & Employer Profile'}
            </h1>
            <p className="text-xs text-slate-500">
              {pathname === '/discover'
                ? 'Discover verified fresher portfolios with live proof-of-work'
                : pathname === '/shortlists'
                ? 'Manage shortlists and contact candidates'
                : 'Verified employer profile and organization settings'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4ad1c7]/15 px-3 py-1 text-xs font-semibold text-[#1f357c] border border-[#4ad1c7]/40 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#4ad1c7] animate-pulse"></span>
              Live Talent Discovery
            </span>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
