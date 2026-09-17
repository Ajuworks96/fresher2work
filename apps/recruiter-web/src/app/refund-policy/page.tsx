import React from 'react';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle, Clock, CreditCard, Mail, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | FresherToWork',
  description: 'Official Refund & Cancellation Policy for FresherToWork candidate activation and recruiter services.',
};

export default function RefundPolicyPage() {
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
            <Link href="/terms" className="text-slate-400 transition hover:text-white">
              Terms of Service
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <RotateCcw className="h-3.5 w-3.5" /> Razorpay & Merchant Compliance
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Transparent rules on candidate verification fee (₹99) and recruiter billing
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12 text-sm leading-relaxed text-slate-300 sm:text-base">

          {/* Overview Card */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">1. Nature of the Service & Pricing</h2>
            </div>
            <p className="mt-4">
              FresherToWork (operated by <strong>Velvetbyte PVT Ltd</strong>) provides digital services for aspiring job candidates and verified corporate recruiters:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="font-semibold text-white">Candidate Profile Activation & Verification Service (₹99 Incl. Taxes):</p>
              <p className="mt-1 text-xs text-slate-400">
                A one-time digital processing fee that initiates manual review of candidate proofs-of-work (UI/UX, Marketing, Video Editing, Software Development), verification badge allocation, and listing in the recruiter talent discovery portal.
              </p>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">2. Cancellation Policy</h2>
            </div>
            <p className="mt-4">
              Because candidate profile verification begins immediately upon receipt of payment to allocate moderation resources, profile activations cannot be cancelled once the verification process has started or the verified badge has been granted.
            </p>
            <p className="mt-3">
              However, candidates may cancel their profile listing or delete their account at any time without any recurring charges or cancellation penalties.
            </p>
          </section>

          {/* Refund Scenarios */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">3. When Refunds Are Granted</h2>
            </div>
            <p className="mt-4">
              We stand by our commitment to fair treatment. You are eligible for a <strong>100% full refund</strong> in the following scenarios:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Duplicate Charges:</strong> If you were charged more than once due to a network glitch or payment gateway double-charge, all duplicate debits will be refunded in full.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Technical Gateway Failure:</strong> If money was debited from your bank account or UPI application but your FresherToWork profile was not activated due to a technical server timeout, and our system does not resolve it within 24 hours.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                <div>
                  <strong className="text-white">Unfulfilled Verification:</strong> If our operations moderation team fails to review your submitted portfolio within 7 business days from submission.
                </div>
              </li>
            </ul>
          </section>

          {/* Non-refundable conditions */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">4. When Refunds Are Not Applicable</h2>
            </div>
            <p className="mt-4">
              Refunds will not be issued in the following circumstances:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
              <li>Your profile was reviewed, moderated, and published to recruiters as promised.</li>
              <li>You were rejected or flagged by moderators due to plagiarized, stolen, or fake work samples submitted in violation of our Terms of Service.</li>
              <li>You decided not to apply for jobs or changed your mind after your profile was already activated.</li>
              <li>You did not receive an immediate job offer from a specific company (we guarantee talent visibility and verified credentials, not guaranteed employment).</li>
            </ul>
          </section>

          {/* Refund Timeline & Process */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white">5. How to Request a Refund & Processing Timelines</h2>
            <p className="mt-4">
              To request a refund under the eligible criteria:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-300">
              <li>Send an email to <strong>infovelvetbyte@gmail.com</strong> with the subject: <code>&quot;Refund Request - [Your Registered Email / Phone]&quot;</code>.</li>
              <li>Include your Razorpay Payment ID (starts with <code>pay_...</code>) or the screenshot of the debit transaction.</li>
              <li>Our finance team will verify the claim within <strong>24 to 48 hours</strong>.</li>
            </ol>
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-300 text-sm">
              <strong>Processing Timeline:</strong> Once approved, the refund is initiated directly to your original payment method (Bank Account, UPI, Card) via Razorpay. It typically reflects in your statement within <strong>5 to 7 working days</strong> according to standard Reserve Bank of India banking clearing cycles.
            </div>
          </section>

          {/* Support Contacts */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">6. Support & Escalations</h2>
            </div>
            <p className="mt-4 text-slate-300">
              For billing questions, transaction disputes, or verification support:
            </p>
            <p className="mt-2 text-white">
              <strong>Entity:</strong> Velvetbyte PVT Ltd / FresherToWork<br />
              <strong>Billing Email:</strong> infovelvetbyte@gmail.com<br />
              <strong>Support Hotline:</strong> +91 8921658090<br />
              <strong>Operating Hours:</strong> Monday – Saturday, 9:00 AM – 6:00 PM IST
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
