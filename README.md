# Dibeh Architecture — Frontend

Public marketing site and authenticated admin console for **Dibeh Architecture** (Joseph Dibeh), an architecture studio operating in Paris, the French Riviera, and Beirut. The frontend presents portfolio content, service pages, client inquiry and consultation booking (with Stripe Checkout), career applications, blogs, and news. A separate **admin** area lets studio staff manage content, bookings, and applications.

**Production:** [https://www.dibeh-architecture.com](https://www.dibeh-architecture.com) (Vercel)  
**API:** Express backend on Render — base URL resolved by `services/api.ts` (see [API integration](#api-integration)).

---

## Tech stack & ecosystem

| Category | Technology | Version (from `package.json`) |
|----------|------------|-----------------------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) | `^14.2.15` |
| UI library | React | `^18.3.1` |
| Language | TypeScript | `^5.3.3` |
| CSS | Bootstrap 5 + CSS Modules + global styles | `bootstrap ^5.3.2`, `react-bootstrap ^2.9.1` |
| Animation | Framer Motion | `^11.0.0` |
| Icons | Lucide React | `^0.294.0` |
| Carousels | Swiper | `^11.2.10` |
| Rich text (admin blogs) | TinyMCE (`@tinymce/tinymce-react`, `tinymce`) | `^6.3.0` / `^8.3.2` |
| Rich text (alternate) | TipTap (`@tiptap/*`) | `^3.20.1` |
| HTML sanitization | DOMPurify | `^3.3.3` |
| Fonts | `next/font/google` — Montserrat, Space Mono | — |
| Bundler | Webpack (via Next.js) | — |
| Linting | ESLint via `next lint` | — |

There is **no** global state library (Redux/Zustand). State is handled with React hooks, a single `LanguageContext`, and service-layer `fetch` calls.

---

## Architecture & folder structure

The app uses the **Next.js 14 App Router** with a **feature-oriented component layout** and a thin **services** layer for all backend communication.

```
frontend/
├── app/                          # Routes (App Router)
│   ├── layout.tsx                # Root layout: fonts, SEO, LanguageProvider, GA
│   ├── page.tsx                  # Home
│   ├── about/
│   ├── services/                 # Hub + per-service pages (architecture, interior, …)
│   ├── projects/                 # Listing + [id] detail
│   ├── news/                     # Listing + [slug]
│   ├── blogs/[slug]/
│   ├── inquiry/success|cancel/   # Post–Stripe Checkout
│   ├── admin/                    # Protected admin shell
│   │   ├── layout.tsx            # Wraps AdminLayoutClient
│   │   ├── AdminLayoutClient.tsx # Auth gate + sidebar/topbar
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── projects|testimonials|inquiries|bookings/
│   │   ├── careers|applications|blogs|news|profile/
│   ├── sitemap.ts                # Dynamic sitemap (fetches API)
│   └── robots.ts
├── components/
│   ├── home/                     # Hero, stats, projects teaser, inquiry, career, testimonials
│   ├── projects/                 # Grid, cards, viewer modals (gallery, plans, info)
│   ├── services/                 # Services list + per-service “consist-of” sections
│   ├── about/                    # Founder / studio content
│   ├── news/                     # News listing UI
│   ├── admin/                    # Admin tables, forms, modals (by domain)
│   └── shared/                   # Navigation, footer, GA, legal/cookie banners
├── contexts/
│   └── LanguageContext.tsx       # EN/FR i18n (inline dictionary, localStorage)
├── services/                     # API clients (all use services/api.ts)
│   ├── api.ts                    # Base URL, fetch wrapper, credentials
│   ├── inquiries.ts, stripe.ts, projects.ts, …
│   └── admin/                    # Admin-only endpoints
├── config/                       # socialLinks, siteMetadata
├── styles/                       # globals.css
├── next.config.js                # @ alias, Cloudinary image domains
├── tsconfig.json                 # paths: "@/*" -> "./*"
└── package.json
```

### Design patterns

| Pattern | Where |
|---------|--------|
| **App Router pages** | `app/**/page.tsx` — server components where possible; `'use client'` for interactivity |
| **Layout composition** | `PublicLayoutWrapper` (nav + footer) for public routes; `AdminLayoutClient` for `/admin/*` |
| **Service layer** | `services/*.ts` — typed wrappers around `get` / `post` / `put` / `patch` / `del` |
| **CSS Modules** | Co-located `*.module.css` next to components |
| **i18n** | Client-side `LanguageContext` + `beforeInteractive` script in root layout to avoid language flash |
| **Auth (admin)** | Cookie-based JWT; layout calls `GET /api/admin/auth/me` and redirects to `/admin/login` on 401 |

There is no dedicated `hooks/` or `types/` directory; types live beside services or in component files.

---

## Features (UI)

### Public site

- **Home:** Hero, editable company stats (`/api/homepage-stats`), services overview, published projects, testimonials submission/listing, career section (published job openings + application form with CV/portfolio upload), multi-step **inquiry wizard** (identity → context/documents → path → general submit or paid consultation).
- **About:** Studio and founder narrative.
- **Services:** Index plus dedicated pages — Architecture, Interior Design, Landscape, Photography, 3D Scanning, 3D Printing, Branding, Preliminary Declaration & Approvals.
- **Projects:** Grid of published work; detail viewer with gallery slideshow, project info, and **plans** (only for non-Residential projects when plans exist).
- **News & blogs:** Listing and slug-based article pages (HTML content sanitized for display).
- **Inquiry / consultation:** Date/time availability checks, Stripe Checkout for consult path, success/cancel pages, post-payment flows coordinated with backend webhooks.
- **Legal & privacy:** Cookie banner, consent-gated Google Analytics (GA4 `G-ESPTY58V3P`), privacy/terms/cookie modals.
- **SEO:** Rich root metadata, JSON-LD `ArchitectureFirm` schema, dynamic `sitemap.xml`, `robots.txt` (disallows `/admin`).

### Admin (`/admin`)

| Route | Purpose |
|-------|---------|
| `/admin/login` | Email/password login (httpOnly cookies) |
| `/admin/dashboard` | Counts, recent activity, Stripe revenue summary; edit homepage stats |
| `/admin/projects` | CRUD, publish/unpublish, Cloudinary image/plan uploads |
| `/admin/testimonials` | Approve / reject / delete submissions |
| `/admin/inquiries` | List/filter inquiries; billing panel for business clients |
| `/admin/bookings` | Paid consultation bookings (subset of inquiries) |
| `/admin/careers` | Job opening CRUD, publish/archive |
| `/admin/applications` | Career applications: status, notes, CV/portfolio download, CSV export |
| `/admin/blogs` | Blog CRUD with TinyMCE, publish/unpublish |
| `/admin/news` | News CRUD, publish/unpublish |
| `/admin/profile` | Update admin email/password |

---

## Getting started / local development

### Prerequisites

- **Node.js 18+** (required by Next.js 14; LTS recommended)
- **npm** (or compatible package manager)
- Backend API running locally (default `http://localhost:5000`) — see [backend README](../backend/README.md)

### Installation

```bash
cd frontend
npm install
```

### Environment variables

Create `frontend/.env.local`:

```env
# Required for local dev — must include the /api suffix
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Required for admin blog editor (TinyMCE cloud)
NEXT_PUBLIC_TINYMCE_API_KEY=your_tinymce_api_key

# Recommended in production (Vercel)
NEXT_PUBLIC_SITE_URL=https://www.dibeh-architecture.com
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | **Yes** (prod) / recommended (dev) | Full API prefix including `/api`, e.g. `https://your-backend.onrender.com/api`. All service calls append paths like `/inquiries`, `/projects`. |
| `NEXT_PUBLIC_TINYMCE_API_KEY` | For blog admin | TinyMCE API key used by `TinyMCEBlogEditor`. |
| `NEXT_PUBLIC_SITE_URL` | Prod recommended | Canonical site origin for `sitemap.ts` absolute URLs. Defaults to `http://localhost:3000` in development. |

If `NEXT_PUBLIC_API_URL` is unset:

- **Development:** `http://localhost:5000/api`
- **Production / Vercel:** `https://architect-portfolio-backend-5bow.onrender.com/api` (hardcoded fallback in `services/api.ts` and `app/sitemap.ts`)

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run Next.js ESLint |

### Typical local workflow

1. Start MongoDB-backed API: `cd backend && npm run dev`
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

- Uses native **`fetch`** (not Axios).
- Default **`credentials: 'include'`** so httpOnly admin cookies (`accessToken`, `refreshToken`) are sent on cross-origin requests when CORS allows it.
- Public read-only calls may pass `{ withCredentials: false }` to omit cookies.
- JSON requests set `Content-Type: application/json`.
- Responses expect backend shape: `{ success: boolean, message?: string, data?: T }`.

### Service modules

| Module | Endpoints (relative to base URL) |
|--------|----------------------------------|
| `services/api.ts` | `get`, `post`, `put`, `patch`, `del` |
| `services/inquiries.ts` | `/inquiries/*` multi-step flow, availability |
| `services/stripe.ts` | `/stripe/create-checkout-session`, session status |
| `services/projects.ts` | `/projects` |
| `services/blogs.ts`, `news.ts` | `/blogs`, `/news` |
| `services/testimonials.ts` | `/testimonials` |
| `services/careerApplication.ts`, `jobs.ts` | `/career`, `/careers` |
| `services/homepageStats.ts` | `/homepage-stats` |
| `services/admin/*` | `/admin/*` protected routes |

**Multipart uploads** (inquiry documents, career CV, admin project images) use `FormData` and dedicated fetch calls in the relevant service files—not the default JSON `fetchApi` helper.

### Admin authentication flow

1. `POST /admin/auth/login` → sets httpOnly cookies on the API domain.
2. `AdminLayoutClient` calls `GET /admin/auth/me` on each protected page load.
3. On **401**, client redirects to `/admin/login`.
4. `POST /admin/auth/refresh` available for token refresh.

For production, the API must list the frontend origin in `FRONTEND_URLS`, use `credentials: true` CORS, and set `COOKIE_DOMAIN` on the backend when frontend and API are on sibling subdomains.

### Images

`next.config.js` allows remote images from `res.cloudinary.com` (primary), `**.supabase.co`, and `images.unsplash.com`.

---

## Deployment (Vercel)

1. Connect the `frontend` directory (or monorepo path) to Vercel.
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` → production API with `/api` suffix
   - `NEXT_PUBLIC_SITE_URL` → `https://www.dibeh-architecture.com`
   - `NEXT_PUBLIC_TINYMCE_API_KEY`
3. Build command: `npm run build` — Output: Next.js default.
4. Ensure backend `FRONTEND_URLS` includes the Vercel/production domain.

---

## Related documentation

- [API_CONFIG.md](./API_CONFIG.md) — API URL override notes
- [Backend README](../backend/README.md) — REST API, Stripe webhooks, MongoDB
