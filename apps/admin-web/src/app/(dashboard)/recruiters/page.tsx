'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import {
  Users,
  UserPlus,
  RefreshCw,
  ExternalLink,
  Mail,
  Building2,
  X,
  Award,
  Bookmark,
  Eye,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Search,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  AlertTriangle,
} from 'lucide-react';

export default function RecruitersAdminPage() {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<any | null>(null);
  const [deletingRecruiter, setDeletingRecruiter] = useState<any | null>(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'recruiters' | 'placements'>('recruiters');

  // Add Recruiter Form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    designation: '',
    companyName: '',
    industry: '',
    location: '',
    website: '',
  });

  // Edit Recruiter Form
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    designation: '',
    businessEmail: '',
    phone: '',
    linkedinUrl: '',
    companyName: '',
    companyIndustry: '',
    companyLocation: '',
    companyWebsite: '',
    password: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [recRes, plcRes] = await Promise.all([
        adminApi.getAdminRecruiters(),
        adminApi.getAdminPlacements().catch(() => ({ placements: [], metrics: {} })),
      ]);
      setRecruiters(recRes.recruiters || []);
      setPlacements(plcRes.placements || []);
    } catch (err) {
      console.warn('Failed to load recruiters or placements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRecruiter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminApi.createRecruiterByAdmin(formData);
      setShowAddModal(false);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
        companyName: '',
        industry: '',
        location: '',
        website: '',
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create recruiter');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (recruiter: any) => {
    setEditingRecruiter(recruiter);
    setEditFormData({
      fullName: recruiter.fullName || '',
      designation: recruiter.designation || '',
      businessEmail: recruiter.businessEmail || '',
      phone: recruiter.phone || recruiter.user?.phone || '',
      linkedinUrl: recruiter.linkedinUrl || '',
      companyName: recruiter.company?.name || '',
      companyIndustry: recruiter.company?.industry || '',
      companyLocation: recruiter.company?.location || '',
      companyWebsite: recruiter.company?.website || '',
      password: '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecruiter) return;
    try {
      setSubmitting(true);
      await adminApi.updateRecruiterByAdmin(editingRecruiter.id, editFormData);
      setEditingRecruiter(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update recruiter details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecruiter = async () => {
    if (!deletingRecruiter) return;
    try {
      setSubmitting(true);
      await adminApi.deleteRecruiterByAdmin(deletingRecruiter.id);
      setRecruiters((prev) => prev.filter((r) => r.id !== deletingRecruiter.id));
      if (selectedRecruiter?.id === deletingRecruiter.id) {
        setSelectedRecruiter(null);
      }
      setDeletingRecruiter(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete recruiter account');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecruiters = recruiters.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.businessEmail.toLowerCase().includes(q) ||
      (r.company?.name && r.company.name.toLowerCase().includes(q)) ||
      (r.designation && r.designation.toLowerCase().includes(q))
    );
  });

  const totalHires = recruiters.reduce((sum, r) => sum + (r.hiresCount || 0), 0);
  const totalShortlists = recruiters.reduce((sum, r) => sum + (r.shortlistsCount || 0), 0);
  const totalReveals = recruiters.reduce((sum, r) => sum + (r.revealsCount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recruiter Operations & Hiring Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add real corporate recruiters, manage partner accounts, and monitor candidate hiring outcomes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Real Recruiter</span>
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar - 100% Real */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Recruiter Partners</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{recruiters.length}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Real registered corporate accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Candidates Hired</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {placements.length > 0 ? placements.length : totalHires}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">Direct In-App Hires</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Saved Shortlists</span>
            <Bookmark className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalShortlists}</p>
          <p className="text-[11px] text-slate-500 font-medium">Candidates bookmarked by recruiters</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-bold tracking-wider">Contact Reveals</span>
            <Eye className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalReveals}</p>
          <p className="text-[11px] text-slate-500 font-medium">Direct interview outreach clicks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('recruiters')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'recruiters'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Recruiter Accounts ({recruiters.length})
          </button>
          <button
            onClick={() => setActiveTab('placements')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'placements'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Direct In-App Hires & Placements ({placements.length})
          </button>
        </div>

        {activeTab === 'recruiters' && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search recruiter or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-64 shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Recruiters List */}
      {activeTab === 'recruiters' && (
        <>
          {loading ? (
            <div className="py-24 text-center text-slate-400 flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">Retrieving recruiters from database...</p>
            </div>
          ) : filteredRecruiters.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No Recruiters Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                All dummy records have been removed. You can onboard real corporate hiring partners using the button below.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Onboard Real Recruiter</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Recruiter Details</th>
                    <th className="px-5 py-3.5">Company Profile</th>
                    <th className="px-5 py-3.5">Contact Details</th>
                    <th className="px-5 py-3.5">Candidates Hired</th>
                    <th className="px-5 py-3.5">Shortlists</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecruiters.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Recruiter Details */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                            {r.fullName?.[0] || 'R'}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedRecruiter(r)}
                              className="font-bold text-slate-900 hover:text-emerald-600 text-sm text-left block transition-colors cursor-pointer"
                            >
                              {r.fullName}
                            </button>
                            <span className="text-[11px] text-slate-400">{r.designation}</span>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">{(r.company as any)?.name || '—'}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            {(r.company as any)?.location && <span>{(r.company as any).location}</span>}
                            {(r.company as any)?.industry && (
                              <span>• {(r.company as any).industry}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 space-y-0.5">
                        <p className="font-mono text-emerald-600 text-[11px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{r.businessEmail}</span>
                        </p>
                        {r.phone && (
                          <p className="font-mono text-slate-400 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-300 shrink-0" />
                            <span>{r.phone}</span>
                          </p>
                        )}
                      </td>

                      {/* Hired Candidates */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">
                          <Award className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.hiresCount || 0} Hired</span>
                        </span>
                      </td>

                      {/* Shortlists */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-700 font-mono">
                          {r.shortlistsCount || 0} candidates
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedRecruiter(r)}
                            title="Inspect recruiter details"
                            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <button
                            onClick={() => openEditModal(r)}
                            title="Edit recruiter profile & company"
                            className="p-1.5 bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingRecruiter(r)}
                            title="Delete recruiter account"
                            className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 text-red-600 font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Verified Direct In-App Placements */}
      {activeTab === 'placements' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direct In-App Placements & Hires</h3>
                <p className="text-xs text-slate-500">Students recruited and hired through FresherToWork mobile app</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Direct Hires</span>
              </span>
            </div>

            {placements.length === 0 ? (
              <div className="p-16 text-center text-slate-400">
                <Award className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                <h4 className="text-sm font-bold text-slate-800">No In-App Placements Recorded Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  All dummy records were purged. As corporate recruiters review candidates on the platform and extend job offers, verified placement records will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-5 py-3.5">Hired Candidate</th>
                    <th className="px-5 py-3.5">Hired Role</th>
                    <th className="px-5 py-3.5">Hiring Employer</th>
                    <th className="px-5 py-3.5">Recruiter In-Charge</th>
                    <th className="px-5 py-3.5">Offered Package</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {placements.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                            {p.candidateName?.[0] || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.candidateName}</p>
                            <p className="text-[11px] text-slate-400">{p.candidateHeadline}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">{p.roleTitle}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900">{p.companyName}</span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-700">{p.recruiterName}</p>
                        <p className="text-[10px] text-slate-400">{p.recruiterDesignation}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {p.packageLpa}
                        </span>
                      </td>

                      <td className="px-5 py-4">
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
        </div>
      )}

      {/* Inspect Recruiter Details Modal */}
      {selectedRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-slate-700">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-black text-slate-700 text-sm">
                  {selectedRecruiter.fullName?.[0] || 'R'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedRecruiter.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedRecruiter.designation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    openEditModal(selectedRecruiter);
                    setSelectedRecruiter(null);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedRecruiter(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Company Info Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Company Profile</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {selectedRecruiter.company?.verificationStatus || 'VERIFIED'}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800">{selectedRecruiter.company?.name || '—'}</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <p><span className="text-slate-400">Location:</span> {selectedRecruiter.company?.location || '—'}</p>
                  <p><span className="text-slate-400">Industry:</span> {selectedRecruiter.company?.industry || '—'}</p>
                </div>
                {selectedRecruiter.company?.website && (
                  <a
                    href={selectedRecruiter.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:underline pt-1 text-[11px]"
                  >
                    <Globe className="w-3 h-3" />
                    <span>{selectedRecruiter.company.website}</span>
                  </a>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Contact & Credentials</span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-800 font-mono">{selectedRecruiter.businessEmail}</span>
                  </p>
                  {selectedRecruiter.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-800 font-mono">{selectedRecruiter.phone}</span>
                    </p>
                  )}
                  {selectedRecruiter.linkedinUrl && (
                    <a
                      href={selectedRecruiter.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Activity Stats */}
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Hires</p>
                  <p className="text-base font-black text-emerald-600 mt-0.5">{selectedRecruiter.hiresCount || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Shortlists</p>
                  <p className="text-base font-black text-slate-800 mt-0.5">{selectedRecruiter.shortlistsCount || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Reveals</p>
                  <p className="text-base font-black text-slate-800 mt-0.5">{selectedRecruiter.revealsCount || 0}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <button
                onClick={() => {
                  setDeletingRecruiter(selectedRecruiter);
                  setSelectedRecruiter(null);
                }}
                className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Delete Recruiter Account
              </button>
              <button
                onClick={() => setSelectedRecruiter(null)}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Real Recruiter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-slate-700">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Onboard Real Recruiter & Company</h3>
                <p className="text-xs text-slate-500">Create official employer hiring account and register company details.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRecruiter} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Recruiter Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HR Manager / Lead Talent"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Login Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Innovations"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software, E-commerce, Edtech"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Company Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bangalore, Kochi, Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Company Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Onboarding...' : 'Confirm Recruiter Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Recruiter Details Modal */}
      {editingRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 text-slate-700">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Recruiter & Company Details</h3>
                <p className="text-xs text-slate-500">Update corporate hiring partner credentials and profile information.</p>
              </div>
              <button
                onClick={() => setEditingRecruiter(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.designation}
                    onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={editFormData.businessEmail}
                    onChange={(e) => setEditFormData({ ...editFormData, businessEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.companyName}
                    onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={editFormData.companyIndustry}
                    onChange={(e) => setEditFormData({ ...editFormData, companyIndustry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.companyLocation}
                    onChange={(e) => setEditFormData({ ...editFormData, companyLocation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Company Website URL
                  </label>
                  <input
                    type="url"
                    value={editFormData.companyWebsite}
                    onChange={(e) => setEditFormData({ ...editFormData, companyWebsite: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={editFormData.linkedinUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Set New Password (leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  placeholder="New password (min 6 characters)"
                  value={editFormData.password || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecruiter(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Recruiter Confirmation Modal */}
      {deletingRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 text-slate-700 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Recruiter Account?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete recruiter{' '}
                <span className="font-bold text-slate-800">{deletingRecruiter.fullName}</span> (
                {deletingRecruiter.businessEmail})? This will suspend their corporate hiring access.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRecruiter(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRecruiter}
                disabled={submitting}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Deleting...' : 'Yes, Delete Recruiter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
