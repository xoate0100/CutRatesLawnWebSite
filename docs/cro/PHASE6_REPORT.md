# Phase 6 — Validation

**Date:** 2026-09-20  
**Branch:** `cro/phase-1-measurement`

## Completed this pass

- Playwright projects: **phone-390** (390×844), **tablet-768** (768×1024), **desktop-1440** (1440×900)
- Specs: `tests/e2e/cro-phase6.spec.ts`, `cro-measurement.spec.ts`, `quote-funnel.spec.ts`
- **Result:** 55 passed, 2 skipped (sticky Call chip is `md:hidden`, so tablet/desktop skip by design)
- Routes checked at all three viewports with no material `console.error`: `/`, `/quote`, `/quote/mowing`, `/lp/snow-removal`, `/service-areas/derby/pest-control`, `/pricing`, `/contact`
- `conversion_lead` dataLayer contract on thank-you without UTM; `conversion_gated_on_attribution: false`
- `/lp/*` stripped chrome (no Services/Bundles nav)
- CI gate: `lib/analytics/datalayer-contract.test.ts` is part of `pnpm run test:analytics` / `npm run verify`
- Dead v0 headers/footers/fake forms moved to `components/_graveyard/`
- `waitForGTM` no longer waits 5s when no GTM container is configured (organic thank-you was dropping conversions for bounce-back visitors)
- Cron route accepts **GET and POST** so Vercel Cron can hit `/api/cron/lead-retry`
- Human playbook: `docs/cro/HUMAN_FINISH_GUIDE.md`

## Lighthouse (mobile, local `next start` on :3010)

Script: `pnpm run audit:lighthouse-cro` → `artifacts/audit/cro-lh/lh-summary.json` (not committed).

Targets from the CRO plan: performance ≥ 90, accessibility ≥ 95, CLS < 0.1.

| Page | Perf | A11y | CLS | vs target |
|---|---|---|---|---|
| `/` | 78 | 100 | 0.028 | a11y + CLS pass; perf miss |
| `/quote` | 85 | 98 | 0.000 | a11y + CLS pass; perf miss |
| `/quote/mowing` | 86 | 95 | 0.000 | a11y + CLS pass; perf miss |
| `/lp/snow-removal` | 95 | 98 | 0.009 | **all pass** |
| `/service-areas/derby/pest-control` | 84 | 100 | 0.000 | a11y + CLS pass; perf miss |

Local lab (no CDN, hero media, first-load JS ~146 kB on marketing chrome). Production on Vercel + GCS images will differ. **Do not block merge on local perf 90** if a11y/CLS hold; re-run Lighthouse on the Preview URL after deploy.

Chrome-launcher printed `EPERM` on Windows tmp cleanup; scores still wrote.

## Deviations

- Vendor `analytics.tracking` conformance still requires attribution. Runtime does not. Intentional split (vendor/ is outside `write_to`).
- `components/cta-section.tsx` still live on legacy pages — not graveyarded.
- Lighthouse performance target not met on chrome-heavy pages in this local run.

## Merge

- **Do not merge to main** until Andy finishes `docs/cro/HUMAN_FINISH_GUIDE.md` (H-CRO-017): GHL secrets, Redis, Cron, website-lead SMS workflow, smoke test.
