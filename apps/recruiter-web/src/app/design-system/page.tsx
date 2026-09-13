'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  SearchInput,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  FilterChip,
  VerificationBadge,
  Avatar,
  ProgressBar,
  CompletenessMeter,
  ProjectCard,
  CertificateCard,
  SkillChip,
  FileUploadZone,
  EmptyState,
  Skeleton,
  CandidateCardSkeleton,
  Modal,
  AlertBanner,
} from '@/components/ui';
import { SkillLevel } from '@fresher2work/types';

export default function DesignSystemGalleryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('React');
  const [loadingBtn, setLoadingBtn] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-12 max-w-7xl mx-auto">
      {/* Design System Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
            FresherToWork Design System
          </span>
          <span className="text-xs text-slate-400 font-mono">v1.0.0</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
          Component & Token Showcase
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visual personality: Premium, Warm, Confident, Professional, Friendly, Minimal.
        </p>
      </div>

      {/* 1. Buttons */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">1. Button Styles & Variants</h2>
        <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-xl border border-slate-200">
          <Button variant="primary">Primary Emerald</Button>
          <Button variant="secondary">Secondary Slate</Button>
          <Button variant="accent">Accent Indigo</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button
            variant="primary"
            isLoading={loadingBtn}
            onClick={() => {
              setLoadingBtn(true);
              setTimeout(() => setLoadingBtn(false), 1500);
            }}
          >
            {loadingBtn ? 'Loading...' : 'Click to Test Loading'}
          </Button>
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large CTA</Button>
        </div>
      </section>

      {/* 2. Inputs & Search */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">2. Inputs & Search Fields</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-xl border border-slate-200">
          <Input label="Candidate Email" placeholder="student@example.com" helperText="Your registered email address" />
          <Input label="Required Skills" error="Please enter at least 1 skill" placeholder="e.g. React, Node.js" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Talent Search Bar</label>
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue('')}
            />
          </div>
        </div>
      </section>

      {/* 3. Badges, Chips & Avatars */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">3. Badges, Chips & Avatars</h2>
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand" dot>Active Talent</Badge>
            <Badge variant="accent" dot>Recruiter Verified</Badge>
            <Badge variant="success">Payment Verified (₹99)</Badge>
            <Badge variant="warning">Under Review</Badge>
            <Badge variant="error">Suspended</Badge>
            <Badge variant="neutral">Draft</Badge>
            <VerificationBadge />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
            <FilterChip label="React" count={28} selected={selectedFilter === 'React'} onToggle={() => setSelectedFilter('React')} />
            <FilterChip label="TypeScript" count={24} selected={selectedFilter === 'TypeScript'} onToggle={() => setSelectedFilter('TypeScript')} />
            <FilterChip label="Python" count={19} selected={selectedFilter === 'Python'} onToggle={() => setSelectedFilter('Python')} />
            <FilterChip label="Remote" count={12} selected={selectedFilter === 'Remote'} onToggle={() => setSelectedFilter('Remote')} />
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
            <Avatar name="Rohan Sharma" size="xs" status="online" />
            <Avatar name="Pooja Nair" size="sm" status="verified" />
            <Avatar name="Aditya Verma" size="md" status="online" />
            <Avatar name="Anjali Menon" size="lg" status="verified" />
            <Avatar name="Vikram Joshi" size="xl" status="offline" />
          </div>
        </div>
      </section>

      {/* 4. Completeness & Progress */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">4. Progress & Completeness Meters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompletenessMeter
            score={85}
            missingSteps={['Add live demo URL to Project #1', 'Add college GPA details']}
          />
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Progress Bar Scales</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">Small Brand Progress (30%)</p>
                <ProgressBar value={30} size="sm" variant="brand" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Medium Accent Progress (70%)</p>
                <ProgressBar value={70} size="md" variant="accent" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Large Warning Progress (55%)</p>
                <ProgressBar value={55} size="lg" variant="warning" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Project & Certificate Cards */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">5. Project & Certificate Showcase Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCard
            title="TaskFlow — Real-Time Kanban Board"
            description="Engineered a real-time collaborative task board with drag-and-drop, presence avatars, and WebSocket synchronization."
            techStack={['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']}
            liveDemoUrl="https://taskflow-demo.vercel.app"
            githubRepoUrl="https://github.com/rohan/taskflow"
            mediaUrls={['https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80']}
          />
          <div className="space-y-4">
            <CertificateCard
              name="Meta Front-End Developer Professional Certificate"
              issuingOrganization="Meta via Coursera"
              issueDate="June 2024"
              credentialUrl="https://coursera.org"
            />
            <div className="flex flex-wrap gap-2">
              <SkillChip name="React" level={SkillLevel.ADVANCED} isVerified />
              <SkillChip name="TypeScript" level={SkillLevel.ADVANCED} isVerified />
              <SkillChip name="Python" level={SkillLevel.INTERMEDIATE} isVerified />
              <SkillChip name="Docker" level={SkillLevel.BEGINNER} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. File Upload & Empty States */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">6. File Upload Zone & Empty States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <FileUploadZone
              currentFileUrl="https://assets.fresher2work.com/cvs/rohan_cv.pdf"
              onFileSelect={(f) => alert(`Selected file: ${f.name}`)}
            />
          </div>
          <EmptyState
            title="No Candidates Found"
            description="No fresher candidates match the selected skill filters. Try selecting another technology."
            actionLabel="Reset Search Filters"
            onAction={() => alert('Reset filters')}
          />
        </div>
      </section>

      {/* 7. Loading Skeletons & Alerts */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">7. Loading Skeletons, Alerts & Modals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CandidateCardSkeleton />
          <div className="space-y-3">
            <AlertBanner type="success" title="Profile Activated!" message="Your profile has entered the active fresher talent discovery pool." />
            <AlertBanner type="warning" title="Incomplete Profile" message="Reach at least 70% completeness to enable ₹99 profile activation." />
            <AlertBanner type="error" title="Upload Failed" message="Only PDF documents up to 5MB are permitted." />
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open Interactive Modal Preview
            </Button>
          </div>
        </div>
      </section>

      {/* Modal Dialog Component */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Candidate Contact Details"
        description="Verified recruiter contact authorization."
        footer={
          <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
            Done
          </Button>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-700">
            Contact event logged under your verified recruiter account.
          </p>
          <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono">
            📧 Email: rohan.sharma.dev@gmail.com<br />
            📱 Phone: +91 98765 43210
          </div>
        </div>
      </Modal>
    </div>
  );
}
