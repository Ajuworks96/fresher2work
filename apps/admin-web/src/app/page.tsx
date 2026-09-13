'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('ftw_admin_token');
    if (token) {
      router.replace('/analytics');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">FresherToWork Admin Portal</h1>
        <p className="mt-2 text-sm text-slate-500">Redirecting to operations...</p>
      </div>
    </div>
  );
}
