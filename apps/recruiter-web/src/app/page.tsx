'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/recruiter');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">FresherToWork</h1>
        <p className="mt-2 text-sm text-slate-500">Redirecting to recruiter portal...</p>
      </div>
    </div>
  );
}
