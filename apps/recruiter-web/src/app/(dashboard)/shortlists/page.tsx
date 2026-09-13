'use client';

import { useEffect, useState } from 'react';
import { ShortlistRecord, StudentProfile, RecruiterProfile } from '@fresher2work/types';
import { recruiterApi } from '@/lib/api';
import {
  BookmarkCheck,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Trash2,
  Globe,
  CheckCircle2,
  X,
  Sparkles,
  Briefcase,
  Code2,
  FolderGit2,
  GraduationCap,
  Award,
  ImageIcon,
  Lock,
  ShieldCheck,
} from 'lucide-react';

export default function ShortlistsPage() {
  const [shortlists, setShortlists] = useState<ShortlistRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<StudentProfile | null>(null);
  const [contactRevealed, setContactRevealed] = useState<any>(null);
  const [contacting, setContacting] = useState(false);

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

  // Hire Candidate State
  const [hiringCandidate, setHiringCandidate] = useState<StudentProfile | null>(null);
  const [hireRoleTitle, setHireRoleTitle] = useState('');
  const [hirePackageLpa, setHirePackageLpa] = useState('');
  const [hireNotes, setHireNotes] = useState('');
  const [hiringLoading, setHiringLoading] = useState(false);
  const [hireError, setHireError] = useState('');
  const [hireSuccessMsg, setHireSuccessMsg] = useState('');

  const loadShortlists = async () => {
    try {
      const res = await recruiterApi.getShortlists();
      setShortlists(res.shortlists);
    } catch (err) {
      console.warn('Failed to load shortlists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShortlists();
  }, []);

  const handleRemove = async (studentId: string) => {
    try {
      await recruiterApi.removeShortlist(studentId);
      setShortlists((prev) => prev.filter((sl) => sl.studentId !== studentId));
    } catch (err: any) {
      alert(err.message || 'Failed to remove candidate');
    }
  };

  const handleRevealContact = async (candidateId: string) => {
    setContacting(true);
    try {
      const res = await recruiterApi.contactCandidate(candidateId, 'EMAIL');
      setContactRevealed(res.contactInfo);
    } catch (err: any) {
      alert(err.message || 'Could not reveal contact');
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

      // Update in local shortlists
      setShortlists((prev) =>
        prev.map((sl) =>
          sl.studentId === hiringCandidate.id
            ? {
                ...sl,
                student: sl.student
                  ? { ...sl.student, isHired: true, placement: res.placement }
                  : sl.student,
              }
            : sl
        )
      );

      if (selectedCandidate && selectedCandidate.id === hiringCandidate.id) {
        setSelectedCandidate({
          ...selectedCandidate,
          isHired: true,
          placement: res.placement,
        });
      }

      setHireSuccessMsg(`✓ ${hiringCandidate.fullName} marked as HIRED!`);
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
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Saved Candidate Shortlists</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Review bookmarked fresher candidates, inspect proof-of-work, and reach out directly.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading saved shortlists...</div>
      ) : shortlists.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 shadow-xs">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/60">
            <BookmarkCheck className="w-6 h-6 stroke-[1.75]" />
          </div>
          <p className="text-base font-bold text-slate-900">No candidates saved to your shortlist yet</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Explore the Talent Discovery feed and save promising freshers with verified proof of work.
          </p>
          <a
            href="/discover"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
          >
            Discover Talents →
          </a>
        </div>
      ) : (
        <div className="space-y-3.5">
          {shortlists.map((sl) => {
            const student = sl.student;
            return (
              <div
                key={sl.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center font-black text-slate-700 shrink-0">
                    {student?.avatarUrl ? (
                      <img src={student.avatarUrl} alt={student.fullName} className="h-full w-full object-cover" />
                    ) : (
                      student?.fullName?.charAt(0) || 'S'
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {student?.fullName || 'Candidate'}
                      </h4>
                      {student?.placement || student?.isHired ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-2xs shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          HIRED
                        </span>
                      ) : student?.completenessScore ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          {student.completenessScore}% Match
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {student?.headline || 'Fresher Graduate'}
                    </p>

                    {/* Placement Banner if Hired */}
                    {(student?.placement || student?.isHired) && (
                      <div className="mt-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-950 font-semibold flex items-center justify-between">
                        <span className="truncate flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <strong className="text-emerald-900">Placed:</strong> {student.placement?.companyName || student.placement?.company?.name || 'Partner Company'}
                          {student.placement?.roleTitle && ` • ${student.placement.roleTitle}`}
                        </span>
                        {student.placement?.packageLpa && (
                          <span className="shrink-0 font-black text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded text-[10px] ml-1.5">
                            {student.placement.packageLpa}
                          </span>
                        )}
                      </div>
                    )}

                    {sl.note && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2 italic">
                        Recruiter Note: &quot;{sl.note}&quot;
                      </p>
                    )}

                    {/* Candidate Projects & Proof of Work Snippet */}
                    {student?.projects && student.projects.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                          <span className="flex items-center gap-1">
                            <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                            Proof of Work ({student.projects.length} Projects)
                          </span>
                          {student.cvFileUrl && (
                            <a
                              href={student.cvFileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              CV PDF ↗
                            </a>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {student.projects.slice(0, 2).map((p) => {
                            const demoUrl = p.liveDemoUrl || p.projectLink;
                            const codeUrl = (p as any).githubRepoUrl || (p.projectLink && p.projectLink.includes('github') ? p.projectLink : undefined);
                            return (
                              <div key={p.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-extrabold text-slate-900 truncate">{p.title}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {demoUrl && (
                                      <a
                                        href={demoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 underline"
                                      >
                                        Demo ↗
                                      </a>
                                    )}
                                    {codeUrl && (
                                      <a
                                        href={codeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-extrabold text-slate-700 hover:text-slate-900 underline"
                                      >
                                        Code ↗
                                      </a>
                                    )}
                                  </div>
                                </div>
                                {p.role && <p className="text-[10px] text-emerald-700 font-bold mt-0.5">Role: {p.role}</p>}
                                {p.toolsUsed && p.toolsUsed.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {p.toolsUsed.map((tool, idx) => (
                                      <span key={idx} className="bg-indigo-50 border border-indigo-200/60 text-indigo-700 px-1.5 py-0.2 rounded text-[9px] font-bold">
                                        🛠️ {tool}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {p.techStack && p.techStack.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {p.techStack.slice(0, 4).map((tech, idx) => (
                                      <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {p.mediaUrls && p.mediaUrls.length > 0 && (
                                  <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                                    {p.mediaUrls.slice(0, 2).map((imgUrl, i) => (
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
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Education Snippet */}
                    {student?.education && student.education.length > 0 && (
                      <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {student.education[0].degree} in {student.education[0].fieldOfStudy} • {student.education[0].institutionName}
                        </span>
                      </div>
                    )}

                    {student?.skills && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {student.skills.slice(0, 5).map((sk) => (
                          <span key={sk.id} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                            {sk.skillName}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {student && (
                    student.placement || student.isHired ? (
                      isHiredByMe(student) ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCandidate(student);
                              setContactRevealed(null);
                            }}
                            className="rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
                          >
                            View Placed Profile
                          </button>
                          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Your Hire
                          </span>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setLockedModalCandidate(student)}
                            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            Profile Locked
                          </button>
                          <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200 shrink-0">
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
                          }}
                          className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleOpenHireModal(student)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Briefcase className="w-3.5 h-3.5" />
                          Hire
                        </button>
                      </>
                    )
                  )}
                  <button
                    onClick={() => handleRemove(sl.studentId)}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over Profile Drawer from Shortlists */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedCandidate.fullName}</h2>
                  <p className="text-xs text-slate-500">{selectedCandidate.headline}</p>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 text-base cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Placement Details Banner in Drawer if Hired */}
              {(selectedCandidate.placement || selectedCandidate.isHired) && (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      Candidate Placed & Hired
                    </span>
                    {selectedCandidate.placement?.packageLpa && (
                      <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                        {selectedCandidate.placement.packageLpa}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <p className="text-emerald-700 font-bold uppercase text-[10px]">Hiring Company</p>
                      <p className="font-extrabold text-emerald-950">
                        {selectedCandidate.placement?.companyName || selectedCandidate.placement?.company?.name || 'Partner Company'}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700 font-bold uppercase text-[10px]">Job Role</p>
                      <p className="font-extrabold text-emerald-950">
                        {selectedCandidate.placement?.roleTitle || 'Graduate Trainee'}
                      </p>
                    </div>
                  </div>
                  {selectedCandidate.placement?.notes && (
                    <p className="text-xs text-emerald-800 bg-emerald-100/50 p-2 rounded-lg italic">
                      "{selectedCandidate.placement.notes}"
                    </p>
                  )}
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h4>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{selectedCandidate.about}</p>
              </div>

              {/* Verified Projects */}
              {selectedCandidate.projects && selectedCandidate.projects.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Verified Projects ({selectedCandidate.projects.length})
                  </h4>
                  <div className="mt-2 space-y-3">
                    {selectedCandidate.projects.map((p) => {
                      const demoUrl = p.liveDemoUrl || p.projectLink;
                      const codeUrl = (p as any).githubRepoUrl || (p.projectLink && p.projectLink.includes('github') ? p.projectLink : undefined);
                      return (
                        <div key={p.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{p.title}</p>
                              {p.role && <p className="text-xs font-semibold text-emerald-700">Role: {p.role}</p>}
                            </div>
                            <div className="flex items-center gap-2">
                              {demoUrl && (
                                <a
                                  href={demoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                  Demo ↗
                                </a>
                              )}
                              {codeUrl && (
                                <a
                                  href={codeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 underline"
                                >
                                  <Code2 className="w-3.5 h-3.5" />
                                  Code ↗
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
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
                          {p.techStack && p.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {p.techStack.map((tech, i) => (
                                <span key={i} className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          {p.mediaUrls && p.mediaUrls.length > 0 && (
                            <div className="space-y-1.5 pt-1 border-t border-slate-200/70">
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1">
                                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                                Visual Proof Deliverables ({p.mediaUrls.length})
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
                                      <span>View Proof</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Work Samples */}
              {selectedCandidate.workSamples && selectedCandidate.workSamples.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Work Samples & Creative Portfolio ({selectedCandidate.workSamples.length})
                  </h4>
                  <div className="mt-2 space-y-2.5">
                    {selectedCandidate.workSamples.map((sample) => (
                      <div key={sample.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              {sample.category.replace('_', ' ')}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 mt-1">{sample.title}</h5>
                            {sample.clientOrContext && (
                              <p className="text-[10px] text-slate-500 font-medium">Context: {sample.clientOrContext}</p>
                            )}
                          </div>
                          {sample.workLink && (
                            <a
                              href={sample.workLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View ↗
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{sample.description}</p>
                        {sample.toolsUsed && sample.toolsUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sample.toolsUsed.map((tool, idx) => (
                              <span key={idx} className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                🛠️ {tool}
                              </span>
                            ))}
                          </div>
                        )}
                        {sample.mediaUrls && sample.mediaUrls.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 pt-1">
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
                                  <span>View Asset</span>
                                  <ExternalLink className="w-3 h-3" />
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified PDF CV */}
              {selectedCandidate.cvFileUrl && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Candidate CV</h4>
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      Original PDF CV
                    </span>
                    <a
                      href={selectedCandidate.cvFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Education */}
              {selectedCandidate.education && selectedCandidate.education.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Education</h4>
                  <div className="mt-2 space-y-2">
                    {selectedCandidate.education.map((edu) => (
                      <div key={edu.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <p className="text-xs font-bold text-slate-900">{edu.institutionName}</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {edu.degree} in {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear}) {edu.gradeOrCgpa && `• ${edu.gradeOrCgpa}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {selectedCandidate.certificates && selectedCandidate.certificates.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Certifications ({selectedCandidate.certificates.length})
                  </h4>
                  <div className="mt-2 space-y-2">
                    {selectedCandidate.certificates.map((cert) => (
                      <div key={cert.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{cert.name}</p>
                            <p className="text-[11px] text-slate-500">{cert.issuingOrganization} • {cert.issueDate}</p>
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-600 hover:underline">
                            Verify ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Skills ({selectedCandidate.skills.length})
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedCandidate.skills.map((sk) => (
                      <span key={sk.id} className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                        {sk.skillName}
                        {sk.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-3">
              {contactRevealed ? (
                <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 border border-slate-800">
                  <p className="text-xs font-bold text-emerald-400 uppercase">Contact Details</p>
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
                </div>
              ) : null}

              <div className="flex gap-2">
                {!contactRevealed && (
                  <button
                    onClick={() => handleRevealContact(selectedCandidate.id)}
                    disabled={contacting}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-xs"
                  >
                    <Mail className="w-4 h-4" />
                    {contacting ? 'Revealing...' : 'Reveal Contact Details'}
                  </button>
                )}

                {selectedCandidate.placement || selectedCandidate.isHired ? (
                  <div className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-100 border border-emerald-300 py-3 text-xs font-black text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Placed
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenHireModal(selectedCandidate)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                  >
                    <Briefcase className="w-4 h-4" />
                    Hire Candidate
                  </button>
                )}
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
                Understood, Return to Shortlists
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
