# SkillsHub — AI-Powered Skills Intelligence Platform

SkillsHub uses Gemini AI to extract structured skills profiles from resumes and enables semantic natural-language talent search with AI-powered candidate ranking.

## Features

- **Smart Extraction** — Upload a PDF resume, Gemini 2.5 Pro extracts skills, projects, certifications with proficiency estimation. A second pass infers related skills (React -> JavaScript, Kubernetes -> Docker).
- **Semantic Search** — Type natural language queries like "React developer in Pune with 5+ years". Gemini parses the query, matches candidates from the database, and scores each with a specific reasoning sentence.
- **Review Queue** — HR reviews AI-extracted profiles before committing to the employee database. Edit fields inline, approve or reject.
- **Role-based Access** — HR sees dashboard, search, review queue, employee directory. Employees see their own profile and can upload resumes.
- **Responsive UI** — Mobile-friendly with navigation drawer, card layouts, and skeleton loading states.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui-style components
- **Backend**: Next.js API Routes, NextAuth.js (credentials provider)
- **Database**: Neon Postgres (serverless) + Prisma ORM
- **AI**: Google Gemini 2.5 Pro (extraction, ranking) + Gemini 2.5 Flash (inference, query parsing)
- **Validation**: Zod

## Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) Postgres database
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

## Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd SkillsHub
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in your `.env`:
   - `DATABASE_URL` — Neon pooled connection string
   - `DIRECT_URL` — Neon direct connection string
   - `GEMINI_API_KEY` — From Google AI Studio
   - `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — `http://localhost:3000` for local dev

3. **Push database schema**
   ```bash
   npx prisma db push
   ```

4. **Seed demo data**
   ```bash
   npm run db:seed
   ```

5. **Start dev server**
   ```bash
   npm run dev
   ```

## Demo Logins

| Role     | Email          | Password |
|----------|----------------|----------|
| HR       | hr@demo.com    | demo1234 |
| Employee | dev@demo.com   | demo1234 |

## Vercel Deployment

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add the Neon integration (auto-sets `DATABASE_URL`)
4. Add environment variables: `GEMINI_API_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
5. Build command is already configured: `prisma generate && next build`
6. After first deploy, run `npx prisma db push` and `npm run db:seed` locally against the Neon production URL

## Project Structure

```
/src
  /app
    /(auth)/login, /signup        — Authentication pages
    /(hr)/dashboard, /search,     — HR-only pages
         /review-queue, /employees
    /(employee)/profile, /upload  — Employee pages
    /api/extract                  — Resume PDF -> structured profile (Gemini)
    /api/search                   — NL query -> ranked candidates (Gemini)
    /api/profiles                 — Employee CRUD
    /api/review                   — Approve/reject extracted profiles
  /lib
    /gemini.ts                    — Gemini client wrapper
    /prompts.ts                   — Versioned system prompts
    /schemas.ts                   — Gemini responseSchema definitions
    /skill-taxonomy.ts            — Canonical skill list + categories
    /db.ts                        — Prisma client singleton
    /auth.ts                      — NextAuth configuration
  /components                     — UI components (shadcn/ui style)
/prisma
  /schema.prisma                  — Database schema
  /seed.ts                        — 12 realistic employee profiles
```
