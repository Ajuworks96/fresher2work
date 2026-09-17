import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, Database, UserCheck, Mail, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | FresherToWork',
  description: 'Learn how FresherToWork collects, uses, and protects candidate and recruiter personal data in compliance with India DPDP Act 2023.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 font-extrabold text-slate-950 shadow-md shadow-emerald-500/20">
              F
            </span>
            <span>
              Fresher<span className="text-emerald-600">ToWork</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-semibold">
            <Link href="/terms" className="text-slate-600 transition hover:text-slate-950">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="text-slate-600 transition hover:text-slate-950">
              Refund Policy
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-slate-50/60 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            <Shield className="h-4 w-4" /> Data Protection & Privacy Standard
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base max-w-2xl mx-auto">
            Last updated: September 17, 2026 • Fully compliant with India&apos;s <strong>Digital Personal Data Protection (DPDP) Act 2023</strong>
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">
          
          {/* Section 1: Introduction */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">1. Introduction & Operating Entity</h2>
            </div>
            <p className="mt-4">
              Welcome to <strong>FresherToWork</strong>, operated by <strong>Velvetbyte PVT Ltd</strong> (&quot;FresherToWork&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We respect your personal privacy and are deeply committed to protecting the confidential data of both aspiring candidates and corporate recruiters using our mobile application and web portals (located at <span className="font-semibold text-emerald-600">freshertowork.com</span> and <span className="font-semibold text-emerald-600">recruiter-web-lac.vercel.app</span>).
            </p>
            <p className="mt-3">
              This Privacy Policy explains what personal information we collect, why we collect it, how it is processed and secured, and your explicit rights under the law. By registering or using FresherToWork, you consent to the transparent practices described herein.
            </p>
          </section>

          {/* Section 2: Data We Collect */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                <Database className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">2. Information We Collect</h2>
            </div>
            <p className="mt-4">
              We collect information strictly necessary to authenticate users, showcase genuine proof-of-work, and connect freshers with verified corporate recruiters:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Candidate Profile Information:</strong> Full name, email address, phone number, encrypted password hash, role headline, bio, city, and state.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Proof-of-Work & Credentials:</strong> Verified project repositories, portfolio URLs (GitHub, Behance, Figma, Google Drive), skill tags with proficiency ratings, resume documents (PDF), and educational background.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Recruiter Organization Information:</strong> Registered company name, corporate domain website, official work email, contact numbers, recruiter designation, and office locations.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Transactional & Payment Data:</strong> Order IDs, transaction reference IDs, and verification receipts processed securely via Razorpay. <em>We never store card numbers, CVVs, or UPI PINs on our servers.</em>
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3: How We Use Data */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-sm">
                <Eye className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">3. How Your Information Is Used & Protected</h2>
            </div>
            <p className="mt-4">
              Your data is utilized solely to facilitate genuine hiring connections without deceptive practices:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="font-bold text-slate-900">Masked Contact Protection</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Candidate email and mobile numbers remain protected and masked from general public crawlers until verified recruiters unlock access.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="font-bold text-slate-900">Proof-of-Work Verification</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Submitted projects and repository links are audited to assign genuine skill badges that distinguish real creators from inflated resumes.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="font-bold text-slate-900">Instant OTP Security</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Email addresses are used for 4-digit verification and account recovery codes sent via encrypted mail transfer.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <h3 className="font-bold text-slate-900">Zero Third-Party Advertising</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  We never sell, rent, or trade your personal profile data or phone numbers to external marketing agencies or lead-generation brokers.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Security & Data Retention */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">4. Data Security, Cloud Storage & Encryption</h2>
            </div>
            <p className="mt-4">
              All communications are protected using end-to-end TLS 1.3 / SSL 256-bit encryption. Candidate and recruiter records are housed in secure, isolated PostgreSQL database clusters hosted on Supabase cloud infrastructure with automated daily snapshots and restricted administrative IP whitelists. Passwords are saved exclusively as one-way salted bcrypt cryptographic hashes.
            </p>
          </section>

          {/* Section 5: Your Rights & Account Deletion */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">5. Your Legal Rights & Data Erasure (DPDP Act)</h2>
            </div>
            <p className="mt-4">
              Under India&apos;s DPDP Act 2023, you have full ownership over your digital footprint on FresherToWork:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li><strong>Right of Access & Correction:</strong> View and update your profile, projects, resumes, and portfolio links at any moment via the mobile application.</li>
              <li><strong>Right to Erasure (Permanent Deletion):</strong> Request immediate, permanent deletion of your profile, project proofs, and contact details by contacting our Grievance Officer.</li>
              <li><strong>Right to Withdraw Consent:</strong> Revoke authorization for recruiter outreach at any time.</li>
            </ul>
          </section>

          {/* Section 6: Contact Information */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">6. Grievance Redressal & Data Privacy Officer</h2>
            </div>
            <p className="mt-3 text-slate-700">
              For any privacy inquiries, data deletion requests, or DPDP compliance concerns, you can directly reach our officer:
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200/80 bg-white p-5 text-sm text-slate-700 shadow-sm space-y-2">
              <p><strong className="text-slate-950">Corporate Entity:</strong> Velvetbyte PVT Ltd / FresherToWork</p>
              <p><strong className="text-slate-950">Official Email:</strong> <a href="mailto:infovelvetbyte@gmail.com" className="text-emerald-700 hover:underline">infovelvetbyte@gmail.com</a></p>
              <p><strong className="text-slate-950">Helpline Phone:</strong> <a href="tel:+918921658090" className="text-emerald-700 hover:underline">+91 8921658090</a></p>
              <p><strong className="text-slate-950">Operating Locations:</strong> Calicut and Kochi, Kerala, India</p>
              <p><strong className="text-slate-950">Grievance SLA:</strong> All complaints acknowledged within 24 hours and resolved within 7 business days.</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
