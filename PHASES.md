# ProjectDNA — Build Phases

> **Stack**: Next.js 16 · @clerk/nextjs · Neon (Postgres) · Drizzle ORM · Google Gemini API · Vanilla CSS
> **Working dir**: `d:/work/ProjectDNA/my-clerk-next-app/`
> **Dev server**: `http://localhost:3000`

---

## Legend
- `[ ]` Not started
- `[/]` In progress
- `[x]` Done ✅

---

## Phase 0 — Foundation ✅ (Complete)
- [x] Next.js 16 project scaffolded
- [x] Clerk CLI installed & authenticated (`cskewale8@gmail.com`)
- [x] Clerk linked to app **ProjectDNA** (`app_3ItZPrU66sQ7hmPBN5IBzmpLMkr`)
- [x] `.env.local` written with `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`
- [x] Sign-in / Sign-up routes scaffolded (`app/sign-in/`, `app/sign-up/`)
- [x] `proxy.ts` — Clerk middleware + `/__clerk/:path*` matcher verified
- [x] `clerk doctor` — all checks green
- [x] Dev server running at `localhost:3000`

---

## Phase 1 — Design System & Global Styles ✅ (Complete)
> **Goal**: A stunning dark-mode design system. Every page that follows inherits from this.

- [x] Replace `app/globals.css` with full design system:
  - Color tokens (deep navy bg, electric violet primary, cyan accent, glass surfaces)
  - Typography scale (Inter + Space Grotesk from Google Fonts)
  - CSS custom properties for spacing, radius, shadows
  - Glassmorphism card utility (`.glass-card`)
  - Gradient button utilities (`.btn-primary`, `.btn-ghost`)
  - Smooth animation keyframes (fadeIn, slideUp, pulse-glow)
  - Scrollbar styling, selection color
- [x] Update `app/layout.tsx`:
  - Import Google Fonts
  - Verify `<ClerkProvider>` wrapping
  - Add global `<Navbar>` component
- [x] Create `components/ui/Navbar.tsx`:
  - Logo + nav links
  - Clerk `<SignInButton>`, `<SignUpButton>`, `<UserButton>` with `<Show>` guards
  - Sticky + glassmorphism style
- [x] Create `components/ui/Button.tsx` — primary / ghost / danger variants
- [x] Create `components/ui/Card.tsx` — glass card wrapper
- [x] Create `components/ui/Badge.tsx` — colored tag/badge component
- [x] Create `components/ui/Chip.tsx` — skill/tech chip
- [x] Create `components/ui/Input.tsx` — styled form input
- [x] Create `components/ui/Modal.tsx` — overlay modal
- [x] Create `components/ui/Avatar.tsx` — user avatar with fallback initials
- [x] Create `components/ui/ScoreBar.tsx` — animated horizontal progress bar
- [x] Create `components/ui/PageLayout.tsx` — page wrapper with sidebar slot

**Done when**: `localhost:3000` shows a polished dark navbar with Clerk sign-in/sign-up buttons.

---

## Phase 2 — Database Setup (Neon + Drizzle ORM) ✅ (Complete)
> **Goal**: Full database schema defined, migrations run, DB client ready.

