'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  Globe,
  Award,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProfile = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const res = await fetch(`${apiUrl}/api/v1/students/p/${slug}`);
        if (!res.ok) {
          throw new Error('Profile not found or not currently public.');
        }
        const data = await res.json();
        setProfile(data.profile);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-900">Portfolio Unavailable</h2>
          <p className="text-sm text-slate-500">{error || 'This candidate profile is not active.'}</p>
          <Link
            href="/discover"
            className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
          >
            Explore Other Candidates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight text-slate-900">
            Fresher<span className="text-emerald-600">ToWork</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            Portfolio
          </span>
        </div>
        <div>
          <Link
            href="/login"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Recruiter Login ↗
          </Link>
        </div>
      </header>

      {/* Main Candidate Portfolio View */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
        {/* Mandatory Action Alert if Profile Issue Flagged by Admin */}
        {(profile.moderationStatus === 'FLAGGED' || profile.moderationNotes) && (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-amber-950">
                  ⚠️ Action Required: Profile Verification Notice from Super Admin
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                  Mandatory Correction
                </span>
              </div>
              <p className="text-xs text-amber-900 font-medium leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200">
                <strong>Admin Feedback:</strong> {profile.moderationNotes || 'Please correct your proof of work project links and resume file to enable recruiter discovery.'}
              </p>
              <p className="text-[11px] text-amber-800 font-semibold">
                🔒 Note: Your profile is temporarily hidden from direct recruiter discovery until the requested corrections are resolved.
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl font-black shadow-inner shrink-0">
              {profile.fullName?.charAt(0) || 'S'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900">{profile.fullName}</h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                </span>
              </div>
              <p className="text-base text-slate-600 font-medium mt-1">{profile.headline || 'Aspiring Professional'}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                {profile.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.city}, {profile.country || 'India'}
                  </span>
                )}
                {profile.preferences?.availability && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {profile.preferences.availability}
                  </span>
                )}
                {profile.preferences?.workMode && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    {profile.preferences.workMode}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <Link
                href="/discover"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition text-center shadow-xs"
              >
                Contact Candidate via Recruiter App
              </Link>
            </div>
          </div>

          {profile.about && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{profile.about}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Skills & Proficiencies</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: any, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {skill.skillName || skill.name}
                  {skill.rating && <span className="text-emerald-600 font-bold">★ {skill.rating}/5</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Proof of Work - Projects */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Proof of Work — Projects ({profile.projects.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.projects.map((p: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{p.title}</h4>
                    {p.role && <p className="text-xs text-emerald-600 font-semibold mt-0.5">{p.role}</p>}
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                    {p.techStack && p.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.techStack.map((tech: string, tIdx: number) => (
                          <span key={tIdx} className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {p.liveDemoUrl && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60">
                      <a
                        href={p.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Live Demo
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Samples / Portfolio */}
        {profile.workSamples && profile.workSamples.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Creative Work Samples & Portfolio ({profile.workSamples.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.workSamples.map((ws: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 text-sm">{ws.title}</h4>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {ws.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ws.description}</p>
                  </div>
                  {ws.assetUrl && (
                    <div className="mt-3 pt-2 border-t border-slate-200/60">
                      <a
                        href={ws.assetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                      >
                        View Project Asset ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {profile.education && profile.education.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Education</h3>
              <div className="space-y-3">
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-emerald-500 pl-3">
                    <h4 className="text-xs font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                    <p className="text-xs text-slate-500">{edu.institutionName}</p>
                    <p className="text-[11px] text-slate-400">Class of {edu.gradYear || edu.endYear || '2025'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.certificates && profile.certificates.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Certificates</h3>
              <div className="space-y-3">
                {profile.certificates.map((cert: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-teal-500 pl-3">
                    <h4 className="text-xs font-bold text-slate-900">{cert.name}</h4>
                    <p className="text-xs text-slate-500">{cert.issuingOrganization}</p>
                    <p className="text-[11px] text-slate-400">Issued {cert.issueDate || '2024'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
