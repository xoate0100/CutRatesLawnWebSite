# Merged Findings Register

**Orchestrator:** `/audit-all`  
**Date:** 2026-09-22  
**SoT:** This file for open/closed after merge. Domain packs may lag until next domain refresh.

**Status legend:** `Open` | `Patched-unshipped` | `Closed` | `Owner-decision`

---

## P0

### ALL-F-101 — GTM not active in production browser bundle
- **status:** Closed (verified live 2026-09-22)
- **severity:** critical · **priority:** P0
- **root_cause:** Dynamic `process.env[key]` prevented Next from inlining `NEXT_PUBLIC_GTM_CONTAINER_ID` into client JS (SSR noscript still worked)
- **fix:** Static env access (`1c4afc8`); deploy `dpl_5FqorFgARtrrDm7ezEABjzXjmnk5`
- **evidence:** Live `gtm_configured: true`; network `gtm.js?id=GTM-KGVZJ93G` + GA4 `G-5X2990G1ZP` + Ads `AW-16564037616`

### ALL-F-102 — Canonicals / sitemap use localhost
- **status:** Closed (verified live)
- **fix:** `NEXT_PUBLIC_SITE_URL=https://cutrateslawn.com` + redeploy
- **evidence:** Prod `/sitemap.xml` hosts `cutrateslawn.com`

### ALL-F-103 — Empty SSR HTML (Suspense around entire tree)
- **status:** Closed (verified live)
- **fix:** AnalyticsProvider side-effect sibling under Suspense (`f8a6500`)
- **evidence:** Fetch of `/service-areas/wichita/lawn-care` contains H1; `/debug` and `/api-test` return 404

---

## P1

### ALL-F-104 — Lead delivery / durable queue unverified
- **status:** Open
- **severity:** high · **priority:** P1
- **affected:** `/api/lead`, GHL, Upstash
- **actual:** GHL env present on Vercel; no `UPSTASH_*`; no labeled E2E lead this pass; in-memory fallback loses leads
- **fix:** Human `GHL-TEST-001`; add Upstash + ensure cron `/api/cron/lead-retry` authorized with `CRON_SECRET`
- **regression:** Test lead appears in GHL with tags `website-lead` / `source:quote`

### ALL-F-105 — Turnstile mismatch risk
- **status:** Open (currently both unset — consistent)
- **severity:** high · **priority:** P1
- **affected:** quote/contact submit
- **actual:** Widget absent live; no `TURNSTILE_*` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` on Vercel (safe). If secret alone is added later, every submit fails "Spam check failed."
- **fix:** Set site key + secret together, or leave both unset
- **code:** Partial leads no longer send Turnstile token (`quote-funnel.tsx`)

### ALL-F-106 — CSP blocked analytics / ads / CF Insights
- **status:** Patched-unshipped
- **severity:** high · **priority:** P1
- **fix:** CSP allowlist expanded in `next.config.mjs` for GTM/GA/Ads/CF Insights/Turnstile
- **regression:** No CSP console violations on `/` after deploy

### ALL-F-107 — Funnel events inflated (~5×)
- **status:** Patched-unshipped
- **severity:** high · **priority:** P1
- **root_cause:** `useAnalytics()` returned a new object each render → effect re-fired
- **fix:** Memoize hook return

### ALL-F-108 — Fake conversions on thank-you
- **status:** Patched-unshipped
- **severity:** high · **priority:** P1
- **actual:** `rid` defaulted to `unknown` and still fired `conversion_lead`
- **fix:** Fire only when real `rid` present; E2E covers negative case

### ALL-F-109 — Public debug / test pages
- **status:** Patched-unshipped
- **severity:** high · **priority:** P1
- **fix:** Removed page routes + debug API stubs (`google-reviews-debug`, `api-debug`, `api/test`, etc.)
- **regression:** Prod 404 for `/debug`, `/api-test`, `/api/google-reviews-debug`

### ALL-F-110 — Fake `@leads.cutrateslawn.com` emails
- **status:** Patched-unshipped
- **severity:** high · **priority:** P1
- **fix:** Stop inventing emails; omit from GHL upsert when empty/placeholder

### ALL-F-111 — Deep link skips address
- **status:** Patched-unshipped
- **severity:** high · **priority:** P1
- **fix:** Resolved service always starts on `details` step

### ALL-F-112 — Stale Google review count (24 vs 32)
- **status:** Patched-unshipped
- **fix:** `GOOGLE_REVIEW_COUNT = 32`

---

## P2

### ALL-F-201 — Referral / certifications / thin content
- **status:** Patched-unshipped (referral + certs); Open (case-studies, community)
- **fix:** Softened public copy; unpublish or rewrite `/case-studies` + `/community`

### ALL-F-202 — Media slot quality (hardscape/aeration)
- **status:** Patched-unshipped (interim remaps)
- **fix:** Human Envato/own photography + `media:publish`

### ALL-F-203 — Consent defaults analytics/ads off
- **status:** Closed (owner chose US opt-out 2026-09-22)
- **actual:** Was deny-until-Accept; now default granted with banner opt-out
- **fix:** `DEFAULT_CONSENT` + gtm-init consent default + banner “Got it” / “Turn off ads & analytics”

### ALL-F-204 — Blog dead links / Strapi 504 / empty portal
- **status:** Open
- **affected:** blog redirects to `/blog`; Strapi health 504; `/schedule` → `/portal` empty
- **fix:** Remove dead blog cards; fix or drop Strapi; portal truthfulness

### ALL-F-205 — GA4 measurement ID not on Vercel
- **status:** Open (may be OK if GTM-only)
- **fix:** Confirm GA4 loads via GTM; else set `NEXT_PUBLIC_GA4_MEASUREMENT_ID`

---

## Closed / superseded from 2026-09-01 register

| Prior ID | Note |
|----------|------|
| ALL-F-001 debug APIs | Routes removed (confirm after deploy) |
| ALL-F-002 GHL not on Vercel | **Closed** — GHL PIT/location/pipeline present |
| ALL-F-010 no security headers | Superseded — headers+CSP now in `next.config.mjs` (CSP hosts expanded this pass) |
