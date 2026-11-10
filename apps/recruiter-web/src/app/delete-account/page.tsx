import React from 'react';
import Link from 'next/link';
import { Trash2, ShieldAlert, ArrowLeft, CheckCircle2, Mail, Phone, Lock, FileText, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Request Account & Data Deletion | Fresher2Work',
  description: 'Submit an account deletion request or learn how to erase your personal profile data from Fresher2Work under the India DPDP Act 2023.',
};

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-rose-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/brand/logo.png"
              alt="Fresher2Work"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
            <Link href="/privacy" className="text-slate-600 transition hover:text-slate-950">
              Privacy Policy
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
      <div className="relative overflow-hidden border-b border-rose-100 bg-gradient-to-b from-rose-50/50 via-slate-50/60 to-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 shadow-sm">
            <ShieldAlert className="h-4 w-4" /> User Right to Erasure • India DPDP Act 2023
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Account & Data Deletion
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base max-w-2xl mx-auto">
            You have full ownership of your personal profile, uploaded proofs, and application records. You can delete your account permanently at any time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">

          {/* Method 1: In-App Deletion */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                <Trash2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Method 1: Instant In-App Deletion</h2>
            </div>
            <p className="mt-4 text-slate-700">
              If you have the <strong>Fresher2Work</strong> mobile app installed on your device, you can delete your account instantly without contacting support:
            </p>
            <ol className="mt-4 space-y-3 list-decimal pl-5 text-slate-800 font-medium">
              <li>Open the <strong>Fresher2Work</strong> candidate mobile app.</li>
              <li>Tap the <strong>Profile</strong> tab on the bottom navigation bar.</li>
              <li>Scroll down to the <strong>Account & Compliance</strong> section or tap the Settings gear icon.</li>
              <li>Tap <strong>&quot;Delete Account Permanently&quot;</strong>.</li>
              <li>Confirm your deletion. Your account, authentication credentials, project uploads, and Talent Passport will be immediately and irreversibly purged from our live database.</li>
            </ol>
          </section>

          {/* Method 2: Web / Email Request */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm">
                <Mail className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">Method 2: Web or Email Erasure Request</h2>
            </div>
            <p className="mt-4 text-slate-700">
              If you have uninstalled the app or cannot access your account, you can submit an erasure request directly to our Data Protection and Grievance Officer:
            </p>
            
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950">Send an email to:</strong>{' '}
                  <a href="mailto:infovelvetbyte@gmail.com?subject=Account%20Deletion%20Request%20-%20Fresher2Work" className="font-bold text-[#1f357c] hover:underline">
                    infovelvetbyte@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950">Email Subject:</strong> <code>Account Deletion Request - [Your Registered Email]</code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-950">Information Required:</strong> Your registered full name, mobile number, and registered candidate email.
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              * In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act 2023, our Grievance Officer will acknowledge your request within 24 hours and finalize the complete erasure within <strong>7 business days</strong>.
            </p>
          </section>

          {/* What Data Is Deleted vs Retained */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#1f357c]" />
              What Happens When You Delete Your Account?
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                <div className="font-bold text-emerald-950">Data Permanently Deleted:</div>
                <ul className="mt-2 space-y-1.5 text-xs text-emerald-900">
                  <li>• Your full name, email, phone number, and password hashes.</li>
                  <li>• Public Talent Passport canvas (<span className="font-mono">fresher2work.com/u/...</span>).</li>
                  <li>• Uploaded resumes, project documentation, and portfolios.</li>
                  <li>• Skill badges, test rankings, and recruiter shortlist bookmarks.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="font-bold text-slate-950">Data Retained (Legal Compliance Only):</div>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                  <li>• Financial invoice receipts and Razorpay transaction IDs required by Indian tax laws (GST Act) are archived securely for audit purposes without personal marketing linkage.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold">Have Questions or Need Help?</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              Our support team is available Monday to Saturday (9:00 AM – 6:00 PM IST) to assist with any privacy or data concerns.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm">
              <a href="mailto:infovelvetbyte@gmail.com" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20 transition">
                <Mail className="h-4 w-4 text-[#4ad1c7]" /> infovelvetbyte@gmail.com
              </a>
              <a href="tel:+918921658090" className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20 transition">
                <Phone className="h-4 w-4 text-[#4ad1c7]" /> +91 8921658090
              </a>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

