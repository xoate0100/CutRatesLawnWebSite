# System and Workflow Inventory

**Audit date:** 2026-08-01  
**App:** CutRatesLawnWebSite — Next.js 14.2.16 App Router marketing / lead shell

## Architecture snapshot

```
Browser
  → Next.js pages (SSR/static UI)
       ├─ Client mocks: /contact, /schedule, /quote, live-chat, search
       ├─ /portal → redirect FieldPortals (external auth/account)
       ├─ /dashboard → public mock customer UI (no auth)
       └─ mediaSrc()/getMedia() → lib/generated/media-map.json
            → GCS URL or /placeholder.svg fallback

Offline ops: scripts/media/* → gs://site_photo_storage (gcloud ADC)

Absent in-repo: app/api, middleware, DB, auth libraries, cron/jobs, form webhooks
```

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.2.16, React 18, TypeScript |
| UI | Tailwind, shadcn/Radix, lucide-react |
| Config | `lib/site-config.ts`, `.env` / `.env.example` |
| Media | `lib/media.ts`, `docs/media/*`, `scripts/media/*`, sharp/yaml |
| Tests | Playwright Edge (`tests/e2e/*`) |
| Deploy | Vercel (`vercel.json` → `npm run verify`) |

## Roles

| Role | In this app | Enforcement |
|------|-------------|-------------|
| Anonymous visitor | Yes (default) | None required |
| Customer | External FieldPortals only | **Not enforced** in Next |
| Admin / staff | Does not exist | N/A |
| Impersonated “logged-in” UI | `/dashboard` mock | **None** — public |

## Routes (implemented)

29 local pages + `/portal` redirect. Client components: `contact`, `quote`, `schedule` only.

See explore inventory: `/`, `/about`, `/blog`, `/bundles` (+ all/residential/commercial/seasonal), `/careers`, `/case-studies`, `/certifications`, `/community`, `/contact`, `/dashboard`, `/faq`, `/our-work`, `/pricing`, `/quote`, `/referral`, `/schedule`, `/service-areas`, `/services` (+ all/commercial/landscaping/lawn-care/pest-control/power-washing/residential).

## Linked but missing (404 confirmed 2026-08-01)

`/account`, `/blog/*` (3 slugs), `/bundles/landscape`, `/bundles/total-home`, `/careers/apply`, `/case-studies/*` (3), `/invoices`, `/privacy`, `/services/gutter-cleaning`, `/services/hardscapes`, `/services/hardscaping`, `/services/snow-removal`, `/sitemap`, `/terms`.

## APIs / backend

- **No** `app/api/**` route handlers.
- Guessed paths `/api`, `/api/contact`, `/api/auth/session`, `/api/leads`, `/.env`, `/admin` → **404**.
- `.env.example` anticipates `CONTACT_FORM_WEBHOOK_URL`, `RESEND_API_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID` — not wired.

## Database / jobs

None in the Next runtime. Media pipeline is CLI-only.

## Third-party services

| Service | Status |
|---------|--------|
| FieldPortals | Live redirect/link; auth **unvalidated** |
| Google Maps embed | Contact page iframe (third-party key in Maps traffic) |
| GCS `site_photo_storage` | Bucket accessible via gcloud user; site slots unbound |
| Envato MCP | Ops tooling (global Cursor); not runtime |
| Analytics | Not wired |
| Email/CRM | Not wired |

## Expected end-to-end journeys (inventory before test)

| ID | Journey | Expected outcome | Actual (audit) |
|----|---------|------------------|----------------|
| J1 | Browse services → Learn More | Reach detail page | Partial — several homepage CTAs 404 |
| J2 | Request quote | Durable quote / lead | Local `$0` calc; no network |
| J3 | Schedule service | Booking or portal handoff | Dead end; console only |
| J4 | Contact form | Lead stored/emailed | Fake success alert; no POST |
| J5 | Newsletter subscribe | Provider subscription | GET `/?` reload |
| J6 | Customer portal | Authenticated account | External FieldPortals landing |
| J7 | In-app dashboard | Auth + real data | Public mock; `/account` `/invoices` 404 |
| J8 | Legal/privacy | Policy pages | 404 |
| J9 | Careers apply | Application flow | `/careers/apply` 404 |
| J10 | Referral share | Copy working link | Copy inert; fake URL |
| J11 | Live chat | Agent or ticket | Client mock reply |
| J12 | Media publish | GCS + page CDN URL | Pipeline works offline; slots still placeholders |
| J13 | Search | Relevant results | 3 hardcoded local matches |

## Forms matrix

| Surface | Handler | Network |
|---------|---------|---------|
| Contact | `console.log` + `alert` | None (app) |
| Schedule | `console.log` | None |
| Quote | Local math | None |
| Footer/blog newsletter | No `onSubmit` | Accidental GET |
| Live chat | Local state | None |
| Search | Mock filter | None |
| Referral Copy | No `onClick` | N/A |
