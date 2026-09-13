# Deployment & Vercel Guide - Fresher2Work

## 1. Overview
Fresher2Work is a full-stack monorepo consisting of:
- **`apps/recruiter-web`**: Next.js (App Router) portal for recruiters to discover verified talent, manage shortlists, unlock contact details, and hire candidates with exclusive access control.
- **`apps/admin-web`**: Next.js (App Router) Super Admin portal for moderating candidate proof-of-work (UI/UX, Digital Marketing, Video Editing, Software Development), managing companies, recruiters, and viewing placement analytics.
- **`apps/api`**: Node.js / Express / Prisma / PostgreSQL REST API backend.
- **`apps/mobile`**: React Native / Expo mobile app for candidates to complete challenges, upload proof-of-work, and track applications.
- **`packages/*`**: Shared TypeScript packages (`@fresher2work/types`, `@fresher2work/ui-tokens`, `@fresher2work/api-client`).

---

## 2. Deploying Single Unified Web App to Vercel (Recommended)

You do **NOT** need two separate Vercel projects or two separate URLs! 
Everything is unified under a single Next.js deployment (`apps/recruiter-web`):

| Portal | URL Path | Description |
| :--- | :--- | :--- |
| **Recruiter Portal** | `/discover`, `/shortlists`, `/company` | Talent discovery, locked profile protection, contact unlocks, hire workflow |
| **Super Admin Portal** | **`/admin`** (Sub-directory) | Full candidate moderation, multi-domain proof of work inspection (UI/UX, Marketing, Video, Software), recruiter and placement management |
| **Talent Portfolio** | `/p/[slug]` | Public candidate verified profile |

### Step-by-Step Vercel Setup (Single URL):
1. Go to your [Vercel Dashboard](https://vercel.com).
2. Select your project **`fresher2work-recruiter`** (or import `https://github.com/Ajuworks96/fresher2work.git`).
3. Set **Root Directory** to: `apps/recruiter-web`.
4. Ensure **Include files outside the Root Directory** is checked.
5. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g. `https://api.yourdomain.com` or local backend).
6. Click **Deploy**.

Once deployed:
- Point your custom domain or subdomain (e.g. `https://recruiter.yourdomain.com` or `https://app.yourdomain.com`).
- Recruiter portal is at `https://recruiter.yourdomain.com`
- Super Admin portal is directly at `https://recruiter.yourdomain.com/admin`!

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
