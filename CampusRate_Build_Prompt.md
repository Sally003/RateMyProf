# CampusRate — Master Build Prompt

Copy everything below into your AI coding tool (Claude Code, Bolt, v0, Cursor, Lovable, etc.) as the project brief.

---

## ROLE & OBJECTIVE

You are a senior full-stack product engineer and UI/UX designer. Build **CampusRate**, a student-driven academic feedback platform where students discover, rate, and anonymously review professors across colleges and universities. Follow the specification below exactly. Where a decision isn't specified, choose the option that best matches "clean, modern, trustworthy academic platform" and state your assumption in a code comment.

---

## 1. TECH STACK

- **Frontend:** React + Vite + Tailwind CSS + React Router + Recharts (for rating breakdowns/admin analytics)
- **Backend/DB:** Supabase (PostgreSQL, Auth, Row Level Security, Edge Functions where server-side logic is needed)
- **Auth:** Google OAuth + Email/Password, with email verification and account recovery
- **Deployment target:** Frontend on Vercel, backend on Supabase

---

## 2. VISUAL DESIGN SYSTEM (STRICT)

Build a **cohesive 3-color theme** — do not introduce ad-hoc colors outside this palette:

- **Primary (Trust/Brand):** Deep indigo/navy blue — used for headers, primary buttons, nav, links
- **Secondary (Accent/Energy):** Warm amber/gold — used for ratings, highlights, CTAs, badges
- **Neutral (Base):** Off-white / soft gray background with charcoal text — used for cards, backgrounds, body copy

Design principles:
- Modern, minimal, generous whitespace, rounded corners (`rounded-2xl`), soft shadows — avoid clutter or dated "bootstrap" look.
- **3D tile / card effect** wherever content is grouped (professor cards, college cards, rating category tiles, admin dashboard stat cards): use layered box-shadows, subtle depth on hover (`translateY` + shadow expansion), soft gradients or beveled edges to give a tactile, elevated "glass/neumorphic-lite" look — not flat Material Design.
- Typography: one clean sans-serif for headings (semi-bold/bold, slightly tight tracking) and one for body text; clear type hierarchy.
- Micro-interactions: hover lift on tiles, smooth transitions (150–250ms ease), skeleton loaders instead of spinners, subtle scale-in on modal/dialog open.
- Fully responsive (mobile-first), since this is a responsive web app, not native.
- Dark mode is a nice-to-have, not required for MVP — if built, keep the same 3-color logic in dark variants.

---

## 3. INFORMATION ARCHITECTURE / PAGES

### Public / Student-facing
1. **Landing page** — value prop, search bar, featured colleges, how-it-works, trust/privacy messaging
2. **Sign up / Log in** — Google OAuth + email, email verification flow, password recovery
3. **Onboarding** — select college, department, year of study (stored internally only, never shown publicly)
4. **College discovery** — search/browse colleges, view departments
5. **Professor search** — filter by name, college, department, course
6. **Professor profile** — name, college, department, designation, overall rating (3D tile rating breakdown by category: Teaching Quality, Marking Fairness, Communication, Approachability — Difficulty shown separately), courses taught, review list, verification badge (Official Source Verified / Faculty Verified / Community Submitted / Pending Verification)
7. **Submit review** — professor, course, semester, academic year, 1–5 ratings per category, "would take again" (Yes/No), written feedback, client + server-side validation, duplicate-prevention check (one review per professor+course+semester+year per user)
8. **Report review** — reason selector (Spam, Abusive, Personal attack, Personal info, Suspected fake, Other) + details field
9. **Request missing professor** — name, college, department, optional source URL, pending status shown to submitter

### Admin (role-gated)
10. **Admin dashboard/overview** — total users, colleges, departments, professors, reviews, pending reviews, reported reviews (as 3D stat tiles + Recharts visualizations)
11. **Review moderation queue** — approve / reject / hide / flag, view credibility & risk signals
12. **Professor management** — add / edit / verify / reject / merge duplicates
13. **College & department management** — add / edit / manage departments

---

