import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowLeft, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | FresherToWork',
  description: 'Get in touch with FresherToWork support, candidate verification helpline, and recruiter partnerships.',
};

export default function ContactPage() {
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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <MessageSquare className="h-3.5 w-3.5" /> Direct Support & Partnerships
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Have questions about candidate verification, recruiter hiring, or payments? We are here to help.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          
          {/* Card 1: Candidate Helpline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Candidate & General Support</h2>
            <p className="mt-2 text-sm text-slate-400">
              For queries about mobile app verification, portfolio reviews, or ₹99 payment confirmations.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-2.5 text-slate-300">
                <span className="font-semibold text-white">Email:</span>
                <a href="mailto:infovelvetbyte@gmail.com" className="text-emerald-400 hover:underline">
                  infovelvetbyte@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-slate-300">
                <span className="font-semibold text-white">Response SLA:</span>
                Within 24 hours
              </p>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Phone className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Helpline & WhatsApp</h2>
            <p className="mt-2 text-sm text-slate-400">
              Urgent assistance for payment escalations and candidate support.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex items-center gap-2.5 text-slate-300">
                <span className="font-semibold text-white">Phone / WhatsApp:</span>
                <a href="tel:+918921658090" className="text-emerald-400 hover:underline">
                  +91 8921658090
                </a>
              </p>
              <p className="flex items-center gap-2.5 text-slate-300">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
              </p>
            </div>
          </div>

          {/* Card 3: Business Location */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 sm:col-span-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">Registered Business Office</h2>
            <p className="mt-2 text-sm text-slate-400">
              Operated under corporate registration:
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <p><strong className="text-white">Legal Entity:</strong> Velvetbyte PVT Ltd</p>
              <p className="mt-1"><strong className="text-white">Platform Brand:</strong> FresherToWork (Fresher2Work)</p>
              <p className="mt-1"><strong className="text-white">Operational Hubs:</strong> Calicut, Kerala & Bengaluru, Karnataka, India</p>
              <p className="mt-1"><strong className="text-white">Official Website:</strong> <a href="https://velvetbyte.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">https://velvetbyte.com</a></p>
            </div>
          </div>

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
