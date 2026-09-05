-- =========================================================
-- JobPulse AI — Autonomous Job Application Agent Database Schema
-- =========================================================

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  title VARCHAR(255) DEFAULT 'Software Engineer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS master_profiles (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  headline TEXT,
  summary TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  min_base_salary INTEGER DEFAULT 180000,
  remote_preference VARCHAR(50) DEFAULT 'remote',
  work_authorization VARCHAR(255) DEFAULT 'US Citizen',
  target_roles JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_postings (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo TEXT,
  location VARCHAR(255),
  workplace_type VARCHAR(50) DEFAULT 'remote',
  salary_range VARCHAR(255),
  min_salary INTEGER DEFAULT 0,
  max_salary INTEGER DEFAULT 0,
  posted_date VARCHAR(100),
  match_score INTEGER DEFAULT 80,
  description TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  matched_skills JSONB DEFAULT '[]'::jsonb,
  missing_skills JSONB DEFAULT '[]'::jsonb,
  source_url TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tailored_diffs (
  id VARCHAR(64) PRIMARY KEY,
  job_id VARCHAR(64) REFERENCES job_postings(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255),
  company VARCHAR(255),
  ats_score_before INTEGER DEFAULT 75,
  ats_score_after INTEGER DEFAULT 95,
  summary_before TEXT,
  summary_after TEXT,
  diff_chunks JSONB DEFAULT '[]'::jsonb,
  keywords_added JSONB DEFAULT '[]'::jsonb,
  tone_adjustment TEXT,
  generated_cover_letter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  job_id VARCHAR(64) REFERENCES job_postings(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo TEXT,
  location VARCHAR(255),
  salary_range VARCHAR(255),
  stage VARCHAR(50) DEFAULT 'discovered',
  applied_date VARCHAR(50),
  match_score INTEGER DEFAULT 85,
  tailored_diff_id VARCHAR(64),
  interview_round VARCHAR(255),
  interview_date VARCHAR(255),
  offer_amount VARCHAR(255),
  notes TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  timestamp VARCHAR(50),
  level VARCHAR(20) DEFAULT 'info',
  message TEXT NOT NULL,
  job_id VARCHAR(64),
  action_type VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_settings (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  autonomous_mode BOOLEAN DEFAULT TRUE,
  match_threshold INTEGER DEFAULT 85,
  max_daily_applications INTEGER DEFAULT 12,
  auto_apply_interval_minutes INTEGER DEFAULT 15,
  ai_model VARCHAR(255) DEFAULT 'Gemini 1.5 Pro / Claude 3.5 Sonnet (Tailoring Engine v4)',
  ai_tone VARCHAR(50) DEFAULT 'technical',
  blacklisted_companies JSONB DEFAULT '["Meta", "Amazon Web Services", "ByteDance"]'::jsonb,
  blacklisted_keywords JSONB DEFAULT '["Wordpress", "PHP 5", "Crypto Trader", "Gambling"]'::jsonb,
  dry_run_mode BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- Pre-Seed Data
-- =========================================================

-- 1. Demo User
INSERT INTO users (id, name, email, password_hash, title, avatar_url)
VALUES (
  'usr-001',
  'Alex Rivera',
  'alex.rivera@systems.dev',
  '$2a$10$wT0dGv0iY3lIHzVvI8Kk1.0wL8CjE6L3Z5F7N8Q1R2S3T4U5V6W7X',
  'Lead Architect & Staff Full-Stack Engineer',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
) ON CONFLICT (id) DO NOTHING;

-- 2. Master Profile
INSERT INTO master_profiles (
  id, user_id, name, headline, summary, email, phone, location,
  github_url, linkedin_url, portfolio_url, min_base_salary,
  remote_preference, work_authorization, target_roles, skills, experiences
)
VALUES (
  'prof-001',
  'usr-001',
  'Alex Rivera',
  'Lead Architect & Staff Full-Stack Systems Engineer | Distributed Systems & High-Scale Web',
  'Distinguished full-stack systems engineer and architect with 10+ years driving large-scale distributed architectures, ultra-low latency real-time web engines, and edge-deployed cloud platforms. Proven track record scaling workloads from zero to 150M+ requests/day, modernizing legacy enterprise stacks to micro-frontends and event-driven microservices, and leading high-velocity cross-functional engineering teams.',
  'alex.rivera@systems.dev',
  '+1 (415) 890-2341',
  'San Francisco, CA (Open to Remote)',
  'https://github.com/alexrivera-dev',
  'https://linkedin.com/in/alexrivera-systems',
  'https://alexrivera.dev',
  210000,
  'remote',
  'US Citizen (No sponsorship required)',
  '["Staff Software Engineer", "Principal Frontend Architect", "Lead Systems Architect", "Head of Engineering", "Senior Staff Full-Stack Engineer"]'::jsonb,
  '[
    {"category": "Languages & Core", "items": ["TypeScript", "JavaScript (ESNext)", "Go", "Rust", "Python", "SQL", "GraphQL", "HTML5/CSS3"]},
    {"category": "Frontend & Architecture", "items": ["React 18/19", "Next.js 14+ (App Router)", "Tailwind CSS", "Vue 3", "WebSockets", "WebAssembly", "State Machines", "Micro-frontends"]},
    {"category": "Backend & Distributed Systems", "items": ["Node.js", "Go (Gin/Fiber)", "gRPC / Protobuf", "Kafka", "Redis", "PostgreSQL", "DynamoDB", "Temporal.io"]},
    {"category": "Cloud, DevOps & Containers", "items": ["Docker", "Kubernetes", "AWS (ECS, Lambda, RDS, S3)", "GCP", "Terraform", "CI/CD (GitHub Actions)", "Datadog", "Prometheus"]}
  ]'::jsonb,
  '[
    {
      "id": "exp-1",
      "company": "Aether Cloud Networks",
      "role": "Staff Systems Architect & Tech Lead",
      "startDate": "2021-03",
      "endDate": "Present",
      "location": "San Francisco, CA (Remote)",
      "highlights": [
        "Architected and led the migration of a monolithic API gateway to an event-driven edge mesh handling 120M+ daily events with 99.995% uptime.",
        "Engineered real-time collaborative workspace utilizing WebSockets, CRDTs, and WebAssembly, reducing sync latency by 68% across global regions.",
        "Mentored 18 engineers, standardized multi-tenant observability with OpenTelemetry and Datadog, cutting MTTR for P1 incidents from 42m to 8m.",
        "Spearheaded transition from container sprawl to unified Kubernetes deployments using Terraform, lowering cloud infrastructure costs by $340K annually."
      ]
    },
    {
      "id": "exp-2",
      "company": "Kinetic Data Systems",
      "role": "Senior Full-Stack Engineer",
      "startDate": "2018-06",
      "endDate": "2021-02",
      "location": "San Francisco, CA",
      "highlights": [
        "Built dynamic analytical reporting dashboard using React, TypeScript, and virtualized canvas tables processing 500,000+ row financial datasets in sub-100ms.",
        "Designed decoupled GraphQL Federation schema combining 7 internal billing and telemetry microservices, decreasing client roundtrips by 54%.",
        "Implemented rigorous automated CI test suite with Playwright and Jest, increasing overall test coverage from 44% to 92%."
      ]
    },
    {
      "id": "exp-3",
      "company": "Apex Digital Labs",
      "role": "Software Engineer",
      "startDate": "2015-08",
      "endDate": "2018-05",
      "location": "Austin, TX",
      "highlights": [
        "Developed customer-facing responsive web portals using modern JavaScript, React, and RESTful Node.js microservices.",
        "Optimized PostgreSQL query execution plans and indexing strategies, slashing average API response latency from 320ms to 45ms."
      ]
    }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 3. Agent Settings
INSERT INTO agent_settings (
  user_id, autonomous_mode, match_threshold, max_daily_applications,
  auto_apply_interval_minutes, ai_model, ai_tone, blacklisted_companies,
  blacklisted_keywords, dry_run_mode
)
VALUES (
  'usr-001',
  TRUE,
  85,
  12,
  15,
  'Gemini 1.5 Pro / Claude 3.5 Sonnet (Tailoring Engine v4)',
  'technical',
  '["Meta", "Amazon Web Services", "ByteDance"]'::jsonb,
  '["Wordpress", "PHP 5", "Crypto Trader", "Gambling"]'::jsonb,
  FALSE
) ON CONFLICT (user_id) DO NOTHING;

-- 4. Job Postings (15 Requisitions)
INSERT INTO job_postings (id, title, company, company_logo, location, workplace_type, salary_range, min_salary, max_salary, posted_date, match_score, description, required_skills, matched_skills, missing_skills, source_url, status)
VALUES
('job-1', 'Staff Infrastructure & Platform Engineer', 'Stripe', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', 'remote', '$240,000 - $310,000 + Equity', 240000, 310000, '2 hours ago', 96, 'We are looking for a Staff Infrastructure Engineer to design resilient distributed payment routing engines. You will lead the evolution of Stripe platform primitives, ensuring ultra-reliable processing across multi-region cloud infrastructures.', '["Distributed Systems", "Go", "Kubernetes", "AWS", "High Availability", "Terraform"]'::jsonb, '["Distributed Systems", "Go", "Kubernetes", "AWS", "Terraform"]'::jsonb, '["Payment Gateway Standards"]'::jsonb, 'https://stripe.com/jobs', 'queued'),

('job-2', 'Principal Frontend Architect', 'Vercel', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (Global)', 'remote', '$230,000 - $290,000 + Equity', 230000, 290000, '5 hours ago', 97, 'Vercel is seeking a Principal Frontend Architect to drive the future of Next.js, Edge runtime integrations, and modern rendering patterns. You will collaborate directly with developer relations and core framework engineers.', '["Next.js", "React", "TypeScript", "Edge Compute", "Performance Optimization", "WebAssembly"]'::jsonb, '["Next.js", "React", "TypeScript", "Edge Compute", "Performance Optimization", "WebAssembly"]'::jsonb, '[]'::jsonb, 'https://vercel.com/careers', 'applied'),

('job-3', 'Staff Product Engineer', 'Linear', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (US/EU)', 'remote', '$220,000 - $280,000 + Top-Tier Equity', 220000, 280000, '1 day ago', 98, 'Linear is hiring a Staff Product Engineer to craft the fastest issue tracker and product planning platform on earth. Focus on local-first synchronization, sub-50ms interactions, and delightful ergonomics.', '["TypeScript", "React", "CRDTs / Local-First", "WebSockets", "GraphQL", "Tailwind CSS"]'::jsonb, '["TypeScript", "React", "CRDTs / Local-First", "WebSockets", "Tailwind CSS"]'::jsonb, '["IndexedDB Custom Engines"]'::jsonb, 'https://linear.app/careers', 'applied'),

('job-4', 'Senior AI Interfaces Engineer', 'Anthropic', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Hybrid', 'hybrid', '$250,000 - $330,000 + Equity', 250000, 330000, '1 day ago', 95, 'Help build the human-AI interaction paradigm for Claude. You will develop generative AI interfaces, streaming response renderers, tool-calling user experiences, and high-performance frontend state machines.', '["TypeScript", "React", "Streaming APIs", "Next.js", "LLM Agent Architectures"]'::jsonb, '["TypeScript", "React", "Streaming APIs", "Next.js"]'::jsonb, '["Prompt Evaluation Frameworks"]'::jsonb, 'https://anthropic.com/careers', 'applied'),

('job-5', 'Senior Database Systems Engineer', 'Supabase', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (Worldwide)', 'remote', '$200,000 - $260,000 + Equity', 200000, 260000, '2 days ago', 91, 'Supabase is looking for a systems engineer passionate about Postgres extensions, real-time replication, and cloud multi-tenancy. You will build high-throughput connection poolers and distributed backup engines.', '["PostgreSQL", "Go", "Rust", "Docker", "Distributed Systems"]'::jsonb, '["PostgreSQL", "Go", "Docker", "Distributed Systems"]'::jsonb, '["Postgres C Internals"]'::jsonb, 'https://supabase.com/careers', 'queued'),

('job-6', 'Senior Performance & Canvas Engineer', 'Figma', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', 'hybrid', '$225,000 - $285,000 + Equity', 225000, 285000, '2 days ago', 92, 'Join the Figma multiplayer canvas team. Develop cutting-edge vector renderers, WebGL/WebGPU shaders, and real-time collaborative state engines running at silky 60fps.', '["TypeScript", "C++ / Rust / Wasm", "WebGL", "State Synchronization", "Graphics"]'::jsonb, '["TypeScript", "Rust", "State Synchronization", "WebAssembly"]'::jsonb, '["WebGPU Shaders"]'::jsonb, 'https://figma.com/careers', 'applied'),

('job-7', 'Staff Distributed Systems Engineer', 'Datadog', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'New York, NY / Remote', 'remote', '$235,000 - $300,000 + Equity', 235000, 300000, '3 days ago', 89, 'Build the next-generation ingestion pipelines handling tens of trillions of metric points and logs each day. Focus on Kafka pipelines, zero-copy deserialization, and Go backends.', '["Go", "Kafka", "Distributed Systems", "Kubernetes", "Time-Series DB"]'::jsonb, '["Go", "Kafka", "Distributed Systems", "Kubernetes"]'::jsonb, '["Time-Series Compression Algorithms"]'::jsonb, 'https://datadoghq.com/careers', 'reviewed'),

('job-8', 'Senior Full Stack Engineer, Core Platform', 'Airbnb', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', 'remote', '$215,000 - $275,000 + Equity', 215000, 275000, '3 days ago', 94, 'Architect guest and host checkout workflows with extreme accessibility, responsive internationalization, and micro-frontend server-side rendering.', '["React", "TypeScript", "GraphQL", "Java / Kotlin or Node.js", "High Concurrency"]'::jsonb, '["React", "TypeScript", "GraphQL", "Node.js", "High Concurrency"]'::jsonb, '["Kotlin"]'::jsonb, 'https://airbnb.com/careers', 'applied'),

('job-9', 'Lead Backend Engineer, Financial Ledger', 'Ramp', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'New York, NY / Remote', 'hybrid', '$220,000 - $280,000 + Equity', 220000, 280000, '4 days ago', 88, 'Ramp is revolutionizing corporate finance. Build double-entry accounting engines, high-speed card auth routing, and automated compliance microservices.', '["Python", "PostgreSQL", "Distributed Transactions", "AWS", "Financial Security"]'::jsonb, '["Python", "PostgreSQL", "AWS"]'::jsonb, '["Double-Entry Ledger Systems"]'::jsonb, 'https://ramp.com/careers', 'new'),

('job-10', 'Edge Compute & Workers Specialist', 'Cloudflare', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', 'remote', '$210,000 - $265,000 + Equity', 210000, 265000, '4 days ago', 90, 'Empower developers to build serverless applications deployed across hundreds of edge locations. Implement V8 isolate optimizations and durable storage primitives.', '["Rust", "TypeScript", "V8 Isolates", "Distributed Key-Value", "Networking"]'::jsonb, '["Rust", "TypeScript", "Networking"]'::jsonb, '["V8 Engine Internals"]'::jsonb, 'https://cloudflare.com/careers', 'new'),

('job-11', 'Full-Stack Developer Platform Engineer', 'OpenAI', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Onsite', 'onsite', '$260,000 - $340,000 + Generous PPU', 260000, 340000, '5 days ago', 93, 'Build developer dashboards, token quota billing systems, and API playground tools powering millions of AI developers worldwide.', '["Next.js", "React", "Python", "TypeScript", "API Design", "PostgreSQL"]'::jsonb, '["Next.js", "React", "Python", "TypeScript", "PostgreSQL"]'::jsonb, '["Billing/Stripe Custom Subscriptions"]'::jsonb, 'https://openai.com/careers', 'new'),

('job-12', 'Senior Enterprise Full-Stack Engineer', 'Retool', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', 'remote', '$210,000 - $270,000 + Equity', 210000, 270000, '5 days ago', 87, 'Retool makes building internal tools remarkably fast. Help engineer the component canvas, granular RBAC permissions, and database connector ecosystem.', '["TypeScript", "React", "Node.js", "PostgreSQL", "SQL Parsers"]'::jsonb, '["TypeScript", "React", "Node.js", "PostgreSQL"]'::jsonb, '["SQL AST Parsers"]'::jsonb, 'https://retool.com/careers', 'new'),

('job-13', 'Staff Open Source Platform Engineer', 'PostHog', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (Anywhere)', 'remote', '$210,000 - $260,000 + Transparent Equity', 210000, 260000, '6 days ago', 89, 'Help scale an all-in-one product analytics suite. Work with ClickHouse data warehouses, Kafka pipelines, and open-source TypeScript SDKs.', '["ClickHouse", "Python", "TypeScript", "Kafka", "Open Source"]'::jsonb, '["Python", "TypeScript", "Kafka"]'::jsonb, '["ClickHouse Optimization"]'::jsonb, 'https://posthog.com/careers', 'new'),

('job-14', 'Senior Systems Engineer, Actions', 'GitHub', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (US)', 'remote', '$215,000 - $275,000 + Equity', 215000, 275000, '1 week ago', 86, 'Scale the world’s largest CI/CD pipeline. Architect sandboxed runner VMs, secure token validation, and artifact caching layers for millions of repositories.', '["Go", "Azure / AWS", "Container Isolation", "High Scale API"]'::jsonb, '["Go", "AWS", "Container Isolation"]'::jsonb, '["Azure Virtual Machine Scale Sets"]'::jsonb, 'https://github.com/careers', 'new'),

('job-15', 'Senior Security Platform Engineer', 'Vanta', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', 'remote', '$200,000 - $250,000 + Equity', 200000, 250000, '1 week ago', 82, 'Automate compliance and continuous security monitoring. Integrate with 100+ cloud providers and enterprise SaaS APIs.', '["TypeScript", "GraphQL", "AWS IAM", "SOC2 Compliance Automations"]'::jsonb, '["TypeScript", "GraphQL", "AWS IAM"]'::jsonb, '["SOC2 Compliance Automations"]'::jsonb, 'https://vanta.com/careers', 'dismissed')
ON CONFLICT (id) DO NOTHING;

-- 5. Tailored Diffs
INSERT INTO tailored_diffs (id, job_id, user_id, job_title, company, ats_score_before, ats_score_after, summary_before, summary_after, diff_chunks, keywords_added, tone_adjustment, generated_cover_letter)
VALUES
('diff-stripe', 'job-1', 'usr-001', 'Staff Infrastructure & Platform Engineer', 'Stripe', 78, 96,
 'Distinguished full-stack systems engineer with 10+ years driving large-scale distributed architectures and web engines.',
 'High-impact Staff Infrastructure Architect with 10+ years designing fault-tolerant distributed systems, multi-region cloud primitives, and sub-millisecond payment/event routing engines handling 120M+ daily transactions at 99.995% availability.',
 '[
   {"id": "c1", "type": "unchanged", "originalText": "Aether Cloud Networks — Staff Systems Architect (2021 - Present)", "tailoredText": "Aether Cloud Networks — Staff Systems Architect (2021 - Present)"},
   {"id": "c2", "type": "removed", "originalText": "- Architected and led the migration of a monolithic API gateway to an event-driven edge mesh handling 120M+ daily events with 99.995% uptime.", "reason": "Lacked explicit emphasis on high-availability cloud routing and multi-region fault tolerance"},
   {"id": "c3", "type": "added", "tailoredText": "+ Architected and deployed multi-region event-driven distributed edge routing mesh handling 120M+ daily transactions with 99.995% SLA and zero-data-loss failover mechanisms.", "reason": "Aliged with Stripe high-scale distributed transaction requirements (+14% keyword match)"},
   {"id": "c4", "type": "unchanged", "originalText": "- Mentored 18 engineers, standardized multi-tenant observability with OpenTelemetry and Datadog.", "tailoredText": "- Mentored 18 engineers, standardized multi-tenant observability with OpenTelemetry and Datadog."},
   {"id": "c5", "type": "removed", "originalText": "- Spearheaded transition from container sprawl to unified Kubernetes deployments using Terraform, lowering cloud infrastructure costs by $340K annually.", "reason": "Generic cost reduction focus"},
   {"id": "c6", "type": "added", "tailoredText": "+ Spearheaded automated Kubernetes infrastructure-as-code deployment pipelines using Terraform, enforcing strict PCI-grade security isolation while reducing cloud infrastructure footprint by $340K/yr.", "reason": "Injected compliance & security isolation keywords matching Stripe platform expectations"}
 ]'::jsonb,
 '["Multi-Region Routing", "Fault Tolerance", "PCI-DSS Readiness", "Zero-Loss Ledger Sync", "gRPC Mesh"]'::jsonb,
 'Sharply elevated infrastructure resilience and financial-grade reliability metrics',
 'Dear Stripe Infrastructure Hiring Committee,\n\nI am thrilled to apply for the Staff Infrastructure & Platform Engineer role. Having spent the last several years architecting mission-critical distributed routing meshes handling over 120M events daily at 99.995% uptime, Stripe''s relentless commitment to economic infrastructure resilience deeply aligns with my architectural philosophy.\n\nBest regards,\nAlex Rivera'
),
('diff-linear', 'job-3', 'usr-001', 'Staff Product Engineer', 'Linear', 81, 98,
 'Distinguished full-stack systems engineer and architect with 10+ years driving large-scale distributed architectures and ultra-low latency real-time web engines.',
 'Product-minded Staff Engineer with 10+ years obsessive focus on sub-50ms web interactions, local-first client synchronization (CRDTs & WebSockets), and high-craft UI/UX engineering with Next.js and TypeScript.',
 '[
   {"id": "l1", "type": "unchanged", "originalText": "Kinetic Data Systems — Senior Full-Stack Engineer", "tailoredText": "Kinetic Data Systems — Senior Full-Stack Engineer"},
   {"id": "l2", "type": "removed", "originalText": "- Built dynamic analytical reporting dashboard using React, TypeScript, and virtualized canvas tables processing 500,000+ row financial datasets in sub-100ms.", "reason": "Rephrased to emphasize interaction design, local caching, and 60fps frame budgets"},
   {"id": "l3", "type": "added", "tailoredText": "+ Crafted high-performance desktop-grade dashboard using React and virtualized canvas rendering, delivering buttery 60fps scrolling across 500,000+ items with sub-50ms optimistic UI mutations.", "reason": "Matches Linear culture of extreme responsiveness and craft (+17% ATS match)"}
 ]'::jsonb,
 '["Local-First Architecture", "CRDTs", "Sub-50ms Latency", "High-Craft UI", "Optimistic UI Updates"]'::jsonb,
 'Emphasized product velocity, speed obsession, ergonomics, and local-first data sync',
 'Dear Linear Team,\n\nLinear has redefined the standard for modern desktop and web applications. As a product engineer with deep distributed systems roots, I believe software should feel instant, tactile, and effortless.\n\nWarm regards,\nAlex Rivera'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Applications (10 pipeline items)
INSERT INTO applications (id, user_id, job_id, job_title, company, company_logo, location, salary_range, stage, applied_date, match_score, tailored_diff_id, interview_round, interview_date, offer_amount, notes, timeline)
VALUES
('app-01', 'usr-001', 'job-3', 'Staff Product Engineer', 'Linear', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (US/EU)', '$220,000 - $280,000', 'offer', '2026-08-14', 98, 'diff-linear', NULL, NULL, '$265,000 Base + $140,000 Equity / yr', 'Exceptional feedback on local-first sync architecture challenge. Offer received, reviewing contract terms.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-12 09:12", "note": "AI agent identified role via career crawler"},
   {"stage": "tailoring", "timestamp": "2026-08-12 11:30", "note": "Generated local-first focused resume diff (ATS 98%)"},
   {"stage": "applied", "timestamp": "2026-08-14 14:00", "note": "Automated application dispatched via Linear portal"},
   {"stage": "interviewing", "timestamp": "2026-08-19 16:00", "note": "Completed technical deep dive with Tech Lead"},
   {"stage": "offer", "timestamp": "2026-08-28 11:15", "note": "Official offer package extended"}
 ]'::jsonb),

('app-02', 'usr-001', 'job-4', 'Senior AI Interfaces Engineer', 'Anthropic', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Hybrid', '$250,000 - $330,000', 'interviewing', '2026-08-18', 95, 'diff-stripe', 'Round 3: System Design & Human-AI Interaction', 'Tomorrow, 2:00 PM PST', NULL, 'Passed initial recruiter screen and architecture pairing. Next is interactive canvas UI system design.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-16 10:00", "note": "Matched role with 95% semantic score"},
   {"stage": "tailoring", "timestamp": "2026-08-17 08:30", "note": "Tailored resume emphasizing streaming UI"},
   {"stage": "applied", "timestamp": "2026-08-18 09:00", "note": "Application sent with tailored cover letter"},
   {"stage": "interviewing", "timestamp": "2026-08-25 15:30", "note": "Recruiter screen cleared; scheduled Round 3"}
 ]'::jsonb),

('app-03', 'usr-001', 'job-2', 'Principal Frontend Architect', 'Vercel', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (Global)', '$230,000 - $290,000', 'interviewing', '2026-08-20', 97, 'diff-linear', 'Round 2: Framework Core & Turbopack Walkthrough', 'Thursday, 10:00 AM PST', NULL, 'Chatted with VP of DX; discussion on Next.js 15 Server Actions and edge hydration optimizations.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-19 14:20", "note": "Scraped from official Vercel jobs feed"},
   {"stage": "applied", "timestamp": "2026-08-20 10:15", "note": "Dispatched application automatically"},
   {"stage": "interviewing", "timestamp": "2026-08-26 13:00", "note": "First round interview with engineering leadership"}
 ]'::jsonb),

('app-04', 'usr-001', 'job-1', 'Staff Infrastructure & Platform Engineer', 'Stripe', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', '$240,000 - $310,000', 'applied', '2026-08-28', 96, 'diff-stripe', NULL, NULL, NULL, 'Submitted tailored resume with PCI-DSS & multi-region routing highlights. Greenhouse application status: Under Review.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-27 18:00", "note": "Agent detected role matching target salary"},
   {"stage": "tailoring", "timestamp": "2026-08-28 09:30", "note": "Redline diff approved by user"},
   {"stage": "applied", "timestamp": "2026-08-28 10:05", "note": "Dispatched payload to Stripe Greenhouse portal"}
 ]'::jsonb),

('app-05', 'usr-001', 'job-8', 'Senior Full Stack Engineer, Core Platform', 'Airbnb', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', '$215,000 - $275,000', 'applied', '2026-08-30', 94, 'diff-stripe', NULL, NULL, NULL, 'Application submitted via Workday automation. Awaiting hiring manager review.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-29 11:00", "note": "Found listing on LinkedIn integration"},
   {"stage": "applied", "timestamp": "2026-08-30 16:45", "note": "Automated application complete"}
 ]'::jsonb),

('app-06', 'usr-001', 'job-6', 'Senior Performance & Canvas Engineer', 'Figma', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', '$225,000 - $285,000', 'applied', '2026-08-31', 92, 'diff-linear', NULL, NULL, NULL, 'Highlighted WebAssembly, 60fps rendering, and CRDT synchronizations.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-30 08:00", "note": "Discovered via Figma talent network"},
   {"stage": "applied", "timestamp": "2026-08-31 09:20", "note": "Dispatched resume and portfolio link"}
 ]'::jsonb),

('app-07', 'usr-001', 'job-5', 'Senior Database Systems Engineer', 'Supabase', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'Remote (Worldwide)', '$200,000 - $260,000', 'tailoring', NULL, 91, 'diff-stripe', NULL, NULL, NULL, 'Currently synthesizing bullet points regarding Postgres replication and Go connection poolers.',
 '[
   {"stage": "discovered", "timestamp": "2026-09-01 12:00", "note": "Job matched agent threshold (>90%)"},
   {"stage": "tailoring", "timestamp": "2026-09-02 08:15", "note": "Agent currently building tailored diff"}
 ]'::jsonb),

('app-08', 'usr-001', 'job-7', 'Staff Distributed Systems Engineer', 'Datadog', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'New York, NY / Remote', '$235,000 - $300,000', 'tailoring', NULL, 89, 'diff-stripe', NULL, NULL, NULL, 'Drafting Kafka pipeline metrics and MTTR reduction achievements.',
 '[
   {"stage": "discovered", "timestamp": "2026-09-02 14:00", "note": "Discovered high-compensation listing"},
   {"stage": "tailoring", "timestamp": "2026-09-03 09:00", "note": "Diff generation queued"}
 ]'::jsonb),

('app-09', 'usr-001', 'job-9', 'Lead Backend Engineer, Financial Ledger', 'Ramp', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'New York, NY / Remote', '$220,000 - $280,000', 'discovered', NULL, 88, 'diff-stripe', NULL, NULL, NULL, 'Queued in auto-pilot buffer. Will begin tailoring in next autonomous batch.',
 '[
   {"stage": "discovered", "timestamp": "2026-09-03 16:20", "note": "Discovered role with 88% match score"}
 ]'::jsonb),

('app-10', 'usr-001', 'job-15', 'Senior Security Platform Engineer', 'Vanta', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80', 'San Francisco, CA / Remote', '$200,000 - $250,000', 'rejected', '2026-08-10', 82, 'diff-stripe', NULL, NULL, NULL, 'Position closed internally by hiring organization. Candidate pipeline archived.',
 '[
   {"stage": "discovered", "timestamp": "2026-08-08 10:00", "note": "Discovered role"},
   {"stage": "applied", "timestamp": "2026-08-10 11:30", "note": "Submitted application"},
   {"stage": "rejected", "timestamp": "2026-08-20 18:00", "note": "Automated notice: requisition filled"}
 ]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Agent Logs
INSERT INTO agent_logs (id, user_id, timestamp, level, message, job_id, action_type)
VALUES
('log-01', 'usr-001', '11:40:12', 'info', 'JobPulse autonomous scheduler daemon initialized. Checking active scrape targets...', NULL, 'scan'),
('log-02', 'usr-001', '11:40:18', 'info', 'Scraped 48 raw engineering requisitions from Greenhouse, Lever, and Workday APIs.', NULL, 'scan'),
('log-03', 'usr-001', '11:41:05', 'success', 'Match engine evaluated: "Staff Product Engineer @ Linear" scored 98% compatibility.', 'job-3', 'match'),
('log-04', 'usr-001', '11:41:40', 'info', 'Synthesizing tailored resume diff for Stripe Infrastructure requisition. Injected 5 ATS keywords.', 'job-1', 'tailor'),
('log-05', 'usr-001', '11:42:15', 'success', 'ATS compliance score improved from 78/100 to 96/100 (+18% delta). Redline diff finalized.', 'job-1', 'tailor'),
('log-06', 'usr-001', '11:43:02', 'info', 'Dispatched application payload to Stripe Greenhouse portal with tailored cover letter.', 'job-1', 'apply'),
('log-07', 'usr-001', '11:43:30', 'success', 'Application confirmed by Stripe endpoint [HTTP 201 Created]. Requisition tracking ID #STR-99410.', 'job-1', 'apply'),
('log-08', 'usr-001', '11:44:10', 'info', 'Standby mode: Next autonomous scan cycle in 15 minutes (or trigger immediately via UI).', NULL, NULL)
ON CONFLICT (id) DO NOTHING;
