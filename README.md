# JobPulse AI — Autonomous Job Application Agent

A containerized autonomous AI Job Hunting Agent backed by **PostgreSQL 16**, built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, and Zustand.

---

## Key Features

1. **Agent Command Center (Dashboard)**
   - Live telemetry stream simulating real-time web scraping, ATS parsing, and application dispatches.
   - 5 KPI Metric Cards: Requisitions Discovered, Dispatched Applications, Avg ATS Fit, Active Interviews, and Secured Offers.
   - Autonomous Auto-Pilot loop toggle, instant cycle execution trigger, and tuning sliders.

2. **Requisition Radar & Signature Tailored Redline Diff**
   - 15 realistic pre-seeded job postings (Stripe, Airbnb, Vercel, Supabase, Datadog, Anthropic, Figma, Linear, Ramp, Cloudflare, OpenAI, Retool, GitHub, PostHog, Vanta) stored in PostgreSQL.
   - Real-time ATS match scoring with matched and missing skill indicators.
   - **Signature Redline Resume Diff**: Side-by-side or unified comparison showing additions (`+` in green), deletions (`-` in red), and ATS score gains (e.g. +18% improvement).
   - AI Cover Letter generator with copy-to-clipboard functionality.

3. **Applications Pipeline (Kanban & Table)**
   - 6-stage lifecycle tracking: `Discovered` → `Tailoring` → `Applied` → `Interviewing` → `Offer` → `Rejected`.
   - Interactive stage advancing/rewinding with real-time PostgreSQL database synchronization.
   - Comprehensive detail modal with event timeline, interview rounds, offer packages, and recruiter notes.
   - Toggleable between Kanban Board and searchable/sortable Data Table.

4. **Master Candidate Profile & Skills Taxonomy**
   - Editable candidate profile with quantified achievements stored in PostgreSQL relational tables.
   - Categorized skills matrix (Languages, Frontend, Distributed Systems, Cloud/DevOps) with interactive tag additions and deletions.

5. **Authentication & User Management**
   - User Registration and Login mechanisms with password hashing via `bcryptjs` and session tokens.
   - Pre-seeded demo account:
     - **Email**: `alex.rivera@systems.dev`
     - **Password**: `password123`
   - Easy switching between demo profile and newly registered accounts.

6. **PostgreSQL Relational Architecture**
   - Managed `postgres:16-alpine` service in Docker Compose.
   - Automatic database schema initialization and pre-seeding via `init.sql`.
   - Dedicated persistent volume (`postgres_data`).

---

## Running with Docker Compose (Recommended)

To launch the full stack (Next.js Standalone + PostgreSQL 16):

```bash
docker compose up --build -d
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To view logs:
```bash
docker compose logs -f
```

To stop all containers:
```bash
docker compose down
```

---

## Credentials (Out-of-the-Box Demo)

- **Demo Email**: `alex.rivera@systems.dev`
- **Demo Password**: `password123`
- Or click **Sign In / Register** in the top-right header to create a new profile!
