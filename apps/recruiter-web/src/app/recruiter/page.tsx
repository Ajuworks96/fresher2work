'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterPage() {
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
      if (!localStorage.getItem('ftw_recruiter_token')) {
        localStorage.setItem('ftw_recruiter_token', 'ftw_recruiter_jwt_demo');
        localStorage.setItem('ftw_recruiter_user', JSON.stringify(defaultRecruiter));
      }
      router.replace('/discover');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">FresherToWork Recruiter</h1>
        <p className="mt-2 text-sm text-slate-500">Opening recruiter portal...</p>
      </div>
    </div>
  );
}
