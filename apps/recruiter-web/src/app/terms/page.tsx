import React from 'react';
import Link from 'next/link';
import { Scale, CheckCircle2, AlertTriangle, Briefcase, UserCheck, Shield, Mail, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | FresherToWork',
  description: 'Terms and Conditions governing the use of FresherToWork for candidates, recruiters, and hiring organizations.',
};

export default function TermsOfServicePage() {
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
            <Link href="/privacy" className="text-slate-400 transition hover:text-white">
              Privacy Policy
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
            <Scale className="h-3.5 w-3.5" /> User Agreement & Platform Policies
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Effective Date: September 17, 2026 • Governing Laws of India
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12 text-sm leading-relaxed text-slate-300 sm:text-base">

          {/* Section 1: Agreement to Terms */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Scale className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
            </div>
            <p className="mt-4">
              These Terms & Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;Candidate&quot;, or &quot;Recruiter&quot;) and <strong>Velvetbyte PVT Ltd</strong> (&quot;FresherToWork&quot;, &quot;we&quot;, &quot;us&quot;), governing your access to and use of our mobile application, web portals, talent discovery engines, and verification services.
            </p>
            <p className="mt-3">
              By registering an account, accessing candidate portfolios, or submitting payments on FresherToWork, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use our platform.
            </p>
          </section>

          {/* Section 2: Candidate Obligations & Proof-of-Work */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <UserCheck className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">2. Candidate Terms & Proof-of-Work Guidelines</h2>
            </div>
            <p className="mt-4">
              FresherToWork operates on the principle of authentic skill demonstration (&quot;Proof of Work&quot;):
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Authenticity of Submissions:</strong> All submitted projects, live links (GitHub, Behance, Figma, Google Drive, live URLs), case studies, and resume PDFs must represent your own genuine work or clearly credited team efforts.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Zero Tolerance for Plagiarism:</strong> Uploading fabricated projects, stolen assets, or forged academic certificates will result in immediate disqualification, flagging, and permanent banning from the ecosystem.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Profile Activation Fee:</strong> Candidates may activate their profile for recruiter discovery by paying a nominal, one-time verification fee of ₹99. This covers manual human moderation, portfolio inspection, and cloud portfolio hosting.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3: Recruiter Responsibilities */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">3. Recruiter & Employer Terms</h2>
            </div>
            <p className="mt-4">
              Recruiters and corporate hiring partners must adhere to professional hiring ethics:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-purple-400" />
                <div>
                  <strong className="text-white">Legitimate Job Openings:</strong> Recruiters agree to use candidate contact details solely to evaluate, interview, and offer legitimate full-time, part-time, or internship employment.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-purple-400" />
                <div>
                  <strong className="text-white">Prohibition of Spam & Solicitation:</strong> Unlocking candidate contacts to send multi-level marketing (MLM), paid training courses, unsolicited promotional offers, or spam is strictly prohibited.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-purple-400" />
                <div>
                  <strong className="text-white">Confidentiality:</strong> Unlocked candidate resumes and contact details must not be resold or made publicly accessible.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 4: Fees & Payment Processing */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">4. Fees, Payments & Security</h2>
            </div>
            <p className="mt-4">
              All transactions on FresherToWork are processed in Indian Rupees (INR) via our authorized payment partner <strong>Razorpay</strong>. Transactions are encrypted using standard industry safeguards (PCI-DSS compliance).
            </p>
            <p className="mt-3">
              The ₹99 candidate profile activation fee provides ongoing access to recruiter discovery, verified badge eligibility, and candidate portfolio hosting. For details on cancellation or refund eligibility, please refer to our <Link href="/refund-policy" className="text-emerald-400 underline hover:text-emerald-300">Refund & Cancellation Policy</Link>.
            </p>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">5. Intellectual Property Rights</h2>
            </div>
            <p className="mt-4">
              Candidates retain 100% full intellectual property ownership of their submitted original source code, designs, video edits, and project assets. By publishing proofs of work on FresherToWork, candidates grant us a non-exclusive license to host, display, and preview these assets to registered hiring companies.
            </p>
            <p className="mt-3">
              The FresherToWork logo, brand names, visual identity, platform code, and verification algorithms are proprietary assets of Velvetbyte PVT Ltd.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">6. Disclaimer of Warranties & Limitation of Liability</h2>
            <p className="mt-4 text-slate-300">
              While FresherToWork diligently moderates portfolios and connects freshers with genuine companies, <strong>we do not guarantee employment, job offers, or specific compensation packages</strong>. Hiring decisions rest solely between the candidate and the hiring employer.
            </p>
            <p className="mt-3 text-slate-300">
              In no event shall Velvetbyte PVT Ltd, its founders, or directors be liable for any indirect, incidental, or consequential damages resulting from platform downtime, hiring outcomes, or third-party communications.
            </p>
          </section>

          {/* Section 7: Governing Law & Jurisdiction */}
          <section className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">7. Governing Law & Dispute Resolution</h2>
            <p className="mt-4 text-slate-300">
              These Terms shall be governed by and interpreted in accordance with the laws of the Republic of India. Any disputes arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Kerala, India.
            </p>
          </section>

          {/* Section 8: Inquiries */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">8. Inquiries & Legal Notices</h2>
            </div>
            <p className="mt-4 text-slate-300">
              For any questions regarding these Terms of Service, please write to:
            </p>
            <p className="mt-2 text-white">
              <strong>Legal Dept:</strong> Velvetbyte PVT Ltd / FresherToWork<br />
              <strong>Email:</strong> infovelvetbyte@gmail.com<br />
              <strong>Helpline:</strong> +91 8921658090
            </p>
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
