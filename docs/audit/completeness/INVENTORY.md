# Completeness Inventory — Cut Rates Lawn Website

**Audit:** `/audit-completeness` (discovery)  
**Date:** 2026-09-01  
**Stack:** Next.js — `applies_to: next`  
**Mode:** discovery (read-only)

## Interactive controls → handlers

| UI control | Location | Handler | Backend | Persistence / external |
|------------|----------|---------|---------|------------------------|
| Contact form (production) | `components/blocks/contact-form-block.tsx` | `onSubmit` → `fetch` | `POST /api/lead` | GHL / webhook / Resend |
| Quote funnel submit | `components/quote/quote-funnel.tsx` | `submitLead` | `POST /api/lead` | Same as contact |
| Newsletter (footer + blog) | `components/newsletter-signup.tsx` | `onSubmit` | `POST /api/newsletter` | GHL / webhook / Resend |
| Schedule "Continue to Contact" | `app/schedule/page.tsx` | `handleSubmit` → redirect | None (query params to `/contact`) | Handoff only — intentional |
| Legacy contact form A | `components/forms/contact-form.tsx` | `FormContainer` | `POST /api/contact` | **Stub — logs only** |
| Legacy contact form B | `components/contact-form.tsx` | `onSubmit` | **None** — `setTimeout` fake | **Silent fake success** |
| Login / Register | `components/auth/login-form.tsx`, register flow | `useAuth` | `lib/auth.ts` mock | localStorage only |
| Search | `app/search/page.tsx` | server `performSearch` | `lib/search.ts` mock array | No CMS/Strapi query |
| Live chat FAB | `components/live-chat.tsx` | Links to contact/phone | None | Honest offline help (not broken) |
| Referral copy link | `app/referral/page.tsx` | `copy()` clipboard | Client-generated URL | No server referral tracking |
| Google reviews widget | `components/google-reviews-list.tsx` | `fetch` | `GET /api/google-reviews` | Google Places proxy |
| API troubleshooter | `components/api-troubleshooter.tsx` | `fetch` | `GET /api/health` | Strapi diagnostics |

## API routes → callers

| Route | Called by | Status |
|-------|-----------|--------|
| `/api/lead` | ContactFormBlock, QuoteFunnel | **Wired** |
| `/api/newsletter` | NewsletterSignup (footer, blog) | **Wired** |
| `/api/contact` | `components/forms/contact-form.tsx` only | **Orphan stub** |
| `/api/health` | ApiTroubleshooter, admin diagnostics | Wired (ops) |
| `/api/google-reviews` | google-reviews-list, google-api-test | Wired |
| `/api/reviews/google` | No UI reference found | **Orphan duplicate** |
| `/api/google-reviews-debug` | dev api-key-validator | Debug only |
| `/api/mock-homepage` | Unknown / none in app | **Orphan** |
| `/api/test`, `/api/simple`, `/api/html` | None | **Scaffold orphan** |

## Server actions

No `app/**/actions.ts` or `"use server"` mutation actions found. All writes go through Route Handlers.

## Data layer

| Store | Readers | Writers | Notes |
|-------|---------|---------|-------|
| Strapi CMS | `lib/api.ts`, `lib/blog-api.ts`, page loaders | None from this app | Read-only content |
| GHL contacts | — | `lib/ghl.ts` via lead/newsletter APIs | Requires env |
| localStorage | `lib/auth.ts` | mock login/register | Not server-visible |
| In-memory Maps | `/api/lead`, `/api/newsletter` | same | Not durable |

## Feature flags

`0_phase0_bootstrap/feature_flags.yml` — agent write-path governance only. No product feature flags gating contact/quote/search.

## External integrations

| Integration | Code status | Ops status (per docs) |
|-------------|-------------|----------------------|
| Go High Level | `lib/ghl.ts` + lead/newsletter routes | `GHL-OPS-001` open — Vercel env + workflows |
| FieldPortals | Redirect from `/portal`, `/dashboard` | External — link only |
| Resend / webhooks | Optional paths in lead APIs | Env-dependent |
| Turnstile | Server verify in `/api/lead` | UI not wired; secret optional |
| Strapi | Extensive read clients + mock fallback | Token required for live content |
| Google Places | Reviews proxy | `GOOGLE_PLACES_API_KEY` required |

## Marker scan summary (`app/`, `components/`, `lib/`)

| Pattern | Notable hits |
|---------|--------------|
| `mock` | `lib/auth.ts`, `lib/search.ts`, `lib/services/mock-data.ts`, `app/api/mock-homepage` |
| `TODO` | `app/privacy/page.tsx` (attorney-review), `app/referral/page.tsx` (owner-approval) |
| `stub` | `app/api/contact`, e2e contact stub |
| `placeholder` | Image fallbacks (expected) |
| `Phase 3 preparation` | `lib/auth.ts`, `lib/search.ts` |

## User-reachable incomplete paths

1. `/search?q=…` — always mock results  
2. `/login`, `/register`, `/account` — mock auth vs portal strategy  
3. `/privacy` — legal shell  
4. `/referral` — unconfirmed reward copy  
5. `/admin/*` — setup docs without prod gate  
6. Lead forms — 503 if GHL/webhook/Resend all unset (correct failure, incomplete ops)
