'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  Building2,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Briefcase,
  Users,
  Eye,
  Bookmark,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      setRefreshing(true);
      const res = await adminApi.getAdminAnalytics();
      setData(res);
    } catch (err) {
      console.warn('Failed to load analytics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Querying live platform analytics...</p>
      </div>
    );
  }

  const m = data?.metrics || {};
  const latestStudents = data?.recentActivity?.latestStudents || [];
  const verifiedPlacements = data?.verifiedPlacements || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner with Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Platform Operations & Hiring Growth</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated in real-time from mobile candidate registrations, recruiter activity, and verified in-app placements.
          </p>
        </div>
        <button
          onClick={loadAnalytics}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold rounded-xl transition-all shadow-xs self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Live Data'}</span>
        </button>
      </div>

      {/* KPI Cards Row 1: Core Platform */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Candidates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Candidates</p>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3 tracking-tight">{m.totalStudents || 0}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Mobile App Signups</span>
          </div>
        </div>

        {/* Card 2: Activated Profiles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activated Profiles</p>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-3 tracking-tight">{m.activatedStudents || 0}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{m.activationRatePercent || 0}% Conversion Rate</span>
          </div>
        </div>

        {/* Card 3: Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue (₹99)</p>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3 tracking-tight">₹{m.totalRevenueInRupees || 0}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-600 font-medium">
            <span>{m.successfulPaymentsCount || 0} Successful Activations</span>
          </div>
        </div>

        {/* Card 4: Corporate Partners */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Partners</p>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-3 tracking-tight">{m.totalCompanies || 0}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
            <span>{m.totalRecruiters || 0} Active Recruiters</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row 2: In-App Placement & Recruiter Telemetry */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Talent Hiring & Placement Telemetry
            </h3>
            <p className="text-xs text-slate-500">Corporate recruiter engagement & job placement outcomes</p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% In-App Direct Placement Ratio</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Direct Hires */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Verified Direct Hires</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-600 mt-2 tracking-tight">
              {m.totalHiredCandidates || verifiedPlacements.length || 0}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Platform freshers placed</p>
          </div>

          {/* Average Package */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Average Package (CTC)</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {m.averagePackageLpa || '—'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Across technology & design roles</p>
          </div>

          {/* Average Time to Hire */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Average Days to Hire</span>
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              {m.averageDaysToHire || '—'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">From profile view to offer letter</p>
          </div>

          {/* Recruiter Activity: Shortlists & Reveals */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase font-bold tracking-wider">Shortlists & Reveals</span>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{m.totalShortlists || 0}</p>
              <span className="text-xs text-slate-400 font-medium">saved /</span>
              <p className="text-xl font-bold text-amber-600 tracking-tight">{m.totalContactReveals || 0}</p>
              <span className="text-xs text-slate-400 font-medium">reveals</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Direct interview interest signals</p>
          </div>
        </div>
      </div>

      {/* Verified Direct In-App Placements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Verified Platform Direct Hires</h3>
            <p className="text-xs text-slate-500">Live placement records resulting from recruiter outreach</p>
          </div>
          <Link
            href="/recruiters"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>Manage Recruiter Accounts</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {verifiedPlacements.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            <Award className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs font-semibold">No placements recorded yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
              <tr>
                <th className="px-6 py-3.5">Candidate Name</th>
                <th className="px-6 py-3.5">Designation / Role</th>
                <th className="px-6 py-3.5">Hiring Employer</th>
                <th className="px-6 py-3.5">Corporate Recruiter</th>
                <th className="px-6 py-3.5">Package Offered</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifiedPlacements.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                        {p.candidateName?.[0] || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{p.candidateName}</p>
                        <p className="text-[11px] text-slate-400">{p.candidateHeadline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{p.roleTitle}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{p.companyName}</td>
                  <td className="px-6 py-4 text-slate-600">{p.recruiterName}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {p.packageLpa}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Direct Hire</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Activity: Latest Candidate Signups */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Candidate Registrations</h3>
            <p className="text-xs text-slate-500">Live student candidate accounts from the Flutter Mobile App</p>
          </div>
          <Link
            href="/moderation"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>Candidate Directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {latestStudents.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Candidates Registered Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              As students register in the mobile app, their profiles will populate here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {latestStudents.map((s: any) => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 uppercase">
                    {s.fullName?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.fullName}</p>
                    <p className="text-xs text-slate-500">{s.headline || s.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {s.completenessScore}% Score
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      s.isActivated
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {s.isActivated ? 'Active' : 'Unpaid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
