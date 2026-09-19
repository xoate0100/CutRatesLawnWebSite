# SEO — Findings

**Mode:** discovery (read-only) | **Date:** 2026-09-01

## Summary

| Priority | Open |
|----------|------|
| P0 | 0 |
| P1 | 2 |
| P2 | 5 |
| P3 | 2 |

---

### F-SEO-001 — No XML sitemap or `robots.ts`

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Crawlability |
| Status | Open |

**Evidence:** No `app/sitemap.ts`, `app/sitemap.xml`, or `public/robots.txt`. Only an HTML page at `/sitemap` with 16 hand-picked links.

**Impact:** Search engines lack a machine-readable URL list; new dynamic routes (blog posts, service areas, bundle slugs) may not be discovered promptly.

---

### F-SEO-002 — JSON-LD structured data not wired; placeholders if enabled

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Structured data |
| Status | Open |

**Evidence:** `components/structured-data.tsx` and `components/json-ld.tsx` exist but are not imported by any route. `createLocalBusinessData()` falls back to placeholder phone `(555) 123-4567`, address `123 Green Street`, and NYC-ish geo coordinates.

**Impact:** No rich results eligibility; enabling without fixing defaults would emit invalid/misleading schema.

---

### F-SEO-003 — Key conversion routes lack unique metadata

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Metadata |
| Status | Open |

**Evidence:** No `metadata` export on `app/page.tsx` (home), `app/pricing/page.tsx`, `app/schedule/page.tsx`, `app/referral/page.tsx`, `app/portal/page.tsx`, `app/dashboard/page.tsx`, and several bundle sub-pages.

**Impact:** Duplicate or generic titles/descriptions in SERPs and social shares for high-intent pages.

---

### F-SEO-004 — No `llms.txt` for AI discoverability

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | AI discoverability |
| Status | Open |

**Evidence:** No `public/llms.txt` or equivalent machine-readable site summary.

**Impact:** Answer-engine and LLM crawlers lack a curated facts surface (services, service area, quote URL, contact).

---

### F-SEO-005 — HTML sitemap incomplete vs live route set

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Internal linking |
| Status | Open |

**Evidence:** `app/sitemap/page.tsx` lists 16 links. `scripts/pre-release-browser-audit.mjs` expects 29+ marketing routes including `/service-areas`, bundle variants, and service sub-pages.

**Impact:** Orphan risk for pages not linked from nav or sitemap.

---

### F-SEO-006 — Dev/test routes may be indexable

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Indexability |
| Status | Open |

**Evidence:** Routes like `/debug`, `/api-test`, `/test-page`, `/static-test`, `/google-reviews-test` have no `robots: { index: false }`. Only `app/dev/components/page.tsx` sets noindex.

**Impact:** Thin or diagnostic pages could appear in search results.

---

### F-SEO-007 — Root metadata includes `generator: "v0.dev"`

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Metadata hygiene |
| Status | Open |

**Evidence:** `app/layout.tsx` line 86.

**Impact:** Minor; exposes scaffold origin, no functional SEO harm.

---

### F-SEO-008 — Structured data component is client-rendered

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Structured data |
| Status | Open |

**Evidence:** `components/structured-data.tsx` uses `"use client"` and `useState` — JSON-LD would hydrate after first paint if used.

**Impact:** Crawlers that don't execute JS may miss schema even after wiring.
