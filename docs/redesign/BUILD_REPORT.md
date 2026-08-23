# Redesign build report

**Branch:** `feat/design-system-rebuild` → `main`  
**Date:** 2026-08-23  
**Package manager:** pnpm

## What shipped

Full marketing redesign from `docs/redesign/*` prototypes:

- Brand tokens (forest / lime / cream / paper) + Bricolage Grotesque + Hanken Grotesk
- Block library under `components/blocks/` + MediaFrame/VideoFrame via `getMedia(slot)`
- Home, services (+ aeration, holiday-lights), service-areas (+ 7 town slugs), quote, our-work, bundles, about, contact
- Lead path preserved: QuoteFunnel → `/api/lead`, contact → lead/contact APIs, estimator math unchanged
- `/dev/components` QA gallery

## Routes (new / rebuilt)

| Route | Notes |
|-------|--------|
| `/` | Full home composition |
| `/services`, `/services/[slug]`, dedicated service pages | Landscaping flagship |
| `/services/aeration`, `/services/holiday-lights` | New |
| `/service-areas`, `/service-areas/[slug]` | 7 towns |
| `/quote` | InteriorHero + existing funnel |
| `/our-work`, `/bundles`, `/about`, `/contact` | Block recipes |
| `/faq`, `/blog`, `/privacy`, `/terms` | Light reskin |

## Media slots (human licensing)

New / ensured in `docs/media/SLOT_MAP.yaml` (null `asset_id`, fallbacks):

- `home.hero.video`, `pattern.leaf`, `icons.gardening`
- `services.holiday-lights`, `services.snow-removal`, `services.commercial`
- `areas.{wichita,valley-center,andover,derby,maize,kansas-city,leavenworth}.hero`

See `docs/media/ENVATO_PROPOSALS_REDESIGN.md` for Envato shortlists. **Do not auto-download.**

## Validation

| Gate | Result |
|------|--------|
| `pnpm run build` | Pass |
| Pricing tests | Pass |
| Playwright chromium (`redesign` + `quote-funnel`) | 25/25 pass |
| Playwright mobile (Pixel 5 / chromium) | 22/22 pass |
| Hardcoded GCS/Envato URLs in app/components | Cleared |
| Binaries | None staged |
| Lighthouse mobile (best-effort) | home perf ~75–95 (CDN-sensitive), a11y **96**; landscaping perf **99**, a11y **97** |

Screenshots: `artifacts/redesign/*.png` (gitignored).

## Figma mirror

Target file: `sxG4jdV7FXFf8KtkCfKy96`  
Page: **Redesign — Build Progress** (see `docs/redesign/FIGMA_MIRROR.md` if API self-heal required).

## Code Connect (planned map)

| Code | Figma |
|------|--------|
| `components/ui/button.tsx` | Button (lime/ghost/dark) |
| `components/blocks/service-grid.tsx` | ServiceCard / FeatureCard |
| `components/ui/pill.tsx` | Pill |
| `components/ui/tag.tsx` | Tag |
| `components/blocks/bundle-card.tsx` | Bundle |
| `components/blocks/faq-accordion.tsx` | FAQ |
| `components/blocks/interior-hero.tsx` | InteriorHero |
