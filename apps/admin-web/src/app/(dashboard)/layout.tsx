'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('ftw_admin_token');
    localStorage.removeItem('ftw_admin_user');
    router.push('/login');
  };

  const navItems = [
    { label: 'Platform Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Candidate Moderation', href: '/moderation', icon: ShieldCheck },
    { label: 'Employer Companies', href: '/companies', icon: Building2 },
    { label: 'Recruiter Accounts', href: '/recruiters', icon: Users },
    { label: 'Payment Ledger (₹99)', href: '/payments', icon: CreditCard },
  ];

  const getPageInfo = (path: string) => {
    switch (path) {
      case '/analytics':
        return {
          title: 'Platform Overview & KPIs',
          subtitle: 'Live business performance and activation funnel metrics',
        };
      case '/moderation':
        return {
          title: 'Candidate Talent Pool',
          subtitle: 'Verify student portfolios, project proofs, and profile status',
        };
      case '/companies':
        return {
          title: 'Employer & Company Verification',
          subtitle: 'Authorize corporate hiring partners and company domains',
        };
      case '/recruiters':
        return {
          title: 'Recruiter Accounts & Hiring Managers',
          subtitle: 'Manage employer user access and corporate recruiter credentials',
        };
      case '/payments':
        return {
          title: 'Payment Transactions & Revenue',
          subtitle: 'Real-time audit log of student ₹99 activations and Razorpay order records',
        };
      default:
        return {
          title: 'Platform Operations',
          subtitle: 'FresherToWork Superadmin Control Center',
        };
    }
  };

  const currentInfo = getPageInfo(pathname);

  return (
    <div className="flex min-h-screen bg-slate-100/70 font-sans text-slate-800 antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0B0F17] text-white flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Brand */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-tight text-white">
                Fresher<span className="text-emerald-400">ToWork</span>
              </span>
              <span className="rounded bg-emerald-950/90 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-400 border border-emerald-800/80 uppercase tracking-wider">
                ADMIN
              </span>
            </div>
          </div>

          <div className="px-5 pt-5 pb-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Navigation
            </p>
          </div>

          {/* Navigation */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-[#080B10]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-black text-xs">
                SA
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Super Admin</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] text-emerald-400/90 font-medium">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-red-950/80 border border-slate-700 hover:border-red-800 text-slate-400 hover:text-red-300 flex items-center justify-center transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="text-[11px] text-slate-500 -mt-0.5">
              {currentInfo.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live PostgreSQL Connected
            </span>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
