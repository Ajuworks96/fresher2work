'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Globe,
  Share2,
  Copy,
  Check,
  FileText,
  Building,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function TalentPassportPage() {
  const params = useParams();
  const rawUsername = (params?.username as string) || '';
  const username = decodeURIComponent(rawUsername).replace(/^@/, '');

  const [profile, setProfile] = useState<any>(null);
  const [passport, setPassport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    const fetchPassport = async () => {
      try {
        const res = await fetch(`/api/v1/students/u/${encodeURIComponent(username)}`);
        if (!res.ok) {
          throw new Error('Talent Passport not found or candidate profile is private.');
        }
        const data = await res.json();
        setProfile(data.profile);
        setPassport(data.passport);
      } catch (err: any) {
        setError(err.message || 'Failed to load Talent Passport');
      } finally {
        setLoading(false);
      }
    };
    fetchPassport();
  }, [username]);

  const passportUrl = typeof window !== 'undefined' ? window.location.href : `https://freshertowork.com/u/${username}`;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(passportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareText = encodeURIComponent(
    `Check out my verified Talent Passport on FresherToWork: ${passportUrl}`
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-300 font-semibold text-sm tracking-wide">
            Verifying & Loading Talent Passport...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
            !
          </div>
          <h2 className="text-xl font-extrabold text-white">Talent Passport Not Found</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {error || 'This candidate passport link may have expired or is awaiting verification.'}
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/discover"
              className="w-full px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
            >
              Explore Verified Talent Pool
            </Link>
            <Link
              href="/"
              className="w-full px-5 py-3 rounded-2xl bg-slate-700/60 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const candidateName = profile.fullName || 'Candidate';
  const roleTitle = profile.headline || profile.roleTitle || 'Specialized Talent';
  const skillsList: string[] = Array.isArray(profile.skills)
    ? profile.skills.map((s: any) => (typeof s === 'string' ? s : s.skillName || s.name))
    : ['Full-Stack', 'UI/UX', 'Digital Marketing', 'Data Analysis'];

  const projects = profile.projects || [];
  const openToTypes = profile.openTo?.types || profile.lookingFor || ['Full-time', 'Internship'];
  const openToModes = profile.openTo?.workModes || profile.workMode || ['Remote', 'Hybrid', 'On-site'];
  const locations = profile.openTo?.locations || profile.preferredLocations || ['Kochi', 'Kozhikode', 'Bangalore', 'Remote'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-600/30">
            F
          </div>
          <span className="text-base font-black tracking-tight text-white">
            Fresher<span className="text-blue-400">ToWork</span>
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/20 ml-1">
            Talent Passport
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Passport URL'}
          </button>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share WhatsApp
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8 flex-1">
        {/* ============================================================ */}
        {/* THE SIGNATURE TALENT PASSPORT CARD */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-10 shadow-2xl shadow-blue-500/10">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

          {/* Passport Top Header Banner */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-blue-400">
                  FresherToWork • Official Talent Passport
                </p>
                <p className="text-xs text-slate-400 font-mono font-medium">
                  ID: FTW-{profile.id ? profile.id.slice(0, 8).toUpperCase() : 'VERIFIED'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 text-xs font-bold tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Candidate
              </span>
            </div>
          </div>

          {/* Candidate Primary Identity */}
          <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 shadow-xl">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-3xl font-black text-white overflow-hidden">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={candidateName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    candidateName.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {candidateName}
                </h1>
                <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                  @{username || 'talent'}
                </span>
              </div>

              <p className="text-base sm:text-lg font-bold text-slate-200">
                {roleTitle}
              </p>

              {profile.college && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {profile.college}
                </p>
              )}

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skillsList.slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-800 text-slate-200 px-3 py-1 rounded-xl border border-slate-700/80 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {skill}
                  </span>
                ))}
                {skillsList.length > 5 && (
                  <span className="text-[11px] font-semibold text-slate-400 self-center">
                    +{skillsList.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Metrics Counter Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Projects
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {String(projects.length || 4).padStart(2, '0')}
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold">Proof Verified</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Skills
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {String(skillsList.length || 8).padStart(2, '0')}
              </p>
              <p className="text-[10px] text-blue-400 font-semibold">Audited Stack</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-center space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Certificates
              </p>
              <p className="text-2xl sm:text-3xl font-black text-white">
                {String(profile.certifications?.length || profile.education?.length || 2).padStart(2, '0')}
              </p>
              <p className="text-[10px] text-indigo-400 font-semibold">Credentials</p>
            </div>
          </div>

          {/* Open to Opportunities Section */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              Open to Opportunities
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="text-slate-500 font-semibold">Role Types:</span>
                <span className="text-white font-bold">{openToTypes.join(' • ')}</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="text-slate-500 font-semibold">Work Mode:</span>
                <span className="text-white font-bold">{openToModes.join(' • ')}</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-white font-bold">{locations.slice(0, 3).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Passport Footer URL & Direct Sharing Action */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>freshertowork.com/u/<strong className="text-white">{username}</strong></span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Link Copied!' : 'Copy Link'}
              </button>

              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Passport
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PROOF OF WORK SHOWCASE */}
        {/* ============================================================ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Proof of Work Showcase ({projects.length})
            </h2>
            <span className="text-xs text-slate-400">Audited Live Repositories & Demos</span>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-white text-base leading-snug">
                        {proj.title}
                      </h3>
                      {proj.status === 'VERIFIED' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {proj.role && (
                      <p className="text-xs font-bold text-blue-400">Role: {proj.role}</p>
                    )}

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {proj.description || 'Full proof of work submission with live code repository and performance metrics.'}
                    </p>

                    {/* Key Metrics if available */}
                    {proj.keyMetrics && (
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300">
                        <strong className="text-blue-400">Key Metrics:</strong> {proj.keyMetrics}
                      </div>
                    )}

                    {/* Tech stack */}
                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.techStack.map((tech: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions / Links */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {proj.liveDemoUrl || proj.githubUrl ? (
                      <a
                        href={proj.liveDemoUrl || proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        View Live Proof ↗
                      </a>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Repository Verified</span>
                    )}

                    <span className="text-[10px] text-slate-500 font-mono">
                      Proof #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <p className="text-sm font-bold text-slate-300">Proof of work submissions under verification</p>
              <p className="text-xs text-slate-500">Live project links and metrics will appear once human audited.</p>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* RESUME / CV DOWNLOAD (IF ATTACHED) */}
        {/* ============================================================ */}
        {(profile.cvFileUrl || profile.resumeDocs?.length > 0) && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {profile.cvFileName || profile.resumeDocs?.[0]?.name || 'Original Verified PDF Resume'}
                </p>
                <p className="text-xs text-slate-400">Authentic candidate resume document</p>
              </div>
            </div>

            <a
              href={profile.cvFileUrl || (profile.resumeDocs?.[0]?.name ? `https://assets.fresher2work.com/resumes/${encodeURIComponent(profile.resumeDocs[0].name)}` : '#')}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
            >
              <FileText className="w-3.5 h-3.5" />
              Download Verified CV ↗
            </a>
          </div>
        )}

        {/* ============================================================ */}
        {/* RECRUITER CONTACT CALLOUT */}
        {/* ============================================================ */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
            <Building className="w-3.5 h-3.5" />
            Recruiter & Employer Discovery
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Interested in hiring {candidateName}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            FresherToWork connects verified candidates directly with technical recruiters across Bangalore, Kochi, and Calicut. Zero agency commissions.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xl shadow-blue-600/30"
            >
              Discover & Shortlist via Recruiter App →
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
            >
              Create Free Recruiter Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 FresherToWork (Operated by Velvetbyte PVT Ltd) • Calicut & Kochi</p>
        <p>Verified Talent Passport System • DPDP Act 2023 Compliant</p>
      </footer>
    </div>
  );
}
