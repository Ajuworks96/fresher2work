import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
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
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-white tracking-tight">
              India&apos;s Dedicated Proof-of-Work Fresher Hiring Ecosystem
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Connecting genuine, project-verified talent directly with proactive engineering & design recruiters.
            </p>
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
                Calicut and Kochi, Kerala, India
              </p>
            </div>

            {/* Candidate App Store Badges */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                FresherToWork Candidate App
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Google Play Button */}
                <a
                  href="/Fresher2Work.apk"
                  download="Fresher2Work.apk"
                  className="group flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2 transition-all hover:border-emerald-500/50 hover:bg-slate-800 active:scale-95 shadow-sm"
                  title="Download FresherToWork for Android"
                >
                  <svg className="h-5 w-5 fill-current text-emerald-400 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186a1.99 1.99 0 0 1-.61-.92L3 21.266V2.734l.609-.92zm11.246 11.246l2.373-2.373-12.82-7.4a1.986 1.986 0 0 0-.799-.287l11.246 10.06zM4.409 22.986c.264.048.543-.024.799-.287l12.82-7.4-2.373-2.373-11.246 10.06zm13.684-11.758a1.5 1.5 0 0 1 0 1.544l-2.072 1.205-2.05-2.05 2.05-2.05 2.072 1.205a1.5 1.5 0 0 1 0 .146z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Get it on</div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300">Google Play</div>
                  </div>
                </a>

                {/* Apple App Store Button */}
                <div
                  className="group flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 px-3.5 py-2 opacity-90 transition-all hover:border-slate-700"
                  title="FresherToWork for iOS"
                >
                  <svg className="h-5 w-5 fill-current text-slate-300" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.78 1.01.08 2.05-.53 2.67-1.28z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Download on</div>
                    <div className="text-xs font-bold text-white">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 1: Candidates & Recruiters */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Platform
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
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Legal & Safety
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
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Direct Contact
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
