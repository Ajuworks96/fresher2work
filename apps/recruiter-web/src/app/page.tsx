'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code2,
  Palette,
  Video,
  TrendingUp,
  Star,
  ExternalLink,
  Github,
  Sparkles,
  Lock,
  Building2,
  Users,
  Search,
  Zap,
  Award,
  Layers,
  ChevronRight,
  Download,
  Smartphone,
  Eye,
  Check,
  CheckCheck,
  SlidersHorizontal,
  Bell,
  Cpu,
  Fingerprint,
  QrCode,
  Compass,
  ArrowUpRight,
  Laptop,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'software' | 'design' | 'marketing' | 'video'>('software');
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setSubSuccess(true);
    setTimeout(() => setSubSuccess(false), 4000);
    setEmailSub('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* =========================================================================
          1. TOP NAVIGATION BAR (Clean, Minimalist SaaS)
      ========================================================================= */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5A36] to-[#E64C29] font-black text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              F
            </span>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Fresher<span className="text-[#FF5A36]">ToWork</span>
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#benefits" className="hover:text-slate-900 transition-colors">Key Benefits</a>
            <a href="#tools" className="hover:text-slate-900 transition-colors">Talent Tools</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Proof-of-Work</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Recruiter Plans</a>
            <Link href="/Fresher2Work.apk" className="hover:text-emerald-700 font-bold transition-colors flex items-center gap-1.5 text-emerald-600">
              <Download className="w-3.5 h-3.5" /> Mobile App
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/superadmin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 shadow-xs transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Super Admin</span>
            </Link>
            
            <Link
              href="/recruiter"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#e64c29] shadow-md shadow-orange-500/20 transition-all active:scale-[0.98]"
            >
              <span>Recruiter Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          2. HERO SECTION (With Hyper-Realistic Phone Mockup & Floating Cards)
      ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Soft Ambient Background Gradient Glows matching reference image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none -z-10 opacity-70">
          <div className="absolute top-10 left-10 w-96 h-96 bg-[#FFEBE4] rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-[450px] h-[450px] bg-[#E0F7F6] rounded-full blur-3xl" />
          <div className="absolute top-44 left-1/3 w-80 h-80 bg-[#FFF3EE] rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Proof-of-Work Hiring Platform for Growing Teams
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Smarter Fresher Hiring for Growing Businesses
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An all-in-one talent platform built to verify technical proof-of-work, eliminate deceptive paper resumes, and connect high-growth teams with job-ready freshers.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/recruiter"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#FF5A36] hover:bg-[#e64c29] shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98]"
            >
              <span>Explore Verified Talents</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/Fresher2Work.apk"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all active:scale-[0.98]"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Download Candidate App</span>
            </Link>

            <Link
              href="/superadmin"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>Super Admin Portal ↗</span>
            </Link>
          </div>

          {/* HERO VISUAL: Centered Device with Floating Metric Cards */}
          <div className="mt-14 sm:mt-18 relative max-w-5xl mx-auto">
            
            {/* FLOATING CARD 1: Left Verification Widget matching reference image */}
            <div className="hidden lg:flex absolute -left-4 top-1/4 -translate-y-1/2 z-20 flex-col gap-2.5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 text-left w-72 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  ID: FTW-98421
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              </div>

              {/* Progress Node Line */}
              <div className="flex items-center justify-between py-1 px-1">
                <div className="flex flex-col items-center">
                  <span className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                  <span className="text-[9px] text-slate-500 font-medium mt-1">Code Solved</span>
                </div>
                <div className="h-0.5 w-12 bg-emerald-400" />
                <div className="flex flex-col items-center">
                  <span className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                  <span className="text-[9px] text-slate-500 font-medium mt-1">16 Tests</span>
                </div>
                <div className="h-0.5 w-12 bg-emerald-400" />
                <div className="flex flex-col items-center">
                  <span className="h-4 w-4 rounded-full bg-orange-500 text-white flex items-center justify-center text-[9px] font-bold">★</span>
                  <span className="text-[9px] text-orange-600 font-bold mt-1">Direct Hire</span>
                </div>
              </div>

              <div className="pt-1.5 flex items-center gap-2.5 bg-slate-50 rounded-xl p-2 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                  AS
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-900 truncate">Adarsh Suresh</div>
                  <div className="text-[10px] text-slate-500 truncate">Full Stack Engineer • 98.5% Score</div>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Right Stats Widget matching reference image */}
            <div className="hidden lg:flex absolute -right-4 top-1/3 -translate-y-1/2 z-20 flex-col gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 text-left w-64 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#FFF1EC] text-[#FF5A36] flex items-center justify-center font-black border border-orange-200/80">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">3.5k+</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Vetted Candidates
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-[#E6F9F6] text-emerald-700 flex items-center justify-center font-black border border-emerald-200/80">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">24/7</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Verified Contact Reveal
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER DEVICE MOCKUP: High-End Native Smartphone (iPhone 16 Pro Style) */}
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px] rounded-[52px] p-3.5 bg-slate-950 shadow-2xl shadow-slate-900/30 border-4 border-slate-800">
              {/* Outer Edge Antenna lines & Metallic Titanium Rim Accent */}
              <div className="absolute -left-[5px] top-24 w-[3px] h-9 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-[5px] top-36 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
              <div className="absolute -left-[5px] top-52 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
              <div className="absolute -right-[5px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

              {/* Dynamic Island Pill with Camera & Sensor */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-emerald-400 font-bold">LIVE</span>
                </div>
              </div>

              {/* Real iOS Status Bar (9:41, 5G, Wi-Fi, 100% Battery) */}
              <div className="relative w-full bg-white rounded-[44px] overflow-hidden pt-2 text-left border border-slate-100 shadow-inner">
                <div className="h-6 flex items-center justify-between px-7 pt-1 text-[11px] font-bold text-slate-900 select-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-semibold text-slate-600">5G</span>
                    {/* Wi-Fi wave icon */}
                    <svg className="w-3.5 h-3.5 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 4c3.31 0 6.33 1.34 8.52 3.52L12 19.98 3.48 11.52C5.67 9.34 8.69 8 12 8z"/>
                    </svg>
                    {/* Battery icon */}
                    <div className="w-5 h-2.5 rounded-sm border border-slate-700 p-0.5 flex items-center">
                      <div className="h-full w-full bg-emerald-500 rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Real Candidate App View inside phone */}
                <div className="p-4 pt-5 pb-6 space-y-3.5">
                  
                  {/* App Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#FF5A36] text-white flex items-center justify-center text-xs font-black">
                        F
                      </span>
                      <div>
                        <div className="text-[11px] font-black text-slate-900">FresherToWork</div>
                        <div className="text-[9px] text-slate-400">Talent Passport #98421</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-emerald-600" /> Active
                    </span>
                  </div>

                  {/* Candidate Identity Card */}
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/50 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-orange-600 uppercase tracking-wider bg-orange-100/70 px-2 py-0.5 rounded">
                        Full-Stack Dev
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400">Calicut, Kerala</span>
                    </div>
                    <div className="text-xs font-black text-slate-900">
                      Adarsh Suresh
                    </div>
                    <div className="text-[10px] text-slate-500 leading-snug mt-0.5">
                      Next.js 15, PostgreSQL & TypeScript microservices architecture.
                    </div>

                    {/* Verified Metrics Badges inside App */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[9px]">
                      <div className="p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-400 block text-[8px] uppercase font-bold">Jest Test Suites</span>
                        <span className="font-extrabold text-emerald-600">16 / 16 Passed</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-400 block text-[8px] uppercase font-bold">Plagiarism Scan</span>
                        <span className="font-extrabold text-slate-800">0% Clean Code</span>
                      </div>
                    </div>

                    {/* Audit stamp */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Superadmin Audited
                      </span>
                      <Link
                        href="/recruiter"
                        className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-[9px] font-bold flex items-center gap-1"
                      >
                        Inspect Work <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Secondary Proof-of-Work Cards */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          <Palette className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-800">Design System • Figma</div>
                          <div className="text-[8px] text-slate-400">42 verified UI components</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        9.4 / 10
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-800">Loom Code Walkthrough</div>
                          <div className="text-[8px] text-slate-400">Architecture breakdown</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        4K 60fps
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. TRUSTED BY LOGO STRIP (Monochrome High-Tech Partner Badges)
      ========================================================================= */}
      <section className="py-10 border-y border-slate-200/60 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by Growing Tech, Product & Design Teams Worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-extrabold text-sm sm:text-base tracking-tight">
            <span className="hover:text-slate-900 transition-colors">TESLA</span>
            <span className="hover:text-slate-900 transition-colors">Notion</span>
            <span className="hover:text-slate-900 transition-colors">Slack</span>
            <span className="hover:text-slate-900 transition-colors">RazorScale</span>
            <span className="hover:text-slate-900 transition-colors">Velvetbyte</span>
            <span className="hover:text-slate-900 transition-colors">Postman</span>
            <span className="hover:text-slate-900 transition-colors">Vercel</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. KEY BENEFITS FOR SMARTER HIRING (Top 3 Cards matching reference image)
      ========================================================================= */}
      <section id="benefits" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Key Benefits
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Key Benefits for Smarter Deliveries & Hiring
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            Manage candidates, inspect real project code, and execute hires with complete confidence from a single, intuitive interface.
          </p>
        </div>

        {/* 3 Pastel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Faster Delivery Times */}
          <div className="p-8 rounded-3xl bg-[#FFF3EC] border border-orange-200/70 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5A36] text-white flex items-center justify-center font-black mb-6 shadow-md shadow-orange-500/20">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Faster Delivery Times</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Slash screening cycles from 3 weeks to under 48 hours. Recruiters review verified code test suites and live deployments instantly.
            </p>
          </div>

          {/* Card 2: Enhanced Delivery Security */}
          <div className="p-8 rounded-3xl bg-[#ECFDF5] border border-emerald-200/70 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black mb-6 shadow-md shadow-emerald-600/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Enhanced Delivery Security</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Zero paper resume bluff. Anti-plagiarism Git scanners and automated unit tests verify that every line of code was built by the student.
            </p>
          </div>

          {/* Card 3: Complete Shipment Visibility */}
          <div className="p-8 rounded-3xl bg-[#EFF6FF] border border-blue-200/70 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black mb-6 shadow-md shadow-blue-600/20">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Complete Visibility</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Inspect Figma component trees, GitHub commit history, and Loom architecture walkthroughs with one-click direct recruiter reveals.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. SIGNATURE RADIAL SECTION: "TOOLS THAT POWER SMARTER DELIVERIES"
             (Direct faithful recreation of the radial design in the reference image)
      ========================================================================= */}
      <section id="tools" className="py-20 sm:py-28 bg-white border-y border-slate-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Core Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Tools That Power Smarter Deliveries & Hiring
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Everything your talent team needs to manage, track, and optimize technical fresher hiring without messy agencies or paper resumes.
          </p>

          {/* RADIAL DIAGRAM CONTAINER */}
          <div className="mt-16 sm:mt-24 relative max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* LEFT 3 FEATURE NODES */}
            <div className="flex flex-col gap-8 text-left w-full lg:w-72">
              
              {/* Node 1 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                    Live Code Tracking
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Real-time Jest & Vitest runner tracking candidate challenge commits with pass/fail metrics.
                </p>
              </div>

              {/* Node 2 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Smart Match Planning
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Algorithmic scoring based on verified technical deliverables rather than deceptive resume keywords.
                </p>
              </div>

              {/* Node 3 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    Pipeline Management
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct candidate shortlists, recruiter interview notes, and 1-click offer dispatches in one portal.
                </p>
              </div>

            </div>

            {/* CENTER PHONE MOCKUP (Connected by radial lines) */}
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[310px] rounded-[48px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-800 shrink-0">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30" />

              <div className="w-full bg-[#FFFFFF] rounded-[40px] overflow-hidden pt-8 pb-5 px-3.5 text-left border border-slate-100 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[9px] font-black uppercase text-[#FF5A36]">Challenge Radar</span>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Feed
                  </span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="font-bold text-slate-800">Dev Challenge #42</span>
                    <span className="text-emerald-600 font-bold">100% Passed</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-full" />
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500">
                    <span>16/16 Unit Tests</span>
                    <span>0% Plagiarism</span>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-[9px]">
                  <div className="p-2 rounded-lg bg-orange-50/60 border border-orange-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800">UI/UX Systems</span>
                    <span className="text-orange-600 font-bold">42 Tokens</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                    <span className="font-bold text-slate-800">Backend API</span>
                    <span className="text-emerald-700 font-bold">PostgreSQL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 3 FEATURE NODES */}
            <div className="flex flex-col gap-8 text-left w-full lg:w-72">
              
              {/* Node 4 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                    Repo & Figma Scanning
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Direct inspection of public Git repositories, branch trees, and interactive design prototypes.
                </p>
              </div>

              {/* Node 5 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    Instant Notifications
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Instant alerts delivered to recruiter dashboards when top candidates submit verified challenge passes.
                </p>
              </div>

              {/* Node 6 */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                    Performance Analytics
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Monitor placement ratios, average time-to-hire, and market compensation benchmarks.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. POWERFUL FEATURES TO SIMPLIFY HIRING (2x2 Bento Grid matching reference)
      ========================================================================= */}
      <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Powerful Features to Simplify Hiring
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600">
            A comprehensive suite of screening, verification, and talent acquisition tools designed for high-performing engineering teams.
          </p>
        </div>

        {/* 2x2 Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bento Card 1: Smart Route Optimization / Code Execution */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Automation</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  99.99% Accuracy
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Smart Code Execution & Verification</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Automated sandboxed test runners evaluate candidate repositories against rigorous unit and integration test suites.
              </p>

              {/* Realistic Code Trace Preview */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-500 pb-2 border-b border-slate-800 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2">order_service.test.ts • Jest</span>
                </div>
                <pre className="pt-3 text-[11px] leading-relaxed text-emerald-400">
{`PASS src/__tests__/order_service.test.ts
  ✓ validates inventory balance (4ms)
  ✓ executes PostgreSQL transaction (8ms)
  ✓ triggers audit notification (2ms)

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total`}
                </pre>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">99.99%</span>
                <span className="text-xs text-slate-500 block">Verification accuracy</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#FF5A36]">15 min</span>
                <span className="text-xs text-slate-500 block">Review turnaround</span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Secure & Reliable Deliveries */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Passports</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  24/7 Verified
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Fraud-Proof Talent Passports</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Every candidate portfolio is backed by cryptographically verifiable test reports and verified Super Admin audit stamps.
              </p>

              {/* Realistic Candidate Card */}
              <div className="mt-6 p-5 rounded-2xl bg-[#FFF6F2] border border-orange-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center font-bold text-sm">
                      AM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Anjali Menon</div>
                      <div className="text-[11px] text-slate-500">UI/UX Systems Architect</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Hired by RazorScale
                  </span>
                </div>
                <div className="mt-3 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">
                  Design System with 120+ atomic Figma tokens, accessibility audited to WCAG 2.1 AAA.
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">99.95%</span>
                <span className="text-xs text-slate-500 block">Placement success rate</span>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-600">24/7</span>
                <span className="text-xs text-slate-500 block">Recruiter portal uptime</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Secure & Reliable In-App Hires */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Hiring</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  100% In-App
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Instant One-Click Direct Offers</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Skip agency intermediaries. Directly unlock verified candidate contacts and dispatch offer letters in seconds.
              </p>

              {/* Offer Dispatch Simulator Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Audit ID: FTW-HIRE-2026-98</span>
                  <span className="text-emerald-600">Offer Accepted</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Candidate: Arjun K.</span>
                  <span className="font-bold text-slate-900">₹8.5 LPA Verified</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">100%</span>
                <span className="text-xs text-slate-500 block">Direct in-app hiring</span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#FF5A36]">&lt; 5 Sec</span>
                <span className="text-xs text-slate-500 block">Direct contact reveal</span>
              </div>
            </div>
          </div>

          {/* Bento Card 4: Anti-Plagiarism AI Scanner */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Code Integrity</span>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Zero Hallucinations
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Deep Git Forensics & Anti-Cheat</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Commit timestamp inspection, branch diff analysis, and LLM plagiarism detection ensure zero copied boilerplate.
              </p>

              <div className="mt-6 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">0% Plagiarism Detected</div>
                    <div className="text-[11px] text-slate-500">100% Original Code Commits</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  CLEAN
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-emerald-600">0.0%</span>
                <span className="text-xs text-slate-500 block">Copied code threshold</span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">48 Hrs</span>
                <span className="text-xs text-slate-500 block">Average time to hire</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CHOOSE A PLAN THAT GROWS WITH YOUR BUSINESS (2 Pricing Cards matching reference)
      ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FAFAF8] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF5A36] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Recruiter Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Choose a Plan That Grows With Your Business
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Everything your talent team needs to manage, track, and optimize technical fresher hiring without agency overhead.
          </p>

          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* Plan 1: Starter Card (Clean White) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starter</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900">$39</span>
                  <span className="text-sm font-medium text-slate-500">/ month</span>
                </div>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  Ideal for early-stage startups screening their first engineering and design freshers.
                </p>

                <div className="mt-8 space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Browse 3,500+ verified fresher profiles</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inspect public GitHub & Figma portfolios</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5 Direct contact reveals per month</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard email support</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/recruiter"
                  className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all text-center block shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Plan 2: Professional Card (Signature Vibrant Orange matching reference) */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#FF5A36] text-white shadow-xl shadow-orange-500/25 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                  Popular
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-orange-200 uppercase tracking-wider">Professional</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">$79</span>
                  <span className="text-sm font-medium text-orange-200">/ month</span>
                </div>
                <p className="mt-3 text-xs text-orange-100 leading-relaxed">
                  For growing high-scale teams needing unlimited reveals and custom coding challenges.
                </p>

                <div className="mt-8 space-y-3.5 text-xs text-white">
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span className="font-semibold">Unlimited candidate contact reveals</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Run sandboxed live unit test suites</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Deep anti-plagiarism Git forensics</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Priority Super Admin verification pipeline</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0" />
                    <span>Dedicated talent advisor & SLA</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/recruiter"
                  className="w-full py-3.5 rounded-full bg-white hover:bg-slate-100 text-[#FF5A36] text-xs font-extrabold transition-all text-center block shadow-md"
                >
                  Enter Recruiter Portal
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          8. TESTIMONIAL QUOTE (Matching reference image)
      ========================================================================= */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <div className="flex items-center justify-center gap-1.5 text-yellow-400 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
          ))}
        </div>
        <blockquote className="text-lg sm:text-2xl font-bold text-slate-800 leading-relaxed">
          &ldquo;Managing fresher hiring is now 10x faster and completely transparent. Real-time test tracking and inspectable Git code changed our engineering hiring pipeline forever.&rdquo;
        </blockquote>
        <div className="mt-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm mb-2">
            DM
          </div>
          <div className="text-sm font-black text-slate-900">David Miller</div>
          <div className="text-xs text-slate-500">VP of Engineering, RazorScale Technologies</div>
        </div>
      </section>

      {/* =========================================================================
          9. PRE-FOOTER BANNER: "STAY UPDATED. STAY AHEAD." (Matching reference image)
      ========================================================================= */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#FFEBE4] via-[#FFF3EE] to-[#E0F7F6] border border-orange-200/50 text-center relative overflow-hidden shadow-lg shadow-orange-500/5">
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Stay Updated. Stay Ahead.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Subscribe to receive top weekly vetted fresher challenges, hiring insights, and platform feature drops.
          </p>

          <form onSubmit={handleSubscribe} className="mt-8 max-w-md mx-auto flex items-center gap-2 bg-white rounded-full p-1.5 border border-slate-200/80 shadow-xs">
            <input
              type="email"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="Enter your work email"
              required
              className="flex-1 px-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FF5A36] hover:bg-[#e64c29] text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              Subscribe Free
            </button>
          </form>

          {subSuccess && (
            <p className="mt-3 text-xs font-bold text-emerald-700 animate-fadeIn">
              ✓ Thanks! You are subscribed to FresherToWork updates.
            </p>
          )}

          {/* Device Mockup emerging from bottom */}
          <div className="mt-12 -mb-24 max-w-[280px] mx-auto rounded-t-[40px] p-3 bg-slate-900 border-t-4 border-x-4 border-slate-800 shadow-2xl">
            <div className="w-full bg-white rounded-t-[32px] pt-4 px-4 pb-8 text-left">
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-600 border-b border-slate-100 pb-2">
                <span>FresherToWork Radar</span>
                <span className="text-emerald-600">● Live Updates</span>
              </div>
              <div className="mt-2 text-[10px] font-bold text-slate-900">
                Top Full-Stack & UI/UX Freshers Live
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          10. FOOTER (Multi-Column Modern SaaS with Download Badges)
      ========================================================================= */}
      <footer className="pt-20 pb-12 bg-white border-t border-slate-200/60 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-100">
            
            {/* Col 1: Brand & App Download */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF5A36] font-black text-white text-xs">
                  F
                </span>
                <span className="text-base font-black text-slate-900">
                  Fresher<span className="text-[#FF5A36]">ToWork</span>
                </span>
              </Link>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Empowering college graduates and career changers into high-paying engineering, product design, and growth marketing roles through transparent proof-of-work.
              </p>
              
              {/* Download APK Pill */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <Link
                  href="/Fresher2Work.apk"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Android APK</span>
                </Link>
              </div>
            </div>

            {/* Col 2: Platform */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#benefits" className="hover:text-slate-900 transition-colors">Key Benefits</a></li>
                <li><a href="#tools" className="hover:text-slate-900 transition-colors">Tools</a></li>
                <li><a href="#features" className="hover:text-slate-900 transition-colors">Proof-of-Work</a></li>
                <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Recruiter Pricing</a></li>
              </ul>
            </div>

            {/* Col 3: Portals */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Portals</h4>
              <ul className="space-y-2">
                <li><Link href="/recruiter" className="hover:text-[#FF5A36] font-semibold transition-colors">Recruiter Portal</Link></li>
                <li><Link href="/superadmin" className="hover:text-emerald-700 font-semibold transition-colors">Super Admin Console</Link></li>
                <li><Link href="/Fresher2Work.apk" className="hover:text-slate-900 transition-colors">Candidate Mobile App</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            {/* Col 4: Legal & Compliance */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Legal & Security</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="hover:text-slate-900 transition-colors">Refund Policy</Link></li>
                <li><span className="text-emerald-600 font-semibold">Cloudflare Zero Trust Verified</span></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © 2026 FresherToWork Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Enterprise Grade Security</span>
              <span>•</span>
              <span>TLS 1.3 256-bit Encryption</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
