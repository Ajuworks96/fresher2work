'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultRecruiter = {
        id: 'user-recruiter-demo',
        fullName: 'Partner Recruiter',
        designation: 'Lead Talent Partner',
        businessEmail: 'recruiter@freshertowork.com',
        role: 'RECRUITER',
        company: {
          id: 'company-razorscale',
          name: 'RazorScale Technologies',
          verificationStatus: 'VERIFIED',
        },
        companyName: 'RazorScale Technologies',
      };
      localStorage.setItem('ftw_recruiter_token', 'ftw_recruiter_jwt_demo');
      localStorage.setItem('ftw_recruiter_user', JSON.stringify(defaultRecruiter));
      router.replace('/recruiter');
    }
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
