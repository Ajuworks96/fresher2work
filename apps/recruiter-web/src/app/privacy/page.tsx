import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Database, UserCheck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | FresherToWork',
  description: 'Learn how FresherToWork collects, uses, and protects candidate and recruiter personal data in compliance with India DPDP Act 2023.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20">
              F
            </span>
            <span>
              Fresher<span className="text-emerald-400">ToWork</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/terms" className="text-slate-400 transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-slate-400 transition hover:text-white">
              Refund Policy
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Shield className="h-3.5 w-3.5" /> Data Protection & Privacy Standard
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Last updated: September 17, 2026 • Operates under Digital Personal Data Protection (DPDP) Act, India
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12 text-sm leading-relaxed text-slate-300 sm:text-base">
          
          {/* Section 1: Introduction */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">1. Introduction & Overview</h2>
            </div>
            <p className="mt-4">
              Welcome to <strong>FresherToWork</strong>, operated by <strong>Velvetbyte PVT Ltd</strong> (&quot;FresherToWork&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We respect your privacy and are committed to protecting the personal data of both aspiring candidates and corporate recruiters who use our mobile application and web portals (located at <span className="text-emerald-400">freshertowork.com</span> and <span className="text-emerald-400">recruiter-web-lac.vercel.app</span>).
            </p>
            <p className="mt-3">
              This Privacy Policy explains what information we collect, why we collect it, how it is secured, and the choices you have concerning your personal information. By registering or using FresherToWork, you consent to the data practices described in this policy.
            </p>
          </section>

          {/* Section 2: Data We Collect */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">2. Information We Collect</h2>
            </div>
            <p className="mt-4">
              We collect information to authenticate users, display verified candidate proof-of-work, and enable recruiters to discover vetted talent:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Candidate Account Information:</strong> Full name, email address, phone number, hashed password, profile headline, bio, city, and state.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Proof of Work & Professional Credentials:</strong> Project titles, live portfolio URLs (GitHub, Behance, Figma, Google Drive), skills with proficiency self-ratings, uploaded CV / resume files (PDF), and educational qualification details.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Recruiter Business Information:</strong> Official company name, company website, work email address, phone number, designation, and company location.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Payment Data:</strong> Payment order ID, transaction ID, payment status, and timestamps processed securely via Razorpay. <em>We do NOT store credit card numbers, debit card numbers, CVV, or bank UPI PINs on our servers.</em>
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3: How We Use Data */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">3. How Your Information Is Used & Shared</h2>
            </div>
            <p className="mt-4">
              Your information is strictly utilized to operate the talent discovery ecosystem:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="font-semibold text-white">Controlled Contact Visibility</h3>
                <p className="mt-1.5 text-xs text-slate-400">
                  Candidate email, phone number, and downloadable resumes are kept private and masked until an authorized, verified recruiter reveals them.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="font-semibold text-white">Proof of Work Verification</h3>
                <p className="mt-1.5 text-xs text-slate-400">
                  Admin moderators inspect submitted project links and resumes to assign genuine verified badges to deserving freshers.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="font-semibold text-white">Security & One-Time Passwords</h3>
                <p className="mt-1.5 text-xs text-slate-400">
                  Email addresses are used to transmit 4-digit verification codes and password recovery tokens via encrypted SMTP.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="font-semibold text-white">No Third-Party Selling</h3>
                <p className="mt-1.5 text-xs text-slate-400">
                  We never sell, rent, or trade candidate or recruiter contact data to third-party advertisers or marketing agencies.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Security & Data Retention */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">4. Data Security & Storage</h2>
            </div>
            <p className="mt-4">
              We employ industry-standard technical measures including SSL/TLS 256-bit encryption in transit, isolated PostgreSQL cloud database architecture on Supabase, and salted bcrypt cryptographic password hashing. Access to internal administrative databases is restricted to authorized operations personnel under multi-factor authentication.
            </p>
          </section>

          {/* Section 5: Your Rights & Account Deletion */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">5. User Rights & Account Deletion</h2>
            </div>
            <p className="mt-4">
              Under India&apos;s DPDP Act and international privacy frameworks, you have the right to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
              <li>Access, preview, and update your personal profile, skills, and portfolio samples anytime inside the mobile app.</li>
              <li>Request complete and permanent deletion of your profile, projects, and personal data by submitting a deletion request through the app or by emailing our data officer.</li>
              <li>Withdraw consent for recruiter contact reveals.</li>
            </ul>
          </section>

          {/* Section 6: Contact Information */}
          <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">6. Contact Our Grievance Officer</h2>
            </div>
            <p className="mt-4 text-slate-300">
              For any questions, privacy concerns, or data erasure requests, please contact our designated Grievance Officer:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p><strong className="text-white">Entity:</strong> Velvetbyte PVT Ltd / FresherToWork</p>
              <p className="mt-1"><strong className="text-white">Email:</strong> infovelvetbyte@gmail.com</p>
              <p className="mt-1"><strong className="text-white">Phone:</strong> +91 8921658090</p>
              <p className="mt-1"><strong className="text-white">Address:</strong> Calicut / Bengaluru, India</p>
              <p className="mt-1"><strong className="text-white">Support Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM IST</p>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400">
        <p>© 2026 FresherToWork (Velvetbyte PVT Ltd). All rights reserved.</p>
        <div className="mt-3 flex justify-center gap-6">
          <Link href="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link>
          <Link href="/refund-policy" className="text-slate-400 hover:text-white">Refund Policy</Link>
          <Link href="/contact" className="text-slate-400 hover:text-white">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}
