import React from 'react';
import Link from 'next/link';
import { Scale, CheckCircle2, AlertTriangle, Briefcase, UserCheck, Shield, Mail, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | FresherToWork',
  description: 'Terms and Conditions governing the use of FresherToWork for candidates, recruiters, and hiring organizations.',
};

export default function TermsOfServicePage() {
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
            <Link href="/privacy" className="text-slate-600 transition hover:text-slate-950">
              Privacy Policy
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
            <Scale className="h-4 w-4" /> Legal User Agreement & Platform Policies
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base max-w-2xl mx-auto">
            Effective Date: September 17, 2026 • Governed by the Laws of the Republic of India
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">
          
          {/* Section 1: Agreement */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">1. Agreement to Terms</h2>
            </div>
            <p className="mt-4">
              These Terms & Conditions constitute a legally binding agreement between you (&quot;User&quot;, &quot;Candidate&quot;, or &quot;Recruiter&quot;) and <strong>Velvetbyte PVT Ltd</strong>, operating <strong>FresherToWork</strong> (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating an account, browsing candidate projects, making payments, or accessing any part of our service, you agree to comply with and be bound by these Terms.
            </p>
            <p className="mt-3">
              If you do not agree with any part of these Terms, you must immediately discontinue using our applications and web portals.
            </p>
          </section>

          {/* Section 2: Platform Purpose */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">2. Nature of Service & Proof-of-Work Model</h2>
            </div>
            <p className="mt-4">
              FresherToWork is a curated talent discovery platform designed to solve the entry-level hiring mismatch in India by showcasing authentic proof-of-work (code repositories, design prototypes, live web apps, product analysis) rather than unverified resumes.
            </p>
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-slate-700">
              <p className="font-semibold text-blue-950">Important Clarification on Employment:</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                FresherToWork connects job seekers with corporate recruiters. While we vigorously vet candidate proof-of-work and verify recruiter identities, we do not guarantee employment, interview invitations, or specific salary compensation. Final hiring decisions rest entirely with prospective employers.
              </p>
            </div>
          </section>

          {/* Section 3: Candidate Obligations */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 shadow-sm">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">3. Candidate Accounts & Verification Fee</h2>
            </div>
            <p className="mt-4">
              Candidates registering on the mobile application agree to adhere to strict authenticity guidelines:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Truthful Submissions:</strong> All submitted project links, GitHub repositories, Figma portfolios, and resume details must be your original work or accurately disclose your role in team collaborations.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">One-Time Discovery Pass (₹99):</strong> Candidate profile verification, priority discovery ranking, and direct recruiter contact reveals require an upfront, non-recurring verification fee of <strong>₹99 (inclusive of GST)</strong>.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">No Plagiarism / Fraud:</strong> Any profile found displaying stolen source code, fabricated credentials, or fraudulent project claims will have their badge revoked and account permanently banned without refund.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 4: Recruiter Conduct */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">4. Recruiter Code of Conduct</h2>
            </div>
            <p className="mt-4">
              Authorized recruiters accessing candidate contacts and portfolios agree to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Contact candidates strictly for legitimate, bona fide full-time, part-time, or internship employment opportunities.</li>
              <li>Never solicit registration fees, training charges, or security deposits from candidates (Zero Fee Hiring Policy).</li>
              <li>Safeguard candidate contact numbers and resumes in accordance with India&apos;s DPDP Act 2023 without distributing to external marketing lists.</li>
            </ul>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">5. Intellectual Property Rights</h2>
            </div>
            <p className="mt-4">
              Candidates retain 100% full intellectual property ownership of the source code, design assets, and projects they link or upload. By submitting projects to FresherToWork, candidates grant us a non-exclusive license to showcase previews, screenshots, and summaries solely for the purpose of connecting them with prospective employers.
            </p>
          </section>

          {/* Section 6: Payments & Refunds Link */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">6. Payments, Billing & Refunds</h2>
            </div>
            <p className="mt-4">
              All financial transactions are conducted via PCI-DSS compliant payment gateways (Razorpay). Details regarding cancellations, accidental billing, and eligibility for refunds are governed by our standalone <Link href="/refund-policy" className="font-semibold text-emerald-600 underline hover:text-emerald-700">Refund & Cancellation Policy</Link>, which is incorporated into these Terms by reference.
            </p>
          </section>

          {/* Section 7: Jurisdiction */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-300 shadow-sm">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">7. Governing Law & Dispute Resolution</h2>
            </div>
            <p className="mt-4">
              These Terms shall be interpreted, governed by, and construed in accordance with the laws of India. Any legal dispute, controversy, or claim arising out of or relating to these terms or use of the platform shall be subject to the exclusive jurisdiction of the competent courts in Kozhikode (Calicut), Kerala or Bengaluru, Karnataka, India.
            </p>
          </section>

          {/* Section 8: Support Card */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">8. Questions Regarding Terms</h2>
            </div>
            <p className="mt-3 text-slate-700">
              If you have any questions or require legal clarification regarding these Terms of Service, please contact our administrative team:
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200/80 bg-white p-5 text-sm text-slate-700 shadow-sm space-y-2">
              <p><strong className="text-slate-950">Legal Entity:</strong> Velvetbyte PVT Ltd / FresherToWork</p>
              <p><strong className="text-slate-950">Email:</strong> <a href="mailto:infovelvetbyte@gmail.com" className="text-emerald-700 hover:underline">infovelvetbyte@gmail.com</a></p>
              <p><strong className="text-slate-950">Helpline:</strong> <a href="tel:+918921658090" className="text-emerald-700 hover:underline">+91 8921658090</a></p>
              <p><strong className="text-slate-950">Locations:</strong> Calicut (Kerala) & Bengaluru (Karnataka), India</p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