- [x] Add `DATABASE_URL` placeholder / client config ready for Neon
- [x] Install: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`
- [x] Create `lib/db/index.ts` — Neon + Drizzle client
- [x] Create `lib/db/schema.ts` — all tables:
  - `users` — (id, clerkId, email, name, username, avatarUrl, onboardingComplete, createdAt)
  - `developer_profiles` — (userId, bio, role, experience, skills[], techStack[], interests[], hoursPerWeek, availabilityStatus, college, organization)
  - `working_styles` — (userId, workTiming, workApproach, workPace, communicationStyle, teamPreference)
  - `projects` — (id, ownerId, name, slug, description, category, duration, deadline, teamSize, techPreferences[], visibility, status, createdAt)
  - `project_dna` — (projectId, summary, domain, difficulty, recommendedTeamSize, requiredRoles JSON, requiredSkills JSON, generatedAt)
  - `invitations` — (id, fromUserId, toUserId, projectId, status, matchScore, createdAt)
  - `project_members` — (id, projectId, userId, role [admin/member/viewer], joinedAt)
- [x] Create `drizzle.config.ts`
- [x] Run `npx drizzle-kit generate` (Migration `0000_jittery_bushwacker.sql` generated)
- [x] Create `lib/db/queries/` typed query helpers:
  - `users.ts` — getUserByClerkId, upsertUser
  - `profiles.ts` — getProfile, upsertProfile, upsertWorkingStyle
  - `projects.ts` — createProject, getProjectById, listPublicProjects, getUserProjects
  - `invitations.ts` — createInvitation, getUserInvitations, updateInvitationStatus
  - `members.ts` — addMember, getProjectMembers, getMemberRole

**Done when**: Migration files generated & Drizzle queries exported.

---

## Phase 3 — Clerk Webhook → User Sync
> **Goal**: Every new Clerk sign-up automatically creates a `users` row in Neon.

- [ ] Add `CLERK_WEBHOOK_SECRET` to `.env.local`
- [ ] Install `svix` (Clerk webhook verification)
- [ ] Create `app/api/webhooks/clerk/route.ts`:
  - Verify Svix signature
  - Handle `user.created` → insert into `users` table
  - Handle `user.updated` → update name/avatar
- [ ] Configure webhook endpoint in Clerk Dashboard → `{ngrok_url}/api/webhooks/clerk`
- [ ] Test: sign up a new user → confirm `users` row created in DB

**Done when**: New Clerk signup → row appears in Neon `users` table.

---

## Phase 4 — Onboarding Wizard (5 Steps)
> **Goal**: After first sign-up, user is guided through profile setup before accessing the app.

- [ ] Create `app/onboarding/page.tsx` — multi-step wizard shell with step indicator
- [ ] **Step 1 — Basic Info**: name, username (auto-slug), college/org, bio
- [ ] **Step 2 — Professional Info**: primary role, experience level, skills (tag input), tech stack, interests (checkboxes)
- [ ] **Step 3 — Availability**: hours/week (slider), full-time/part-time toggle, current status
- [ ] **Step 4 — Working Style** (5 card selectors):
  - Work Timing: Morning 🌅 / Afternoon ☀️ / Night 🌙 / Flexible 🕐
  - Work Approach: Structured 📋 / Flexible 🌊
  - Work Pace: Fast-paced ⚡ / Balanced ⚖️ / Detail-oriented 🔍
  - Communication: Daily 💬 / Weekly 📅 / Async 📨
  - Team Role: Leader 👑 / Collaborative 🤝 / Independent 🧑‍💻
- [ ] **Step 5 — Preview**: public profile preview + "Finish & Launch" button
- [ ] `app/api/onboarding/route.ts` — POST: save profile + working style, set `onboardingComplete = true`
- [ ] Middleware redirect: `onboardingComplete = false` → `/onboarding`

**Done when**: Full 5-step flow saves to DB and redirects to dashboard.

---

## Phase 5 — Public Pages
> **Goal**: Landing page, Explore Projects, Public Developer Profiles — no login required.

### 5a — Landing Page (`app/page.tsx`)
- [ ] Hero section: animated headline, sub-copy, CTA buttons
- [ ] Animated "Project DNA" network visualization (CSS + canvas)
- [ ] Feature highlights: 3-column grid
- [ ] "How It Works" — 3-step visual
- [ ] Stats bar with animated counters
- [ ] Footer

### 5b — Explore Projects (`app/explore/page.tsx`)
- [ ] Fetch all public projects from DB
- [ ] Project cards: name, domain, description, skills, team size, deadline
- [ ] Filter sidebar: domain, tech stack, team size
- [ ] Search bar (client-side filter)

### 5c — Public Developer Profile (`app/profile/[username]/page.tsx`)
- [ ] Avatar, name, role badge, bio
- [ ] Skills + tech stack chips
- [ ] Working style cards
- [ ] Availability status pill
- [ ] Active projects section

**Done when**: All 3 pages load with real data and look stunning without login.

---

## Phase 6 — Authenticated Dashboard
> **Goal**: Central hub after login — shows all user activity.

- [ ] Protect `/dashboard` with `auth.protect()`
- [ ] `app/dashboard/page.tsx` — 4 sections:
  - **My Projects** — cards with status, team fill, "Manage" button
  - **My Teams** — projects where user is a member
  - **Pending Invitations** — count badge + quick accept/reject
  - **Recommended Projects** — top 3 matching user profile
- [ ] Empty states for all sections
- [ ] Quick-action sidebar: Create Project, Find Projects, Edit Profile

**Done when**: Dashboard loads with real data, all sections functional.

---

## Phase 7 — Project Creation + AI Analyzer
> **Goal**: User creates a project and AI instantly structures it into Project DNA.

### 7a — Create Project Form (`app/create-project/page.tsx`)
- [ ] Step 1: name, description, category
- [ ] Step 2: duration, deadline, team size
- [ ] Step 3: preferred tech, visibility (public/private)
- [ ] "Analyze with AI ✨" button + loading animation
- [ ] Preview AI result before confirming save

### 7b — AI Analyzer (`app/api/ai/analyze-project/route.ts`)
- [ ] Install `@google/generative-ai`
- [ ] POST: receives project name + description
- [ ] Gemini structured prompt → JSON output:
  - summary, domain, difficulty, recommendedTeamSize, requiredRoles[]
- [ ] Save `project_dna` record to DB

**Done when**: Create project → AI returns structured DNA → saved to DB.

---

## Phase 8 — Project DNA Dashboard
> **Goal**: Rich visual breakdown of AI-generated project profile.

- [ ] `app/project/[projectId]/page.tsx`:
  - Domain badge + difficulty pill
  - Project summary card
  - Animated SVG donut chart — role composition
  - Required roles cards with skill chips
  - Team fill progress bar
  - "Find Candidates" CTA
- [ ] `app/project/[projectId]/layout.tsx` — sub-nav (Overview / Match / Team / Workspace)
- [ ] Public projects viewable by all; private by members only

**Done when**: DNA page renders all AI data with rich visuals.

---

## Phase 9 — Smart Matching System
> **Goal**: AI-powered candidate ranking with per-category compatibility.

- [ ] `app/api/ai/match-candidates/route.ts`:
  - Skills Match 40% — Jaccard similarity
  - Interest Match 20% — overlap count
  - Working Style Match 20% — preference alignment
  - Availability Match 20% — hours + status
  - Return top 20 ranked candidates
- [ ] `app/project/[projectId]/match/page.tsx`:
  - Ranked candidate cards with overall % badge
  - Per-category score bars
  - "View Profile" + "Send Invite" buttons
  - Role filter dropdown
  - Already-invited candidates highlighted

**Done when**: Match page shows ranked candidates with correct scores; invite button works.

---

## Phase 10 — Invitations
> **Goal**: Full send/receive/accept/reject flow.

- [ ] `app/api/invitations/route.ts` — POST (create), GET (list)
- [ ] `app/api/invitations/[id]/route.ts` — PATCH (accept/reject)
- [ ] `app/invitations/page.tsx`:
  - Received tab: project info, sender, match %, accept/reject
  - Sent tab: outgoing with status badge
- [ ] On accept: insert row into `project_members` (role = member)
- [ ] Navbar notification dot for pending invitations

**Done when**: Full invite flow works end-to-end.

---

## Phase 11 — Team Workspace (Private)
> **Goal**: Private project workspace, access-controlled by membership.

- [ ] `lib/auth/workspace-guard.ts` — check `project_members` for current user
- [ ] `app/workspace/[projectId]/layout.tsx` — sidebar nav shell
- [ ] `app/workspace/[projectId]/page.tsx` — **Overview** (stats, activity)
- [ ] `app/workspace/[projectId]/team/page.tsx` — **Team** (members, roles, admin controls)
- [ ] `app/workspace/[projectId]/dna/page.tsx` — **DNA** (editable by Admin)
- [ ] `app/workspace/[projectId]/tasks/page.tsx` — **Tasks** (Kanban: To Do / In Progress / Done)
- [ ] `app/workspace/[projectId]/progress/page.tsx` — **Progress** (milestones, completion %)
- [ ] `app/workspace/[projectId]/resources/page.tsx` — **Resources** (links, GitHub, docs)

**Done when**: Workspace loads for members only; tasks and team management work.

---

## Phase 12 — Stretch Features
> **Goal**: Advanced AI insights and placeholder scaffolds.

### 12a — Team Gap Analysis
- [ ] `app/api/ai/team-gap/route.ts` — coverage % per role + AI text insight
- [ ] `app/workspace/[projectId]/gap-analysis/page.tsx` — coverage bars + AI recommendation

### 12b — AI Team Health Score
- [ ] `app/api/ai/team-health/route.ts` — composite 0–100 score
- [ ] `app/workspace/[projectId]/health/page.tsx` — animated SVG gauge + sub-scores

### 12c — Placeholder Scaffolds
- [ ] `app/workspace/[projectId]/github/page.tsx` — "GitHub integration coming soon"
- [ ] `app/workspace/[projectId]/chat/page.tsx` — "Real-time chat coming soon"

---

## Environment Variables Checklist

```env
# Already in .env.local ✅
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Still needed ⬜
CLERK_WEBHOOK_SECRET=...
DATABASE_URL=...           # from neon.tech
GEMINI_API_KEY=...         # from aistudio.google.com
```

---

## Build Order Summary

| Phase | Feature | Status |
|-------|---------|--------|
| 0 | Bootstrap + Clerk Auth | ✅ Done |
| 1 | Design System + UI Components | ✅ Done |
| 2 | Database Schema + Drizzle | ✅ Done |
| 3 | Clerk Webhook → User Sync | ⬜ Next |
| 4 | Onboarding Wizard (5 Steps) | ⬜ |
| 5 | Public Pages (Landing, Explore, Profile) | ⬜ |
| 6 | Authenticated Dashboard | ⬜ |
| 7 | Project Creation + AI Analyzer | ⬜ |
| 8 | Project DNA Dashboard | ⬜ |
| 9 | Smart Matching System | ⬜ |
| 10 | Invitations | ⬜ |
| 11 | Team Workspace | ⬜ |
| 12 | Stretch Features | ⬜ |
