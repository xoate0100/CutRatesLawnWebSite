# Security Inventory — Cut Rates Lawn Website

**Audit:** `/audit-security-nist` (discovery)  
**Date:** 2026-09-01  
**Stack:** Next.js (App Router) — `applies_to: next`  
**Mode:** discovery (read-only)

## Scope

Marketing + lead-capture site with server API routes, optional Go High Level (GHL) CRM integration, Strapi CMS reads, and external FieldPortals customer portal. No local database or Supabase in this repo.

## API routes (`app/api/`)

| Route | Methods | Auth required | Data classification | Notes |
|-------|---------|---------------|---------------------|-------|
| `/api/lead` | POST | None (public) | PII (name, email, phone, address, message) | Primary lead path; Zod validation, honeypot, optional Turnstile, in-memory rate limit |
| `/api/newsletter` | POST | None | PII (email) | GHL/webhook/Resend delivery; no IP rate limit |
| `/api/contact` | POST | None | PII | **Stub** — logs body, simulates success, no delivery |
| `/api/health` | GET | None | Internal (Strapi token validity, endpoint map) | Runs `runApiDiagnostics()` |
| `/api/health/strapi` | GET | None | Internal | Strapi connectivity |
| `/api/google-reviews` | GET | None | Public (cached reviews) | Proxies Google Places API |
| `/api/reviews/google` | GET | None | Public | Duplicate reviews path via service factory |
| `/api/google-reviews-debug` | GET | None | **Secret metadata** | Exposes `placeIdValue`, key length |
| `/api/test` | GET | None | — | Returns "Hello World" |
| `/api/simple` | GET | None | — | Returns "OK" |
| `/api/html` | GET | None | — | Returns raw HTML test page |
| `/api/mock-homepage` | GET | None | — | Mock CMS JSON |
| `/api-debug` (app route) | GET | None | **Secret metadata** | Key prefix, placeId, live API probe |

## Page routes — auth boundaries

| Route pattern | Middleware | Effective auth | Trust boundary |
|---------------|------------|--------------|----------------|
| `/account/*` | `auth_token` cookie check | **Broken** — lib uses `localStorage` key `cut_rates_auth_token`, not cookie | Client-only mock auth |
| `/dashboard/*` | Cookie check | Redirects to FieldPortals (no local dashboard) | External portal |
| `/login`, `/register` | Redirect if cookie present | Mock credentials `user@example.com` / `password` | Fiction |
| `/portal` | None | Redirect to `NEXT_PUBLIC_CUSTOMER_PORTAL_URL` | FieldPortals (external) |
| `/admin/*` | None | **Unauthenticated** | Strapi setup/diagnostics UI |
| `/debug`, `/api-test`, etc. | None | **Unauthenticated** | Dev tooling |
| `/dev/components` | None | `notFound()` in production only | Partial gate |
| Public marketing (`/`, `/contact`, `/quote`, …) | None | N/A | Lead forms → `/api/lead` |

## Middleware (`middleware.ts`)

- Matcher: `/account/:path*`, `/dashboard/:path*`, `/login`, `/register`
- Checks cookie name: `auth_token`
- Does **not** protect `/api/*`, `/admin/*`, debug routes

## Secrets & environment (server-only)

| Variable | Purpose | Exposure risk |
|----------|---------|---------------|
| `GHL_PRIVATE_INTEGRATION_TOKEN` | GHL upsert | Server-only (correct) |
| `GHL_LOCATION_ID` | GHL location | Server-only |
| `TURNSTILE_SECRET_KEY` | Spam check | Server-only; optional → bypass |
| `RESEND_API_KEY` | Email delivery | Server-only |
| `CONTACT_FORM_WEBHOOK_URL` | Webhook delivery | Server-only |
| `STRAPI_API_TOKEN` | CMS reads | Server-only; validity leaked via `/api/health` |
| `GOOGLE_PLACES_API_KEY` | Reviews proxy | Server-only; metadata leaked via debug routes |
| `GOOGLE_PLACE_ID` | Reviews target | Leaked in `/api/google-reviews-debug`, `/api-debug` |

## Public (`NEXT_PUBLIC_*`)

Business contact info, site URL, customer portal URL, media base URL — appropriate for client bundle per `.env.example`.

## Data flows (PII)

```
ContactFormBlock / QuoteFunnel / NewsletterSignup
  → POST /api/lead | /api/newsletter
    → GHL upsert (if configured) | webhook | Resend
```

Alternate (orphaned): `components/forms/contact-form.tsx` → `/api/contact` (log only).

## Security headers

- **Global response headers:** not configured in `next.config.mjs`
- **Image optimizer only:** CSP `default-src 'self'; script-src 'none'; sandbox` for SVG path

## External systems

| System | Auth model | Validated this audit |
|--------|------------|----------------------|
| Go High Level | Private Integration Token | Code reviewed; prod env/workflows unverified |
| FieldPortals | External SSO/session | Not in scope of this repo |
| Strapi CMS | Bearer token (server) | Health endpoint probes |
| Google Places | API key (server) | Proxied via `/api/google-reviews` |
| Cloudflare Turnstile | Site + secret keys | Secret optional; UI not wired |

## Attack surface summary

- **Unauthenticated:** All `/api/*` routes, admin pages, debug endpoints
- **Authenticated (intended):** `/account` — mock only, easily bypassed
- **No file upload, no SQL/ORM** in this app layer
