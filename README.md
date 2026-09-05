<![CDATA[<div align="center">

# 🧬 ProjectDNA

**AI-Powered Developer-Project Matching Platform**

_Find your perfect team. Build something extraordinary._

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk)](https://clerk.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev)
[![Neon](https://img.shields.io/badge/Neon-Postgres-00E699?logo=postgresql)](https://neon.tech)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F)](https://orm.drizzle.team)

</div>

---

## 📖 What is ProjectDNA?

**ProjectDNA** is an AI-powered platform that matches developers to projects based on their unique "Developer DNA" — a composite profile built from their skills, working style, tech preferences, and availability.

Think of it as a **Tinder for developers and side-projects**: project owners describe what they're building, and our AI analyzes the project requirements, identifies skill gaps, and recommends the best-fit developers from the community — ranked by a **DNA Match Score**.

### The Problem

Finding the right collaborators for a project is hard:
- Developers waste hours browsing job boards that don't understand their working style.
- Project owners post listings and pray someone with the right skills shows up.
- Team fit goes beyond just technical skills — timezone, communication style, and work pace matter just as much.

### The Solution

ProjectDNA solves this with a **three-layer matching engine**:

1. **Developer DNA Profiling** — Captures skills, experience, tech stack, working style (async vs sync, morning vs night owl, fast-paced vs methodical), and availability.
2. **Project DNA Analysis** — AI breaks down a project description into required roles, skills, difficulty level, and ideal team composition.
3. **AI Match Scoring** — Gemini AI cross-references developer profiles against project requirements and outputs a match score (0-100%) with explanations.

---

## ✨ Features

### 🔐 Authentication & User Management (Powered by Clerk)
- Secure sign-up / sign-in with email, Google, GitHub, and more
- Persistent user sessions across the platform
- Webhook-based user sync between Clerk and the database
- Protected routes with middleware-level authentication
- User profile management with avatar, bio, and settings

### 🧬 Developer DNA Onboarding
- Multi-step onboarding wizard capturing:
  - **Role & Experience** — Frontend, Backend, Fullstack, DevOps, AI/ML, etc.
  - **Skills & Tech Stack** — Languages, frameworks, databases, cloud platforms
  - **Working Style** — Async/sync preference, communication style, work pace
  - **Availability** — Hours per week, timezone, project commitment level

### 🚀 Project Creation & Management
- Rich project creation form with category, duration, tech preferences, and team size
- AI-powered **Project DNA Analysis** — instantly breaks down project requirements into:
  - Required roles with skill expectations
  - Difficulty assessment
  - Recommended team composition
- Public project discovery for the community

### 🤖 AI-Powered Features (Gemini AI)
- **Smart Candidate Matching** — AI analyzes the developer pool and ranks candidates by fit
- **Project DNA Analysis** — Auto-generates a project breakdown from description
- **Team Gap Analysis** — Identifies missing skills and roles in your current team
- **Team Health Score** — AI evaluates team balance, skill coverage, and collaboration potential

### 👥 Team Collaboration
- **Invitation System** — Send invitations to developers via email
- **Accept/Decline Workflow** — Recipients can accept and auto-join the project team
- **Real-time Team Roster** — View current team members with roles and join dates
- **Role-Based Access** — Admin, Member, and Viewer roles per project

### 🏗️ Project Workspace
Each project gets a full workspace with:
- **Overview Dashboard** — Project stats and team summary
- **DNA Insights** — AI-generated project analysis and role requirements
- **Team Management** — View, invite, and manage team members
- **Task Board** — Track project tasks and progress
- **Gap Analysis** — AI identifies skill gaps in your current team
- **Team Health** — AI-evaluated team health score and recommendations
- **Resources** — Shared project resources and links
- **Chat** — Team communication hub
- **GitHub Integration** — Connect and track repository activity
- **Progress Tracking** — Visual progress indicators and milestones

### 🔍 Explore & Discover
- Browse all public projects on the platform
- Search and filter by category, tech stack, and team size
- View project details, required roles, and DNA match scores
- One-click apply to join interesting projects

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│          Next.js 16 (App Router + RSC)           │
│     React 19 · CSS Modules · Turbopack          │
└─────────────────┬──────────────┬────────────────┘
                  │              │
          ┌───────▼──────┐  ┌───▼────────────┐
          │  Clerk Auth  │  │  API Routes    │
          │  Middleware   │  │  /api/*        │
          │  Webhooks     │  │                │
          └───────┬──────┘  └───┬────────────┘
                  │             │
          ┌───────▼─────────────▼──────────┐
          │         Drizzle ORM            │
          │    Type-safe query builder     │
          └───────────────┬────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │      Neon Serverless Postgres  │
          │   (Users, Projects, Members,   │
          │    Invitations, DNA Profiles)  │
          └────────────────────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │       Google Gemini AI         │
          │  (Matching, Analysis, Scoring) │
          └────────────────────────────────┘
```

---

## 🔑 Clerk — The Authentication Hero

[Clerk](https://clerk.com) is the **backbone of ProjectDNA's identity layer**. Here's how it powers the platform:

### Why Clerk?

| Capability | How ProjectDNA Uses It |
|---|---|
| **Pre-built Auth UI** | Beautiful sign-in/sign-up pages with zero custom UI code — supports email, Google, GitHub out of the box |
| **Middleware Protection** | `clerkMiddleware` protects all routes except public ones (`/`, `/sign-in`, `/sign-up`, `/explore`). One file, full security |
| **Server-Side Auth** | `auth()` and `currentUser()` in API routes — instantly know who's making the request with zero boilerplate |
| **Webhook Sync** | On user creation/update, Clerk fires webhooks to `/api/webhooks` which syncs user data into our Neon database via Svix |
| **Session Management** | Persistent sessions, automatic token refresh, and cross-tab sync handled automatically |
| **User Metadata** | Avatar URLs, email addresses, and display names flow directly from Clerk into the app |

### Clerk Integration Points

```
proxy.ts (Middleware)
├── clerkMiddleware() — Protects all non-public routes
├── createRouteMatcher() — Defines public routes
│
app/api/webhooks/route.ts
├── Svix webhook verification
├── user.created → upsertUser() in Neon DB
├── user.updated → sync profile changes
│
app/api/invitations/route.ts
├── auth() — Get current user's Clerk ID
├── currentUser() — Fetch full Clerk profile
├── getOrSyncUser() — Ensure Clerk user exists in DB
│
app/api/projects/route.ts
├── auth() — Verify project ownership
├── getUserByClerkId() — Map Clerk ID → DB UUID
│
components/ui/Navbar.tsx
├── <UserButton /> — Clerk's pre-built user menu
├── <SignInButton /> / <SignOutButton />
```

### The Clerk → Database Sync Flow

```
1. User signs up via Clerk UI
2. Clerk fires webhook → /api/webhooks
3. Svix verifies webhook signature
4. upsertUser() creates/updates record in Neon
5. User gets a DB UUID linked to their Clerk ID
6. All subsequent API calls use auth() → clerkId → DB UUID
```

This means **every user who authenticates through Clerk automatically gets a database identity**, enabling seamless project creation, invitations, and team membership.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | Full-stack React framework with Server Components |
| **Runtime** | [React 19](https://react.dev) | UI rendering with latest concurrent features |
| **Auth** | [Clerk](https://clerk.com) | Authentication, user management, and session handling |
| **AI** | [Google Gemini AI](https://ai.google.dev) | Project analysis, candidate matching, team health scoring |
| **Database** | [Neon](https://neon.tech) | Serverless Postgres with autoscaling |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe SQL query builder |
| **Webhooks** | [Svix](https://svix.com) | Secure webhook delivery and verification |
| **Styling** | CSS Modules | Scoped, maintainable component styles |
| **Bundler** | [Turbopack](https://turbo.build/pack) | Blazing-fast Next.js development bundler |
| **Language** | TypeScript 5 | End-to-end type safety |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- A [Clerk](https://clerk.com) account (free tier works)
- A [Neon](https://neon.tech) database (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key (for Gemini)

### 1. Clone the Repository

```bash
git clone https://github.com/ChaitanyaKewale/ProjectDNA.git
cd ProjectDNA/my-clerk-next-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxxxx

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Neon Database
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/projectdna?sslmode=require

# Google Gemini AI
GEMINI_API_KEY=AIzaSyxxxxx
```

### 4. Set Up the Database

Push the Drizzle schema to your Neon database:

```bash
npx drizzle-kit push
```

### 5. Configure Clerk Webhooks

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com) → **Webhooks**
2. Add a new endpoint: `https://your-domain.com/api/webhooks`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the signing secret to `CLERK_WEBHOOK_SIGNING_SECRET`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start building your dream team! 🎉

---

## 📁 Project Structure

```
my-clerk-next-app/
├── app/
│   ├── page.tsx                    # Landing page with DNA animation
│   ├── layout.tsx                  # Root layout with ClerkProvider
│   ├── globals.css                 # Global design system
│   ├── sign-in/                    # Clerk sign-in page
│   ├── sign-up/                    # Clerk sign-up page
│   ├── onboarding/                 # Developer DNA onboarding wizard
│   ├── dashboard/                  # Main dashboard with project overview
│   ├── create-project/             # Project creation form
│   ├── explore/                    # Public project discovery
│   ├── invitations/                # Invitation management (send/receive)
│   ├── profile/                    # User profile page
│   ├── project/[id]/               # Public project detail view
│   ├── workspace/[projectId]/      # Full project workspace
│   │   ├── dna/                    # AI project DNA analysis
│   │   ├── team/                   # Team roster management
│   │   ├── tasks/                  # Task board
│   │   ├── gap-analysis/           # AI skill gap detection
│   │   ├── health/                 # AI team health score
│   │   ├── chat/                   # Team chat
│   │   ├── github/                 # GitHub integration
│   │   ├── resources/              # Shared resources
│   │   └── progress/               # Progress tracking
│   └── api/
│       ├── webhooks/               # Clerk webhook handler (Svix)
│       ├── projects/               # CRUD for projects
│       ├── invitations/            # Send, receive, accept/reject invitations
│       └── ai/
│           ├── analyze-project/    # AI project DNA analysis
│           ├── match-candidates/   # AI developer matching
│           ├── team-gap/           # AI team gap analysis
│           └── team-health/        # AI team health scoring
├── components/
│   └── ui/                         # Reusable UI components
├── lib/
│   └── db/
│       ├── index.ts                # Neon + Drizzle connection
│       ├── schema.ts               # Database schema (7 tables)
│       └── queries/                # Type-safe query functions
│           ├── users.ts            # User CRUD
│           ├── members.ts          # Project membership
│           ├── invitations.ts      # Invitation management
│           └── projects.ts         # Project queries
├── proxy.ts                        # Clerk middleware configuration
├── drizzle.config.ts               # Drizzle Kit configuration
└── package.json
```

---

## 🗄️ Database Schema

ProjectDNA uses **7 core tables** managed by Drizzle ORM:

| Table | Purpose |
|---|---|
| `users` | Synced from Clerk — stores clerkId, email, name, avatar |
| `developer_profiles` | Skills, tech stack, experience, availability |
| `working_styles` | Work timing, communication style, team preferences |
| `projects` | Project details — name, description, category, tech, team size |
| `project_dna` | AI-generated analysis — required roles, skills, difficulty |
| `invitations` | Cross-user invitations with match scores and messages |
| `project_members` | RBAC membership — links users to projects with roles |

---

## 🔄 How It Works — End to End

```
1. SIGN UP        → Clerk handles auth → Webhook syncs user to Neon DB
2. ONBOARDING     → Multi-step wizard builds your Developer DNA profile
3. CREATE PROJECT  → Describe your project → AI generates Project DNA
4. FIND MATCHES   → AI scans developer pool → Ranks by DNA Match Score
5. SEND INVITES   → Invite top matches by email → They see it in their inbox
6. ACCEPT & JOIN  → Developer accepts → Auto-added to project_members
7. COLLABORATE    → Full workspace: tasks, chat, GitHub, progress tracking
```

---

## 📜 License

This project is part of the **Clerk + Neon Hackathon** submission.

---

<div align="center">

**Built with 💜 using Clerk, Neon, Gemini AI, and Next.js**

[⭐ Star this repo](https://github.com/ChaitanyaKewale/ProjectDNA) if you found it interesting!

</div>
]]>
