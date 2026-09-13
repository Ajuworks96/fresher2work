'use client';

import { useState, useEffect } from 'react';
import { CompanyProfile, RecruiterProfile, CompanyVerificationStatus } from '@fresher2work/types';
import { recruiterApi } from '@/lib/api';

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [recruiter, setRecruiter] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [designation, setDesignation] = useState('');

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [compRes, recRes] = await Promise.all([
        recruiterApi.getCompany().catch(() => ({ company: null })),
        recruiterApi.getRecruiterProfile().catch(() => ({ recruiter: null })),
      ]);

      if (compRes.company) {
        setCompany(compRes.company);
        setName(compRes.company.name);
        setWebsite(compRes.company.website || '');
        setIndustry(compRes.company.industry || '');
        setLocation(compRes.company.location || '');
      }

      if (recRes.recruiter) {
        setRecruiter(recRes.recruiter);
        setRecruiterName(recRes.recruiter.fullName);
        setDesignation(recRes.recruiter.designation);
      }
    } catch (err) {
      console.warn('Failed to load company profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedComp = await recruiterApi.updateCompany({
        name,
        website,
        industry,
        location,
      });

      if (recruiter) {
        await recruiterApi.updateRecruiterProfile({
          fullName: recruiterName,
          designation,
        });
      }

      setCompany(updatedComp.company);
      setEditing(false);
      setSuccessMsg('Employer profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update company profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading company profile...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Company & Recruiter Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Your verified employer identity visible to freshers when reaching out.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-200 text-xs font-bold">
          {successMsg}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Edit Employer Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Company Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="FinTech / SaaS"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Headquarters
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru, Karnataka"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 pt-2">
            Recruiter Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Designation
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Company Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center font-black text-emerald-800 text-xl border border-emerald-200">
                {company?.name.substring(0, 2).toUpperCase() || 'CO'}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{company?.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    ✓ Verified Employer
                  </span>
                  <span className="text-xs text-slate-400">• Active Discovery Partner</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website</p>
                <p className="text-slate-900 font-semibold mt-0.5">
                  {company?.website ? (
                    <a href={company.website} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                      {company.website} ↗
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Sector</p>
                <p className="text-slate-900 font-semibold mt-0.5">{company?.industry || 'Technology'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Headquarters</p>
                <p className="text-slate-900 font-semibold mt-0.5">{company?.location || 'India'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Status</p>
                <p className="text-emerald-600 font-bold mt-0.5">
                  {company?.verificationStatus || 'VERIFIED'}
                </p>
              </div>
            </div>
          </div>

          {/* Recruiter Representative Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Assigned Talent Partner
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Representative Name</p>
                <p className="text-slate-900 font-semibold mt-0.5">{recruiter?.fullName || 'Recruiter'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Designation</p>
                <p className="text-slate-900 font-semibold mt-0.5">{recruiter?.designation || 'Hiring Lead'}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Email</p>
                <p className="text-slate-900 font-semibold mt-0.5">{recruiter?.businessEmail}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</p>
                <p className="text-emerald-600 font-bold mt-0.5">Verified Recruiter</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
