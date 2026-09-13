# Deployment & Vercel Guide - Fresher2Work

## 1. Overview
Fresher2Work is a full-stack monorepo consisting of:
- **`apps/recruiter-web`**: Next.js (App Router) portal for recruiters to discover verified talent, manage shortlists, unlock contact details, and hire candidates with exclusive access control.
- **`apps/admin-web`**: Next.js (App Router) Super Admin portal for moderating candidate proof-of-work (UI/UX, Digital Marketing, Video Editing, Software Development), managing companies, recruiters, and viewing placement analytics.
- **`apps/api`**: Node.js / Express / Prisma / PostgreSQL REST API backend.
- **`apps/mobile`**: React Native / Expo mobile app for candidates to complete challenges, upload proof-of-work, and track applications.
- **`packages/*`**: Shared TypeScript packages (`@fresher2work/types`, `@fresher2work/ui-tokens`, `@fresher2work/api-client`).

---

## 2. Deploying Web Apps to Vercel

Both `apps/recruiter-web` and `apps/admin-web` can be deployed to Vercel directly from the GitHub repository (`https://github.com/Ajuworks96/fresher2work.git`).

### Option A: Via Vercel Dashboard (Recommended)

#### 1. Deploy Recruiter Web (`apps/recruiter-web`)
1. Log into your [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
2. Import the Git repository: `https://github.com/Ajuworks96/fresher2work.git`.
3. In the project configuration:
   - **Project Name**: `fresher2work-recruiter`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click "Edit" and choose `apps/recruiter-web`.
   - **Include files outside the Root Directory**: Checked (Enabled by default for monorepo resolution).
   - **Build Command**: `npm run build:recruiter` (or leave default `npm run build` as `transpilePackages` is enabled).
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed API (e.g. `https://api.yourdomain.com` or backend server URL).
5. Click **Deploy**.

#### 2. Deploy Super Admin Web (`apps/admin-web`)
1. In Vercel Dashboard, click **"Add New Project"**.
2. Select the same Git repository (`fresher2work`).
3. In the project configuration:
   - **Project Name**: `fresher2work-admin`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click "Edit" and choose `apps/admin-web`.
   - **Include files outside the Root Directory**: Checked.
   - **Build Command**: `npm run build:admin` (or default `npm run build`).
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: URL of your deployed API.
5. Click **Deploy**.

---

### Option B: Via Vercel CLI

You can also deploy directly from your local terminal using the Vercel CLI:

```bash
# To deploy Recruiter Web
npx vercel apps/recruiter-web --prod

# To deploy Admin Web
npx vercel apps/admin-web --prod
```

---

## 3. Backend API Deployment
The API (`apps/api`) can be deployed to any Node.js container or cloud platform (Render, Railway, Fly.io, AWS ECS, DigitalOcean, or Vercel Serverless Function):

- **Build**: `npm run build --workspace=@fresher2work/api`
- **Start**: `npm run start --workspace=@fresher2work/api`
- **Database Migrations**: `npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma`
- **Required Env Variables**:
  - `DATABASE_URL`: PostgreSQL connection string.
  - `JWT_SECRET`: Secure random string.
  - `PORT`: Server port (defaults to 4000).
  - `CORS_ORIGIN`: Allowed origins (e.g. `https://fresher2work-recruiter.vercel.app,https://fresher2work-admin.vercel.app`).
