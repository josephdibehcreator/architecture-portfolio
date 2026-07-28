# Frontend

> **The public presentation layer of a fully automated content and commerce platform.**

All portfolio projects, journal articles, consultation prices, and booking availability rendered on this site are produced and managed **autonomously** — by scheduled Claude Code routines and payment-driven backend automation, not by interactive administration. The frontend is a thin, presentation-focused client: it renders the state the automated backend maintains and stays current, priced, and bookable **without any manual administration.**

This is the Next.js application that renders the public website ([www.dibeh-architecture.com](https://www.dibeh-architecture.com)) and the (rarely-needed) admin console. It presents portfolio content, service pages, the client inquiry & consultation-booking wizard (Stripe Checkout), career applications, blogs, and news.

**Production:** [https://www.dibeh-architecture.com](https://www.dibeh-architecture.com) (Vercel)
**API:** Express backend on Render — base URL resolved by `services/api.ts`.

---

## Table of contents

1. [How automation reaches the UI](#how-automation-reaches-the-ui)
2. [Tech stack](#tech-stack)
3. [Architecture & folder structure](#architecture--folder-structure)
4. [The automated experiences (UI/UX)](#the-automated-experiences-uiux)
5. [Admin console (manual override)](#admin-console-manual-override)
6. [Local development](#local-development)
7. [API integration](#api-integration)
8. [Deployment (Vercel)](#deployment-vercel)

---

## How automation reaches the UI

The frontend is intentionally a **thin, presentation-focused client**. It does not decide what content exists, what a consultation costs, or when a slot is booked — it *renders* the state that the automated backend maintains. This separation is what makes the platform self-operating.

| Visitor experience | Where the data comes from — **all automated** |
|--------------------|-----------------------------------------------|
| **Journal / blog** | Articles are researched, written, formatted, and published by **Claude Code routines**. The UI simply fetches `/api/blogs` and renders sanitized HTML. |
| **Portfolio / projects** | Projects, galleries, plans, and case-study metadata are created and curated by **Claude Code routines**. The UI fetches `/api/projects`. |
| **Consultation pricing** | The price shown at checkout is computed **server-side** from the client's chosen scope (duration + optional Roadmap Report). The UI never hardcodes or calculates a price — it requests a ready-to-pay Stripe session. |
| **Booking confirmation** | The moment Stripe payment completes, the backend confirms the inquiry and books the calendar slot. The UI's success page reflects an **already-finalized** booking. |

The practical result: **the content and commerce on this site update themselves.** A visitor always sees a current portfolio, a fresh journal, accurate pricing, and live availability — with zero manual intervention.

---

## Tech stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | [Next.js](https://nextjs.org/) (App Router) | `^14.2.15` |
| UI library | React | `^18.3.1` |
| Language | TypeScript | `^5.3.3` |
| CSS | Bootstrap 5 + CSS Modules + globals | `bootstrap ^5.3.2`, `react-bootstrap ^2.9.1` |
| Animation | Framer Motion | `^11.0.0` |
| Icons | Lucide React | `^0.294.0` |
| Carousels | Swiper | `^11.2.10` |
| Rich text (admin blogs) | TinyMCE | `^6.3.0` / `^8.3.2` |
| HTML sanitization | DOMPurify | `^3.3.3` |
| Fonts | `next/font/google` — Montserrat, Space Mono | — |
| Linting | ESLint via `next lint` | — |

No global state library. State is handled with React hooks, a single `LanguageContext` (EN/FR), and a thin `services/` `fetch` layer.

---

## Architecture & folder structure

Next.js 14 **App Router** with a **feature-oriented component layout** and a thin **services** layer for all backend communication.

```
frontend/
├── app/                          # Routes (App Router)
│   ├── layout.tsx                # Root layout: fonts, SEO, LanguageProvider, GA
│   ├── page.tsx                  # Home
│   ├── about/  services/  projects/  news/  blogs/[slug]/
│   ├── inquiry/success|cancel/   # Post–Stripe Checkout landing
│   ├── admin/                    # Protected admin shell (manual override)
│   ├── sitemap.ts  robots.ts     # Dynamic SEO (fetch API)
├── components/
│   ├── home/                     # Hero, stats, projects teaser, inquiry wizard, career, testimonials
│   ├── projects/                 # Grid, cards, gallery/plans/info viewers
│   ├── services/  about/  news/  # Content sections
│   ├── admin/                    # Admin tables, forms, modals (by domain)
│   └── shared/                   # Navigation, footer, GA, legal/cookie banners
├── contexts/LanguageContext.tsx  # EN/FR i18n (inline dictionary, localStorage)
├── services/                     # API clients (all use services/api.ts)
│   ├── api.ts                    # Base URL, fetch wrapper, credentials
│   ├── inquiries.ts, stripe.ts, projects.ts, blogs.ts, news.ts, …
│   └── admin/                    # Admin-only endpoints
├── config/                       # socialLinks, siteMetadata
├── next.config.js                # @ alias, Cloudinary image domains
└── tsconfig.json                 # paths: "@/*" -> "./*"
```

### Design patterns

| Pattern | Where |
|---------|--------|
| **App Router pages** | `app/**/page.tsx` — server components where possible; `'use client'` for interactivity |
| **Layout composition** | Public nav/footer wrapper for public routes; `AdminLayoutClient` for `/admin/*` |
| **Service layer** | `services/*.ts` — typed wrappers around `get` / `post` / `put` / `patch` / `del` |
| **CSS Modules** | Co-located `*.module.css` next to components |
| **i18n** | Client-side `LanguageContext` + `beforeInteractive` script to avoid language flash |
| **Auth (admin)** | Cookie-based JWT; layout calls `GET /api/admin/auth/me` and redirects to `/admin/login` on 401 |

---

## The automated experiences (UI/UX)

### 1. Journal — autonomously published blogs

- **Listing** (`/blogs`) and **article** (`/blogs/[slug]`) pages fetch from `services/blogs.ts` → `/api/blogs`.
- Every post is authored and published by Claude Code routines on the backend; the UI renders the pre-sanitized HTML `content` and displays cover image, category, author, and credit.
- No editorial action is ever required in the frontend for a new article to go live — publishing a draft on the backend makes it appear here automatically.

### 2. Portfolio — autonomously curated projects

- **Grid** (`/projects`) and **detail** (`/projects/[id]`) render published work from `services/projects.ts` → `/api/projects`.
- The detail viewer presents a **gallery slideshow**, a structured **project info** panel (maîtrise d'ouvrage, surface, budget, statut…), and **plans** — shown only for non-Residential projects that have them (a rule enforced by the backend).
- Projects, images, and metadata are created and maintained by Claude Code routines; the UI is purely presentational.

### 3. Inquiry & consultation wizard — automated pricing → checkout

The home page hosts a **multi-step inquiry wizard** that turns a cold visitor into a paid, booked consultation with no manual involvement:

1. **Identity** — `clientType` (private/business), name, email, phone → `POST /api/inquiries`.
2. **Context** — project details + optional document uploads (multipart) → `PUT /api/inquiries/:id/context`.
3. **Path** — `general` inquiry or paid `consult` → `PUT /api/inquiries/:id/path`.
4. **Consultation scope** — duration (30/60/90 min) and the optional **Roadmap Report** add-on → `PUT /api/inquiries/:id/consultation`.
5. **Availability** — the calendar UI checks live open slots via `/api/inquiries/check-availability` and `/api/inquiries/booked-slots`.
6. **Checkout** — `services/stripe.ts` calls `POST /api/stripe/create-checkout-session` with `{ inquiryId, duration, roadmapReport }`. **The backend prices the request server-side** and returns a hosted Stripe Checkout URL; the browser redirects to it.

> The UI never computes or hardcodes a price. It sends the client's chosen scope and receives a ready-to-pay session — pricing is an automated, server-side concern.

### 4. Automated scheduling — the success page reflects a done deal

- After Stripe Checkout, the client lands on **`/inquiry/success`** (or `/inquiry/cancel`).
- By the time this page renders, the backend webhook has **already** confirmed the inquiry, created the Google Calendar event, and sent internal notifications.
- The success page can confirm session status via `GET /api/stripe/session/:sessionId` (and `verify-payment` as a fallback), but the **booking itself is finalized by automation, not by the UI**.

### Supporting public UX

- **Home:** hero, editable company statistics (`/api/homepage-stats`), services overview, published projects, testimonials, career section (openings + application form with CV/portfolio upload).
- **Services:** index + dedicated pages — Architecture, Interior Design, Landscape, Photography, 3D Scanning, 3D Printing, Branding, Preliminary Declaration & Approvals.
- **News & blogs:** listing and slug pages (sanitized HTML display).
- **Legal & privacy:** cookie banner, consent-gated GA4, privacy/terms/cookie modals.
- **SEO:** rich root metadata, JSON-LD `ArchitectureFirm` schema, dynamic `sitemap.xml`, `robots.txt` (disallows `/admin`).

---

## Admin console (manual override)

The `/admin` area exists as a **manual override** — a safety net for the rare case a human wants to inspect or adjust what the automation maintains. Day-to-day, it is not needed.

| Route | Purpose |
|-------|---------|
| `/admin/login` | Email/password login (httpOnly cookies) |
| `/admin/dashboard` | Counts, recent activity, Stripe revenue summary; edit homepage stats |
| `/admin/projects` | CRUD, publish/unpublish, Cloudinary image/plan uploads |
| `/admin/blogs` | Blog CRUD with TinyMCE, publish/unpublish |
| `/admin/news` | News CRUD, publish/unpublish |
| `/admin/testimonials` | Approve / reject / delete submissions |
| `/admin/inquiries` | List/filter inquiries; billing panel for business clients |
| `/admin/bookings` | Paid consultation bookings (subset of inquiries) |
| `/admin/careers` | Job opening CRUD, publish/archive |
| `/admin/applications` | Career applications: status, notes, CV/portfolio download, CSV export |
| `/admin/profile` | Update admin email/password |

The same content endpoints these pages call are the ones the Claude Code routines drive autonomously via the backend's machine key — a human admin and the automation share one validated pipeline.

---

## Local development

### Prerequisites

- **Node.js 18+** (LTS recommended)
- Backend API running locally (default `http://localhost:5000`) — see [backend README](../backend/README.md)

### Install

```bash
cd frontend
npm install
```

### Environment variables — `frontend/.env.local`

```env
# Required — must include the /api suffix
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Required for the admin blog editor (TinyMCE cloud)
NEXT_PUBLIC_TINYMCE_API_KEY=your_tinymce_api_key

# Recommended in production
NEXT_PUBLIC_SITE_URL=https://www.dibeh-architecture.com
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** (prod) / recommended (dev) | Full API prefix incl. `/api`. Service calls append `/inquiries`, `/projects`, … |
| `NEXT_PUBLIC_TINYMCE_API_KEY` | For blog admin | TinyMCE key used by the blog editor |
| `NEXT_PUBLIC_SITE_URL` | Prod recommended | Canonical origin for `sitemap.ts`. Defaults to `http://localhost:3000` in dev |

If `NEXT_PUBLIC_API_URL` is unset: **dev** → `http://localhost:5000/api`; **prod** → hardcoded Render fallback in `services/api.ts` and `app/sitemap.ts`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Next.js ESLint |

### Typical workflow

1. Start the API: `cd backend && npm run dev`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `.env.local`
3. `npm run dev` in `frontend`
4. Public site: `http://localhost:3000` — Admin: `http://localhost:3000/admin/login`

---

## API integration

All HTTP traffic goes through **`services/api.ts`**.

### Base URL

```typescript
// Priority:
// 1. process.env.NEXT_PUBLIC_API_URL
// 2. Production/Vercel fallback → Render URL
// 3. Development → http://localhost:5000/api
```

### Client behavior

- Native **`fetch`** (not Axios).
- Default **`credentials: 'include'`** so httpOnly admin cookies are sent when CORS allows.
- Public read-only calls may pass `{ withCredentials: false }`.
- Responses expect `{ success: boolean, message?: string, data?: T }`.

### Service modules

| Module | Endpoints |
|--------|-----------|
| `services/api.ts` | `get`, `post`, `put`, `patch`, `del` |
| `services/inquiries.ts` | `/inquiries/*` multi-step flow, availability |
| `services/stripe.ts` | `/stripe/create-checkout-session`, session status |
| `services/projects.ts` | `/projects` (autonomously curated) |
| `services/blogs.ts`, `news.ts` | `/blogs`, `/news` (autonomously published) |
| `services/testimonials.ts` | `/testimonials` |
| `services/careerApplication.ts`, `jobs.ts` | `/career`, `/careers` |
| `services/homepageStats.ts` | `/homepage-stats` |
| `services/admin/*` | `/admin/*` protected routes |

**Multipart uploads** (inquiry documents, career CV, admin project images) use `FormData` with dedicated fetch calls, not the JSON helper.

### Admin authentication flow

1. `POST /admin/auth/login` → httpOnly cookies on the API domain.
2. `AdminLayoutClient` calls `GET /admin/auth/me` on each protected page load.
3. On **401**, redirect to `/admin/login`.
4. `POST /admin/auth/refresh` for token refresh.

Production requires the API to list the frontend origin in `FRONTEND_URLS`, use `credentials: true` CORS, and set `COOKIE_DOMAIN` when frontend and API are sibling subdomains.

### Images

`next.config.js` allows remote images from `res.cloudinary.com` (primary), `**.supabase.co`, and `images.unsplash.com`.

---

## Deployment (Vercel)

1. Connect the `frontend` directory to Vercel.
2. Set env vars: `NEXT_PUBLIC_API_URL` (with `/api`), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TINYMCE_API_KEY`.
3. Build command: `npm run build`.
4. Ensure the backend `FRONTEND_URLS` includes the Vercel/production domain.

---

## Related documentation

- [Backend README](../backend/README.md) — automation & cloud-routine integration, API routes, database models, Stripe & Calendar
