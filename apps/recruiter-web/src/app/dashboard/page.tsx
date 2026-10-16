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
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 text-white font-sans">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-[#FF5A36] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Navigating to dashboard...</span>
      </div>
    </div>
  );
}
