'use client';

import { useState, useEffect } from 'react';
import {
  StudentProfile,
  RecruiterProfile,
  WorkMode,
  AvailabilityOption,
  TalentSortOption,
} from '@fresher2work/types';
import { recruiterApi } from '@/lib/api';
import {
  Search,
  GraduationCap,
  Briefcase,
  Zap,
  ShieldCheck,
  MapPin,
  FileText,
  Globe,
  Code2,
  ExternalLink,
  Bookmark,
  Mail,
  Phone,
  Award,
  CheckCircle2,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Sparkles,
  SlidersHorizontal,
  BookmarkPlus,
  ImageIcon,
  Palette,
  Video,
  TrendingUp,
  Layers,
  Wrench,
  Lock,
} from 'lucide-react';

function getCandidateDiscipline(student: StudentProfile) {
  const text = `${student.headline || ''} ${student.about || ''} ${student.preferences?.preferredRoles?.join(' ') || ''} ${student.skills?.map((s) => s.skillName).join(' ') || ''}`.toLowerCase();
  if (text.includes('ui/ux') || text.includes('product design') || text.includes('figma') || text.includes('designer') || text.includes('graphic design') || text.includes('brand')) {
    return { label: '🎨 UI/UX & Design', color: 'bg-pink-100 text-pink-800 border-pink-300' };
  }
  if (text.includes('marketing') || text.includes('growth') || text.includes('seo') || text.includes('ads') || text.includes('semrush') || text.includes('performance marketer')) {
    return { label: '📈 Digital Marketing', color: 'bg-amber-100 text-amber-900 border-amber-300' };
  }
  if (text.includes('video') || text.includes('editor') || text.includes('motion') || text.includes('premiere') || text.includes('davinci') || text.includes('after effects')) {
    return { label: '🎬 Video & Motion', color: 'bg-violet-100 text-violet-800 border-violet-300' };
  }
  return { label: '💻 Tech & Software', color: 'bg-blue-100 text-blue-800 border-blue-300' };
}

