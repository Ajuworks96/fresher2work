# Fresher2Work — Real Live Production Project Specification

## 1. Executive Summary & Monorepo Architecture

Fresher2Work is an end-to-end verified proof-of-work hiring ecosystem connecting fresh graduates with corporate recruiters. It eliminates resume fraud by requiring verified proof-of-work (live demos, Figma prototypes, DaVinci/Premiere showreels, Meta Ads ROAS case studies) and locks hired candidates to maintain hiring exclusivity.

```
fresher2work/ (Root Workspace)
├── apps/
│   ├── recruiter-web/         # Next.js 15 (App Router) — Unified Recruiter & Super Admin Portal
│   │   ├── src/app/
│   │   │   ├── (auth)/        # Corporate Recruiter Login & Registration
│   │   │   ├── (dashboard)/   # Talent Discovery, Shortlists, Company Branding
│   │   │   ├── admin/         # Super Admin Multi-Domain Moderation & Placement Ledger
│   │   │   ├── api/v1/        # Standalone Serverless API Route Handlers
│   │   │   └── p/[slug]/      # Public Verified Candidate Portfolio Showcase
│   ├── admin-web/             # Standalone Next.js Super Admin Dashboard
│   ├── api/                   # Node.js / Express / Prisma / Supabase PostgreSQL Backend
│   │   ├── src/modules/       # Auth, Students, Discovery, Payments, Admin, Storage
│   │   └── prisma/            # Production Prisma Schema & Migrations
│   ├── mobile_flutter/        # Production Flutter (Dart) Android & iOS Mobile Application
│   │   ├── lib/core/          # ApiService, StorageService, Domain Constants
│   │   ├── lib/features/      # Auth, Onboarding, Home Feed, Proofs, Profile, ₹99 Activation
│   │   └── android/           # Native Android Gradle configuration, SDK 35, Java 17
│   └── mobile/                # React Native / Expo Candidate Application
├── packages/
│   ├── types/                 # Shared TypeScript domain models & enums
│   ├── ui-tokens/             # Design tokens, color palettes, spacing, typography
│   └── api-client/            # Shared isomorphic HTTP API client
└── Fresher2Work.apk           # Standalone Release Android APK
```

---

## 2. Live Production Deployments & Access Points

| Component | Target Platform | Live URL / Path | Access Credentials / Notes |
| :--- | :--- | :--- | :--- |
| **Recruiter Portal** | Vercel Serverless | `https://recruiter-web-ajuworks96s-projects.vercel.app` | Recruiter Email login / Discovery |
| **Super Admin Portal** | Vercel (Unified Sub-route) | `https://recruiter-web-ajuworks96s-projects.vercel.app/admin` | Email: `admin@freshertowork.com`<br>Password: `Admin@FresherToWork2026!` |
| **Public Candidate Showcase** | Vercel Serverless | `https://recruiter-web-ajuworks96s-projects.vercel.app/p/[slug]` | Shareable portfolio with PII protection |
| **Serverless API Engine** | Vercel Route Handlers | `https://recruiter-web-ajuworks96s-projects.vercel.app/api/v1` | Standalone zero-cold-start API |
| **PostgreSQL Database** | Supabase Cloud (AWS ap-southeast) | `aws-0-ap-southeast-2.pooler.supabase.com:5432` | SSL connection pooling with PgBouncer |
| **Candidate Mobile App (APK)** | Android Device | `Fresher2Work.apk` (Root Directory) | Installable on any Android 8.0+ smartphone |

---

## 3. Database Schema & Core Entities

The production database is managed via Prisma ORM on Supabase PostgreSQL:

- **`User`**: Authentication identities with roles (`STUDENT`, `RECRUITER`, `ADMIN`) and status flags.
- **`StudentProfile`**: Candidate headline, about, avatar, completion score, activation status (`isActivated`), and public slug.
- **`Project` & `ProjectMedia`**: Proof-of-work submissions including live demo URLs, GitHub repositories, Figma links, video assets, and verified skill tags.
- **`WorkSample`**: Specialized assets across graphic design, campaigns, and commercial videos.
- **`Education` & `Certificate`**: Verified academic history and professional certifications.
- **`ProfileActivation` & `Payment`**: Real-time ₹99 audit trail with Razorpay order and gateway IDs.
- **`PlacementRecord`**: Cryptographic lock linking placed candidate to hiring recruiter and company with package details (`isHired = true`).
- **`RecruiterProfile` & `Company`**: Corporate partner profiles, verification tier, and candidate shortlists.

---

## 4. Core Features & Business Workflows

### A. Candidate Proof-of-Work & Profile Activation
1. Candidates register on mobile, select their domain, and build their profile.
2. Freshers upload verifiable proof-of-work (live links, GitHub repos, Figma prototypes, commercial showreels).
3. The platform calculates completeness dynamically. Once the candidate reaches **>= 70% completeness**, the ₹99 Discovery Pass is unlocked.
4. Completing activation submits the profile into the Super Admin moderation queue.

### B. Super Admin Moderation & Exclusivity Control
1. Super Admin inspects candidate proofs in `/admin`.
2. Super Admin can **Approve** (marks candidate verified and visible to all recruiters), **Request Changes / Flag** (sends notification to candidate with corrective guidance), or **Reject**.
3. When a candidate is hired, the candidate profile is locked: other recruiters cannot view contact information or poach placed talent.

### C. Recruiter Discovery & Contact Unlock
1. Corporate recruiters search candidates with faceted filters (Domain, Skills, City, Activation Status).
2. Recruiters review proof-of-work previews and case study links.
3. Recruiters unlock contact details or extend hiring offers directly through the portal.

---

## 5. Production Environment Configuration

```env
# Server / API Environment (.env)
PORT=4000
NODE_ENV=production
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?sslmode=require&connection_limit=5&connect_timeout=30&pgbouncer=true"
JWT_SECRET=fresher2work-secure-jwt-secret-key-2026-prod
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
ACTIVATION_AMOUNT_PAISE=9900
CORS_ORIGIN=*

# Web Portals (Next.js)
NEXT_PUBLIC_API_URL=https://recruiter-web-ajuworks96s-projects.vercel.app

# Flutter Mobile App
API_URL=https://recruiter-web-ajuworks96s-projects.vercel.app/api/v1
```

---

## 6. Build & Maintenance Commands

```bash
# 1. Build all shared packages
npm run build:packages

# 2. Build Recruiter & Unified Admin Web Portal
npm run build:recruiter

# 3. Build Dedicated Admin Web Portal
npm run build:admin

# 4. Build Node.js Backend
npm run build --workspace=@fresher2work/api

# 5. Run Database Migrations
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

# 6. Build Android APK
cd apps/mobile_flutter && flutter build apk --release
```
