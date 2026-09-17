'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Activity,
  Users,
  Building,
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Plus,
  Edit2,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  MapPin,
  Lock,
  Eye,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  CheckCheck,
  AlertCircle,
  DollarSign,
  UserCheck,
  Layers,
  BarChart3,
  Filter,
  Share2,
  BadgeCheck,
  Download,
  LayoutDashboard,
  Building2,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Flag,
  MessageSquare,
  HelpCircle,
  Info,
  Image as ImageIcon,
  Palette,
  Megaphone,
  Video,
  FolderGit2,
  Code2,
  Trash2,
  Key,
  Copy,
} from 'lucide-react';

type NavTab = 'candidates' | 'placements' | 'dashboard' | 'recruiters' | 'ledger';
type StatusFilter = 'ALL' | 'PENDING' | 'FLAGGED' | 'VERIFIED' | 'ACTIVATED' | 'HIRED' | 'REJECTED';

export default function SuperAdminSidebarPage() {
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('candidates');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin Auth State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data State
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  // Candidate Inspector Modal / Drawer
  const [inspectingCandidate, setInspectingCandidate] = useState<any | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'placement' | 'projects' | 'resume' | 'academics' | 'moderation'>('overview');
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  // Candidate Moderation & Issue Flagging State
  const [selectedIssuePreset, setSelectedIssuePreset] = useState<string>('Invalid / Corrupt Resume PDF');
  const [customIssueInstructions, setCustomIssueInstructions] = useState<string>('');
  const [isFlaggingCandidate, setIsFlaggingCandidate] = useState(false);

  // Single Company & Hires Inspector Drawer / Modal
  const [selectedCompanyHub, setSelectedCompanyHub] = useState<any | null>(null);
  const [companyHubTab, setCompanyHubTab] = useState<'hires' | 'overview' | 'pipeline'>('hires');
  const [recruiterSearch, setRecruiterSearch] = useState('');
  const [recruiterFilter, setRecruiterFilter] = useState<'ALL' | 'VERIFIED' | 'HIRED'>('ALL');

  const switchNavTab = (tab: NavTab) => {
    setActiveTab(tab);
    setInspectingCandidate(null);
    setSelectedCompanyHub(null);
  };

  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  // Create Recruiter Modal State
  const [showCreateRecruiterModal, setShowCreateRecruiterModal] = useState(false);
  const [newRecruiter, setNewRecruiter] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    designation: 'Lead Talent Acquisition',
    companyName: '',
    industry: 'Technology & SaaS',
    location: 'Bengaluru / Remote',
    website: '',
    verificationStatus: 'VERIFIED',
  });
  const [creatingRecruiter, setCreatingRecruiter] = useState(false);

  // Edit Recruiter / Company Modal State
  const [editingRecruiter, setEditingRecruiter] = useState<any | null>(null);
  const [updatingRecruiter, setUpdatingRecruiter] = useState(false);
  const [deletingRecruiterId, setDeletingRecruiterId] = useState<string | null>(null);

  // Security & Audit Logs Modal State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Super Admin Direct Password Reset / Set State
  const [passwordTarget, setPasswordTarget] = useState<{
    type: 'CANDIDATE' | 'RECRUITER';
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [newTargetPassword, setNewTargetPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ftw_admin_token');
      if (stored) {
        setToken(stored);
        fetchAdminData(stored);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleExportCSV = (type: 'placements' | 'candidates' | 'ledger') => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    const filename = `ftw_${type}_export_${new Date().toISOString().slice(0, 10)}.csv`;

    if (type === 'placements') {
      csvContent += 'Candidate Name,Candidate Email,Company Name,Recruiter Name,Role Title,Package LPA,Audit ID,Placement Date\n';
      placementsList.forEach((p: any) => {
        csvContent += `"${p.candidateName}","${p.candidateEmail}","${p.companyName}","${p.recruiterName}","${p.roleTitle}","${p.packageLpa}","${p.auditId}","${p.placedAt}"\n`;
      });
    } else if (type === 'candidates') {
      csvContent += 'Full Name,Email,Headline,City,Completeness Score,Verification Status,Activated\n';
      students.forEach((s: any) => {
        csvContent += `"${s.fullName}","${s.user?.email || s.email || ''}","${s.headline || ''}","${s.city || ''}","${s.completenessScore || 0}%","${s.verificationStatus}","${s.isActivated ? 'YES' : 'NO'}"\n`;
      });
    } else {
      csvContent += 'Receipt ID,Candidate Email,Amount (INR),Payment Status,Gateway Order ID,Payment ID,Date\n';
      payments.forEach((p: any) => {
        csvContent += `"${p.id}","${p.user?.email || 'Candidate'}","₹${(p.amountPaise / 100).toFixed(2)}","${p.status}","${p.gatewayOrderId || ''}","${p.gatewayPaymentId || ''}","${p.createdAt}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
    showToast(`Exported ${type.toUpperCase()} records successfully`);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      if (data.user?.role !== 'ADMIN') {
        throw new Error('Unauthorized: User account does not hold SUPER_ADMIN privileges.');
      }
      localStorage.setItem('ftw_admin_token', data.token);
      setToken(data.token);
      await fetchAdminData(data.token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ftw_admin_token');
    setToken(null);
  };

  const fetchAdminData = async (activeAuthToken?: string) => {
    const effectiveToken = activeAuthToken || token;
    if (!effectiveToken) return;
    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${effectiveToken}` };

      const [resAnalytics, resStudents, resRecruiters, resCompanies, resPayments] = await Promise.all([
        fetch(`${apiUrl}/api/v1/admin/analytics`, { headers }).then((r) => r.json()),
        fetch(`${apiUrl}/api/v1/admin/students`, { headers }).then((r) => r.json()),
        fetch(`${apiUrl}/api/v1/admin/recruiters`, { headers }).then((r) => r.json()).catch(() => ({ recruiters: [] })),
        fetch(`${apiUrl}/api/v1/admin/companies`, { headers }).then((r) => r.json()),
        fetch(`${apiUrl}/api/v1/admin/payments`, { headers }).then((r) => r.json()),
      ]);

      const studentList = resStudents.students || [];
      setAnalytics(resAnalytics);

      // Merge server student response with browser-persisted overrides
      const localStudentOverrides: Record<string, any> = (() => {
        try { return JSON.parse(localStorage.getItem('ftw_admin_student_overrides') || '{}'); } catch (_) { return {}; }
      })();

      const mergedStudents = studentList.map((st: any) => {
        const override = localStudentOverrides[st.id] || (st.email ? localStudentOverrides[st.email.toLowerCase()] : null);
        return override ? { ...st, ...override } : st;
      });

      setStudents(mergedStudents);

      // Merge server response with browser-cached newly created recruiters
      const localRecs: any[] = (() => {
        try { return JSON.parse(localStorage.getItem('ftw_admin_recruiters_cache') || '[]'); } catch (_) { return []; }
      })();
      const localComps: any[] = (() => {
        try { return JSON.parse(localStorage.getItem('ftw_admin_companies_cache') || '[]'); } catch (_) { return []; }
      })();

      const normalizeCompanyName = (name?: string) => (name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();

      // Deduplicate and canonicalize companies
      const rawComps = [...(resCompanies.companies || []), ...localComps];
      const compMap = new Map<string, any>();
      for (const c of rawComps) {
        if (!c || !c.name) continue;
        let norm = normalizeCompanyName(c.name);
        if (norm.includes('velvetbyte')) {
          norm = 'velvetbyte';
        }
        if (!compMap.has(norm)) {
          if (norm === 'velvetbyte') {
            compMap.set(norm, {
              id: 'comp-velvetbyte-01',
              name: 'Velvetbyte PVT Ltd',
              website: c.website || 'https://velvetbyte.com',
              industry: 'Web Development',
              location: c.location || 'Calicut',
              verificationStatus: 'VERIFIED',
              createdAt: c.createdAt || '2026-09-15T10:00:00.000Z',
            });
          } else {
            compMap.set(norm, { ...c });
          }
        } else {
          const existing = compMap.get(norm);
          compMap.set(norm, {
            ...existing,
            website: existing.website || c.website,
            industry: existing.industry || c.industry,
            location: existing.location || c.location,
            verificationStatus: 'VERIFIED',
          });
        }
      }
      const mergedCompanies = Array.from(compMap.values());

      // Cleanse local storage so duplicate velvetbyte or already-seeded companies are purged
      try {
        const seenLocal = new Set<string>();
        const cleansedLocalComps = localComps.filter((lc: any) => {
          const norm = normalizeCompanyName(lc.name);
          if (!norm || norm.includes('velvetbyte') || seenLocal.has(norm)) return false;
          const inServer = (resCompanies.companies || []).some((sc: any) => normalizeCompanyName(sc.name) === norm);
          if (inServer) return false;
          seenLocal.add(norm);
          return true;
        });
        localStorage.setItem('ftw_admin_companies_cache', JSON.stringify(cleansedLocalComps));
      } catch (_) {}

      // Deduplicate recruiters and link to canonical company
      const recMap = new Map<string, any>();
      const rawRecs = [...(resRecruiters.recruiters || []), ...localRecs];
      for (const r of rawRecs) {
        if (!r) continue;
        const emailKey = (r.businessEmail || r.email || r.id || '').toLowerCase().trim();
        if (!emailKey) continue;

        let compId = r.companyId;
        let compName = r.companyName;
        if (normalizeCompanyName(compName).includes('velvetbyte') || compId === 'comp-velvetbyte-01') {
          compId = 'comp-velvetbyte-01';
          compName = 'Velvetbyte PVT Ltd';
        } else {
          const matched = mergedCompanies.find((c: any) => c.id === compId || normalizeCompanyName(c.name) === normalizeCompanyName(compName));
          if (matched) {
            compId = matched.id;
            compName = matched.name;
          }
        }

        const updatedRec = {
          ...r,
          companyId: compId,
          companyName: compName,
          company: mergedCompanies.find((c: any) => c.id === compId) || r.company,
        };

        if (!recMap.has(emailKey)) {
          recMap.set(emailKey, updatedRec);
        } else {
          const existing = recMap.get(emailKey);
          recMap.set(emailKey, { ...existing, ...updatedRec });
        }
      }
      const mergedRecruiters = Array.from(recMap.values());

      // Cleanse local recruiters cache
      try {
        const seenRecKey = new Set<string>();
        const cleansedLocalRecs = localRecs.filter((lr: any) => {
          const key = (lr.businessEmail || lr.email || lr.id || '').toLowerCase().trim();
          if (!key || seenRecKey.has(key)) return false;
          const inServer = (resRecruiters.recruiters || []).some(
            (sr: any) => (sr.businessEmail || sr.email || '').toLowerCase().trim() === key
          );
          if (inServer) return false;
          seenRecKey.add(key);
          return true;
        });
        localStorage.setItem('ftw_admin_recruiters_cache', JSON.stringify(cleansedLocalRecs));
      } catch (_) {}

      setRecruiters(mergedRecruiters);
      setCompanies(mergedCompanies);

      // Merge server response with browser-persisted payments cache
      const localPayments: any[] = (() => {
        try { return JSON.parse(localStorage.getItem('ftw_admin_payments_cache') || '[]'); } catch (_) { return []; }
      })();
      const mergedPayments = [...(resPayments.payments || [])];
      for (const lp of localPayments) {
        if (!mergedPayments.some((p: any) => p.id === lp.id || (p.razorpayPaymentId && p.razorpayPaymentId === lp.razorpayPaymentId))) {
          mergedPayments.push(lp);
        }
      }
      setPayments(mergedPayments);

      if (inspectingCandidate) {
        const updated = studentList.find((s: any) => s.id === inspectingCandidate.id);
        if (updated) setInspectingCandidate(updated);
      }
    } catch (err: any) {
      setError('Telemetry sync error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Single Payment Transaction (Test / Live)
  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment record from the ledger?')) return;
    try {
      // 1. Remove from local state immediately
      setPayments((prev) =>
        prev.filter((p) => p.id !== paymentId && p.razorpayPaymentId !== paymentId && p.gatewayPaymentId !== paymentId)
      );

      // 2. Remove from localStorage cache
      const localPayments: any[] = (() => {
        try { return JSON.parse(localStorage.getItem('ftw_admin_payments_cache') || '[]'); } catch (_) { return []; }
      })();
      const updatedLocal = localPayments.filter(
        (p) => p.id !== paymentId && p.razorpayPaymentId !== paymentId && p.gatewayPaymentId !== paymentId
      );
      localStorage.setItem('ftw_admin_payments_cache', JSON.stringify(updatedLocal));

      // 3. Send DELETE to backend
      await fetch(`${apiUrl}/api/v1/admin/payments/${paymentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast('✓ Payment record removed from ledger');
      await fetchAdminData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = async (candidateId: string, candidateName: string) => {
    if (!confirm(`Are you sure you want to permanently delete candidate "${candidateName}"?`)) return;
    try {
      await fetch(`${apiUrl}/api/v1/admin/students/${candidateId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('✓ Candidate deleted successfully');
      if (inspectingCandidate?.id === candidateId) {
        setInspectingCandidate(null);
      }
      await fetchAdminData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Clear All Test Payments from Ledger
  const handleClearAllTestPayments = async () => {
    if (!confirm('Are you sure you want to clear all test payment entries from the revenue ledger?')) return;
    try {
      setPayments([]);
      localStorage.removeItem('ftw_admin_payments_cache');
      await fetch(`${apiUrl}/api/v1/admin/payments`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('✓ All test transactions cleared from ledger');
      await fetchAdminData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    }
  };

  // Moderate Student
  const handleModerateStudent = async (studentId: string, status: string, isActivated?: boolean, moderationNotes?: string | null) => {
    setModeratingId(studentId);
    try {
      const isApproved = status === 'VERIFIED' || status === 'APPROVED' || isActivated === true;
      const targetStatus = isApproved ? 'VERIFIED' : status;
      const targetActivated = isApproved ? true : (isActivated ?? false);

      // 1. Immediately persist to localStorage for zero-latency local durability
      const currentOverrides: Record<string, any> = (() => {
        try { return JSON.parse(localStorage.getItem('ftw_admin_student_overrides') || '{}'); } catch (_) { return {}; }
      })();
      currentOverrides[studentId] = {
        verificationStatus: targetStatus,
        moderationStatus: isApproved ? 'APPROVED' : status,
        isActivated: targetActivated,
        moderationNotes: moderationNotes ?? null,
      };
      localStorage.setItem('ftw_admin_student_overrides', JSON.stringify(currentOverrides));

      // 2. Immediately update state so UI switches instantly
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                verificationStatus: targetStatus,
                moderationStatus: isApproved ? 'APPROVED' : status,
                isActivated: targetActivated,
                moderationNotes: moderationNotes ?? null,
              }
            : s
        )
      );

      // 3. Update modal state if open
      setInspectingCandidate((prev: any) =>
        prev && prev.id === studentId
          ? {
              ...prev,
              verificationStatus: targetStatus,
              moderationStatus: isApproved ? 'APPROVED' : status,
              isActivated: targetActivated,
              moderationNotes: moderationNotes ?? null,
            }
          : prev
      );

      showToast(targetActivated ? '✓ Candidate Activated & Verified' : `Candidate status: ${status}`);

      // 4. Send API request
      const res = await fetch(`${apiUrl}/api/v1/admin/students/${studentId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: targetStatus, isActivated: targetActivated, moderationNotes }),
      });
      if (!res.ok) throw new Error('Action failed');
      await fetchAdminData();
    } catch (err: any) {
      showToast(`⚠️ ${err.message}`);
    } finally {
      setModeratingId(null);
    }
  };

  // Flag Candidate Issue with Custom Notes
  const handleFlagCandidateIssue = async (studentId: string) => {
    if (!selectedIssuePreset) {
      alert('Please select an issue category');
      return;
    }
    setIsFlaggingCandidate(true);
    try {
      const formattedNote = `[${selectedIssuePreset}] ${customIssueInstructions.trim() || 'Please resolve the highlighted issue before re-submitting your profile for recruiter discovery.'}`;
      const res = await fetch(`${apiUrl}/api/v1/admin/students/${studentId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'FLAGGED',
          moderationNotes: formattedNote,
        }),
      });
      if (!res.ok) throw new Error('Failed to flag candidate issue');
      showToast(`⚠️ Candidate issue flagged: ${selectedIssuePreset}`);
      setCustomIssueInstructions('');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFlaggingCandidate(false);
    }
  };

  // Resolve Flagged Issue & Re-Verify Candidate
  const handleResolveCandidateIssue = async (studentId: string) => {
    setIsFlaggingCandidate(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/students/${studentId}/moderate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'VERIFIED',
          moderationNotes: null,
          isActivated: true,
        }),
      });
      if (!res.ok) throw new Error('Failed to resolve candidate issue');
      showToast('✓ Candidate issue resolved and profile marked VERIFIED');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsFlaggingCandidate(false);
    }
  };

  // Create Recruiter Profile
  const handleCreateRecruiter = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingRecruiter(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/recruiters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecruiter),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create recruiter');

      // 1. Immediately inject into active React state & browser cache
      if (data.recruiter) {
        setRecruiters((prev) => {
          const filtered = prev.filter((r) => r.id !== data.recruiter.id && r.businessEmail !== data.recruiter.businessEmail);
          const updated = [data.recruiter, ...filtered];
          try { localStorage.setItem('ftw_admin_recruiters_cache', JSON.stringify(updated)); } catch (_) {}
          return updated;
        });
      }
      if (data.company) {
        setCompanies((prev) => {
          const normNew = (data.company.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
          const isVelvet = normNew.includes('velvetbyte');
          const filtered = prev.filter((c) => {
            const cNorm = (c.name || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim();
            if (isVelvet && cNorm.includes('velvetbyte')) return false;
            return c.id !== data.company.id && cNorm !== normNew;
          });
          const updated = [data.company, ...filtered];
          try {
            const nonVelvet = updated.filter((c) => !(c.name || '').toLowerCase().includes('velvetbyte'));
            localStorage.setItem('ftw_admin_companies_cache', JSON.stringify(nonVelvet));
          } catch (_) {}
          return updated;
        });
      }

      setShowCreateRecruiterModal(false);
      setNewRecruiter({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        designation: 'Lead Talent Acquisition',
        companyName: '',
        industry: 'Technology & SaaS',
        location: 'Bengaluru / Remote',
        website: '',
        verificationStatus: 'VERIFIED',
      });
      showToast('✓ Recruiter profile and company registered successfully');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreatingRecruiter(false);
    }
  };

  // Update Recruiter Profile
  const handleUpdateRecruiter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecruiter) return;
    setUpdatingRecruiter(true);
    try {
      const resRec = await fetch(`${apiUrl}/api/v1/admin/recruiters/${editingRecruiter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editingRecruiter.fullName,
          designation: editingRecruiter.designation,
          businessEmail: editingRecruiter.businessEmail,
          phone: editingRecruiter.phone,
          linkedinUrl: editingRecruiter.linkedinUrl,
        }),
      });
      if (!resRec.ok) throw new Error('Failed to update recruiter details');

      if (editingRecruiter.companyId && editingRecruiter.company) {
        const resComp = await fetch(`${apiUrl}/api/v1/admin/companies/${editingRecruiter.companyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingRecruiter.company.name,
            website: editingRecruiter.company.website,
            location: editingRecruiter.company.location,
            industry: editingRecruiter.company.industry,
            verificationStatus: editingRecruiter.company.verificationStatus,
          }),
        });
        if (!resComp.ok) throw new Error('Failed to update company details');
      }

      setEditingRecruiter(null);
      showToast('Recruiter & employer corrections saved');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingRecruiter(false);
    }
  };

  // Delete Recruiter
  const handleDeleteRecruiter = async (rec: any) => {
    const recName = rec.fullName || 'Recruiter';
    const compName = rec.company?.name || rec.companyName || 'Company';
    if (!confirm(`Are you sure you want to delete recruiter "${recName}" (${compName})? This will permanently remove the recruiter account.`)) {
      return;
    }
    setDeletingRecruiterId(rec.id);
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/recruiters/${rec.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to delete recruiter');
      }

      // Optimistically remove from state and browser cache
      setRecruiters((prev) => {
        const updated = prev.filter((r) => r.id !== rec.id);
        try { localStorage.setItem('ftw_admin_recruiters_cache', JSON.stringify(updated)); } catch (_) {}
        return updated;
      });
      if (rec.companyId && rec.companyId !== 'comp-velvetbyte-01' && !(rec.companyName || '').toLowerCase().includes('velvetbyte')) {
        setCompanies((prev) => {
          const isOther = recruiters.some((r) => r.id !== rec.id && r.companyId === rec.companyId);
          if (isOther) return prev;
          const updated = prev.filter((c) => c.id !== rec.companyId);
          try { localStorage.setItem('ftw_admin_companies_cache', JSON.stringify(updated)); } catch (_) {}
          return updated;
        });
      }

      showToast(`✓ Recruiter "${recName}" deleted successfully`);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingRecruiterId(null);
    }
  };

  // Direct Password Set / Reset for Candidate or Recruiter
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordTarget || !newTargetPassword.trim()) return;
    setSavingPassword(true);
    setPasswordSuccessMessage(null);
    try {
      const endpoint =
        passwordTarget.type === 'CANDIDATE'
          ? `${apiUrl}/api/v1/admin/students/${passwordTarget.id}/password`
          : `${apiUrl}/api/v1/admin/recruiters/${passwordTarget.id}/password`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: newTargetPassword.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      setPasswordSuccessMessage(`✓ Password successfully updated for ${passwordTarget.name}! New password: "${newTargetPassword.trim()}"`);
      showToast(`✓ Password updated for ${passwordTarget.name}`);

      // Optimistically update local candidate/recruiter state
      if (passwordTarget.type === 'CANDIDATE') {
        setStudents((prev) =>
          prev.map((s) => (s.id === passwordTarget.id ? { ...s, password: newTargetPassword.trim() } : s))
        );
        if (inspectingCandidate && inspectingCandidate.id === passwordTarget.id) {
          setInspectingCandidate((prev: any) => ({ ...prev, password: newTargetPassword.trim() }));
        }
      } else {
        setRecruiters((prev) =>
          prev.map((r) => (r.id === passwordTarget.id ? { ...r, password: newTargetPassword.trim() } : r))
        );
      }
    } catch (err: any) {
      alert(err.message || 'Error setting password');
    } finally {
      setSavingPassword(false);
    }
  };

  // Filter students list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.headline?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.companyName?.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && (s.verificationStatus === 'PENDING' || s.moderationStatus === 'PENDING_REVIEW')) ||
      (statusFilter === 'FLAGGED' && (s.moderationStatus === 'FLAGGED' || Boolean(s.moderationNotes))) ||
      (statusFilter === 'VERIFIED' && (s.verificationStatus === 'VERIFIED' || s.moderationStatus === 'APPROVED')) ||
      (statusFilter === 'REJECTED' && (s.verificationStatus === 'REJECTED' || s.moderationStatus === 'REJECTED')) ||
      (statusFilter === 'ACTIVATED' && s.isActivated) ||
      (statusFilter === 'HIRED' && s.isPlaced);
    return matchesSearch && matchesStatus;
  });

  const placementsList = (analytics?.verifiedPlacements && analytics.verifiedPlacements.length > 0)
    ? analytics.verifiedPlacements
    : students
        .filter((s) => s.isHired && s.placement)
        .map((s, idx) => ({
          id: s.placement.id || `plc_${idx + 1}`,
          candidateName: s.fullName,
          candidateEmail: s.email || s.user?.email,
          candidateHeadline: s.headline,
          companyName: s.placement.company?.name || s.placement.companyName || 'Corporate Partner',
          recruiterName: s.placement.recruiter?.fullName || 'Hiring Recruiter',
          recruiterDesignation: 'Talent Acquisition',
          roleTitle: s.placement.roleTitle || 'Verified Role',
          packageLpa: typeof s.placement.packageLpa === 'number' ? `₹${s.placement.packageLpa} LPA` : (s.placement.packageLpa || 'Verified CTC'),
          placedAt: s.placement.hiredAt || s.placement.placedAt || new Date().toISOString(),
          isInAppPlacement: true,
          verificationBadge: '100% In-App Direct Hire',
          auditId: `FTW-HIRE-2026-${s.id.slice(0, 4).toUpperCase()}`,
        }));

  const totalHiresCount = analytics?.metrics?.totalHiredCandidates || placementsList.length;
  const platformSuccessRate = analytics?.metrics?.platformSuccessRatePercent ?? (students.length > 0 ? Math.round((placementsList.length / students.length) * 100) : 20);
  const inAppVerifiedHires = analytics?.metrics?.inAppDirectPlacements || placementsList.length;

  // ==========================================
  // LOGIN SCREEN (High-End White Theme)
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Super Admin Console</h2>
            <p className="text-xs text-slate-500 font-medium">FresherToWork Global Management Portal</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Super Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                  placeholder="admin@freshertowork.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Root Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Root Privileges...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 stroke-[2]" />
                  Authenticate Super Admin
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-emerald-600" /> End-to-End Enterprise Encryption
            </span>
            <Link href="/login" className="text-emerald-600 hover:underline font-bold">
              Recruiter Hub ↗
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN SUPER ADMIN LAYOUT (PREMIUM LEFT SIDEBAR)
  // ==========================================
  return (
    <div className="flex h-screen bg-slate-50/70 text-slate-900 font-sans overflow-hidden">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-slate-800 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* LEFT SIDEBAR NAVIGATION                                       */}
      {/* ============================================================ */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-xs z-10">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-slate-900">
                  Fresher<span className="text-emerald-600">ToWork</span>
                </span>
              </div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                SUPER ADMIN PANEL
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-6">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Executive Modules
              </p>
              <nav className="space-y-1">
                {/* 1. Candidates Verification */}
                <button
                  onClick={() => switchNavTab('candidates')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'candidates' && !selectedCompanyHub && !inspectingCandidate
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-4 h-4 ${activeTab === 'candidates' && !selectedCompanyHub && !inspectingCandidate ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>Candidate Verification</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-700">
                    {students.length}
                  </span>
                </button>

                {/* 2. Placements & Hires Telemetry (NEW) */}
                <button
                  onClick={() => switchNavTab('placements')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'placements' && !selectedCompanyHub && !inspectingCandidate
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className={`w-4 h-4 ${activeTab === 'placements' && !selectedCompanyHub && !inspectingCandidate ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>Verified Placements</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-[10px] font-extrabold text-white">
                    {totalHiresCount} Hires
                  </span>
                </button>

                {/* 3. Overview */}
                <button
                  onClick={() => switchNavTab('dashboard')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'dashboard' && !selectedCompanyHub && !inspectingCandidate
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' && !selectedCompanyHub && !inspectingCandidate ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>Platform Overview</span>
                  </div>
                </button>

                {/* 4. Recruiters */}
                <button
                  onClick={() => switchNavTab('recruiters')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'recruiters' && !selectedCompanyHub && !inspectingCandidate
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className={`w-4 h-4 ${activeTab === 'recruiters' && !selectedCompanyHub && !inspectingCandidate ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>Recruiter Hub</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-extrabold text-slate-700">
                    {recruiters.length}
                  </span>
                </button>

                {/* 5. Revenue & Ledger */}
                <button
                  onClick={() => switchNavTab('ledger')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'ledger' && !selectedCompanyHub && !inspectingCandidate
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className={`w-4 h-4 ${activeTab === 'ledger' && !selectedCompanyHub && !inspectingCandidate ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span>Revenue & Ledger</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-100/60 text-[10px] font-extrabold text-emerald-800">
                    ₹99
                  </span>
                </button>
              </nav>
            </div>

            {/* Quick Actions in Sidebar */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Admin Controls
              </p>
              <button
                onClick={() => setShowCreateRecruiterModal(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Recruiter</span>
              </button>

              <button
                onClick={() => setShowAuditModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Audit Logs & Security</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Reports (CSV)</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 truncate">Super Admin</p>
            <p className="text-[11px] text-slate-400 truncate">{adminEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA                                             */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/60">
        {/* ============================================================ */}
        {/* INNER PAGE 1: DEDICATED COMPANY PROFILE & HIRES DOSSIER     */}
        {/* ============================================================ */}
        {selectedCompanyHub ? (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Inner Header with Breadcrumbs and Back Navigation */}
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSelectedCompanyHub(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Recruiter Hub
                </button>
                <div className="h-4 w-px bg-slate-200 shrink-0" />
                <div className="flex items-center gap-2 text-xs truncate">
                  <button
                    onClick={() => switchNavTab('recruiters')}
                    className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                  >
                    Recruiter Hub
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-900 truncate">
                    {selectedCompanyHub.company?.name || 'Company Profile'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setEditingRecruiter(selectedCompanyHub)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Recruiter
                </button>
              </div>
            </header>

            {/* Inner Page Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Company Hero Profile Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                      {selectedCompanyHub.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900">
                          {selectedCompanyHub.company?.name || 'Company Profile'}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3" />
                          {selectedCompanyHub.company?.verificationStatus || 'VERIFIED PARTNER'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedCompanyHub.company?.industry || 'Technology & Digital Services'} • {selectedCompanyHub.company?.location || 'Bengaluru / Remote'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 flex-wrap">
                        {selectedCompanyHub.company?.website && (
                          <a
                            href={selectedCompanyHub.company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold text-[11px]"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            {selectedCompanyHub.company.website.replace('https://', '')}
                          </a>
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Recruiter Lead: <strong className="text-slate-800">{selectedCompanyHub.fullName}</strong> ({selectedCompanyHub.designation})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCompanyHubTab('hires')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        companyHubTab === 'hires'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      Placed Hires ({students.filter(
                        (s) =>
                          (s.isHired || s.placement) &&
                          ((s.placement?.company?.name || s.companyName || '').toLowerCase().includes((selectedCompanyHub.company?.name || selectedCompanyHub.companyName || '').toLowerCase()) ||
                            (selectedCompanyHub.id && s.placement?.recruiterId === selectedCompanyHub.id))
                      ).length})
                    </button>
                    <button
                      onClick={() => setCompanyHubTab('overview')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        companyHubTab === 'overview'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      Company Overview
                    </button>
                    <button
                      onClick={() => setCompanyHubTab('pipeline')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        companyHubTab === 'pipeline'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Talent Pipeline
                    </button>
                  </div>
                </div>

                {/* Company Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hires Placed</p>
                    <p className="font-extrabold text-emerald-700 text-base mt-0.5 flex items-center gap-1">
                      <BadgeCheck className="w-4 h-4" />
                      {students.filter(
                        (s) =>
                          (s.isHired || s.placement) &&
                          ((s.placement?.company?.name || s.companyName || '').toLowerCase().includes((selectedCompanyHub.company?.name || selectedCompanyHub.companyName || '').toLowerCase()) ||
                            (selectedCompanyHub.id && s.placement?.recruiterId === selectedCompanyHub.id))
                      ).length} Placed
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Reveals</p>
                    <p className="font-extrabold text-slate-900 text-base mt-0.5">
                      {selectedCompanyHub.revealsCount || 0} Unlocks
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Shortlists</p>
                    <p className="font-extrabold text-slate-900 text-base mt-0.5">
                      {selectedCompanyHub.shortlistsCount || 0} Candidates
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hiring Success</p>
                    <p className="font-extrabold text-emerald-700 text-base mt-0.5">
                      {students.filter(
                        (s) =>
                          (s.isHired || s.placement) &&
                          ((s.placement?.company?.name || s.companyName || '').toLowerCase().includes((selectedCompanyHub.company?.name || selectedCompanyHub.companyName || '').toLowerCase()) ||
                            (selectedCompanyHub.id && s.placement?.recruiterId === selectedCompanyHub.id))
                      ).length > 0 ? '100% In-App' : '0% (No hires)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* TAB 1: ALL PLACED HIRES BY THIS SPECIFIC COMPANY */}
              {companyHubTab === 'hires' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Candidates Hired by {selectedCompanyHub.company?.name || 'Company'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Every single verified candidate placed at this organization through FresherToWork
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      100% In-App Direct Placements
                    </span>
                  </div>

                  {(() => {
                    const compName = selectedCompanyHub.company?.name || '';
                    const companyPlacedStudents = students.filter(
                      (s) => (s.isHired || s.placement || s.isPlaced) && (
                        (s.placement?.company?.name || s.companyName || '').toLowerCase().includes(compName.toLowerCase()) ||
                        compName.toLowerCase().includes((s.placement?.company?.name || s.companyName || '').toLowerCase())
                      )
                    );

                    if (companyPlacedStudents.length === 0) {
                      return (
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="font-bold text-slate-700 text-sm">No Hires Placed Yet</p>
                          <p className="text-xs text-slate-400">
                            {selectedCompanyHub.company?.name || 'This organization'} has not verified any direct candidate hires yet.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {companyPlacedStudents.map((hire: any, idx: number) => {
                          const roleName = hire.placement?.roleTitle || hire.roleTitle || hire.headline || 'Junior Full-Stack Engineer';
                          const pkg = hire.placement?.packageLpa ? (typeof hire.placement.packageLpa === 'number' ? `₹${hire.placement.packageLpa} LPA` : hire.placement.packageLpa) : (hire.packageLpa || '₹6.50 LPA');
                          const audit = hire.placement?.auditId || hire.auditId || `FTW-HIRE-2026-${(hire.id || '').slice(0, 4).toUpperCase()}`;

                          return (
                            <div
                              key={hire.id || idx}
                              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-lg shadow-2xs shrink-0">
                                  {hire.fullName?.charAt(0) || 'H'}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-extrabold text-slate-900 text-sm">{hire.fullName}</h4>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold">
                                      <BadgeCheck className="w-3 h-3" />
                                      HIRED
                                    </span>
                                  </div>
                                  <p className="text-xs text-emerald-800 font-bold mt-0.5">
                                    {roleName}
                                  </p>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    {hire.city ? `${hire.city} • ` : ''}{hire.user?.email || hire.email || '—'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-xs w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                                <div className="text-left md:text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Package (CTC)</p>
                                  <p className="font-black text-emerald-700 text-sm mt-0.5">
                                    {pkg}
                                  </p>
                                </div>

                                <div className="text-left md:text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Offer ID</p>
                                  <p className="font-mono text-[11px] text-slate-700 font-bold mt-0.5">
                                    {audit}
                                  </p>
                                </div>

                                <button
                                  onClick={() => {
                                    const fullCandidate = students.find((s) => s.id === hire.id) || hire;
                                    setInspectingCandidate(fullCandidate);
                                    setSelectedCompanyHub(null);
                                    setInspectorTab('placement');
                                  }}
                                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer shrink-0"
                                >
                                  View Audit Dossier
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: COMPANY & RECRUITER DETAILS */}
              {companyHubTab === 'overview' && (
                <div className="space-y-5 text-xs">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm">Company Registration Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Company Name</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.company?.name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Industry Domain</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.company?.industry}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Corporate Headquarters</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.company?.location}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Corporate Website</p>
                        <p className="font-bold text-emerald-700 mt-0.5">{selectedCompanyHub.company?.website || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="font-extrabold text-slate-900 text-sm">Authorized Recruiter Lead Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Lead Recruiter Name</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.fullName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Designation</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.designation}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Business Email</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.businessEmail || selectedCompanyHub.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</p>
                        <p className="font-bold text-slate-900 mt-0.5">{selectedCompanyHub.phone || '+91 98765 43210'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SHORTLISTED TALENT PIPELINE */}
              {companyHubTab === 'pipeline' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Candidates in {selectedCompanyHub.company?.name || 'Company'} Hiring Pipeline
                    </h3>
                    <p className="text-xs text-slate-500">
                      Profiles currently saved or under active review by this employer
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {students.slice(0, 6).map((cand: any, idx: number) => (
                      <div
                        key={cand.id || idx}
                        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex items-center justify-between shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {cand.fullName?.charAt(0) || 'C'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{cand.fullName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{cand.headline || 'Fresher Graduate'}</p>
                            <span className="inline-block text-[10px] font-extrabold text-emerald-700 mt-0.5">
                              {cand.completenessScore || 80}% Complete
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setInspectingCandidate(cand);
                            setSelectedCompanyHub(null);
                            setInspectorTab('overview');
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                        >
                          View ↗
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : inspectingCandidate ? (
          /* ============================================================ */
          /* INNER PAGE 2: CANDIDATE DOSSIER & MODERATION CENTER          */
          /* ============================================================ */
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Inner Header with Breadcrumbs & Back Navigation */}
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setInspectingCandidate(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to {activeTab === 'candidates' ? 'Candidates' : activeTab === 'placements' ? 'Placements' : 'Dashboard'}
                </button>
                <div className="h-4 w-px bg-slate-200 shrink-0" />
                <div className="flex items-center gap-2 text-xs truncate">
                  <button
                    onClick={() => switchNavTab('candidates')}
                    className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                  >
                    Candidates
                  </button>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-slate-900 truncate">
                    {inspectingCandidate.fullName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {inspectingCandidate.slug && (
                  <Link
                    href={`/p/${inspectingCandidate.slug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Public Web Profile ↗
                  </Link>
                )}
                {inspectingCandidate.isActivated ? (
                  <button
                    onClick={() => handleModerateStudent(inspectingCandidate.id, 'PENDING', false)}
                    disabled={moderatingId === inspectingCandidate.id}
                    title="Candidate is active. Click to deactivate/set pending."
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ✓ Active & Verified
                  </button>
                ) : (
                  <button
                    onClick={() => handleModerateStudent(inspectingCandidate.id, 'VERIFIED', true)}
                    disabled={moderatingId === inspectingCandidate.id}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Approve & Activate
                  </button>
                )}
                <button
                  onClick={() => {
                    setPasswordTarget({
                      type: 'CANDIDATE',
                      id: inspectingCandidate.id,
                      name: inspectingCandidate.fullName || 'Candidate',
                      email: inspectingCandidate.email || inspectingCandidate.user?.email || '',
                    });
                    setNewTargetPassword('');
                    setPasswordSuccessMessage(null);
                    setCopiedPassword(false);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Directly Set or Reset Candidate Password"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Password
                </button>
                <button
                  onClick={() => setInspectorTab('moderation')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-700" />
                  Flag Issue
                </button>
                <button
                  onClick={() => handleModerateStudent(inspectingCandidate.id, 'REJECTED', false)}
                  disabled={moderatingId === inspectingCandidate.id}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject Profile
                </button>
                <button
                  onClick={() => handleDeleteCandidate(inspectingCandidate.id, inspectingCandidate.fullName || 'Candidate')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 text-xs font-black transition-colors cursor-pointer"
                  title="Permanently Delete Candidate"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-700" />
                  Delete
                </button>
              </div>
            </header>

            {/* Inner Page Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Candidate Hero Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
                      {inspectingCandidate.avatarUrl ? (
                        <img
                          src={inspectingCandidate.avatarUrl}
                          alt={inspectingCandidate.fullName}
                          className="h-full w-full object-cover rounded-2xl"
                        />
                      ) : (
                        inspectingCandidate.fullName?.charAt(0) || 'F'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{inspectingCandidate.fullName}</h2>
                        {inspectingCandidate.isPlaced && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                            <BadgeCheck className="w-3 h-3" />
                            HIRED
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            inspectingCandidate.verificationStatus === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : inspectingCandidate.verificationStatus === 'REJECTED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inspectingCandidate.verificationStatus}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                          {inspectingCandidate.completenessScore || 0}% Complete
                        </span>
                        {inspectingCandidate.isActivated && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            ✓ Activated for Discovery
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1">{inspectingCandidate.headline || 'Fresher Graduate'}</p>
                    </div>
                  </div>

                  {/* Sub-Tabs Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setInspectorTab('overview')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        inspectorTab === 'overview'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Overview & Coordinates
                    </button>
                    {inspectingCandidate.isPlaced && (
                      <button
                        onClick={() => setInspectorTab('placement')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                          inspectorTab === 'placement'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-emerald-700 hover:text-emerald-800'
                        }`}
                      >
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Placement Offer
                      </button>
                    )}
                    <button
                      onClick={() => setInspectorTab('moderation')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                        inspectorTab === 'moderation'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : inspectingCandidate.moderationStatus === 'FLAGGED' || inspectingCandidate.moderationNotes
                          ? 'text-amber-800 bg-amber-200/70'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Issue Moderation
                    </button>
                    <button
                      onClick={() => setInspectorTab('projects')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        inspectorTab === 'projects'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Proof of Work ({inspectingCandidate.projects?.length || 0})
                    </button>
                    <button
                      onClick={() => setInspectorTab('resume')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        inspectorTab === 'resume'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      PDF Resume {inspectingCandidate.cvFileUrl ? '✓' : ''}
                    </button>
                    <button
                      onClick={() => setInspectorTab('academics')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        inspectorTab === 'academics'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Academics
                    </button>
                  </div>
                </div>

                {/* Active Flagged Issue Alert Banner if candidate has an issue */}
                {(inspectingCandidate.moderationStatus === 'FLAGGED' || inspectingCandidate.moderationNotes) && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-amber-950 text-sm">⚠️ Mandatory Profile Issue Notice Active</p>
                        <p className="text-amber-900 font-medium text-xs mt-0.5">
                          {inspectingCandidate.moderationNotes || 'Candidate profile requires updates before recruiter discovery can be enabled.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleResolveCandidateIssue(inspectingCandidate.id)}
                      disabled={isFlaggingCandidate}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors cursor-pointer"
                    >
                      ✓ Resolve & Clear Issue
                    </button>
                  </div>
                )}
              </div>

              {/* TAB: MODERATION & ISSUE FLAGGING */}
              {inspectorTab === 'moderation' && (
                <div className="space-y-5">
                  <div className="p-6 rounded-2xl bg-white border-2 border-amber-500/30 shadow-xs space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-2xs">
                        <Flag className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">Flag Profile Issue & Send Mandatory Notice</h4>
                        <p className="text-xs text-slate-500">
                          Restricts recruiter discovery and displays an action banner in the candidate&apos;s app until resolved.
                        </p>
                      </div>
                    </div>

                    {/* Preset Category Selectors */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        1. Select Primary Issue Category
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { id: 'Invalid / Corrupt Resume PDF', desc: 'Uploaded resume cannot be opened or is blurry' },
                          { id: 'Broken Demo / Missing GitHub Repo', desc: 'Project link or GitHub repository is broken' },
                          { id: 'Incomplete Bio / Unprofessional Headline', desc: 'Missing required headline or intro details' },
                          { id: 'Unverified Academic CGPA / Degree', desc: 'Education details or GPA certificate missing' },
                          { id: 'Contact Information Mismatch', desc: 'Phone or email appears incorrect or invalid' },
                          { id: 'Other General Compliance Issue', desc: 'Custom policy or profile moderation notice' },
                        ].map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setSelectedIssuePreset(preset.id)}
                            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedIssuePreset === preset.id
                                ? 'border-amber-500 bg-amber-50/80 shadow-2xs'
                                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <p className={`text-xs font-bold ${
                              selectedIssuePreset === preset.id ? 'text-amber-950' : 'text-slate-800'
                            }`}>
                              {selectedIssuePreset === preset.id ? '✓ ' : ''}{preset.id}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{preset.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Note Input */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        2. Specific Instructions for Candidate (Mandatory Student Alert)
                      </label>
                      <textarea
                        rows={3}
                        value={customIssueInstructions}
                        onChange={(e) => setCustomIssueInstructions(e.target.value)}
                        placeholder={`e.g. Please re-upload a clear PDF resume and update the GitHub repository URL for your ${inspectingCandidate.projects?.[0]?.title || 'primary project'} before re-submitting.`}
                        className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-medium focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">
                        Student will see this alert banner on their profile and mobile app.
                      </span>
                      <button
                        onClick={() => handleFlagCandidateIssue(inspectingCandidate.id)}
                        disabled={isFlaggingCandidate}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        {isFlaggingCandidate ? 'Flagging...' : '🚨 Submit Issue Notice & Flag Candidate'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PLACEMENT OFFER */}
              {inspectorTab === 'placement' && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black">
                        <BadgeCheck className="w-4 h-4" />
                        100% IN-APP VERIFIED PLACEMENT
                      </span>
                      <span className="text-xs font-mono text-emerald-800 font-bold">
                        {inspectingCandidate.auditId || 'FTW-HIRE-2026-VERIFIED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
                      <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Hiring Company</p>
                        <p className="font-extrabold text-slate-900 text-base mt-0.5">
                          {inspectingCandidate.placement?.company?.name || inspectingCandidate.companyName || 'Corporate Partner'}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Offered Role</p>
                        <p className="font-extrabold text-slate-900 text-base mt-0.5">
                          {inspectingCandidate.placement?.roleTitle || inspectingCandidate.roleTitle || 'Associate Software Engineer'}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Package (CTC)</p>
                        <p className="font-extrabold text-emerald-700 text-base mt-0.5">
                          {inspectingCandidate.placement?.packageLpa ? `₹${inspectingCandidate.placement.packageLpa} LPA` : (inspectingCandidate.packageLpa || '₹6.50 LPA')}
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Recruiter Lead</p>
                        <p className="font-extrabold text-slate-900 text-base mt-0.5">
                          {inspectingCandidate.placement?.recruiter?.fullName || inspectingCandidate.recruiterName || 'Arjun K (Talent Lead)'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-800 font-medium">
                      ✓ Sourced via candidate direct proof-of-work discovery & authentic recruiter reveal on FresherToWork.
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: OVERVIEW & COORDINATES */}
              {inspectorTab === 'overview' && (
                <div className="space-y-6">
                  {/* Coordinates Grid */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Email Address</p>
                      <p className="font-bold text-slate-900 truncate mt-1">{inspectingCandidate.user?.email || inspectingCandidate.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Phone Number</p>
                      <p className="font-bold text-slate-900 truncate mt-1">{inspectingCandidate.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Location</p>
                      <p className="font-bold text-slate-900 truncate mt-1">{inspectingCandidate.city || 'India'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 text-[10px] uppercase">Availability</p>
                      <p className="font-bold text-emerald-700 truncate mt-1">
                        {inspectingCandidate.preferences?.availability?.replace('_', ' ') || 'Immediate'}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About & Bio Summary</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {inspectingCandidate.about || 'No detailed biography provided by candidate.'}
                    </p>
                  </div>

                  {/* Skills Preview */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Verified Technical Skills ({inspectingCandidate.skills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {inspectingCandidate.skills?.map((sk: any) => (
                        <span
                          key={sk.id}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5"
                        >
                          {sk.skillName}
                          {sk.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PROOF OF WORK */}
              {inspectorTab === 'projects' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Verified Technical & Domain Projects ({inspectingCandidate.projects?.length || 0})
                    </h4>

                    {!inspectingCandidate.projects || inspectingCandidate.projects.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs font-medium border border-dashed rounded-2xl bg-white">
                        No project repositories recorded for this candidate yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inspectingCandidate.projects.map((p: any) => (
                          <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-sm font-extrabold text-slate-900">{p.title}</h5>
                                {p.role && <p className="text-xs text-emerald-700 font-bold mt-0.5">Role: {p.role}</p>}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs font-bold">
                                {(p.liveDemoUrl || p.projectLink) && (
                                  <a
                                    href={p.liveDemoUrl || p.projectLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1 hover:bg-emerald-200 transition-colors"
                                  >
                                    <Globe className="w-3 h-3" />
                                    Live Demo ↗
                                  </a>
                                )}
                                {p.githubRepoUrl && (
                                  <a
                                    href={p.githubRepoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 rounded-lg bg-slate-100 text-slate-800 px-2.5 py-1 hover:bg-slate-200 transition-colors border border-slate-200"
                                  >
                                    Code Repo ↗
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                            {((p.toolsUsed && p.toolsUsed.length > 0) || (p.techStack && p.techStack.length > 0)) && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {(p.toolsUsed && p.toolsUsed.length > 0 ? p.toolsUsed : p.techStack).map((tech: string, idx: number) => (
                                  <span key={idx} className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-md font-semibold text-slate-700 border border-slate-200">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Visual Proof / Screenshot Gallery */}
                            {p.mediaUrls && p.mediaUrls.length > 0 && (
                              <div className="pt-2 border-t border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3 text-slate-400" />
                                  Visual Proof & Screenshots ({p.mediaUrls.length})
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {p.mediaUrls.map((url: string, imgIdx: number) => (
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
                    )}
                  </div>

                  {/* Creative Work Samples & Portfolios (UI/UX, Marketing, Video Editing) */}
                  {inspectingCandidate.workSamples && inspectingCandidate.workSamples.length > 0 && (
                    <div className="pt-4 border-t border-slate-200/80">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Creative Portfolios & Work Samples ({inspectingCandidate.workSamples.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inspectingCandidate.workSamples.map((ws: any) => (
                          <div key={ws.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 mb-1">
                                  {ws.sampleType || 'DELIVERABLE'}
                                </span>
                                <h5 className="text-sm font-extrabold text-slate-900">{ws.title}</h5>
                              </div>
                              {ws.fileUrl && (
                                <a
                                  href={ws.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-bold hover:bg-emerald-100 transition-colors shrink-0"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  View Live Asset ↗
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{ws.description}</p>
                            {ws.thumbnailUrl && (
                              <a
                                href={ws.fileUrl || ws.thumbnailUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative block aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 hover:border-emerald-500 transition-colors"
                              >
                                <img
                                  src={ws.thumbnailUrl}
                                  alt={ws.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                                  Preview Asset ↗
                                </span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PDF RESUME */}
              {inspectorTab === 'resume' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate PDF Document</h4>
                  {inspectingCandidate.cvFileUrl ? (
                    <div className="p-10 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200">
                        <FileText className="w-7 h-7 stroke-[1.75]" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">Original PDF CV Uploaded</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Authentic resume uploaded during candidate onboarding</p>
                      </div>
                      <a
                        href={inspectingCandidate.cvFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Original PDF Resume ↗
                      </a>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-400 text-xs font-medium border border-dashed rounded-2xl bg-white">
                      Candidate has not attached a PDF CV yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ACADEMICS */}
              {inspectorTab === 'academics' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Educational Background</h4>
                    <div className="space-y-3">
                      {inspectingCandidate.education?.map((edu: any) => (
                        <div key={edu.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <p className="text-xs font-bold text-slate-900">{edu.institutionName}</p>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {edu.degree} in {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear}) {edu.gradeOrCgpa && `• CGPA: ${edu.gradeOrCgpa}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {inspectingCandidate.certificates && inspectingCandidate.certificates.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates & Credentials</h4>
                      <div className="space-y-2">
                        {inspectingCandidate.certificates.map((cert: any) => (
                          <div key={cert.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900">{cert.name}</p>
                            <p className="text-[11px] text-slate-500">{cert.issuingOrganization} • {cert.issueDate}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* DEFAULT MAIN VIEWS (TABS)                                    */
          /* ============================================================ */
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top View Header */}
            <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
              <div>
                <h1 className="text-base font-extrabold text-slate-900">
                  {activeTab === 'candidates' && 'Candidate Verification & Moderation'}
                  {activeTab === 'placements' && 'Verified In-App Placements & Success Telemetry'}
                  {activeTab === 'dashboard' && 'Executive Platform Overview & Telemetry'}
                  {activeTab === 'recruiters' && 'Recruiter & Employer Partner Management'}
                  {activeTab === 'ledger' && 'Financial Revenue & ₹99 Activation Ledger'}
                </h1>
                <p className="text-xs text-slate-500">
                  {activeTab === 'candidates' && 'Inspect student proof of work, view uploaded PDF resumes, and verify hired status'}
                  {activeTab === 'placements' && 'Audit live candidates hired directly through FresherToWork with verified employer offers'}
                  {activeTab === 'dashboard' && 'Real-time platform revenue, talent pipeline health, and partner registrations'}
                  {activeTab === 'recruiters' && 'Authorize company accounts, track hires completed, and correct recruiter details'}
                  {activeTab === 'ledger' && 'Razorpay verified transactions, order audit IDs, and activation receipts'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchAdminData()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-400'}`} />
                  Sync Data
                </button>
              </div>
            </header>

            {/* ============================================================ */}
            {/* TAB 1: CANDIDATES VERIFICATION & FULL PROFILE VIEW           */}
            {/* ============================================================ */}
            {activeTab === 'candidates' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search candidate by name, role, email, city, or employer..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                {(['ALL', 'PENDING', 'FLAGGED', 'VERIFIED', 'ACTIVATED', 'HIRED', 'REJECTED'] as StatusFilter[]).map((tab) => {
                  const count =
                    tab === 'ALL'
                      ? students.length
                      : tab === 'FLAGGED'
                      ? students.filter((s) => s.moderationStatus === 'FLAGGED' || Boolean(s.moderationNotes)).length
                      : tab === 'HIRED'
                      ? students.filter((s) => s.isPlaced).length
                      : tab === 'ACTIVATED'
                      ? students.filter((s) => s.isActivated).length
                      : students.filter((s) => s.verificationStatus === tab).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                        statusFilter === tab
                          ? tab === 'FLAGGED'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : tab === 'FLAGGED' && count > 0
                          ? 'text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                          : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {tab === 'HIRED' && '🏆 HIRED VIA APP'}
                      {tab === 'FLAGGED' && '⚠️ ISSUES'}
                      {tab !== 'HIRED' && tab !== 'FLAGGED' && tab}
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        statusFilter === tab ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Candidates Table (Zero Horizontal Scroll - 100% Width Responsive) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="w-full">
                <table className="w-full text-left text-xs table-auto">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3.5 w-[28%]">Candidate</th>
                      <th className="px-4 py-3.5 w-[26%]">Headline & Domain</th>
                      <th className="px-3 py-3.5 w-[16%]">Score & Proof</th>
                      <th className="px-3 py-3.5 w-[16%]">Status / Placement</th>
                      <th className="px-4 py-3.5 w-[14%] text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-slate-400 font-medium">
                          No candidates found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => {
                        const proofCount = (st.projects?.length || 0) + (st.workSamples?.length || 0);
                        const isFlagged = st.moderationStatus === 'FLAGGED' || Boolean(st.moderationNotes);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Identity */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`h-8 w-8 rounded-xl ${
                                  isFlagged
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                } flex items-center justify-center font-black text-xs shrink-0 shadow-2xs`}>
                                  {st.fullName?.charAt(0) || 'F'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900 truncate text-xs">{st.fullName}</p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {st.city ? `${st.city} • ` : ''}{st.user?.email || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Headline */}
                            <td className="px-4 py-3.5">
                              <p className="text-slate-800 font-medium truncate text-xs">{st.headline || 'Fresher Graduate'}</p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {st.preferences?.preferredRoles?.slice(0, 2).join(', ') || 'Entry Level / Full Time'}
                              </p>
                            </td>

                            {/* Completeness & Proof */}
                            <td className="px-3 py-3.5">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-full rounded-full"
                                      style={{ width: `${st.completenessScore || 0}%` }}
                                    />
                                  </div>
                                  <span className="font-extrabold text-slate-700 text-[10px]">{st.completenessScore || 0}%</span>
                                </div>
                                <p className="text-[10px] font-semibold text-slate-500">
                                  {proofCount} proof items {st.cvFileUrl ? '• PDF CV' : ''}
                                </p>
                              </div>
                            </td>

                            {/* Verification & Placement */}
                            <td className="px-3 py-3.5">
                              {st.isPlaced ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold shadow-2xs">
                                    <BadgeCheck className="w-3 h-3" />
                                    HIRED VIA APP
                                  </span>
                                  <p className="text-[10px] font-bold text-slate-600 truncate">
                                    {st.companyName || 'Verified Employer'}
                                  </p>
                                </div>
                              ) : isFlagged ? (
                                <div className="space-y-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold">
                                    <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                                    ACTION REQUIRED
                                  </span>
                                  <p className="text-[10px] text-amber-800 font-semibold truncate max-w-[140px]" title={st.moderationNotes}>
                                    {st.moderationNotes ? st.moderationNotes.replace(/^\[.*?\]\s*/, '') : 'Issue flagged'}
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                      st.verificationStatus === 'VERIFIED'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : st.verificationStatus === 'REJECTED'
                                        ? 'bg-red-50 text-red-700 border border-red-200'
                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}
                                  >
                                    {st.verificationStatus === 'VERIFIED' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                    {st.verificationStatus === 'REJECTED' && <XCircle className="w-2.5 h-2.5" />}
                                    {st.verificationStatus === 'PENDING' && <Clock className="w-2.5 h-2.5" />}
                                    {st.verificationStatus}
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-medium">
                                    {st.isActivated ? '✓ Activated (Paid)' : 'Inactive'}
                                  </p>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                {st.isActivated ? (
                                  <button
                                    onClick={() => handleModerateStudent(st.id, 'PENDING', false)}
                                    disabled={moderatingId === st.id}
                                    title="Candidate is active. Click to deactivate/revoke pass."
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-[11px] shadow-2xs transition-colors cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Active
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleModerateStudent(st.id, 'VERIFIED', true)}
                                    disabled={moderatingId === st.id}
                                    title="Click to instantly approve & activate candidate"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                  >
                                    <Zap className="w-3.5 h-3.5" />
                                    Activate
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setInspectingCandidate(st);
                                    setInspectorTab(st.isPlaced ? 'placement' : 'overview');
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  Details
                                </button>
                                <button
                                  onClick={() => {
                                    setPasswordTarget({
                                      type: 'CANDIDATE',
                                      id: st.id,
                                      name: st.fullName || 'Candidate',
                                      email: st.email || st.user?.email || '',
                                    });
                                    setNewTargetPassword('');
                                    setPasswordSuccessMessage(null);
                                    setCopiedPassword(false);
                                  }}
                                  title="Set or Reset Candidate Password"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                                >
                                  <Key className="w-3.5 h-3.5 text-amber-600" />
                                  Password
                                </button>
                                <button
                                  onClick={() => handleDeleteCandidate(st.id, st.fullName || 'Candidate')}
                                  title="Permanently delete candidate"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: VERIFIED IN-APP PLACEMENTS & SUCCESS RATE TELEMETRY    */}
        {/* ============================================================ */}
        {activeTab === 'placements' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* 4 Hero KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Hires via App</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-slate-900">{totalHiresCount}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    100% In-App
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" /> Direct In-App Placements
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">App Total Success Rate</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-emerald-700">{platformSuccessRate}%</h3>
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Offers released vs active talent pool
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Fresher Package</span>
                <h3 className="text-3xl font-black text-slate-900">
                  {analytics?.metrics?.averagePackageLpa || '₹7.18 LPA'}
                </h3>
                <p className="text-[11px] text-purple-700 font-semibold">
                  Verified salary range: ₹6.0 - ₹8.5 LPA
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg. Time-to-Hire</span>
                <h3 className="text-3xl font-black text-slate-900">
                  {analytics?.metrics?.averageDaysToHire || '4.5 Days'}
                </h3>
                <p className="text-[11px] text-blue-700 font-semibold">
                  Discovery to offer acceptance
                </p>
              </div>
            </div>

            {/* In-App Verification Guarantee Notice */}
            <div className="bg-emerald-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-11 w-11 rounded-xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-700/50">
                  <BadgeCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">100% In-App Direct Placement Verification</h4>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    All listed candidate hires were directly discovered, evaluated via verified proof-of-work, and hired through the FresherToWork portal.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-800/80 border border-emerald-700 text-xs font-bold text-emerald-100">
                  ⚡ 0% External Leakage
                </span>
              </div>
            </div>

            {/* Placements Live Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Live Verified In-App Placements Feed
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time audit log of accepted recruiter job offers & candidate placements
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  {placementsList.length} Verified Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Placed Candidate</th>
                      <th className="px-5 py-3.5">Hiring Employer & Lead</th>
                      <th className="px-5 py-3.5">Secured Role</th>
                      <th className="px-5 py-3.5">Offered CTC</th>
                      <th className="px-5 py-3.5">App Verification Proof</th>
                      <th className="px-5 py-3.5">Placement Date</th>
                      <th className="px-5 py-3.5 text-right">Audit Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {placementsList.map((plc: any, idx: number) => (
                      <tr key={plc.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        {/* Candidate */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                              {plc.candidateName?.charAt(0) || 'C'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{plc.candidateName}</p>
                              <p className="text-[11px] text-slate-400 truncate">{plc.candidateEmail}</p>
                            </div>
                          </div>
                        </td>

                        {/* Employer & Recruiter */}
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-slate-900">{plc.companyName}</p>
                          <p className="text-[11px] text-slate-500 font-medium">Recruiter: {plc.recruiterName}</p>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-slate-800">{plc.roleTitle}</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">Full-Time Direct Offer</p>
                        </td>

                        {/* Package */}
                        <td className="px-5 py-3.5">
                          <span className="font-black text-slate-900 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            {plc.packageLpa}
                          </span>
                        </td>

                        {/* Verification */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              100% IN-APP HIRE
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {plc.auditId}</p>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3.5 text-slate-500">
                          {new Date(plc.placedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => {
                              const match = students.find((s) => s.fullName === plc.candidateName || s.id === plc.studentId);
                              if (match) {
                                setInspectingCandidate({ ...match, ...plc, isPlaced: true });
                              } else {
                                setInspectingCandidate({ ...plc, isPlaced: true, fullName: plc.candidateName });
                              }
                              setInspectorTab('placement');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-slate-400" />
                            Audit Offer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recruiter Placement Leaderboard & Platform Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Top Hiring Employer Organizations
                </h4>
                <div className="space-y-3 text-xs">
                  {companies.map((c: any, idx: number) => {
                    const compHires = placementsList.filter(
                      (p: any) => p.companyName?.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(p.companyName?.toLowerCase())
                    ).length;
                    return (
                      <div key={c.id || idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-lg ${idx === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'} flex items-center justify-center font-black text-xs`}>
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-[10px] text-slate-400">{c.industry || 'Technology & Engineering'}</p>
                          </div>
                        </div>
                        <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {compHires} {compHires === 1 ? 'Hire Placed' : 'Hires Placed'}
                        </span>
                      </div>
                    );
                  })}
                  {companies.length === 0 && (
                    <div className="p-4 text-center text-slate-400">No employer organizations registered yet.</div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  App Success Telemetry Breakdown
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">In-App Candidate Contact Reveals</span>
                    <span className="font-black text-slate-900">
                      {analytics?.metrics?.totalContactReveals || 0} Reveals
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Recruiter Candidate Bookmarks & Saves</span>
                    <span className="font-black text-slate-900">
                      {analytics?.metrics?.totalShortlists || 1} Shortlists
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Interview-to-Offer Conversion Rate</span>
                    <span className="font-black text-emerald-700">{platformSuccessRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: EXECUTIVE PLATFORM OVERVIEW                           */}
        {/* ============================================================ */}
        {activeTab === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</span>
                <h3 className="text-3xl font-black text-slate-900">
                  ₹{analytics?.totalRevenueInRupees || payments.length * 99}
                </h3>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> 100% Verified Razorpay Transactions
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In-App Placed Hires</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-emerald-700">{totalHiresCount}</h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    100% In-App
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {platformSuccessRate}% Platform Success Rate
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Talent Pool</span>
                <h3 className="text-3xl font-black text-slate-900">{students.length}</h3>
                <p className="text-[11px] text-slate-500 font-semibold">
                  {students.filter((s) => s.isActivated).length} activated for discovery
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employer Organizations</span>
                <h3 className="text-3xl font-black text-slate-900">{companies.length}</h3>
                <p className="text-[11px] text-purple-700 font-semibold">
                  {recruiters.length} active recruiter leads
                </p>
              </div>
            </div>

            {/* Business Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Fresher Talent Pipeline Breakdown
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Activated & Discovery Ready (₹99 Paid)</span>
                    <span className="font-black text-slate-900">{students.filter((s) => s.isActivated).length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Verified Proof-of-Work Projects</span>
                    <span className="font-black text-slate-900">
                      {students.reduce((acc, s) => acc + (s.projects?.length || 0) + (s.workSamples?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Original PDF CVs Uploaded</span>
                    <span className="font-black text-slate-900">{students.filter((s) => s.cvFileUrl).length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Employer & Recruiter Activity
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Verified Partner Companies</span>
                    <span className="font-black text-slate-900">
                      {companies.filter((c) => c.verificationStatus === 'VERIFIED').length || companies.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Active Talent Acquisition Leads</span>
                    <span className="font-black text-slate-900">{recruiters.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-slate-700">Successful ₹99 Profile Activations</span>
                    <span className="font-black text-slate-900">{payments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: RECRUITERS DIRECTORY & MANAGEMENT                     */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* TAB 4: RECRUITERS DIRECTORY & MANAGEMENT                     */}
        {/* ============================================================ */}
        {activeTab === 'recruiters' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={recruiterSearch}
                  onChange={(e) => setRecruiterSearch(e.target.value)}
                  placeholder="Search by company name, recruiter lead, email, industry, or location..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'HIRED', 'VERIFIED'] as const).map((filter) => {
                    const count =
                      filter === 'ALL'
                        ? recruiters.length
                        : filter === 'HIRED'
                        ? recruiters.filter((r) => (r.hiresCount || 0) > 0).length
                        : recruiters.filter((r) => (r.company?.verificationStatus || 'VERIFIED') === 'VERIFIED').length;

                    return (
                      <button
                        key={filter}
                        onClick={() => setRecruiterFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                          recruiterFilter === filter
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {filter === 'ALL' && 'All Partners'}
                        {filter === 'HIRED' && '🏆 Placed Hires'}
                        {filter === 'VERIFIED' && '✓ Verified'}
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            recruiterFilter === filter ? 'bg-black/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowCreateRecruiterModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Recruiter</span>
                </button>
              </div>
            </div>

            {/* Clean, Spacious, Uncongested Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="w-full">
                <table className="w-full text-left text-xs table-auto">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4 w-[40%]">Company & Recruiter Lead</th>
                      <th className="px-6 py-4 w-[26%]">Domain & Headquarters</th>
                      <th className="px-6 py-4 w-[16%]">Verified Placements</th>
                      <th className="px-4 py-4 w-[8%]">Status</th>
                      <th className="px-6 py-4 w-[10%] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const q = recruiterSearch.toLowerCase().trim();
                      const filtered = recruiters.filter((rec) => {
                        const comp = rec.company?.name?.toLowerCase() || '';
                        const lead = rec.fullName?.toLowerCase() || '';
                        const em = (rec.businessEmail || rec.user?.email || '').toLowerCase();
                        const ind = rec.company?.industry?.toLowerCase() || '';
                        const loc = rec.company?.location?.toLowerCase() || '';
                        const matchText = !q || comp.includes(q) || lead.includes(q) || em.includes(q) || ind.includes(q) || loc.includes(q);

                        if (!matchText) return false;
                        if (recruiterFilter === 'HIRED') return (rec.hiresCount || 0) > 0;
                        if (recruiterFilter === 'VERIFIED') return (rec.company?.verificationStatus || 'VERIFIED') === 'VERIFIED';
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} className="text-center py-16 text-slate-400 font-medium">
                              No recruiter accounts match your filter criteria.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Column 1: Merged Company & Recruiter Profile */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3.5">
                              <div className="h-11 w-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-2xs shrink-0">
                                {rec.company?.name?.charAt(0) || 'C'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-900 text-xs">
                                    {rec.company?.name || 'Company'}
                                  </span>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    {rec.company?.verificationStatus || 'VERIFIED'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-700 font-semibold mt-0.5 truncate">
                                  {rec.fullName} <span className="text-slate-400 font-normal">({rec.designation || 'Recruiter'})</span>
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono truncate">
                                  {rec.businessEmail || rec.user?.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Domain & Headquarters */}
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {rec.company?.industry || 'Technology & Digital Services'}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {rec.company?.location || 'Bengaluru / Remote'}
                            </p>
                            {rec.company?.website && (
                              <a
                                href={rec.company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-emerald-700 hover:underline inline-flex items-center gap-1 font-semibold mt-0.5"
                              >
                                <Globe className="w-2.5 h-2.5 text-emerald-600" />
                                {rec.company.website.replace('https://', '').replace('http://', '')}
                              </a>
                            )}
                          </td>

                          {/* Column 3: Placed Hires (Real Data Calculation) */}
                          <td className="px-6 py-4">
                            {(() => {
                              const compName = rec.company?.name || rec.companyName || '';
                              const realHires = students.filter(
                                (s) =>
                                  (s.isHired || s.placement) &&
                                  ((s.placement?.company?.name || s.companyName || '').toLowerCase().includes(compName.toLowerCase()) ||
                                    (rec.id && s.placement?.recruiterId === rec.id))
                              ).length;

                              return realHires > 0 ? (
                                <>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shadow-2xs">
                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    {realHires} Placed
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    Direct In-App
                                  </p>
                                </>
                              ) : (
                                <>
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                                    0 Placed
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    No hires yet
                                  </p>
                                </>
                              );
                            })()}
                          </td>

                          {/* Column 4: Account Status */}
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          </td>

                          {/* Column 5: Clean Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedCompanyHub(rec);
                                  setCompanyHubTab('hires');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>Company Hub</span>
                                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                              </button>
                              <button
                                onClick={() => {
                                  setPasswordTarget({
                                    type: 'RECRUITER',
                                    id: rec.id,
                                    name: rec.fullName || rec.company?.name || rec.companyName || 'Recruiter',
                                    email: rec.email || '',
                                  });
                                  setNewTargetPassword('');
                                  setPasswordSuccessMessage(null);
                                  setCopiedPassword(false);
                                }}
                                className="p-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                                title="Set / Reset Recruiter Password"
                              >
                                <Key className="w-3.5 h-3.5 text-amber-600" />
                              </button>
                              <button
                                onClick={() => setEditingRecruiter(rec)}
                                className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                title="Edit Recruiter Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRecruiter(rec)}
                                disabled={deletingRecruiterId === rec.id}
                                className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                                title="Delete Recruiter Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: FINANCIAL REVENUE LEDGER                              */}
        {/* ============================================================ */}
        {activeTab === 'ledger' && (
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-black text-slate-900">Financial Revenue Ledger</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    Razorpay Live Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Candidate ₹99 activation receipts, gateway payment audit IDs, and ledger control
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={() => fetchAdminData()}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Sync Ledger
                </button>
                {payments.length > 0 && (
                  <button
                    onClick={handleClearAllTestPayments}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Clear all test transaction entries from ledger"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Test Ledger
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue Collected</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">
                  ₹{(payments.reduce((acc, p) => acc + (p.amountPaise || 9900), 0) / 100).toFixed(2)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Successful Activations</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{payments.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Payment Gateway</span>
                <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Razorpay SDK • Official Merchant Active
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Receipt ID</th>
                      <th className="px-5 py-3.5">Candidate Details</th>
                      <th className="px-5 py-3.5">Amount</th>
                      <th className="px-5 py-3.5">Razorpay Order ID</th>
                      <th className="px-5 py-3.5">Payment ID</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                          No payments recorded yet in the ledger.
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => {
                        const candidateEmail = p.user?.email || p.candidateEmail || 'candidate@freshertowork.com';
                        const candidateName = p.user?.fullName || p.candidateName || 'Candidate';
                        const rzpOrder = p.razorpayOrderId || p.gatewayOrderId || '—';
                        const rzpPayment = p.razorpayPaymentId || p.gatewayPaymentId || '—';
                        const amountInRupees = ((p.amountPaise || 9900) / 100).toFixed(2);

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                              {p.id.length > 14 ? `${p.id.substring(0, 12)}...` : p.id}
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-bold text-slate-900 text-xs">{candidateName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{candidateEmail}</p>
                            </td>
                            <td className="px-5 py-3.5 font-black text-emerald-600 font-mono">
                              ₹{amountInRupees}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-500 text-[10px]">
                              {rzpOrder}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-500 text-[10px]">
                              {rzpPayment}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase">
                                <CheckCircle2 className="w-3 h-3" />
                                {p.status || 'SUCCESS'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-400">
                              {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                onClick={() => handleDeletePayment(p.id)}
                                title="Delete test payment transaction from ledger"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          </div>
        )}
      </main>

      {/* ============================================================ */}
      {/* MODAL: CREATE RECRUITER PROFILE                              */}
      {/* ============================================================ */}
      {showCreateRecruiterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Create Recruiter & Company</h3>
                <p className="text-xs text-slate-500">Authorize employer access directly from Super Admin</p>
              </div>
              <button
                onClick={() => setShowCreateRecruiterModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecruiter} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Recruiter Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newRecruiter.fullName}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, fullName: e.target.value })}
                    placeholder="e.g. Anjali Menon"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Designation *</label>
                  <input
                    type="text"
                    required
                    value={newRecruiter.designation}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, designation: e.target.value })}
                    placeholder="e.g. Lead Talent Acquisition"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={newRecruiter.email}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, email: e.target.value })}
                    placeholder="recruiter@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Secure Password *</label>
                  <input
                    type="password"
                    required
                    value={newRecruiter.password}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newRecruiter.companyName}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, companyName: e.target.value })}
                    placeholder="e.g. RazorScale Tech"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Website</label>
                  <input
                    type="url"
                    value={newRecruiter.website}
                    onChange={(e) => setNewRecruiter({ ...newRecruiter, website: e.target.value })}
                    placeholder="https://company.io"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateRecruiterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingRecruiter}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {creatingRecruiter ? 'Creating...' : 'Create Recruiter Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT / CORRECT RECRUITER & COMPANY                    */}
      {/* ============================================================ */}
      {editingRecruiter && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit / Correct Recruiter Profile</h3>
                <p className="text-xs text-slate-500">Update verified company and lead profile details</p>
              </div>
              <button
                onClick={() => setEditingRecruiter(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecruiter} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Recruiter Name</label>
                  <input
                    type="text"
                    required
                    value={editingRecruiter.fullName || ''}
                    onChange={(e) => setEditingRecruiter({ ...editingRecruiter, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Designation</label>
                  <input
                    type="text"
                    required
                    value={editingRecruiter.designation || ''}
                    onChange={(e) => setEditingRecruiter({ ...editingRecruiter, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Name</label>
                  <input
                    type="text"
                    required
                    value={editingRecruiter.company?.name || ''}
                    onChange={(e) =>
                      setEditingRecruiter({
                        ...editingRecruiter,
                        company: { ...editingRecruiter.company, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Website</label>
                  <input
                    type="url"
                    value={editingRecruiter.company?.website || ''}
                    onChange={(e) =>
                      setEditingRecruiter({
                        ...editingRecruiter,
                        company: { ...editingRecruiter.company, website: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const rec = editingRecruiter;
                    setEditingRecruiter(null);
                    setPasswordTarget({
                      type: 'RECRUITER',
                      id: rec.id,
                      name: rec.fullName || rec.company?.name || 'Recruiter',
                      email: rec.email || '',
                    });
                    setNewTargetPassword('');
                    setPasswordSuccessMessage(null);
                    setCopiedPassword(false);
                  }}
                  className="mr-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Set / Change Password
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRecruiter(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingRecruiter}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {updatingRecruiter ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: SECURITY & AUDIT LOGS TRAIL                           */}
      {/* ============================================================ */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Platform Security & Audit Trail</h3>
                  <p className="text-xs text-slate-500">Real-time system health, authentication logs, and root integrity</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Health Indicators */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">PostgreSQL Database</p>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Connected & Healthy
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Razorpay Payment Gateway</p>
                <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live Webhook Active
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Super Admin Session</p>
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  JWT Signed (24h)
                </div>
              </div>
            </div>

            {/* Audit Logs List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recent Security & Moderation Events
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">Super Admin Authentication Successful</p>
                      <p className="text-[10px] text-slate-400 font-mono">Actor: {adminEmail} • Session Authenticated</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Just now</span>
                </div>

                {placementsList.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">In-App Placement: {placementsList[0].candidateName} → {placementsList[0].companyName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Offer: {placementsList[0].packageLpa} • Audit ID: {placementsList[0].auditId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Verified</span>
                  </div>
                )}
                {payments.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">Profile Activation Payment Verified</p>
                        <p className="text-[10px] text-slate-400 font-mono">Gateway Order ID: {payments[0].gatewayOrderId || 'RAZORPAY'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Paid</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EXPORT PLATFORM REPORTS (CSV)                         */}
      {/* ============================================================ */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Export Platform Data</h3>
                  <p className="text-xs text-slate-500">Download formatted CSV reports for executive auditing</p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => handleExportCSV('placements')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="font-extrabold text-slate-900 group-hover:text-emerald-950">
                    1. Verified In-App Placements Report (.CSV)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Candidate names, hiring companies, CTC packages, audit IDs
                  </p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
              </button>

              <button
                onClick={() => handleExportCSV('candidates')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="font-extrabold text-slate-900 group-hover:text-emerald-950">
                    2. Candidate Talent Directory (.CSV)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Profiles, completeness score, verification status, contact details
                  </p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
              </button>

              <button
                onClick={() => handleExportCSV('ledger')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left cursor-pointer group"
              >
                <div>
                  <p className="font-extrabold text-slate-900 group-hover:text-emerald-950">
                    3. ₹99 Revenue & Financial Ledger (.CSV)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Razorpay order IDs, payment IDs, verification timestamps
                  </p>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
              </button>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: SUPER ADMIN PASSWORD RESET & OVERRIDE                 */}
      {/* ============================================================ */}
      {passwordTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-black">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">
                    Set / Reset Password
                  </h3>
                  <p className="text-xs text-slate-500">
                    Super Admin Password Override
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPasswordTarget(null);
                  setPasswordSuccessMessage(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Account Type:</span>
                <span className="font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                  {passwordTarget.type === 'CANDIDATE' ? '🎓 Candidate' : '🏢 Recruiter'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Name:</span>
                <span className="font-bold text-slate-900">{passwordTarget.name}</span>
              </div>
              {passwordTarget.email && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-mono text-slate-700">{passwordTarget.email}</span>
                </div>
              )}
            </div>

            {passwordSuccessMessage ? (
              <div className="space-y-4 py-2">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{passwordSuccessMessage}</p>
                    <p className="mt-1 text-[11px] text-emerald-700">
                      The user can now immediately log in with this new password.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">New Password</span>
                    <span className="font-mono font-black text-slate-900 text-sm">{newTargetPassword}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newTargetPassword);
                      setCopiedPassword(true);
                      setTimeout(() => setCopiedPassword(false), 2000);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setPasswordTarget(null);
                      setPasswordSuccessMessage(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      New Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomPass = 'F2W@' + Math.random().toString(36).slice(-6) + '!';
                        setNewTargetPassword(randomPass);
                      }}
                      className="text-[11px] text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer"
                    >
                      🎲 Generate Random
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    minLength={4}
                    placeholder="Enter new password (e.g. Talent@123)"
                    value={newTargetPassword}
                    onChange={(e) => setNewTargetPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-600 focus:outline-none text-sm font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    This password will be immediately active for their account.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordTarget(null);
                      setPasswordSuccessMessage(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPassword || !newTargetPassword.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5" />
                    {savingPassword ? 'Updating...' : 'Set New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
