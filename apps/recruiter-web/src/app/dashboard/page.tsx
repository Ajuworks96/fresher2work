'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ftw_recruiter_token');
      const stored = localStorage.getItem('ftw_recruiter_user');

      if (token && stored) {
        router.replace('/discover');
      } else {
        router.replace('/recruiter');
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#1f357c] border-t-[#4ad1c7] rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Navigating to dashboard...</span>
      </div>
    </div>
  );
}