## 4. CORE FUNCTIONAL REQUIREMENTS

- **Anonymity by design:** public reviews show only a privacy label ("Verified Student" / "Community Review" / "Under Review") — never name, email, or user ID.
- **Duplicate prevention:** enforce uniqueness on (user, professor, course, semester, academic_year); allow the user to edit their own existing review instead of resubmitting.
- **Credibility system:** internal (non-public) score per review based on account verification, profile completeness, account age, review frequency, and reporting history; only the resulting label is shown publicly.
- **Risk/fraud signals:** flag (not auto-reject) reviews showing high frequency, near-duplicate text, multiple new accounts targeting one professor, or sudden rating spikes — route to moderation queue.
- **Rating calculation:** Overall Rating = average of Teaching Quality, Marking Fairness, Communication, Approachability. Course Difficulty is displayed as a separate, non-averaged metric.
- **Professor verification states:** Official Source Verified, Faculty Verified, Community Submitted, Pending Verification — shown as a badge on the profile.

---

## 5. DATA MODEL

Implement these tables in Supabase Postgres with appropriate foreign keys, indexes, and RLS policies:

```
profiles(id, user_id, college_id, department_id, year_of_study, verification_level, created_at)
colleges(id, name, city, state, website, created_at)
departments(id, college_id, name)
professors(id, college_id, department_id, name, designation, profile_url, verification_status, created_at)
courses(id, college_id, department_id, name, course_code)
professor_courses(id, professor_id, course_id, semester, academic_year)
reviews(id, user_id, professor_id, course_id, teaching_rating, marking_rating, communication_rating,
        approachability_rating, difficulty_rating, would_take_again, review_text, semester,
        academic_year, status, credibility_score, risk_score, created_at, updated_at)
review_reports(id, review_id, user_id, reason, details, status, created_at)
professor_requests(id, submitted_by, name, college_id, department_id, source_url, status, created_at)
```

---

## 6. SECURITY & PRIVACY REQUIREMENTS (NON-NEGOTIABLE)

- Require authenticated sessions for all write operations (reviews, reports, requests).
- Enforce **Row Level Security** so users can only read/write their own `profiles` and `reviews` rows; public read access is limited to approved, anonymized review data.
- Never expose `user_id`, email, or real name in any public API response or client bundle — strip at the query/view level, not just in the UI.
- Sanitize and validate all user-generated content server-side (review text, report details, professor request fields) to prevent XSS/SQL injection; rate-limit submission endpoints.
- Separate, explicitly role-gated admin routes and API calls (`is_admin` check enforced server-side, not just hidden in the UI).
- Log all moderation actions (who approved/rejected/hid/flagged what, and when) in an audit trail table.
- Secure auth flows: verified email required before review submission, secure password reset, session expiry/refresh handled via Supabase Auth best practices.
- Source public professor/college data responsibly, with records traceable to their origin where applicable.

---

## 7. BUILD SEQUENCE

1. Scaffold React + Vite + Tailwind project; configure routing.
2. Set up Supabase project: schema, RLS policies, auth providers.
3. Build design system first (colors, typography, 3D tile component, button/badge components) as a small component library before building pages.
4. Build student-facing flows: auth → onboarding → college/professor discovery → profile → review submission → reporting → professor requests.
5. Build admin dashboard and moderation tools, role-gated.
6. Wire up rating aggregation, credibility labels, and risk flagging logic.
7. Test: RLS/permissions, duplicate review prevention, anonymity leakage, mobile responsiveness, moderation workflows.

---

## 8. OUT OF SCOPE FOR THIS BUILD

Do not build: native mobile apps, AI chatbot, paid subscriptions, real-time chat, advanced ML/recommendation engine, automatic nationwide scraping, or professor advertising products. Keep the architecture extensible so these can be added later (V2: helpful votes, rankings, comparisons, profile claiming; V3: sentiment analysis, AI summaries, advanced fraud detection).

---

**Deliverable:** a working MVP matching the above — clean, modern, 3-color-themed UI with 3D tile components throughout, full student and admin flows, and enforced security/privacy at the database and API level.
