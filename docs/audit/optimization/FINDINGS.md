# Optimization — Findings

**Mode:** discovery (read-only) | **Date:** 2026-09-01

## Summary

| Priority | Open |
|----------|------|
| P0 | 0 |
| P1 | 0 |
| P2 | 4 |
| P3 | 3 |

---

### F-OPT-001 — Sticky chrome causes layout occlusion on mobile (CLS/UX)

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Core Web Vitals / CLS |
| Status | Open |

**Evidence:** `artifacts/audit/local-summary.json` — 47 critical `TEXT-UNDER` hits from `HEADER.sticky` and `StickyQuoteBar` (`DIV.fixed inset-x-0 bottom-0`). Component comment in `sticky-quote-bar.tsx` acknowledges prior audit failure.

**Impact:** Content hidden under fixed UI; may affect engagement and accessibility scores.

---

### F-OPT-002 — Unused `@fontsource-variable` packages in bundle graph

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Bundle |
| Status | Open |

**Evidence:** `@fontsource-variable/bricolage-grotesque` and `hanken-grotesk` in `package.json` dependencies; zero imports in codebase. Fonts loaded via `next/font/google` in `app/layout.tsx`.

**Impact:** Unnecessary install size; risk of accidental duplicate font loading if imported later.

---

### F-OPT-003 — No bundle analyzer or CI perf budget

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Bundle |
| Status | Open |

**Evidence:** No `@next/bundle-analyzer` script; `npm run verify` runs build but does not report chunk sizes.

**Impact:** Regressions from large client components (careers tools, recharts) may go unnoticed.

---

### F-OPT-004 — Legacy Hero component with debug logging and raw patterns

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Runtime / bundle |
| Status | Open |

**Evidence:** `components/hero.tsx` — multiple `console.log` calls, untyped `data` prop, fallback yellow debug UI. Redesign uses `components/blocks/hero.tsx` instead.

**Impact:** Dead code risk if imported; debug logs hurt production perf if reached.

---

### F-OPT-005 — Lighthouse script not wired to verify gate

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Measurement |
| Status | Open |

**Evidence:** `scripts/lighthouse-redesign.mjs` exists; not referenced in `scripts/verify.mjs` or CI.

**Impact:** CWV regressions only caught ad hoc.

---

### F-OPT-006 — High client-component surface area

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | RSC boundaries |
| Status | Open |

**Evidence:** ~90 `"use client"` files including pages like `app/schedule/page.tsx`.

**Impact:** Larger JS payload vs server-rendered marketing pages; higher INP risk on mid-tier mobile.

---

### F-OPT-007 — Playwright E2E triggers full production build each run

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Dev workflow (see also runtime-safety) |
| Status | Open |

**Evidence:** `playwright.config.ts` `webServer.command`: `pnpm run build && pnpm exec next start` with 300s timeout.

**Impact:** Slow feedback loop; significant local CPU during test runs.
