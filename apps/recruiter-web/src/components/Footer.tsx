import React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-[#1f357c]/30 bg-[#3e7aa7] text-white">
      {/* Top Ambient Glow Line with #4ad1c7 */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#4ad1c7] to-transparent" />

      {/* Hero / Value Proposition Strip */}
      <div className="border-b border-white/15 bg-[#1f357c]/30 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-extrabold text-white tracking-tight">
              India&apos;s Dedicated Proof-of-Work Fresher Hiring Ecosystem
            </h4>
            <p className="text-xs text-white/80 mt-1">
              Connecting genuine, project-verified talent directly with proactive engineering & design recruiters.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-slate-100 px-4 py-2.5 text-xs font-black text-[#1f357c] shadow-md shadow-[#1f357c]/20 transition-all active:scale-[0.98]"
            >
              Browse Candidates <ArrowUpRight className="h-3.5 w-3.5 text-[#3e7aa7]" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 hover:border-white px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all active:scale-[0.98]"
            >
              <Mail className="h-3.5 w-3.5 text-[#4ad1c7]" /> Direct Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links Grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          
          {/* Brand & Corporate Identity (Spans 2 columns on lg) */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group bg-white/95 px-3 py-1.5 rounded-xl shadow-xs">
              <img
                src="/brand/logo.png"
                alt="Fresher2Work"
                className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-xs leading-relaxed text-white/85 pr-4">
              A modern hiring platform replacing deceptive resumes with authentic proof-of-work, project repositories, live demos, and verified technical assessments.
            </p>

            <div className="rounded-xl border border-white/15 bg-[#1f357c]/30 p-3.5 text-xs space-y-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="h-2 w-2 rounded-full bg-[#4ad1c7] animate-pulse" />
                <span>Operated by Velvetbyte PVT Ltd</span>
              </div>
              <p className="text-[11px] text-white/80 leading-normal">
                Calicut and Kochi, Kerala, India
              </p>
            </div>

            {/* Candidate App Store Badges */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                Fresher2Work Candidate App
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Google Play Button */}
                <a
                  href="/Fresher2Work.apk"
                  download="Fresher2Work.apk"
                  className="group flex items-center gap-2.5 rounded-xl border border-white/25 bg-[#1f357c]/40 hover:bg-[#1f357c]/60 px-3.5 py-2 transition-all hover:border-[#4ad1c7] active:scale-95 shadow-sm"
                  title="Download Fresher2Work for Android"
                >
                  <img src="/brand/app-icon.png" alt="App Icon" className="h-6 w-6 rounded-md object-contain bg-white p-0.5" />
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-white/70">Get it on</div>
                    <div className="text-xs font-extrabold text-white group-hover:text-[#4ad1c7]">Google Play APK</div>
                  </div>
                </a>

                {/* iOS Placeholder Badge */}
                <div 
                  className="group flex items-center gap-2.5 rounded-xl border border-white/20 bg-[#1f357c]/25 px-3.5 py-2 opacity-95 transition-all hover:border-white/40"
                  title="Fresher2Work for iOS"
                >
                  <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.78 1.01.08 2.05-.53 2.67-1.28z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[9px] uppercase tracking-wider text-white/70">Download on</div>
                    <div className="text-xs font-bold text-white">App Store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Platform</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/discover" className="text-white/85 transition-colors hover:text-white flex items-center gap-1.5 group font-medium">
                  <span>Discover Candidates</span>
                  <span className="rounded bg-[#4ad1c7] px-1.5 py-0.5 text-[10px] font-black text-[#1f357c]">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/company" className="text-white/85 transition-colors hover:text-white font-medium">Company Directory</Link>
              </li>
              <li>
                <Link href="/shortlists" className="text-white/85 transition-colors hover:text-white font-medium">Saved Shortlists</Link>
              </li>
              <li>
                <Link href="/recruiter" className="text-white/85 transition-colors hover:text-white font-medium">Recruiter Portal</Link>
              </li>
              <li>
                <Link href="/register" className="text-white/85 transition-colors hover:text-white font-medium">Post Fresher Opening</Link>
              </li>
              <li>
                <Link href="/superadmin" className="text-white/85 transition-colors hover:text-white font-medium">Super Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Safety */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Legal & Safety</h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/privacy" className="text-white/85 transition-colors hover:text-white font-medium">Privacy Policy (DPDP 2023)</Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/85 transition-colors hover:text-white font-medium">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-white/85 transition-colors hover:text-white font-medium">Refund & Cancellation Policy</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/85 transition-colors hover:text-white font-medium">Grievance & Redressal</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Direct Contact</h3>
            <ul className="mt-4 space-y-3 text-xs">
              <li>
                <a 
                  href="mailto:infovelvetbyte@gmail.com" 
                  className="group flex items-start gap-2.5 rounded-xl border border-white/20 bg-[#1f357c]/30 p-3 transition-all hover:border-white/40 hover:bg-[#1f357c]/50"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#4ad1c7] mt-0.5" />
                  <div>
                    <div className="font-bold text-white group-hover:text-[#4ad1c7]">Email Support</div>
                    <div className="text-[11px] text-white/85">infovelvetbyte@gmail.com</div>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+918921658090" 
                  className="group flex items-start gap-2.5 rounded-xl border border-white/20 bg-[#1f357c]/30 p-3 transition-all hover:border-white/40 hover:bg-[#1f357c]/50"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#4ad1c7] mt-0.5" />
                  <div>
                    <div className="font-bold text-white group-hover:text-[#4ad1c7]">Helpline / WhatsApp</div>
                    <div className="text-[11px] text-white/85">+91 8921658090</div>
                  </div>
                </a>
              </li>
              <li className="text-[11px] text-white/75 leading-normal">
                Hours: Mon – Sat, 9:00 AM – 6:00 PM IST (Response within 48h)
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 border-t border-white/15 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-white/85">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#4ad1c7]" />
            <span className="font-bold text-white">All Systems Operational</span>
            <span className="text-white/60">•</span>
            <span>© 2026 Fresher2Work. Operated by Velvetbyte PVT Ltd.</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/refund-policy" className="transition-colors hover:text-white">Refunds</Link>
            <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
