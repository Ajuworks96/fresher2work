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
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'software' | 'design' | 'marketing' | 'video'>('software');

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-rose-500 to-emerald-500 font-black text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              F
            </span>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Fresher<span className="text-orange-600">ToWork</span>
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#proof-of-work" className="hover:text-slate-900 transition-colors">Proof-of-Work</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link href="/Fresher2Work.apk" className="hover:text-emerald-700 font-bold transition-colors flex items-center gap-1 text-emerald-600">
              <Download className="w-3.5 h-3.5" /> Candidate App
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/superadmin"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-all"
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

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Soft Ambient Background Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10 opacity-70">
          <div className="absolute top-10 left-10 w-96 h-96 bg-orange-200/50 rounded-full blur-3xl" />
          <div className="absolute top-20 right-10 w-[420px] h-[420px] bg-emerald-200/45 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/3 w-80 h-80 bg-rose-100/60 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              India&apos;s #1 Proof-of-Work Fresher Hiring Ecosystem
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
              <span>Explore Verified Candidates</span>
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
            
            {/* FLOATING CARD 1: Left Verification Widget */}
            <div className="hidden lg:flex absolute -left-6 top-1/4 -translate-y-1/2 z-20 flex-col gap-2 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 text-left w-72 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  ID: FTW-2026-DEV
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-400 to-rose-400 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Adarsh Suresh</div>
                  <div className="text-[11px] text-slate-500">Full Stack Engineer</div>
                </div>
              </div>
              <div className="pt-2 text-[10px] text-slate-600 space-y-1 bg-slate-50/80 rounded-lg p-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Live Project:</span>
                  <span className="font-semibold text-slate-900">E-Commerce SaaS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Skill Score:</span>
                  <span className="font-bold text-emerald-600">98.5% Passing</span>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 2: Right Stats Widget */}
            <div className="hidden lg:flex absolute -right-6 top-1/3 -translate-y-1/2 z-20 flex-col gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 text-left w-64 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black border border-emerald-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">3,500+</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Verified Freshers
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-black border border-orange-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">24/7</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Direct Contact Unlock
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER DEVICE MOCKUP (Mobile Shell matching reference image) */}
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] rounded-[44px] p-3.5 bg-slate-900 shadow-2xl shadow-slate-900/20 border-4 border-slate-800">
              {/* Phone Speaker & Dynamic Island Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Screen Content */}
              <div className="w-full bg-[#FFFFFF] rounded-[36px] overflow-hidden pt-9 pb-5 px-4 text-left border border-slate-100 shadow-inner">
                {/* App Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-orange-600 tracking-wider">Candidate App</span>
                    <h3 className="text-sm font-black text-slate-900">Track Challenge</h3>
                  </div>
                  <span className="h-7 px-2.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" /> Active
                  </span>
                </div>

                {/* Candidate Submission Card */}
                <div className="mt-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/40 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Domain</span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-800">
                      Full-Stack Dev
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    Full-Stack Next.js 15 & PostgreSQL Platform
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Complete responsive web portal with real auth, database queries & unit test verification.
                  </div>

                  {/* Verification Status Matrix */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                    <div className="p-2 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-400 block">Test Suites</span>
                      <span className="font-black text-emerald-600">16 / 16 Passed</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-100">
                      <span className="text-slate-400 block">Plagiarism</span>
                      <span className="font-black text-slate-800">0% Clean Code</span>
                    </div>
                  </div>

                  {/* Action pill in app */}
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Approved by Superadmin
                    </span>
                    <Link
                      href="/recruiter"
                      className="px-2.5 py-1 rounded-lg bg-slate-900 text-[10px] font-bold text-white flex items-center gap-1"
                    >
                      Inspect <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>

                {/* Additional Preview Rows */}
                <div className="mt-3 space-y-2">
                  <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">
                        🎨
                      </div>
                      <div className="text-[11px] font-bold text-slate-800">UI/UX Design Systems</div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">9.4/10 Score</span>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                        🎬
                      </div>
                      <div className="text-[11px] font-bold text-slate-800">Video Editing Reel</div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">4K 60fps Cut</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY LOGO STRIP */}
      <section className="py-10 border-y border-slate-200/60 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Trusted by Growing Tech, Product & Design Teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-extrabold text-sm sm:text-base">
            <span className="hover:text-slate-800 transition-colors">RazorScale Technologies</span>
            <span className="hover:text-slate-800 transition-colors">Velvetbyte Labs</span>
            <span className="hover:text-slate-800 transition-colors">CodeStudio Tech</span>
            <span className="hover:text-slate-800 transition-colors">Kochi CloudScale</span>
            <span className="hover:text-slate-800 transition-colors">Calicut Innovators</span>
            <span className="hover:text-slate-800 transition-colors">NextGen Digital</span>
          </div>
        </div>
      </section>

      {/* 4. REVOLUTIONIZING THE WAY FRESHERS GET HIRED */}
      <section id="features" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text & Stats */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 mb-4">
              <span>PARADIGM SHIFT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Revolutionizing the Way Freshers Get Hired
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              Traditional fresher hiring is broken: candidates inflate resumes with buzzwords and copied certificates, forcing recruiters to screen hundreds of candidates to find one competent hire.
            </p>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              FresherToWork replaces paper resumes with real, inspectable proof-of-work: GitHub repos, live Vercel deployments, Figma design systems, and real-time performance analytics.
            </p>

            {/* 3 Bold Metrics */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">3,000+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Verified Projects</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-orange-600">₹12 Cr+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Candidate Earnings</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">48 Hrs</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Average Hire Time</div>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Domain Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proof of Work Domains</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Live Verification
              </span>
            </div>

            {/* Domain Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
              <button
                onClick={() => setActiveTab('software')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'software'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                💻 Software
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'design'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                🎨 UI/UX
              </button>
              <button
                onClick={() => setActiveTab('marketing')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'marketing'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                📈 Marketing
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'video'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                🎬 Video
              </button>
            </div>

            {/* Dynamic Tab Body */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              {activeTab === 'software' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Full-Stack & Mobile Development</span>
                    <span className="text-[10px] font-bold text-orange-600">GitHub Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Clean commit history, modular architecture, Docker configurations, and automated unit test coverage.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Next.js 15</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Flutter</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">PostgreSQL</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Node.js</span>
                  </div>
                </>
              )}

              {activeTab === 'design' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">UI/UX & Product Design</span>
                    <span className="text-[10px] font-bold text-pink-600">Figma Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Interactive prototypes, typography tokens, responsive auto-layouts, and user journey problem-solving frameworks.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Figma</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Design Systems</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">User Research</span>
                  </div>
                </>
              )}

              {activeTab === 'marketing' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Performance & Growth Marketing</span>
                    <span className="text-[10px] font-bold text-emerald-600">ROI Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Live ad spend analytics, conversion rate optimization tests, copy testing matrices, and real customer acquisition case studies.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Meta Ads</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Google Ads</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">SEO / SEM</span>
                  </div>
                </>
              )}

              {activeTab === 'video' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Video Editing & Motion Design</span>
                    <span className="text-[10px] font-bold text-purple-600">Timeline Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    High-engagement short-form reels, pacing analysis, color grading, sound design, and Premiere/After Effects raw project files.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">Premiere Pro</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">After Effects</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">CapCut Pro</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5">
              <Link
                href="/recruiter"
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20"
              >
                <span>Browse {activeTab.toUpperCase()} Talent in Recruiter Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. POWERFUL FEATURES (2x2 BENTO GRID MATCHING REFERENCE) */}
      <section id="proof-of-work" className="py-20 bg-slate-100/60 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
              Powerful Features to Simplify Hiring
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Everything built to protect recruiters from fake claims while rewarding genuine, hardworking freshers.
            </p>
          </div>

          {/* 2x2 Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Proof Inspection */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border border-emerald-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-600/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Direct Proof-of-Work Inspection
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  No more relying on what candidates write on resumes. Inspect their live demo links, Figma files, raw video timelines, and GitHub repository commits in 1 click.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>✓ 100% Verified Submissions</span>
                <Link href="/recruiter" className="hover:underline flex items-center gap-1">
                  Inspect Now →
                </Link>
              </div>
            </div>

            {/* Card 2: Smart Talent Matching */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-50 via-white to-orange-50/30 border border-orange-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mb-6 shadow-md shadow-orange-600/20">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Smart Talent Matching & Filters
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Filter by exact technologies (React, Flutter, Python, Node), preferred work mode (Remote, Hybrid, On-site), and immediate availability to hire in under 48 hours.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-orange-100 flex items-center justify-between text-xs font-bold text-orange-800">
                <span>99.9% Skill Accuracy</span>
                <span>15+ Tech Stacks</span>
              </div>
            </div>

            {/* Card 3: Anti-Resume Fraud */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-md shadow-slate-900/10">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Zero Resume Fraud & Plagiarism Checks
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Automated checks verify original authorship of code repositories, detecting copy-pasted boilerplates, ChatGPT-hallucinated projects, and fake certificates.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                <span>100% Authentic Code</span>
                <span>Superadmin Moderated</span>
              </div>
            </div>

            {/* Card 4: Instant Contact Unlocks */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-white to-rose-50/30 border border-rose-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-6 shadow-md shadow-rose-600/20">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Direct Contact & Shortlist Management
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Save candidates into customized recruitment pipelines, unlock verified email & phone numbers, and message them directly on WhatsApp with zero agency commission.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-800">
                <span>One-Click WhatsApp Connect</span>
                <Link href="/recruiter" className="hover:underline flex items-center gap-1">
                  Start Shortlisting →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TOOLS THAT POWER SMARTER HIRING (Radial Callout Section) */}
      <section id="how-it-works" className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-8 text-center">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Ecosystem Architecture</span>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
          Tools That Power Smarter Deliveries & Hiring
        </h2>
        <p className="text-sm text-slate-600 mt-3 max-w-xl mx-auto">
          From live coding challenges to verified contact unlocks, every tool is engineered for recruiter speed.
        </p>

        {/* 6 Grid Tool Highlights */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-orange-300 transition-colors">
            <div className="text-orange-600 font-extrabold text-sm mb-1">01. Live Proof Tracking</div>
            <h4 className="text-base font-bold text-slate-900">Real-Time Challenge Pipeline</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Track candidate submissions in real-time as they complete technical problem sets and upload verified repos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="text-emerald-600 font-extrabold text-sm mb-1">02. Moderation Control</div>
            <h4 className="text-base font-bold text-slate-900">Super Admin Quality Gate</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every project is vetted for plagiarism, working demo links, and proper coding conventions before listing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-300 transition-colors">
            <div className="text-rose-600 font-extrabold text-sm mb-1">03. Talent Shortlists</div>
            <h4 className="text-base font-bold text-slate-900">Custom Hiring Pipelines</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Organize top applicants into team shortlists with notes, tags, and status tracking for quick hiring decisions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 transition-colors">
            <div className="text-purple-600 font-extrabold text-sm mb-1">04. Multi-Domain Verification</div>
            <h4 className="text-base font-bold text-slate-900">Software, Design, Marketing, Video</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Specialized verification pipelines tailored to each discipline so you judge candidates by industry metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
            <div className="text-blue-600 font-extrabold text-sm mb-1">05. Direct Contact Unlocks</div>
            <h4 className="text-base font-bold text-slate-900">Verified Email & WhatsApp</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              No messaging delays or recruiter agency markups. Reach out directly to candidate mobile numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="text-emerald-600 font-extrabold text-sm mb-1">06. Android & iOS App</div>
            <h4 className="text-base font-bold text-slate-900">Dedicated Candidate Mobile App</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Candidates build portfolios, take assessments, and get notifications on interview invites directly from their phone.
            </p>
          </div>

        </div>
      </section>

      {/* 7. CHOOSE A PLAN THAT GROWS WITH YOUR BUSINESS (Matching reference pricing cards) */}
      <section id="pricing" className="py-20 bg-slate-100/70 border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Pricing Plans</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-1">
              Choose a Plan That Grows With Your Business
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Transparent, fair pricing for hiring verified fresher talent with zero agency commissions.
            </p>
          </div>

          {/* Pricing Cards (Starter vs Professional matching reference) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Starter Card */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-semibold">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  For startups exploring verified candidates and testing technical portfolios.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Unlimited talent browsing & search</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inspect full GitHub repos & Figma files</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>View challenge scores & test pass rates</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Create & manage talent shortlists</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">✕</span>
                    <span>Direct phone & email unlocks</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/recruiter"
                  className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center transition-all shadow-sm"
                >
                  Explore Free in Recruiter Hub
                </Link>
              </div>
            </div>

            {/* Professional Card (Featured Orange/Coral card matching reference) */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#FF5A36] to-[#E0411F] text-white shadow-xl shadow-orange-500/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-200">Professional</span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹4,999</span>
                  <span className="text-xs text-orange-200 font-semibold">/ hire pack</span>
                </div>
                <p className="text-xs text-orange-100 mt-2">
                  For growing companies looking to unlock contacts and hire candidates immediately.
                </p>

                <div className="mt-6 pt-6 border-t border-orange-400/40 space-y-3 text-xs text-white">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Everything in Starter included</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>15 Direct Candidate Contact Unlocks</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Verified Phone Numbers & Email Addresses</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>Direct 1-Click WhatsApp Interview Scheduling</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>30-Day Candidate Replacement Warranty</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/recruiter"
                  className="w-full py-3.5 rounded-full bg-white hover:bg-orange-50 text-slate-900 text-xs font-bold flex items-center justify-center transition-all shadow-md"
                >
                  Start Hiring Now →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. TESTIMONIAL SECTION */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        {/* 5 Gold Stars */}
        <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-6">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        </div>

        <blockquote className="text-lg sm:text-2xl font-bold text-slate-800 leading-snug tracking-tight">
          &ldquo;FresherToWork solved our biggest bottleneck: we used to screen 400 resumes to find one competent junior dev. With FresherToWork, we reviewed 5 candidates&apos; live code, interviewed 3, and hired 2 in 48 hours.&rdquo;
        </blockquote>

        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
            DM
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900">David Miller</div>
            <div className="text-[11px] text-slate-500">Lead Hiring Partner, RazorScale Technologies</div>
          </div>
        </div>
      </section>

      {/* 9. STAY UPDATED. STAY AHEAD. (CTA BANNER MATCHING REFERENCE) */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="rounded-[40px] bg-gradient-to-r from-orange-100 via-rose-50 to-emerald-100 border border-orange-200/60 p-8 sm:p-14 text-center relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2">
            Stay Updated. Stay Ahead.
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-3">
            Subscribe to fresh talent drops, inspect live proof-of-work, and build high-performance teams with verified freshers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/recruiter"
              className="px-8 py-3.5 rounded-full text-xs font-bold text-white bg-[#FF5A36] hover:bg-[#e64c29] shadow-lg shadow-orange-500/25 transition-all"
            >
              Open Recruiter Portal →
            </Link>

            <Link
              href="/superadmin"
              className="px-6 py-3.5 rounded-full text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all"
            >
              Super Admin Console
            </Link>

            <Link
              href="/Fresher2Work.apk"
              className="px-6 py-3.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download App APK
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
