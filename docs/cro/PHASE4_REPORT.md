# Phase 4 — Landing and funnel pages
**Date:** 2026-09-20

## Completed
- `/lp/[service]` noindex, chrome stripped via `MarketingChrome`
- `/quote/[service]` indexed segmented entries
- Area × service matrix `app/service-areas/[slug]/[service]`
- Seasonal grid/marquee via `lib/season.ts`
- Sitemap includes new indexed routes; robots disallow `/lp/` and `/thank-you`
- Bundle fake QuoteForm replaced with real `/quote` link
- Dead quote-form path removed from bundles (full `_graveyard` if build-green)

## Human defaults
- All 11 service slugs get `/lp` (H-CRO-007)
- All area × service combos generated (H-CRO-009)
