import React from 'react';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, AlertCircle, Clock, CreditCard, Mail, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | FresherToWork',
  description: 'Official Refund & Cancellation Policy for FresherToWork candidate activation and recruiter services.',
};

export default function RefundPolicyPage() {
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
            <Link href="/terms" className="text-slate-600 transition hover:text-slate-950">
              Terms of Service
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800 shadow-sm">
            <RotateCcw className="h-4 w-4" /> Razorpay & Merchant Compliance
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base max-w-2xl mx-auto">
            Transparent and fair guidelines regarding the candidate profile verification fee (₹99) and employer services
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">
          
          {/* Section 1: Overview */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">1. Purpose & Scope of Fee</h2>
            </div>
            <p className="mt-4">
              At <strong>FresherToWork</strong> (operated by <strong>Velvetbyte PVT Ltd</strong>), we believe in 100% transparency. Candidates pay a one-time, nominal profile verification & discovery pass fee of <strong>₹99 (inclusive of GST)</strong>.
            </p>
            <p className="mt-3">
              This one-time fee directly offsets manual human engineering review, project repository auditing, fraud prevention, server cloud costs, and direct matching with registered corporate HR recruiters.
            </p>
          </section>

          {/* Section 2: Eligible for Refund */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">2. Circumstances Eligible for a Full Refund</h2>
            </div>
            <p className="mt-4">
              You are entitled to a full 100% refund of your ₹99 payment under any of the following circumstances:
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Duplicate or Accidental Multiple Debits:</strong> If your bank account or UPI application was debited more than once for the same candidate profile due to network latency or gateway timeout, all duplicate debits are refunded immediately.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Payment Debited but Activation Failed:</strong> If money was deducted from your bank account but our automated Razorpay webhook failed to mark your profile as activated, and our technical support team is unable to resolve the issue within 24 hours.
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <strong className="text-slate-950">Cancellation Request Prior to Profile Review:</strong> If you request cancellation of your application within 2 hours of payment before our engineering moderation team reviews your projects.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3: Non-Refundable */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">3. Non-Refundable Circumstances</h2>
            </div>
            <p className="mt-4">
              Refunds will not be issued in the following cases:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Once your candidate profile has been audited, approved, and assigned an active discovery badge in the recruiter portal.</li>
              <li>Failure to secure an interview or job offer. FresherToWork guarantees platform discovery, recruiter search visibility, and portfolio auditing, but does not guarantee employment.</li>
              <li>Accounts banned or suspended due to submission of plagiarized work, counterfeit certificates, or code of conduct violations.</li>
            </ul>
          </section>

          {/* Section 4: Refund Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                <Clock className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">4. Refund Processing & Banking Timelines</h2>
            </div>
            <p className="mt-4">
              All approved refunds are processed automatically through our primary payment partner, <strong>Razorpay</strong>, back to the original source of payment:
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">UPI / Google Pay / PhonePe</div>
                <div className="mt-1 text-base font-extrabold text-slate-950">24 – 48 Hours</div>
                <p className="mt-1 text-xs text-slate-600">Directly credited to linked bank account.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Banking</div>
                <div className="mt-1 text-base font-extrabold text-slate-950">2 – 5 Working Days</div>
                <p className="mt-1 text-xs text-slate-600">Depending on individual bank settlement speed.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Debit / Credit Card</div>
                <div className="mt-1 text-base font-extrabold text-slate-950">5 – 7 Business Days</div>
                <p className="mt-1 text-xs text-slate-600">Standard card network clearance period.</p>
              </div>
            </div>
          </section>

          {/* Section 5: How to Claim Refund */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">5. How to Initiate a Refund Request</h2>
            </div>
            <p className="mt-3 text-slate-700">
              If you experienced a failed transaction, duplicate debit, or require assistance, simply email our payment support desk with your details:
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200/80 bg-white p-5 text-sm text-slate-700 shadow-sm space-y-2">
              <p><strong className="text-slate-950">Send Email to:</strong> <a href="mailto:infovelvetbyte@gmail.com" className="text-emerald-700 font-semibold hover:underline">infovelvetbyte@gmail.com</a></p>
              <p><strong className="text-slate-950">Subject Line:</strong> <code>Refund Request - [Your Registered Mobile Number]</code></p>
              <p><strong className="text-slate-950">Required Details:</strong> Candidate Full Name, Registered Email, Razorpay Payment/Order ID, and screenshot of bank debit message.</p>
              <p><strong className="text-slate-950">Support Phone / WhatsApp:</strong> <a href="tel:+918921658090" className="text-emerald-700 font-semibold hover:underline">+91 8921658090</a></p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
