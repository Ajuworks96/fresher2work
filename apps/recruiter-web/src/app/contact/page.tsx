import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowLeft, MessageSquare, ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | FresherToWork',
  description: 'Get in touch with FresherToWork support, candidate verification helpline, and recruiter partnerships.',
};

export default function ContactPage() {
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 shadow-sm">
            <MessageSquare className="h-4 w-4" /> Direct Support & Grievance Redressal
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base max-w-2xl mx-auto">
            Have questions about candidate verification, recruiter hiring, or technical payments? Our dedicated team is ready to assist you.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          
          {/* Email Support Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-950">Official Email Support</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              For general inquiries, recruiter partnerships, or candidate verification queries:
            </p>
            <a
              href="mailto:infovelvetbyte@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-base font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              infovelvetbyte@gmail.com <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-2 text-xs text-slate-500">
              Typical response time: Under 24 hours
            </p>
          </div>

          {/* Telephone / WhatsApp Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-bold text-slate-950">Phone & WhatsApp Helpline</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Direct voice call assistance and official WhatsApp chat support:
            </p>
            <a
              href="tel:+918921658090"
              className="mt-4 inline-flex items-center gap-2 text-base font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              +91 8921658090 <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="mt-2 text-xs text-slate-500">
              Available Monday – Saturday, 9:00 AM – 6:00 PM IST
            </p>
          </div>

          {/* Operating Locations Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:border-slate-300 transition sm:col-span-2">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 shadow-sm">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Registered Office & Development Hubs</h2>
                <p className="text-xs text-slate-600">Operating entity: <strong>Velvetbyte PVT Ltd</strong></p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kerala Office</span>
                <p className="mt-1 text-sm font-bold text-slate-950">Calicut Development Center</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  HiLITE Cyber Park / Bypass Road, Kozhikode (Calicut), Kerala – 673014, India
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kochi Office</span>
                <p className="mt-1 text-sm font-bold text-slate-950">Kochi Technology Hub</p>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Infopark Kochi / Kakkanad IT Corridor, Ernakulam, Kerala – 682042, India
                </p>
              </div>
            </div>
          </div>

          {/* Grievance Officer & SLA Card */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-sm sm:col-span-2">
            <div className="flex items-center gap-3 text-slate-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Grievance Redressal Mechanism</h2>
                <p className="text-xs text-slate-600">Under Information Technology Act, 2000 and DPDP Act 2023</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-xs sm:text-sm text-slate-700">
              <p>
                If you have complaints regarding data protection, unwanted recruiter messages, or payment resolution:
              </p>
              <div className="rounded-xl border border-emerald-200/80 bg-white p-4 shadow-sm space-y-1.5 text-xs sm:text-sm">
                <p><strong className="text-slate-950">Designated Officer:</strong> Legal & Grievance Team, Velvetbyte PVT Ltd</p>
                <p><strong className="text-slate-950">Direct Grievance Email:</strong> <a href="mailto:infovelvetbyte@gmail.com" className="text-emerald-700 font-semibold hover:underline">infovelvetbyte@gmail.com</a></p>
                <p><strong className="text-slate-950">Phone Helpline:</strong> +91 8921658090</p>
                <p><strong className="text-slate-950">Response Commitment:</strong> All grievances are formally acknowledged within 24 hours and thoroughly redressed within 7 working days.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
