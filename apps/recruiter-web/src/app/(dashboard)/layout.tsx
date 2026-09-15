'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, BookmarkCheck, Building2, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Recruiter');
  const [companyName, setCompanyName] = useState('Company');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ftw_recruiter_token');
      const stored = localStorage.getItem('ftw_recruiter_user');
      if (!token || !stored) {
        router.replace('/login');
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        const r = parsed.recruiter || parsed;
        const name = r.fullName || parsed.fullName || 'Hiring Manager';
        const comp = r.company?.name || r.companyName || parsed.companyName || 'Corporate Partner';
        setUserName(name);
        setCompanyName(comp);
      } catch (e) {
        router.replace('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ftw_recruiter_token');
    localStorage.removeItem('ftw_recruiter_user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Talent Discovery', href: '/discover', icon: Compass },
    { label: 'Saved Shortlists', href: '/shortlists', icon: BookmarkCheck },
    { label: 'Company Profile', href: '/company', icon: Building2 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <span className="text-lg font-black tracking-tight text-slate-900">
              Fresher<span className="text-emerald-600">ToWork</span>
            </span>
            <span className="ml-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/80 uppercase tracking-wide">
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
                        ? 'bg-emerald-50 text-emerald-900 shadow-xs border border-emerald-200/70'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{companyName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
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
            <h1 className="text-base font-extrabold text-slate-900">
              {pathname === '/discover'
                ? 'Talent Discovery Hub'
                : pathname === '/shortlists'
                ? 'Saved Candidates'
                : 'Company & Employer Profile'}
            </h1>
            <p className="text-xs text-slate-400">
              {pathname === '/discover'
                ? 'Discover verified fresher portfolios with live proof-of-work'
                : pathname === '/shortlists'
                ? 'Manage shortlists and contact candidates'
                : 'Verified employer profile'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Talent Discovery
            </span>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
