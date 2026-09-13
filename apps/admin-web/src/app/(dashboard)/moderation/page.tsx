'use client';

import { useEffect, useState, useMemo } from 'react';
import { StudentProfile, ModerationStatus } from '@fresher2work/types';
import { adminApi } from '@/lib/api';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  ExternalLink,
  GraduationCap,
  Briefcase,
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Award,
  Globe,
  Github,
  Linkedin,
  Check,
  Ban,
  ShieldCheck,
  Palette,
  Megaphone,
  Video,
  FolderGit2,
  Code2,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export default function ModerationPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    headline: '',
    about: '',
    city: '',
    country: '',
    isActivated: false,
    moderationStatus: ModerationStatus.APPROVED,
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdminStudents();
      setStudents(res.students || []);
    } catch (err) {
      console.warn('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const openEditModal = (student: StudentProfile) => {
    setEditingStudent(student);
    setEditForm({
      fullName: student.fullName || '',
      email: student.email || (student as any).user?.email || '',
      phone: student.phone || (student as any).user?.phone || '',
      headline: student.headline || '',
      about: student.about || '',
      city: student.city || '',
      country: student.country || '',
      isActivated: !!student.isActivated,
      moderationStatus: student.moderationStatus || ModerationStatus.APPROVED,
      githubUrl: student.githubUrl || '',
      linkedinUrl: student.linkedinUrl || '',
      portfolioUrl: student.portfolioUrl || '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    try {
      setActionLoading(true);
      const res = await adminApi.updateStudentByAdmin(editingStudent.id, editForm);
      const updatedProfile = res.profile;

      setStudents((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? { ...s, ...updatedProfile } : s))
      );
      if (selectedStudent?.id === editingStudent.id) {
        setSelectedStudent((prev) => (prev ? { ...prev, ...updatedProfile } : null));
      }
      setEditingStudent(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update candidate details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    try {
      setActionLoading(true);
      await adminApi.deleteStudentByAdmin(deletingStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== deletingStudent.id));
      if (selectedStudent?.id === deletingStudent.id) {
        setSelectedStudent(null);
      }
      setDeletingStudent(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete candidate account');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ModerationStatus) => {
    try {
      setActionLoading(true);
      await adminApi.moderateStudent(id, { status });
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, moderationStatus: status } : s)));
      if (selectedStudent?.id === id) {
        setSelectedStudent((prev) => (prev ? { ...prev, moderationStatus: status } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update moderation status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActivation = async (id: string, currentActivated: boolean) => {
    const nextState = !currentActivated;
    try {
      setActionLoading(true);
      await adminApi.moderateStudent(id, { isActivated: nextState });
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, isActivated: nextState } : s)));
      if (selectedStudent?.id === id) {
        setSelectedStudent((prev) => (prev ? { ...prev, isActivated: nextState } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to toggle activation status');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        s.fullName.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        ((s as any).user?.email && (s as any).user.email.toLowerCase().includes(q)) ||
        (s.headline && s.headline.toLowerCase().includes(q)) ||
        (s.city && s.city.toLowerCase().includes(q));

      if (statusFilter === 'ALL') return matchesSearch;
      if (statusFilter === 'HIRED') return matchesSearch && (s.isHired || !!s.placement);
      if (statusFilter === 'ACTIVATED') return matchesSearch && s.isActivated;
      if (statusFilter === 'UNACTIVATED') return matchesSearch && !s.isActivated;
      return matchesSearch && s.moderationStatus === statusFilter;
    });
  }, [students, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Candidate Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit registered mobile app students, inspect proof-of-work, edit details, approve, or delete accounts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate by name, email, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-64 sm:w-72 shadow-2xs"
            />
          </div>

          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-emerald-500 shadow-2xs"
          >
            <option value="ALL">All Candidates</option>
            <option value="HIRED">✓ Hired Candidates</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="FLAGGED">Flagged</option>
            <option value="REJECTED">Rejected</option>
            <option value="ACTIVATED">₹99 Activated (Paid)</option>
            <option value="UNACTIVATED">Unactivated (Unpaid)</option>
          </select>

          <button
            onClick={loadStudents}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Querying live candidate database...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            {search || statusFilter !== 'ALL' ? 'No Candidates Match Your Filter' : 'No Candidates Registered Yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {search || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter options.'
              : 'As candidates register on the mobile application, their profiles, project proofs, and verification details will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/75 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 font-bold">
              <tr>
                <th className="px-5 py-3.5">Candidate Details</th>
                <th className="px-5 py-3.5">Contact Info</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Proof Projects</th>
                <th className="px-5 py-3.5">₹99 Status</th>
                <th className="px-5 py-3.5">Moderation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const candidateEmail = s.email || (s as any).user?.email || '—';
                const candidatePhone = s.phone || (s as any).user?.phone || '—';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Candidate Name & Title */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {s.fullName?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="font-bold text-slate-900 hover:text-emerald-600 text-left transition-colors text-sm"
                            >
                              {s.fullName}
                            </button>
                            {(s.placement || s.isHired) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-2xs">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 stroke-[2.5]" />
                                HIRED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{s.headline || 'Fresher Candidate'}</p>
                          {(s.placement || s.isHired) && (
                            <p className="text-[10px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[200px]">
                                Placed: {s.placement?.companyName || s.placement?.company?.name || 'Partner Company'}
                                {s.placement?.roleTitle && ` • ${s.placement.roleTitle}`}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="text-slate-700 font-mono text-[11px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{candidateEmail}</span>
                        </p>
                        {candidatePhone !== '—' && (
                          <p className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{candidatePhone}</span>
                          </p>
                        )}
                        {s.city && (
                          <p className="text-slate-400 text-[10px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                            <span>{s.city}{s.country ? `, ${s.country}` : ''}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Completeness Score */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              s.completenessScore >= 70 ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                            style={{ width: `${s.completenessScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-700 text-xs">
                          {s.completenessScore}%
                        </span>
                      </div>
                    </td>

                    {/* Proof Projects */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {s.projects?.length || 0} proofs
                      </span>
                    </td>

                    {/* ₹99 Activation */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleActivation(s.id, s.isActivated)}
                        disabled={actionLoading}
                        title="Click to toggle activation status"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                          s.isActivated
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.isActivated ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {s.isActivated ? 'Active (Paid)' : 'Unpaid'}
                      </button>
                    </td>

                    {/* Moderation Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          s.moderationStatus === ModerationStatus.APPROVED
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.moderationStatus === ModerationStatus.FLAGGED
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : s.moderationStatus === ModerationStatus.REJECTED
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {s.moderationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          title="Inspect full candidate profile"
                          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                        <button
                          onClick={() => openEditModal(s)}
                          title="Edit candidate details"
                          className="p-1.5 bg-white hover:bg-blue-50 border border-slate-200 text-blue-600 font-bold rounded-lg text-xs transition-colors shadow-2xs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {s.moderationStatus !== ModerationStatus.APPROVED && (
                          <button
                            onClick={() => handleUpdateStatus(s.id, ModerationStatus.APPROVED)}
                            disabled={actionLoading}
                            title="Approve candidate"
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {s.moderationStatus !== ModerationStatus.REJECTED && (
                          <button
                            onClick={() => handleUpdateStatus(s.id, ModerationStatus.REJECTED)}
                            disabled={actionLoading}
                            title="Reject candidate"
                            className="p-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeletingStudent(s)}
                          title="Delete candidate account"
                          className="p-1.5 bg-white hover:bg-red-50 border border-slate-200 text-red-600 font-bold rounded-lg text-xs transition-colors shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate Profile Inspection Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 text-slate-700">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-sm font-black text-slate-700">
                  {selectedStudent.fullName?.[0] || 'C'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedStudent.headline || 'Fresher Candidate'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(selectedStudent)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Placement Verification Banner if Candidate is Hired */}
              {(selectedStudent.placement || selectedStudent.isHired) && (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      Candidate Hired & Placed
                    </span>
                    {selectedStudent.placement?.packageLpa && (
                      <span className="text-xs font-black text-emerald-900 bg-emerald-200/70 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                        Package: {selectedStudent.placement.packageLpa}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                    <div>
                      <p className="text-emerald-700 font-bold uppercase text-[9px] tracking-wider">Hiring Company</p>
                      <p className="font-black text-emerald-950 text-sm mt-0.5">
                        {selectedStudent.placement?.companyName || selectedStudent.placement?.company?.name || 'Partner Company'}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700 font-bold uppercase text-[9px] tracking-wider">Designation / Role</p>
                      <p className="font-black text-emerald-950 text-sm mt-0.5">
                        {selectedStudent.placement?.roleTitle || 'Graduate Trainee'}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700 font-bold uppercase text-[9px] tracking-wider">Placement Date</p>
                      <p className="font-semibold text-emerald-900 mt-0.5">
                        {selectedStudent.placement?.hiredAt ? new Date(selectedStudent.placement.hiredAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  {selectedStudent.placement?.notes && (
                    <p className="text-xs text-emerald-800 bg-emerald-100/60 p-2 rounded-xl italic">
                      Placement Notes: "{selectedStudent.placement.notes}"
                    </p>
                  )}
                </div>
              )}
              {/* Status & Key Metrics Banner */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Score</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedStudent.completenessScore}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">₹99 Activation</p>
                  <p className={`text-sm font-bold mt-0.5 ${selectedStudent.isActivated ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedStudent.isActivated ? 'Activated (Paid)' : 'Unactivated'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Moderation</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedStudent.moderationStatus}</p>
                </div>
              </div>

              {/* Personal & Contact Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Contact & Identity</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Email:</span>{' '}
                    <span className="font-mono text-slate-800 font-semibold">
                      {selectedStudent.email || (selectedStudent as any).user?.email || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Phone:</span>{' '}
                    <span className="font-mono text-slate-800 font-semibold">
                      {selectedStudent.phone || (selectedStudent as any).user?.phone || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>{' '}
                    <span className="text-slate-800 font-medium">
                      {selectedStudent.city || '—'}{selectedStudent.country ? `, ${selectedStudent.country}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Public Slug:</span>{' '}
                    <span className="font-mono text-emerald-600 font-medium">{selectedStudent.publicSlug || '—'}</span>
                  </div>
                </div>

                {/* Social & Web Links */}
                {(selectedStudent.githubUrl || selectedStudent.linkedinUrl || selectedStudent.portfolioUrl) && (
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-3">
                    {selectedStudent.githubUrl && (
                      <a
                        href={selectedStudent.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-600"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {selectedStudent.linkedinUrl && (
                      <a
                        href={selectedStudent.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {selectedStudent.portfolioUrl && (
                      <a
                        href={selectedStudent.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:underline"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Bio / About */}
              {selectedStudent.about && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Candidate Summary</h4>
                  <p className="bg-slate-50 p-3.5 rounded-xl text-slate-600 leading-relaxed border border-slate-100">
                    {selectedStudent.about}
                  </p>
                </div>
              )}

              {/* Resume / CV */}
              {selectedStudent.cvFileUrl && (
                <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{selectedStudent.cvFileName || 'Candidate Resume / CV'}</p>
                      <p className="text-[10px] text-slate-400">PDF Document uploaded via mobile app</p>
                    </div>
                  </div>
                  <a
                    href={selectedStudent.cvFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>View CV</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Education */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Education ({selectedStudent.education?.length || 0})
                </h4>
                {selectedStudent.education && selectedStudent.education.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStudent.education.map((edu: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</p>
                            <p className="text-slate-500 text-xs">{edu.institutionName}</p>
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                        {edu.gradeOrCgpa && (
                          <p className="mt-1 text-[11px] font-semibold text-emerald-600">CGPA / Grade: {edu.gradeOrCgpa}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No formal education entries recorded.</p>
                )}
              </div>

              {/* Verified Skills */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Verified Skills ({selectedStudent.skills?.length || 0})
                </h4>
                {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.skills.map((sk: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                      >
                        {sk.skillName} <span className="text-slate-400 text-[10px]">({sk.proficiencyLevel})</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No skills listed yet.</p>
                )}
              </div>

              {/* Projects & Technical/Design Proof of Work */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center justify-between">
                  <span>Proof of Work & Projects ({selectedStudent.projects?.length || 0})</span>
                </h4>
                {selectedStudent.projects && selectedStudent.projects.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.projects.map((proj: any) => (
                      <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{proj.title}</p>
                            {proj.role && <p className="text-xs font-semibold text-emerald-700">Role: {proj.role}</p>}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs shrink-0">
                            {proj.liveDemoUrl && (
                              <a
                                href={proj.liveDemoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                              >
                                <Globe className="w-3 h-3" />
                                <span>Demo ↗</span>
                              </a>
                            )}
                            {proj.githubRepoUrl && (
                              <a
                                href={proj.githubRepoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-slate-700 hover:underline bg-white px-2 py-0.5 rounded border border-slate-200"
                              >
                                <Code2 className="w-3 h-3" />
                                <span>Code ↗</span>
                              </a>
                            )}
                            {proj.projectLink && !proj.liveDemoUrl && !proj.githubRepoUrl && (
                              <a
                                href={proj.projectLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
                              >
                                <span>Project Link ↗</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed">{proj.description}</p>

                        {/* Tools / Tech Stack Tags */}
                        {((proj.toolsUsed && proj.toolsUsed.length > 0) || (proj.techStack && proj.techStack.length > 0)) && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {(proj.toolsUsed && proj.toolsUsed.length > 0 ? proj.toolsUsed : proj.techStack).map((tool: string, idx: number) => (
                              <span key={idx} className="bg-white text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-slate-200">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Image / Proof Screenshots Gallery */}
                        {proj.mediaUrls && proj.mediaUrls.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-slate-400" />
                              Visual Proof & Screenshots ({proj.mediaUrls.length})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {proj.mediaUrls.map((url: string, imgIdx: number) => (
                                <a
                                  key={imgIdx}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative block aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-emerald-500 transition-colors"
                                >
                                  <img
                                    src={url}
                                    alt={`Proof asset ${imgIdx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                    Open Proof ↗
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">No projects submitted yet.</p>
                )}
              </div>

              {/* Creative Work Samples & Portfolio (UI/UX, Design, Marketing, Video) */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center justify-between">
                  <span>Creative Work Samples & Portfolios ({selectedStudent.workSamples?.length || 0})</span>
                </h4>
                {selectedStudent.workSamples && selectedStudent.workSamples.length > 0 ? (
                  <div className="space-y-3">
                    {selectedStudent.workSamples.map((sample: any) => (
                      <div key={sample.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              {sample.category ? sample.category.replace('_', ' ') : 'CREATIVE WORK'}
                            </span>
                            <h5 className="font-bold text-slate-900 text-sm mt-1">{sample.title}</h5>
                            {sample.clientOrContext && (
                              <p className="text-[11px] text-slate-500 font-medium">Context: {sample.clientOrContext}</p>
                            )}
                          </div>
                          {sample.workLink && (
                            <a
                              href={sample.workLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-xs text-emerald-600 hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0"
                            >
                              <span>View Asset</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed">{sample.description}</p>

                        {/* Tools Used */}
                        {sample.toolsUsed && sample.toolsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sample.toolsUsed.map((tool: string, idx: number) => (
                              <span key={idx} className="bg-white text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-slate-200">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Work Sample Media Previews */}
                        {sample.mediaUrls && sample.mediaUrls.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-slate-400" />
                              Asset Preview ({sample.mediaUrls.length})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {sample.mediaUrls.map((url: string, imgIdx: number) => (
                                <a
                                  key={imgIdx}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative block aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 hover:border-emerald-500 transition-colors"
                                >
                                  <img
                                    src={url}
                                    alt={`Sample asset ${imgIdx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                                    View Full ↗
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">No creative work samples uploaded.</p>
                )}
              </div>

              {/* Verified Certificates */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                  Verified Certificates ({selectedStudent.certificates?.length || 0})
                </h4>
                {selectedStudent.certificates && selectedStudent.certificates.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStudent.certificates.map((cert: any) => (
                      <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{cert.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {cert.issuingOrganization} {cert.issueDate && `• ${cert.issueDate}`}
                            </p>
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                          >
                            <span>Verify ↗</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">No certificates added.</p>
                )}
              </div>

              {/* Candidate Preferences */}
              {selectedStudent.preferences && (
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">Career Preferences</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Preferred Roles</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedStudent.preferences.preferredRoles?.join(', ') || 'Any'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase">Work Mode</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedStudent.preferences.workModes?.join(', ') || selectedStudent.preferences.workMode || 'Any'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActivation(selectedStudent.id, selectedStudent.isActivated)}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg shadow-2xs"
                >
                  {selectedStudent.isActivated ? 'Deactivate Profile' : 'Grant ₹99 Activation'}
                </button>
                <button
                  onClick={() => {
                    setDeletingStudent(selectedStudent);
                  }}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedStudent.moderationStatus !== ModerationStatus.REJECTED && (
                  <button
                    onClick={() => handleUpdateStatus(selectedStudent.id, ModerationStatus.REJECTED)}
                    disabled={actionLoading}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                  >
                    Reject
                  </button>
                )}
                {selectedStudent.moderationStatus !== ModerationStatus.APPROVED && (
                  <button
                    onClick={() => handleUpdateStatus(selectedStudent.id, ModerationStatus.APPROVED)}
                    disabled={actionLoading}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Details Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 text-slate-700">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Candidate Profile</h3>
                <p className="text-xs text-slate-500">Update personal information, contact info, and status.</p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Professional Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flutter Developer | Computer Science 2026"
                  value={editForm.headline}
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  About / Bio Summary
                </label>
                <textarea
                  rows={3}
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Moderation Status
                  </label>
                  <select
                    value={editForm.moderationStatus}
                    onChange={(e) => setEditForm({ ...editForm, moderationStatus: e.target.value as ModerationStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value={ModerationStatus.APPROVED}>Approved</option>
                    <option value={ModerationStatus.PENDING_REVIEW}>Pending Review</option>
                    <option value={ModerationStatus.FLAGGED}>Flagged</option>
                    <option value={ModerationStatus.REJECTED}>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    ₹99 Paid Activation
                  </label>
                  <select
                    value={editForm.isActivated ? 'true' : 'false'}
                    onChange={(e) => setEditForm({ ...editForm, isActivated: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="true">Activated (Paid)</option>
                    <option value="false">Unactivated (Unpaid)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Candidate Account Confirmation Modal */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 text-slate-700 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Candidate Account?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete candidate{' '}
                <span className="font-bold text-slate-800">{deletingStudent.fullName}</span>? This will suspend their login credentials and remove their public discovery profile.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={actionLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
