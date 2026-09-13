'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Briefcase,
  User,
  Settings,
  Home,
  Github,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  FileText,
  Upload,
  ArrowRight,
  Eye,
  Bell,
  Check,
  Flame,
  Award,
  Lock,
  RefreshCw,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

export default function MobilePreviewPage() {
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'activation' | 'profile' | 'onboarding'>('home');
  const [hasFlaggedIssue, setHasFlaggedIssue] = useState<boolean>(true);
  const [isActivated, setIsActivated] = useState<boolean>(false);
  const [demoRole, setDemoRole] = useState<'frontend' | 'backend' | 'fullstack'>('fullstack');

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
            ← Back to Super Admin
          </Link>
          <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>FresherToWork Candidate Mobile App</span>
            <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '2px 8px', borderRadius: '9999px', border: '1px solid rgba(99, 102, 241, 0.3)', fontWeight: 600 }}>
              React Native / Expo v1.0
            </span>
          </div>
        </div>

        {/* Simulator Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Flagged Issue Banner:</span>
            <button
              onClick={() => setHasFlaggedIssue(!hasFlaggedIssue)}
              style={{
                background: hasFlaggedIssue ? '#ef4444' : '#334155',
                color: '#fff',
                border: 'none',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {hasFlaggedIssue ? 'Issue Active (Visible)' : 'No Issues'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>₹99 Activation:</span>
            <button
              onClick={() => setIsActivated(!isActivated)}
              style={{
                background: isActivated ? '#10b981' : '#f59e0b',
                color: '#fff',
                border: 'none',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isActivated ? 'Activated (Unlocked)' : 'Pending (₹99)'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: '48px', overflowY: 'auto' }}>
        
        {/* Left Side: Mobile App Feature Highlights */}
        <div style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818cf8', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
              <Sparkles size={14} /> Student Candidate Experience
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: 0 }}>
              Mobile Candidate Experience & Proof-of-Work Engine
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginTop: '10px' }}>
              Fresher candidates build their profile, link live GitHub proof-of-work repositories, pay the ₹99 one-time activation, and receive direct recruiter inquiries and verification alerts.
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explore Mobile Views:</span>
            
            <button
              onClick={() => setActiveTab('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'home' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'home' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                color: activeTab === 'home' ? '#818cf8' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Home size={18} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>1. Candidate Home & Discovery</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Profile readiness, impressions & recruiter views</div>
                </div>
              </div>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'projects' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'projects' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                color: activeTab === 'projects' ? '#818cf8' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Briefcase size={18} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>2. Proof-of-Work Manager</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Live GitHub repos, tech stacks & demos</div>
                </div>
              </div>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('activation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'activation' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'activation' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                color: activeTab === 'activation' ? '#818cf8' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={18} color="#f59e0b" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>3. ₹99 Discovery Activation</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>One-time paywall to feature in recruiter pool</div>
                </div>
              </div>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'profile' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'profile' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                color: activeTab === 'profile' ? '#818cf8' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={18} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>4. Profile & Admin Moderation Alert</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Shows mandatory issue resolution banner</div>
                </div>
              </div>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('onboarding')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: activeTab === 'onboarding' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                border: activeTab === 'onboarding' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                color: activeTab === 'onboarding' ? '#818cf8' : '#cbd5e1',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sparkles size={18} color="#ec4899" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>5. Candidate Onboarding Flow</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Multi-step student registration wizard</div>
                </div>
              </div>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Realistic iPhone Frame Mockup */}
        <div style={{ position: 'relative', width: '380px', height: '760px', background: '#000', borderRadius: '52px', padding: '12px', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.15), inset 0 0 0 4px #1e293b' }}>
          
          {/* Outer Volume Buttons & Power */}
          <div style={{ position: 'absolute', top: '140px', left: '-3px', width: '3px', height: '40px', background: '#475569', borderRadius: '2px 0 0 2px' }} />
          <div style={{ position: 'absolute', top: '190px', left: '-3px', width: '3px', height: '40px', background: '#475569', borderRadius: '2px 0 0 2px' }} />
          <div style={{ position: 'absolute', top: '160px', right: '-3px', width: '3px', height: '55px', background: '#475569', borderRadius: '0 2px 2px 0' }} />

          {/* Screen Container */}
          <div style={{ width: '100%', height: '100%', background: '#ffffff', borderRadius: '42px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', color: '#0f172a' }}>
            
            {/* iPhone Dynamic Island / Status Bar */}
            <div style={{ height: '44px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 50, borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>9:41</span>
              {/* Dynamic Island */}
              <div style={{ width: '90px', height: '22px', background: '#000', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1e293b', marginLeft: 'auto', marginRight: '8px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', paddingBottom: '70px' }}>
              
              {/* ================= VIEW 1: HOME TAB ================= */}
              {activeTab === 'home' && (
                <div>
                  {/* Top Candidate Bar */}
                  <div style={{ padding: '16px 20px', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                          AK
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Arjun K.</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Full Stack Engineer • 2024 Batch</div>
                        </div>
                      </div>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                        <Bell size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Moderation Banner if flagged */}
                  {hasFlaggedIssue && (
                    <div style={{ margin: '16px 16px 0 16px', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '14px', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <AlertTriangle size={18} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#991b1b' }}>Super Admin Notice: Action Required</div>
                          <div style={{ fontSize: '11.5px', color: '#b91c1c', marginTop: '2px', lineHeight: 1.4 }}>
                            Degree certificate is blurred. Re-upload clean scan to maintain verified badge in recruiter search.
                          </div>
                          <button
                            onClick={() => setActiveTab('profile')}
                            style={{
                              marginTop: '8px',
                              background: '#dc2626',
                              color: '#fff',
                              border: 'none',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Fix in Profile →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activation Banner if not activated */}
                  {!isActivated && (
                    <div style={{ margin: '16px 16px 0 16px', background: 'linear-gradient(135deg, #4f46e5, #4338ca)', borderRadius: '16px', padding: '16px', color: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '9999px' }}>
                          ⚡ 1-Time Activation
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 800 }}>₹99</span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '8px 0 4px 0' }}>Get Discovered by Top Recruiters</h4>
                      <p style={{ fontSize: '12px', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
                        Unlock direct recruiter contact, verified placement tags, and top 5% talent rank.
                      </p>
                      <button
                        onClick={() => setActiveTab('activation')}
                        style={{
                          marginTop: '12px',
                          width: '100%',
                          background: '#fff',
                          color: '#4338ca',
                          border: 'none',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Activate Profile Now →
                      </button>
                    </div>
                  )}

                  {/* Discovery Stats Cards */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>Your Discovery Telemetry</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Recruiter Views</span>
                          <Eye size={14} color="#6366f1" />
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>24</div>
                        <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>+12% from last week</div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Search Appearances</span>
                          <TrendingUp size={14} color="#10b981" />
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>58</div>
                        <div style={{ fontSize: '10.5px', color: '#6366f1', fontWeight: 600, marginTop: '2px' }}>Top 10% in Kerala</div>
                      </div>
                    </div>
                  </div>

                  {/* Proof-of-Work Quick Check */}
                  <div style={{ padding: '0 16px 16px 16px' }}>
                    <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Proof-of-Work Readiness</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>85% Complete</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #4f46e5, #06b6d4)', borderRadius: '9999px' }} />
                      </div>
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <CheckCircle2 size={14} color="#10b981" /> GitHub connected (3 live repositories)
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <CheckCircle2 size={14} color="#10b981" /> Academic scorecard verified
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
                          <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #cbd5e1' }} /> Add live deployment demo URL
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= VIEW 2: PROJECTS TAB ================= */}
              {activeTab === 'projects' && (
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Proof of Work</h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Live repos & validated architecture</p>
                    </div>
                    <button style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}>
                      + Add Project
                    </button>
                  </div>

                  {/* Project Card 1 */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Github size={18} color="#0f172a" />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>fresher-jobs-aggregator</span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                        Verified
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', lineHeight: 1.4 }}>
                      High throughput scraping engine with Next.js dashboard & Redis queuing. Handled 50k+ jobs daily.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {['Next.js', 'PostgreSQL', 'Redis', 'Tailwind'].map(tech => (
                        <span key={tech} style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '12px', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>⭐ 48 GitHub Stars</span>
                      <a href="#" style={{ fontSize: '11.5px', color: '#4f46e5', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Live Demo <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Project Card 2 */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Github size={18} color="#0f172a" />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>realtime-chat-engine</span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                        Verified
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569', marginTop: '8px', lineHeight: 1.4 }}>
                      WebSocket based end-to-end encrypted messaging service with presence tracking and audio notes.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                      {['Node.js', 'Socket.io', 'MongoDB', 'Docker'].map(tech => (
                        <span key={tech} style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= VIEW 3: ACTIVATION TAB ================= */}
              {activeTab === 'activation' && (
                <div style={{ padding: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '10px' }}>
                      <Zap size={28} />
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Candidate Discovery Pass</h2>
                    <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>1-Time ₹99 Activation • Lifetime Validity</p>
                  </div>

                  <div style={{ background: '#ffffff', borderRadius: '18px', border: '2px solid #e0e7ff', padding: '18px', boxShadow: '0 4px 20px rgba(79, 70, 229, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>One-time fee</span>
                      <div>
                        <span style={{ fontSize: '28px', fontWeight: 900, color: '#4f46e5' }}>₹99</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>₹499</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#1e293b' }}>
                        <CheckCircle2 size={16} color="#10b981" /> Direct recruiter WhatsApp & Email inquiries
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#1e293b' }}>
                        <CheckCircle2 size={16} color="#10b981" /> Verified Proof-of-Work badge on search
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#1e293b' }}>
                        <CheckCircle2 size={16} color="#10b981" /> Featured in Top 5% Freshers feed
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: '#1e293b' }}>
                        <CheckCircle2 size={16} color="#10b981" /> Instant notification when recruiter shortlists you
                      </div>
                    </div>

                    <button
                      onClick={() => setIsActivated(true)}
                      style={{
                        marginTop: '18px',
                        width: '100%',
                        background: isActivated ? '#10b981' : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                        color: '#fff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {isActivated ? (
                        <>
                          <Check size={18} /> Profile Activated & Live
                        </>
                      ) : (
                        <>
                          Pay ₹99 via Razorpay / UPI →
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ================= VIEW 4: PROFILE TAB ================= */}
              {activeTab === 'profile' && (
                <div style={{ padding: '16px' }}>
                  {/* Flagged Issue Alert in Profile Screen */}
                  {hasFlaggedIssue && (
                    <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} color="#dc2626" />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#991b1b' }}>Admin Moderation Flag</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#b91c1c', margin: '6px 0 10px 0', lineHeight: 1.4 }}>
                        Issue: <strong>Degree Certificate Blur</strong>. Super Admin marked this profile for verification. Please upload a clear photo or PDF scan.
                      </p>
                      <button style={{ width: '100%', background: '#dc2626', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Upload size={14} /> Re-upload Certificate PDF
                      </button>
                    </div>
                  )}

                  {/* Profile Card */}
                  <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '18px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>
                      AK
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Arjun Krishnan</h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 8px 0' }}>Model Engineering College, Kochi • 2024</p>
                    
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', color: '#3730a3', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>
                      <ShieldCheck size={14} /> ₹6 - ₹9 LPA Expected
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '16px', paddingTop: '14px', textAlign: 'left' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Primary Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {['React.js', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'].map(s => (
                          <span key={s} style={{ fontSize: '11px', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '3px 8px', borderRadius: '6px', color: '#334155', fontWeight: 600 }}>
                            {s}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginTop: '14px', marginBottom: '6px' }}>Verified Credentials</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#334155', fontWeight: 600 }}>B.Tech Computer Science (8.8 CGPA)</span>
                          <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Verified</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
                          <span style={{ color: '#334155', fontWeight: 600 }}>Resume / CV.pdf (Uploaded)</span>
                          <span style={{ color: '#4f46e5', fontWeight: 700 }}>View PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= VIEW 5: ONBOARDING TAB ================= */}
              {activeTab === 'onboarding' && (
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>Step 2 of 4</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>50% Complete</span>
                  </div>
                  <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '9999px', marginBottom: '16px', overflow: 'hidden' }}>
                    <div style={{ width: '50%', height: '100%', background: '#4f46e5' }} />
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>Tell Us About Your Tech Stack</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>Recruiters search candidates by exact stack mastery.</p>

                  <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>Your Preferred Roles</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      {['Frontend', 'Backend', 'Full Stack'].map(role => (
                        <button
                          key={role}
                          onClick={() => setDemoRole(role.toLowerCase() as any)}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            border: demoRole === role.toLowerCase() ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                            background: demoRole === role.toLowerCase() ? '#eef2ff' : '#f8fafc',
                            color: demoRole === role.toLowerCase() ? '#4f46e5' : '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>GitHub Profile URL</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 10px', height: '38px', marginBottom: '14px' }}>
                      <Github size={16} color="#64748b" style={{ marginRight: '8px' }} />
                      <input
                        type="text"
                        defaultValue="https://github.com/arjun-dev"
                        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%', color: '#0f172a' }}
                      />
                    </div>

                    <button style={{ width: '100%', background: '#4f46e5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                      Save & Continue to Projects →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Tab Bar (iOS / Expo Router Native Style) */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '62px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px 10px 8px', zIndex: 40 }}>
              <button
                onClick={() => setActiveTab('home')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: activeTab === 'home' ? '#4f46e5' : '#94a3b8' }}
              >
                <Home size={20} />
                <span style={{ fontSize: '10px', fontWeight: activeTab === 'home' ? 700 : 500 }}>Home</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: activeTab === 'projects' ? '#4f46e5' : '#94a3b8' }}
              >
                <Briefcase size={20} />
                <span style={{ fontSize: '10px', fontWeight: activeTab === 'projects' ? 700 : 500 }}>Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('activation')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: activeTab === 'activation' ? '#f59e0b' : '#94a3b8' }}
              >
                <Zap size={20} />
                <span style={{ fontSize: '10px', fontWeight: activeTab === 'activation' ? 700 : 500 }}>₹99 Pass</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: activeTab === 'profile' ? '#4f46e5' : '#94a3b8' }}
              >
                <User size={20} />
                <span style={{ fontSize: '10px', fontWeight: activeTab === 'profile' ? 700 : 500 }}>Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('onboarding')}
                style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', cursor: 'pointer', color: activeTab === 'onboarding' ? '#4f46e5' : '#94a3b8' }}
              >
                <Sparkles size={20} />
                <span style={{ fontSize: '10px', fontWeight: activeTab === 'onboarding' ? 700 : 500 }}>Wizard</span>
              </button>
            </div>

            {/* iPhone Home Indicator Bar */}
            <div style={{ position: 'absolute', bottom: '4px', left: '50%', transform: 'translateX(-50%)', width: '120px', height: '4px', background: '#0f172a', borderRadius: '9999px', zIndex: 60 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
