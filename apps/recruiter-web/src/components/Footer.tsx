import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-extrabold text-slate-950 shadow-md shadow-emerald-500/20">
                F
              </span>
              <span>
                Fresher<span className="text-emerald-400">ToWork</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              India&apos;s proof-of-work hiring platform connecting verified fresher talent with leading tech companies.
            </p>
            <p className="text-xs text-slate-400">
              Operated by <strong className="text-slate-300">Velvetbyte PVT Ltd</strong>.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/discover" className="transition hover:text-emerald-400">
                  Discover Candidates
                </Link>
              </li>
              <li>
                <Link href="/company" className="transition hover:text-emerald-400">
                  Company Hub
                </Link>
              </li>
              <li>
                <Link href="/shortlists" className="transition hover:text-emerald-400">
                  Saved Shortlists
                </Link>
              </li>
              <li>
                <Link href="/admin" className="transition hover:text-emerald-400">
                  Super Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Legal & Compliance</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="transition hover:text-emerald-400">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-emerald-400">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="transition hover:text-emerald-400">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-emerald-400">
                  Grievance & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Direct Support</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-emerald-400" />
                <a href="mailto:infovelvetbyte@gmail.com" className="transition hover:text-emerald-400">
                  infovelvetbyte@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <a href="tel:+918921658090" className="transition hover:text-emerald-400">
                  +91 8921658090
                </a>
              </li>
              <li className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>PCI-DSS Secured via Razorpay</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-900 pt-6 text-center text-xs text-slate-400">
          <p>© 2026 FresherToWork (Velvetbyte PVT Ltd). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
