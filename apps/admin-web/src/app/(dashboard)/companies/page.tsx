'use client';

import { useEffect, useState } from 'react';
import { CompanyProfile, CompanyVerificationStatus } from '@fresher2work/types';
import { adminApi } from '@/lib/api';
import {
  Building2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Globe,
  MapPin,
} from 'lucide-react';

export default function CompaniesAdminPage() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdminCompanies();
      setCompanies(res.companies || []);
    } catch (err) {
      console.warn('Failed to load companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleVerify = async (id: string, status: CompanyVerificationStatus) => {
    try {
      setActionLoading(true);
      await adminApi.verifyCompany(id, status);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, verificationStatus: status } : c))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update company status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registered Employer Companies</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit employer profiles and approve business domain authenticity for candidate hiring.
          </p>
        </div>
        <button
          onClick={loadCompanies}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Querying registered companies from database...</p>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No Employer Companies Registered Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            All mock companies were cleanly purged. As partner employers register or get onboarded, their records will display here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
              <tr>
                <th className="px-6 py-3.5">Company Name</th>
                <th className="px-6 py-3.5">Industry & Location</th>
                <th className="px-6 py-3.5">Website</th>
                <th className="px-6 py-3.5">Verification</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                    {c.name}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{c.industry || 'Corporate Partner'}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{c.location || 'India'}</span>
                    </p>
                  </td>
                  <td className="px-6 py-4 font-mono text-[11px]">
                    {c.website ? (
                      <a
                        href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        <span>{c.website}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        c.verificationStatus === CompanyVerificationStatus.VERIFIED
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.verificationStatus === CompanyVerificationStatus.REJECTED
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        c.verificationStatus === CompanyVerificationStatus.VERIFIED ? 'bg-emerald-500' : 'bg-amber-400'
                      }`} />
                      {c.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {c.verificationStatus !== CompanyVerificationStatus.VERIFIED && (
                      <button
                        onClick={() => handleVerify(c.id, CompanyVerificationStatus.VERIFIED)}
                        disabled={actionLoading}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-2xs"
                      >
                        Verify
                      </button>
                    )}
                    {c.verificationStatus !== CompanyVerificationStatus.REJECTED && (
                      <button
                        onClick={() => handleVerify(c.id, CompanyVerificationStatus.REJECTED)}
                        disabled={actionLoading}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] transition-colors shadow-2xs"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
