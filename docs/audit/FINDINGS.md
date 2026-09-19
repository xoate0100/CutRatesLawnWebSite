# Merged Findings Register

**Orchestrator:** `/audit-all` (discovery)  
**Date:** 2026-09-01  
**De-duplication rule:** One root issue per row even if multiple domain audits surfaced it.  
**Detail:** See per-domain `docs/audit/<domain>/FINDINGS.md`.

---

## P0 — Immediate risk

### ALL-F-001 — Unauthenticated diagnostic endpoints leak configuration metadata
- **Domains:** security (F-001), observability (F-OBS-007)
- **status:** Confirmed
- **affected:** `/api/google-reviews-debug`, `/api-debug`, `/api/health`, `/admin/diagnostics`
- **actual:** Public JSON exposes place IDs, partial API key hints, Strapi connectivity, token validity
- **fix:** Remove or gate behind `NODE_ENV !== 'production'` + admin secret; strip health payloads in prod
- **evidence:** `app/api/google-reviews-debug/route.ts`, `app/api-debug/route.ts`, `app/api/health/route.ts`

---

## P1 — Core workflow / security / ops blockers

### ALL-F-002 — GHL production secrets not on Vercel
- **Domains:** integrations (INT-F-001), infra (INF-F-003), completeness (F-003), conversion (F-CONV-001)
- **status:** Confirmed (backlog `GHL-OPS-001`)
- **affected:** `/api/lead`, `/api/newsletter` in production
- **actual:** Code path fails closed (503) without `GHL_*` env; human ops step pending
- **fix:** Set `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID` on Vercel; run GHL-TEST-001

### ALL-F-003 — GHL nurture workflows not built
- **Domains:** integrations (INT-F-002)
- **status:** Confirmed (`GHL-WF-001` … `GHL-WF-003` pending)
- **actual:** Tags upsert; no staff/customer automation in GHL product
- **fix:** Build workflows per `docs/integrations/GOHIGHLEVEL.md`

### ALL-F-004 — Next.js 14.2.35 — multiple high CVEs
- **Domains:** dependencies (DEP-F-001), security (related)
- **status:** Confirmed (`pnpm audit` 2026-09-01)
- **actual:** 11+ high advisories; patched line ≥15.5.16
- **fix:** Planned upgrade with full `verify` + E2E regression

### ALL-F-005 — Vercel install uses npm; repo uses pnpm lockfile
- **Domains:** infra (INF-F-001), dependencies (DEP-F-008)
- **status:** Confirmed
- **affected:** `vercel.json` vs `packageManager: pnpm@10.26.0`
- **fix:** Switch Vercel to `pnpm install --frozen-lockfile`; remove `--legacy-peer-deps`

### ALL-F-006 — TypeScript and ESLint ignored at production build
- **Domains:** infra (INF-F-002), security (F-011)
- **status:** Confirmed
- **evidence:** `next.config.mjs` `ignoreBuildErrors`, `ignoreDuringBuilds`
- **fix:** Re-enable gates incrementally; add CI `tsc --noEmit` hard fail

### ALL-F-007 — Mock authentication with known demo credentials
- **Domains:** security (F-002), completeness (F-001)
- **status:** Confirmed
- **affected:** `lib/auth.ts`, `/login`, `/register`, `/account`
- **actual:** `user@example.com` / `password` returns mock JWT
- **fix:** Remove mock auth; redirect to FieldPortals only

### ALL-F-008 — Auth middleware vs localStorage mismatch
- **Domains:** security (F-003), completeness (F-007)
- **status:** Confirmed
- **actual:** Cookie gate in middleware; client uses `localStorage`; `/account` RSC always redirects
- **fix:** Single session model or delete local auth entirely

### ALL-F-009 — Legacy `/api/contact` logs PII and fakes success
- **Domains:** security (F-004), observability (F-OBS-001), completeness (F-004)
- **status:** Confirmed
- **fix:** Delete or 410; route all forms to `/api/lead`; redact logs

### ALL-F-010 — No global HTTP security headers
- **Domains:** security (F-005)
- **status:** Confirmed
- **fix:** Add `headers()` in `next.config.mjs` or middleware (CSP, HSTS, X-Frame-Options, nosniff)

### ALL-F-011 — Turnstile bypassed / not wired in lead UI
- **Domains:** security (F-006), completeness (F-005)
- **status:** Confirmed
- **actual:** Server skips when secret unset; contact/quote UI may not send token
- **fix:** Set `TURNSTILE_SECRET_KEY`; wire widget on lead forms

### ALL-F-012 — Careers apply uses mailto only — no CRM capture
- **Domains:** journey (F-001, F-002), conversion (F-CONV-003)
- **status:** Confirmed
- **affected:** `components/careers/apply-form.tsx`
- **fix:** POST to `/api/lead` with `source:careers` + role fields; keep mailto as optional fallback

### ALL-F-013 — No XML sitemap or robots.ts
- **Domains:** seo (F-SEO-001)
- **status:** Confirmed
- **fix:** Add `app/sitemap.ts`, `app/robots.ts` for live routes

### ALL-F-014 — JSON-LD structured data not wired
- **Domains:** seo (F-SEO-002)
- **status:** Confirmed
- **fix:** Wire LocalBusiness schema with real NAP; server-render where possible

### ALL-F-015 — High media placeholder rate + careers.crew attribution gap
- **Domains:** media (F-001, F-002)
- **status:** Confirmed
- **actual:** ~39% slots `asset_id: null`; `careers.crew` on CDN without Envato metadata
- **fix:** Complete `CAREERS-MEDIA-001` ingest; backfill registry attribution

---

## P2 — Notable (summary)

| ID | Title | Primary domain |
|----|-------|----------------|
| ALL-F-020 | Mock site search (`lib/search.ts`) | completeness |
| ALL-F-021 | Orphan/duplicate API routes | completeness |
| ALL-F-022 | Careers missing from responsive audit matrix | uiux / journey |
| ALL-F-023 | ES language toggle cosmetic only | uiux / journey |
| ALL-F-024 | Sticky chrome mobile occlusion (47 TEXT-UNDER hits) | optimization |
| ALL-F-025 | In-memory rate limit / idempotency on serverless | security / data |
| ALL-F-026 | Strapi CMS orphaned; mock fallback content | integrations / completeness |
| ALL-F-027 | FieldPortals authz unvalidated in-repo | integrations |
| ALL-F-028 | No production error tracking (Sentry etc.) | observability |
| ALL-F-029 | `verify.mjs` uncapped build; scripts bypass exec_guard | runtime-safety |
| ALL-F-030 | AI_CONTEXT / README stale vs current stack | docs |

---

## Counts

| Priority | De-duplicated open |
|----------|-------------------:|
| P0 | 1 |
| P1 | 14 |
| P2 | 24+ (see domain registers) |
| P3 | 12+ |

**Release gate:** Do not mark release-ready while ALL-F-001 (P0) or any P1 above remains open.