export default function TalentDiscoveryPage() {
  const [talents, setTalents] = useState<StudentProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedWorkModes, setSelectedWorkModes] = useState<WorkMode[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [selectedEducation, setSelectedEducation] = useState('');
  const [minCompleteness, setMinCompleteness] = useState<number>(0);
  const [hasCvOnly, setHasCvOnly] = useState(false);
  const [hasProjectsOnly, setHasProjectsOnly] = useState(false);
  const [hasWorkSamplesOnly, setHasWorkSamplesOnly] = useState(false);
  const [hasCertificatesOnly, setHasCertificatesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<TalentSortOption>('RELEVANCE');

  // Slide-Over Drawer & Actions
  const [selectedCandidate, setSelectedCandidate] = useState<StudentProfile | null>(null);
  const [contactRevealed, setContactRevealed] = useState<any>(null);
  const [contacting, setContacting] = useState(false);
  const [shortlistNote, setShortlistNote] = useState('');
  const [savingShortlist, setSavingShortlist] = useState(false);
  const [shortlistSuccess, setShortlistSuccess] = useState('');

  // Hire Candidate Modal State
  const [hiringCandidate, setHiringCandidate] = useState<StudentProfile | null>(null);
  const [hireRoleTitle, setHireRoleTitle] = useState('');
  const [hirePackageLpa, setHirePackageLpa] = useState('');
  const [hireNotes, setHireNotes] = useState('');
  const [hiringLoading, setHiringLoading] = useState(false);
  const [hireError, setHireError] = useState('');
  const [hireSuccessMsg, setHireSuccessMsg] = useState('');

  // Recruiter Identity & Hired Access Control
  const [currentRecruiter, setCurrentRecruiter] = useState<RecruiterProfile | null>(null);
  const [lockedModalCandidate, setLockedModalCandidate] = useState<StudentProfile | null>(null);

  useEffect(() => {
    recruiterApi
      .getRecruiterProfile()
      .then((res) => {
        if (res?.recruiter) setCurrentRecruiter(res.recruiter);
      })
      .catch(() => {});
  }, []);

  const isCandidateHired = (student: StudentProfile) => Boolean(student.placement || student.isHired);
  const isHiredByMe = (student: StudentProfile) => {
    if (!isCandidateHired(student)) return false;
    if (!currentRecruiter) return false;
    const p = student.placement;
    if (!p) return false;
    return p.recruiterId === currentRecruiter.id || Boolean(p.companyId && p.companyId === currentRecruiter.companyId);
  };

  // Facets
  const [facets, setFacets] = useState<any>({
    skills: [],
    locations: [],
    workModes: [],
    roles: [],
    education: [],
  });

  const fetchTalents = async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const res = await recruiterApi.searchTalents({
        q: searchQuery || undefined,
        roles: selectedRole ? [selectedRole] : undefined,
        skills: selectedSkill ? [selectedSkill] : undefined,
        locations: selectedLocation ? [selectedLocation] : undefined,
        countries: selectedCountry ? [selectedCountry] : undefined,
        workMode: selectedWorkModes.length > 0 ? selectedWorkModes : undefined,
        availability: selectedAvailability ? [selectedAvailability as AvailabilityOption] : undefined,
        education: selectedEducation ? [selectedEducation] : undefined,
        minCompleteness: minCompleteness > 0 ? minCompleteness : undefined,
        hasCvOnly: hasCvOnly || undefined,
        hasProjectsOnly: hasProjectsOnly || undefined,
        hasWorkSamplesOnly: hasWorkSamplesOnly || undefined,
        hasCertificatesOnly: hasCertificatesOnly || undefined,
        sort: sortBy,
        page: pageToFetch,
        limit: 12,
      });

      setTalents(res.talents);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
      setCurrentPage(res.page);
      setHasMore(res.hasMore);
      if (res.facetCounts) {
        setFacets(res.facetCounts);
      }
    } catch (err) {
      console.warn('Failed to load talents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents(1);
  }, [
    selectedRole,
    selectedSkill,
    selectedLocation,
    selectedCountry,
    selectedWorkModes,
    selectedAvailability,
    selectedEducation,
    minCompleteness,
    hasCvOnly,
    hasProjectsOnly,
    hasWorkSamplesOnly,
    hasCertificatesOnly,
    sortBy,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTalents(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedSkill('');
    setSelectedLocation('');
    setSelectedCountry('');
    setSelectedWorkModes([]);
    setSelectedAvailability('');
    setSelectedEducation('');
    setMinCompleteness(0);
    setHasCvOnly(false);
    setHasProjectsOnly(false);
    setHasWorkSamplesOnly(false);
    setHasCertificatesOnly(false);
    setSortBy('RELEVANCE');
  };

  const toggleWorkMode = (mode: WorkMode) => {
    if (selectedWorkModes.includes(mode)) {
      setSelectedWorkModes(selectedWorkModes.filter((m) => m !== mode));
    } else {
      setSelectedWorkModes([...selectedWorkModes, mode]);
    }
  };

  const handleShortlist = async (candidateId: string, note?: string) => {
    setSavingShortlist(true);
    try {
      await recruiterApi.shortlistCandidate(candidateId, note || undefined);
      setShortlistSuccess('Candidate saved to your shortlist!');
      setTimeout(() => setShortlistSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Could not shortlist candidate');
    } finally {
      setSavingShortlist(false);
    }
  };

  const handleRevealContact = async (candidateId: string, channel: 'EMAIL' | 'PHONE' | 'LINKEDIN' = 'EMAIL') => {
    setContacting(true);
    try {
      const res = await recruiterApi.contactCandidate(candidateId, channel);
      setContactRevealed(res.contactInfo);
    } catch (err: any) {
      alert(err.message || 'Could not reveal contact information');
    } finally {
      setContacting(false);
    }
  };

  const handleOpenHireModal = (candidate: StudentProfile) => {
    setHiringCandidate(candidate);
    setHireRoleTitle(candidate.headline || candidate.preferences?.preferredRoles?.[0] || 'Associate Software Engineer');
    setHirePackageLpa('₹6.50 LPA');
    setHireNotes('');
    setHireError('');
    setHireSuccessMsg('');
  };

  const handleConfirmHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hiringCandidate) return;
    if (!hireRoleTitle.trim()) {
      setHireError('Job role designation is required');
      return;
    }
    setHiringLoading(true);
    setHireError('');
    try {
      const res = await recruiterApi.hireCandidate(hiringCandidate.id, {
        roleTitle: hireRoleTitle.trim(),
        packageLpa: hirePackageLpa.trim() || undefined,
        notes: hireNotes.trim() || undefined,
      });

      // Update in local state
      setTalents((prev) =>
        prev.map((t) =>
          t.id === hiringCandidate.id
            ? { ...t, isHired: true, placement: res.placement }
            : t
        )
      );

      if (selectedCandidate && selectedCandidate.id === hiringCandidate.id) {
        setSelectedCandidate({
          ...selectedCandidate,
          isHired: true,
          placement: res.placement,
        });
      }

      setHireSuccessMsg(`✓ ${hiringCandidate.fullName} marked as HIRED! Placement recorded across platform.`);
      setTimeout(() => {
        setHiringCandidate(null);
        setHireSuccessMsg('');
      }, 1400);
    } catch (err: any) {
      setHireError(err.message || 'Failed to record candidate hire');
    } finally {
      setHiringLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-xs">
            <GraduationCap className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalCount}</p>
            <p className="text-xs font-semibold text-slate-500">Discoverable Freshers</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-xs">
            <Briefcase className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {talents.reduce((acc, t) => acc + (t.projects?.length || 0) + (t.workSamples?.length || 0), 0)}
            </p>
            <p className="text-xs font-semibold text-slate-500">Proof-of-Work Assets</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-xs">
            <Zap className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">
              {talents.filter((t) => t.preferences?.availability === AvailabilityOption.IMMEDIATE).length}
            </p>
            <p className="text-xs font-semibold text-slate-500">Immediate Availability</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60 shadow-xs">
            <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">100%</p>
            <p className="text-xs font-semibold text-slate-500">Verified Activations</p>
          </div>
        </div>
      </div>

      {/* Quick Domain Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: '', label: '🌟 All Disciplines' },
          { key: 'Designer', label: '🎨 UI/UX & Design' },
          { key: 'Marketing', label: '📈 Digital Marketing' },
          { key: 'Video', label: '🎬 Video & Motion' },
          { key: 'Developer', label: '💻 Tech & Software' },
        ].map((tab) => {
          const isActive = selectedRole === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedRole(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Search & Sorting Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (Figma, Meta Ads, Premiere, React), role (UI/UX, Marketing), name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-2 items-center">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2]" />
              Search Talents
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TalentSortOption)}
              className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="RELEVANCE">Relevance (Proof-of-Work)</option>
              <option value="COMPLETENESS">Highest Completeness</option>
              <option value="MOST_RECENT">Newly Activated</option>
              <option value="PROJECTS_COUNT">Most Projects</option>
            </select>
          </div>
        </form>

        {/* Filter Toolbar / Dropdowns */}
        <div className="flex flex-wrap gap-2.5 items-center pt-2 border-t border-slate-100 text-xs">
          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value="">All Career Roles</option>
            <option value="Designer">🎨 UI/UX & Product Designer</option>
            <option value="Marketing">📈 Digital Marketing & Ads</option>
            <option value="Video">🎬 Video Editor & Motion Designer</option>
            <option value="Frontend">Frontend / React</option>
            <option value="Developer">Full-Stack Developer</option>
            <option value="AI">AI & Machine Learning</option>
            <option value="Flutter">Flutter / Mobile</option>
          </select>

          {/* Skill Filter */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value="">All Skills</option>
            <option value="React">React</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Flutter">Flutter</option>
            <option value="Figma">Figma / UI</option>
            <option value="SEO">SEO & Ads</option>
          </select>

          {/* Location Filter */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value="">All Locations</option>
            <option value="Kochi">Kochi</option>
            <option value="Kozhikode">Kozhikode</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Dubai">Dubai</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value="">All Countries</option>
            <option value="India">India</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
          </select>

          {/* Availability Filter */}
          <select
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value="">Any Availability</option>
            <option value="IMMEDIATE">⚡ Immediate</option>
            <option value="WITHIN_15_DAYS">15 Days</option>
            <option value="WITHIN_30_DAYS">30 Days</option>
          </select>

          {/* Education Filter */}
          <select
            value={selectedEducation}
            onChange={(e) => setSelectedEducation(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value="">All Education</option>
            <option value="B.Tech">B.Tech / B.E</option>
            <option value="B.Des">B.Des (Design)</option>
            <option value="BBA">BBA / Management</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          {/* Completeness Filter */}
          <select
            value={minCompleteness}
            onChange={(e) => setMinCompleteness(Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 bg-slate-50 hover:bg-white"
          >
            <option value={0}>Any Completeness</option>
            <option value={80}>80%+ Completeness</option>
            <option value={90}>90%+ Completeness</option>
          </select>

          {/* Work Mode Toggle Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => toggleWorkMode(WorkMode.REMOTE)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedWorkModes.includes(WorkMode.REMOTE)
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Remote
            </button>
            <button
              type="button"
              onClick={() => toggleWorkMode(WorkMode.HYBRID)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedWorkModes.includes(WorkMode.HYBRID)
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hybrid
            </button>
            <button
              type="button"
              onClick={() => toggleWorkMode(WorkMode.ON_SITE)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedWorkModes.includes(WorkMode.ON_SITE)
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              On-Site
            </button>
          </div>

          {/* Proof of Work Checkbox Toggles */}
          <div className="flex items-center gap-3 pl-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCvOnly}
                onChange={(e) => setHasCvOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Has CV
            </label>

            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={hasProjectsOnly}
                onChange={(e) => setHasProjectsOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Has Projects
            </label>
          </div>

          {(searchQuery ||
            selectedRole ||
            selectedSkill ||
            selectedLocation ||
            selectedCountry ||
            selectedWorkModes.length > 0 ||
            selectedAvailability ||
            selectedEducation ||
            minCompleteness > 0 ||
            hasCvOnly ||
            hasProjectsOnly ||
            hasWorkSamplesOnly ||
            hasCertificatesOnly) && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 ml-auto cursor-pointer"
            >
              ✕ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
          Talent Matches ({totalCount})
        </h2>
        <span className="text-xs text-slate-400">
          Showing page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Candidate Discovery Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading discovery pool...</div>
      ) : talents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200/60">
            <Search className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-base font-bold text-slate-800">No candidates match your active filters</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Try resetting some filters or searching with broader keywords to discover more fresher talent.
          </p>
          <button
            onClick={resetAllFilters}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((student) => {
            const totalProofItems = (student.projects?.length || 0) + (student.workSamples?.length || 0);
            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Avatar & Info */}
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center font-black text-slate-600">
                      {student.avatarUrl ? (
                        <img src={student.avatarUrl} alt={student.fullName} className="h-full w-full object-cover" />
                      ) : (
                        student.fullName.charAt(0)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-extrabold text-slate-900 truncate">{student.fullName}</h3>
                        {student.placement || student.isHired ? (
                          isHiredByMe(student) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-2xs shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                              HIRED BY YOU
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-2xs shrink-0">
                              <Lock className="w-3 h-3 text-slate-500 stroke-[2.5]" />
                              PLACED & LOCKED
                            </span>
                          )
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200 shrink-0">
                            {student.completenessScore}% Complete
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded-md text-[9px] font-bold border uppercase tracking-wider shrink-0 ${getCandidateDiscipline(student).color}`}>
                          {getCandidateDiscipline(student).label}
                        </span>
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {student.headline || 'Fresher Graduate'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Placement Banner if Hired */}
                  {(student.placement || student.isHired) && (
                    isHiredByMe(student) ? (
                      <div className="mt-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-950 font-semibold flex items-center justify-between shadow-2xs">
                        <div className="truncate flex items-center gap-1.5 min-w-0">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">
                            <strong className="text-emerald-900">Placed at your company:</strong> {student.placement?.companyName || currentRecruiter?.company?.name || 'Your Company'}
                            {student.placement?.roleTitle && ` • ${student.placement.roleTitle}`}
                          </span>
                        </div>
                        {student.placement?.packageLpa && (
                          <span className="shrink-0 font-black text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded-md text-[10px] ml-1.5">
                            {student.placement.packageLpa}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2.5 rounded-xl bg-slate-100 border border-slate-300 p-2.5 text-xs text-slate-700 font-semibold flex items-center justify-between shadow-2xs">
                        <div className="truncate flex items-center gap-1.5 min-w-0">
                          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">
                            Placed at <strong>{student.placement?.companyName || 'Partner Employer'}</strong>. Profile access restricted.
                          </span>
                        </div>
                        <span className="shrink-0 font-extrabold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md text-[10px] ml-1.5 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      </div>
                    )
                  )}

                  {/* Bio snippet */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {student.about || 'Fresher talent ready for immediate contribution.'}
                  </p>

                  {/* Proof of Work Projects & Work Samples Showcase */}
                  <div className="mt-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] px-0.5">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />
                        Proof of Work ({totalProofItems} assets)
                      </span>
                      {student.cvFileUrl && (
                        <a
                          href={student.cvFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] hover:bg-emerald-100 transition-colors"
                        >
                          <FileText className="w-3 h-3 stroke-[2]" />
                          CV PDF ↗
                        </a>
                      )}
                    </div>

                    {/* Render candidate projects */}
                    {student.projects && student.projects.length > 0 ? (
                      <div className="space-y-2">
                        {student.projects.slice(0, 2).map((proj) => (
                          <div key={proj.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs space-y-1.5">
                            <div className="flex items-start justify-between gap-1">
                              <div>
                                <p className="font-bold text-slate-900 line-clamp-1">{proj.title}</p>
                                {proj.role && <p className="text-[10px] font-semibold text-emerald-700">Role: {proj.role}</p>}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold">
                                {proj.liveDemoUrl && (
                                  <a
                                    href={proj.liveDemoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-700 hover:text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                                  >
                                    <Globe className="w-2.5 h-2.5" /> Demo
                                  </a>
                                )}
                                {proj.githubRepoUrl && (
                                  <a
                                    href={proj.githubRepoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-700 hover:text-slate-900 bg-slate-200/70 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                                  >
                                    <Code2 className="w-2.5 h-2.5" /> Code
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Tools Used Chips */}
                            {proj.toolsUsed && proj.toolsUsed.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {proj.toolsUsed.map((tool, idx) => (
                                  <span key={idx} className="bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    🛠️ {tool}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Tech Stack if present */}
                            {proj.techStack && proj.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {proj.techStack.map((tech, idx) => (
                                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Proof Screenshot Images Preview */}
                            {proj.mediaUrls && proj.mediaUrls.length > 0 && (
                              <div className="grid grid-cols-2 gap-1.5 pt-1">
                                {proj.mediaUrls.slice(0, 2).map((imgUrl, i) => (
                                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                    <img src={imgUrl} alt="Proof" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-bold px-1 py-0.2 rounded flex items-center gap-0.5">
                                      <ImageIcon className="w-2 h-2" /> Proof
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : student.workSamples && student.workSamples.length > 0 ? (
                      <div className="space-y-1.5">
                        {student.workSamples.slice(0, 2).map((sample) => (
                          <div key={sample.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="truncate min-w-0 pr-2">
                                <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded mr-1">
                                  {sample.category.replace('_', ' ')}
                                </span>
                                <span className="font-bold text-slate-900">{sample.title}</span>
                              </div>
                              {sample.workLink && (
                                <a href={sample.workLink} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold text-[10px] shrink-0">
                                  View ↗
                                </a>
                              )}
                            </div>
                            {sample.clientOrContext && (
                              <p className="text-[10px] text-slate-500 font-medium">Context: {sample.clientOrContext}</p>
                            )}
                            {sample.toolsUsed && sample.toolsUsed.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {sample.toolsUsed.map((tool, idx) => (
                                  <span key={idx} className="bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    🛠️ {tool}
                                  </span>
                                ))}
                              </div>
                            )}
                            {sample.mediaUrls && sample.mediaUrls.length > 0 && (
                              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                {sample.mediaUrls.slice(0, 2).map((imgUrl, i) => (
                                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                    <img src={imgUrl} alt="Asset" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-bold px-1 py-0.2 rounded flex items-center gap-0.5">
                                      <ImageIcon className="w-2 h-2" /> Asset
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400 italic">
                        No projects or proof of work uploaded yet
                      </div>
                    )}
                  </div>

                  {/* Education snippet */}
                  {student.education && student.education.length > 0 && (
                    <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 px-0.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700">
                        {student.education[0].degree} in {student.education[0].fieldOfStudy} • {student.education[0].institutionName}
                      </span>
                    </div>
                  )}

                  {/* Skills Chips */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {student.skills.slice(0, 5).map((sk) => (
                      <span
                        key={sk.id}
                        className="rounded-lg bg-slate-100 border border-slate-200/60 px-2 py-0.5 text-[10px] font-bold text-slate-700 flex items-center gap-1"
                      >
                        {sk.skillName}
                        {sk.isVerified && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                      </span>
                    ))}
                    {student.skills.length > 5 && (
                      <span className="rounded-lg bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                        +{student.skills.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Location & Availability Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 stroke-[1.75]" />
                      {student.preferences?.preferredLocations?.[0] || 'Flexible'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 shrink-0">
                      {student.preferences?.availability === AvailabilityOption.IMMEDIATE ? (
                        <>
                          <Zap className="w-3 h-3 fill-emerald-600 stroke-none" />
                          Immediate
                        </>
                      ) : (
                        'Available Soon'
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  {student.placement || student.isHired ? (
                    isHiredByMe(student) ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedCandidate(student);
                            setContactRevealed(null);
                            setShortlistSuccess('');
                          }}
                          className="flex-1 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 text-center transition-all cursor-pointer shadow-xs"
                        >
                          View Placed Profile
                        </button>
                        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-[11px] border border-emerald-300 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Your Hire
                        </span>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setLockedModalCandidate(student)}
                          className="flex-1 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-700 text-center transition-all cursor-pointer border border-slate-300 flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                          Profile Locked
                        </button>
                        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-500 font-bold text-[11px] border border-slate-200 shrink-0">
                          Placed
                        </span>
                      </>
                    )
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedCandidate(student);
                          setContactRevealed(null);
                          setShortlistSuccess('');
                        }}
                        className="flex-1 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 text-center transition-all cursor-pointer shadow-xs"
                      >
                        View Proof & CV
                      </button>
                      <button
                        onClick={() => handleOpenHireModal(student)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
                        title="Hire this candidate"
                      >
                        <Briefcase className="w-3.5 h-3.5 stroke-[2]" />
                        Hire
                      </button>
                      <button
                        onClick={() => handleShortlist(student.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Save candidate"
                      >
                        <Bookmark className="w-3.5 h-3.5 stroke-[2] text-slate-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchTalents(currentPage - 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-slate-600 px-3">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={!hasMore}
            onClick={() => fetchTalents(currentPage + 1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      {/* Comprehensive Candidate Profile Slide-Over Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center font-black text-xl text-slate-600 shrink-0">
                    {selectedCandidate.avatarUrl ? (
                      <img src={selectedCandidate.avatarUrl} alt={selectedCandidate.fullName} className="h-full w-full object-cover" />
                    ) : (
                      selectedCandidate.fullName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedCandidate.fullName}</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedCandidate.headline}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                        {selectedCandidate.completenessScore}% Completeness
                      </span>
                      {selectedCandidate.preferences?.availability && (
                        <span className="text-[11px] font-semibold text-slate-600">
                          ⚡ {selectedCandidate.preferences.availability.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer text-base"
                >
                  ✕
                </button>
              </div>

              {shortlistSuccess && (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs font-bold">
                  {shortlistSuccess}
                </div>
              )}

              {/* Placement Details Banner if Candidate is Hired */}
              {(selectedCandidate.placement || selectedCandidate.isHired) && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Candidate Placed & Hired
                    </span>
                    {selectedCandidate.placement?.packageLpa && (
                      <span className="text-sm font-black text-emerald-900 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-300">
                        CTC: {selectedCandidate.placement.packageLpa}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <p className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">Hiring Company</p>
                      <p className="text-sm font-extrabold text-emerald-950 mt-0.5">
                        {selectedCandidate.placement?.companyName || selectedCandidate.placement?.company?.name || 'Partner Company'}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">Job Role</p>
                      <p className="text-sm font-extrabold text-emerald-950 mt-0.5">
                        {selectedCandidate.placement?.roleTitle || 'Graduate Trainee'}
                      </p>
                    </div>
                  </div>
                  {selectedCandidate.placement?.notes && (
                    <p className="text-xs text-emerald-800 bg-emerald-100/50 p-2.5 rounded-xl italic">
                      "{selectedCandidate.placement.notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Bio */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">About Candidate</h4>
                <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">{selectedCandidate.about}</p>
              </div>

              {/* Verified Proof of Work Projects */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Verified Proof of Work ({selectedCandidate.projects?.length || 0})</span>
                </h4>
                <div className="mt-2.5 space-y-4">
                  {selectedCandidate.projects?.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No project repos added.</p>
                  ) : (
                    selectedCandidate.projects?.map((p) => (
                      <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{p.title}</h5>
                            {p.role && <p className="text-[11px] font-semibold text-emerald-700">Role: {p.role}</p>}
                          </div>
                          <div className="flex gap-2 text-xs font-bold">
                            {(p.liveDemoUrl || p.projectLink) && (
                              <a
                                href={p.liveDemoUrl || p.projectLink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-1 hover:bg-emerald-200 transition-colors"
                              >
                                <Globe className="w-3 h-3" />
                                Live Demo
                              </a>
                            )}
                            {p.githubRepoUrl && (
                              <a
                                href={p.githubRepoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 rounded bg-slate-200 text-slate-800 px-2 py-1 hover:bg-slate-300 transition-colors"
                              >
                                <Code2 className="w-3 h-3" />
                                Code Repo
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                        {/* Tools Used Chips */}
                        {p.toolsUsed && p.toolsUsed.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Tools & Platforms</p>
                            <div className="flex flex-wrap gap-1">
                              {p.toolsUsed.map((tool, idx) => (
                                <span key={idx} className="bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  🛠️ {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tech Stack */}
                        {p.techStack && p.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {p.techStack.map((t, i) => (
                              <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Skills Demonstrated */}
                        {p.skillsDemonstrated && p.skillsDemonstrated.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {p.skillsDemonstrated.map((s, idx) => (
                              <span key={idx} className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                ✓ {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Visual Proof Screenshots Gallery */}
                        {p.mediaUrls && p.mediaUrls.length > 0 && (
                          <div className="space-y-1.5 pt-1 border-t border-slate-200/70">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                              Visual Proof & High-Res Deliverables ({p.mediaUrls.length})
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {p.mediaUrls.map((url, i) => (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 hover:border-emerald-500 transition-all shadow-2xs block"
                                >
                                  <img src={url} alt={`Deliverable ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                                    <span>View High-Res Proof</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Creative Work Samples */}
              {selectedCandidate.workSamples && selectedCandidate.workSamples.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Work Samples & Creative Portfolio ({selectedCandidate.workSamples.length})
                  </h4>
                  <div className="mt-2.5 space-y-3">
                    {selectedCandidate.workSamples.map((sample) => (
                      <div key={sample.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              {sample.category.replace('_', ' ')}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 mt-1">{sample.title}</h5>
                            {sample.clientOrContext && (
                              <p className="text-[11px] text-slate-500 font-medium">Context: {sample.clientOrContext}</p>
                            )}
                          </div>
                          {sample.workLink && (
                            <a
                              href={sample.workLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Asset
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{sample.description}</p>

                        {/* Tools Used */}
                        {sample.toolsUsed && sample.toolsUsed.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Tools Used</p>
                            <div className="flex flex-wrap gap-1">
                              {sample.toolsUsed.map((tool, idx) => (
                                <span key={idx} className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  🛠️ {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Visual Proofs */}
                        {sample.mediaUrls && sample.mediaUrls.length > 0 && (
                          <div className="space-y-1 pt-1 border-t border-slate-200/70">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-emerald-600" />
                              Asset Previews ({sample.mediaUrls.length})
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {sample.mediaUrls.map((url, i) => (
                                <a
                                  key={i}
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 hover:border-emerald-500 transition-all shadow-2xs block"
                                >
                                  <img src={url} alt={`Asset ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold gap-1">
                                    <span>Open Asset</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate PDF CV Access */}
              {selectedCandidate.cvFileUrl && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Candidate CV (PDF)</h4>
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <FileText className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Verified Original PDF CV</p>
                        <p className="text-[11px] text-emerald-700">Uploaded and reviewed by candidate</p>
                      </div>
                    </div>
                    <a
                      href={selectedCandidate.cvFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Skills & Accreditations */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Skills & Proficiencies ({selectedCandidate.skills?.length || 0})
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedCandidate.skills?.map((sk) => (
                    <span
                      key={sk.id}
                      className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                    >
                      {sk.skillName}
                      {sk.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              {selectedCandidate.education && selectedCandidate.education.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Education</h4>
                  {selectedCandidate.education.map((edu) => (
                    <div key={edu.id} className="mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <p className="text-sm font-bold text-slate-900">{edu.institutionName}</p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {edu.degree} in {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear}) {edu.gradeOrCgpa && `• ${edu.gradeOrCgpa}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Certificates */}
              {selectedCandidate.certificates && selectedCandidate.certificates.length > 0 && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Verified Certificates ({selectedCandidate.certificates.length})
                  </h4>
                  <div className="mt-2 space-y-2">
                    {selectedCandidate.certificates.map((cert) => (
                      <div key={cert.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-600 stroke-[1.75]" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{cert.name}</p>
                            <p className="text-[11px] text-slate-500">{cert.issuingOrganization} • {cert.issueDate}</p>
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Verify
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Preferences */}
              {selectedCandidate.preferences && (
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Candidate Preferences</h4>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-semibold text-slate-400">Preferred Roles</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedCandidate.preferences.preferredRoles?.join(', ') || 'Any'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">Locations</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedCandidate.preferences.preferredLocations?.join(', ') || 'Flexible'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">Work Mode</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedCandidate.preferences.workModes?.join(', ') || selectedCandidate.preferences.workMode || 'Any'}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-400">Relocation Willingness</p>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {selectedCandidate.preferences.relocationWillingness?.replace('_', ' ') || 'Willing'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Reveal Contact, Hire, & Save Shortlist */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              {contactRevealed ? (
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Direct Candidate Contact</p>
                  <p className="text-sm font-mono flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    {contactRevealed.email}
                  </p>
                  {contactRevealed.phone && (
                    <p className="text-sm font-mono flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      {contactRevealed.phone}
                    </p>
                  )}
                  {contactRevealed.linkedinUrl && (
                    <p className="text-sm font-mono flex items-center gap-2">
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <a href={contactRevealed.linkedinUrl} target="_blank" rel="noreferrer" className="text-emerald-400 underline">
                        LinkedIn Profile ↗
                      </a>
                    </p>
                  )}
                </div>
              ) : null}

              <div className="flex gap-2">
                {!contactRevealed && (
                  <button
                    onClick={() => handleRevealContact(selectedCandidate.id, 'EMAIL')}
                    disabled={contacting}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 stroke-[2]" />
                    {contacting ? 'Revealing Contact...' : 'Reveal Direct Contact'}
                  </button>
                )}

                {selectedCandidate.placement || selectedCandidate.isHired ? (
                  <div className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-100 border border-emerald-300 py-3 text-xs font-black text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Candidate Placed
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenHireModal(selectedCandidate)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4 stroke-[2]" />
                    Hire Candidate
                  </button>
                )}

                <button
                  onClick={() => handleShortlist(selectedCandidate.id, shortlistNote)}
                  disabled={savingShortlist}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 stroke-[2]" />
                  Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hire Candidate Modal Dialog */}
      {hiringCandidate && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <Briefcase className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Hire Candidate</h3>
                  <p className="text-xs text-slate-500 font-medium">Record placement for {hiringCandidate.fullName}</p>
                </div>
              </div>
              <button
                onClick={() => setHiringCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 text-xs text-emerald-900 leading-relaxed font-medium">
              💡 <strong>Instant Global Placement:</strong> Recording this placement marks the candidate as <strong>HIRED</strong> across FresherToWork for all recruiters and admins.
            </div>

            {hireError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-semibold">
                {hireError}
              </div>
            )}

            {hireSuccessMsg && (
              <div className="bg-emerald-100 text-emerald-900 p-3 rounded-xl border border-emerald-300 text-xs font-bold">
                {hireSuccessMsg}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Job Role / Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Junior Frontend Developer, QA Engineer"
                  value={hireRoleTitle}
                  onChange={(e) => setHireRoleTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Annual Package (CTC) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 4.5 LPA, 45,000 AED/yr"
                  value={hirePackageLpa}
                  onChange={(e) => setHirePackageLpa(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-emerald-500 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Placement Notes / Joining Details <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Joining on 1st October in Bangalore office"
                  value={hireNotes}
                  onChange={(e) => setHireNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-emerald-500 bg-slate-50/50 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setHiringCandidate(null)}
                disabled={hiringLoading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmHire}
                disabled={hiringLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {hiringLoading ? 'Recording Hire...' : 'Confirm Hire'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hired Candidate Access Restriction Modal */}
      {lockedModalCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Lock className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Candidate Profile Locked</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Exclusively Restricted to Hiring Organization</p>
                </div>
              </div>
              <button
                onClick={() => setLockedModalCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">{lockedModalCandidate.fullName}</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.2 text-[9px] font-black uppercase">
                  HIRED
                </span>
              </div>
              <p className="text-slate-600">
                This candidate was placed and hired by{' '}
                <strong className="text-slate-900 font-bold">
                  {lockedModalCandidate.placement?.companyName || lockedModalCandidate.placement?.company?.name || 'Partner Company'}
                </strong>
                {lockedModalCandidate.placement?.roleTitle && ` as ${lockedModalCandidate.placement.roleTitle}`}.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Platform Placement Privacy Policy
              </p>
              <p className="text-[11px] text-amber-800">
                To protect candidate exclusivity and corporate hiring agreements, once a talent is hired through FresherToWork, their full profile, project portfolios, original CV, and direct contact details are <strong>strictly accessible only to the employer who hired them and the Super Admin</strong>.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setLockedModalCandidate(null)}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 text-xs transition-colors cursor-pointer shadow-xs"
              >
                Understood, Return to Discovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
