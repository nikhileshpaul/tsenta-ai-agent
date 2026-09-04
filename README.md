# Tsenta AI — Standalone Autonomous Job Application Agent

A containerized clone of the **Tsenta AI Job Application Agent**, built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, and Zustand with local storage persistence.

---

## Key Features

1. **Agent Command Center (Dashboard)**
   - Live telemetry stream simulating real-time web scraping, ATS parsing, and application dispatches.
   - 5 KPI Metric Cards: Requisitions Discovered, Dispatched Applications, Avg ATS Fit, Active Interviews, and Secured Offers.
   - Autonomous Auto-Pilot loop toggle, instant cycle execution trigger, and tuning sliders.

2. **Requisition Radar & Signature Tailored Redline Diff**
   - 15 realistic pre-seeded job postings (Stripe, Airbnb, Vercel, Supabase, Datadog, Anthropic, Figma, Linear, Ramp, Cloudflare, OpenAI, Retool, GitHub, PostHog, Vanta).
   - Real-time ATS match scoring with matched and missing skill indicators.
   - **Signature Redline Resume Diff**: Side-by-side or unified comparison showing additions (`+` in green), deletions (`-` in red), and ATS score gains (e.g. +18% improvement).
   - AI Cover Letter generator with copy-to-clipboard functionality.

3. **Applications Pipeline (Kanban & Table)**
   - 6-stage lifecycle tracking: `Discovered` → `Tailoring` → `Applied` → `Interviewing` → `Offer` → `Rejected`.
   - Interactive stage advancing/rewinding.
   - Comprehensive detail modal with event timeline, interview rounds, offer packages, and recruiter notes.
   - Toggleable between Kanban Board and searchable/sortable Data Table.

4. **Master Candidate Profile & Skills Taxonomy**
   - Editable candidate profile with quantified achievements.
   - Categorized skills matrix (Languages, Frontend, Distributed Systems, Cloud/DevOps) with interactive tag additions and deletions.

5. **Agent Orchestration Settings & Diagnostics**
   - Tunable match thresholds, daily dispatch limits, AI persona tone options, and blacklists.
   - Docker container health diagnostics and factory state reset.

---

## Running with Docker Compose (Recommended)

To run the application inside a multi-stage, standalone production container:

```bash
docker compose up --build -d
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To stop the container:
```bash
docker compose down
```

---

## Local Development (Without Docker)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Production build test
npm run build
npm run start
```
