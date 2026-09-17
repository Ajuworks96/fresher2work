import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Scale, 
  RotateCcw, 
  Briefcase, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800/80 bg-[#0B0F19] text-slate-400">
      {/* Top Ambient Glow Line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* Hero / Value Proposition Strip */}
      <div className="border-b border-slate-800/60 bg-gradient-to-r from-slate-900/50 via-slate-900/80 to-slate-900/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">
                India&apos;s Dedicated Proof-of-Work Fresher Hiring Ecosystem
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Connecting genuine, project-verified talent directly with proactive engineering & design recruiters.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              Browse Candidates <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-700/80 hover:text-white active:scale-[0.98]"
            >
              <Mail className="h-3.5 w-3.5 text-emerald-400" /> Direct Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand & Corporate Identity (Spans 2 columns on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-black tracking-tight text-white group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
                F
              </span>
              <span className="text-xl">
                Fresher<span className="text-emerald-400">ToWork</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400 pr-4">
              A modern hiring platform replacing deceptive resumes with authentic proof-of-work, project repositories, live demos, and verified technical assessments.
            </p>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 text-xs space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Operated by Velvetbyte PVT Ltd</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Calicut, Kerala • Bengaluru, Karnataka, India
              </p>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-300">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>256-bit SSL</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-300">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                <span>Razorpay PCI-DSS</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-slate-300">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span>DPDP Act Compliant</span>
              </div>
            </div>
          </div>

          {/* Column 1: Candidates & Recruiters */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-400" /> Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/discover" className="transition-colors hover:text-emerald-400 flex items-center gap-1.5 group">
                  <span>Discover Candidates</span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/company" className="transition-colors hover:text-emerald-400">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link href="/shortlists" className="transition-colors hover:text-emerald-400">
                  Saved Shortlists
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-emerald-400">
                  Recruiter Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-emerald-400">
                  Post Fresher Opening
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition-colors hover:text-emerald-400 text-slate-400">
                  Super Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Legal & Trust Policies */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-emerald-400" /> Legal & Safety
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-emerald-400">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-emerald-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="transition-colors hover:text-emerald-400">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-emerald-400">
                  Grievance & Redressal
                </Link>
              </li>
              <li className="pt-1 text-[11px] text-slate-400">
                Proof-of-Work Verification Fee: <strong className="text-slate-300">₹99 One-time</strong>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-emerald-400" /> Direct Contact
            </h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a 
                  href="mailto:infovelvetbyte@gmail.com" 
                  className="group flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 transition-all hover:border-emerald-500/40 hover:bg-slate-800/60"
                >
                  <Mail className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-300">Email Support</div>
                    <div className="text-[11px] text-slate-400">infovelvetbyte@gmail.com</div>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+918921658090" 
                  className="group flex items-start gap-2 rounded-lg border border-slate-800/80 bg-slate-900/40 p-2.5 transition-all hover:border-emerald-500/40 hover:bg-slate-800/60"
                >
                  <Phone className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white group-hover:text-emerald-300">Helpline / WhatsApp</div>
                    <div className="text-[11px] text-slate-400">+91 8921658090</div>
                  </div>
                </a>
              </li>
              <li className="text-[11px] text-slate-400 leading-normal">
                Hours: Mon – Sat, 9:00 AM – 6:00 PM IST (Response within 48h)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-medium text-slate-300">All Systems Operational</span>
            <span className="text-slate-400">•</span>
            <span>© 2026 FresherToWork. Velvetbyte PVT Ltd.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/refund-policy" className="transition-colors hover:text-white">
              Refunds
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
