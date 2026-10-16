'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/recruiter');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-800">FresherToWork</h1>
        <p className="mt-1 text-xs text-slate-500">Redirecting to recruiter portal...</p>
      </div>
    </div>
  );
}
