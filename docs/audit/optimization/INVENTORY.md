# Optimization — Inventory

**Audit:** `audit-optimization` | **Mode:** discovery | **Stack:** next | **Date:** 2026-09-01

## Render strategy

| Pattern | Usage |
|---------|-------|
| App Router RSC (default) | Most `app/**/page.tsx` without `"use client"` |
| Client pages | `app/schedule/page.tsx`, forms, interactive blocks |
| Dynamic import | `LiveChat` in `app/layout.tsx` (`ssr: false`) |
| `"use client"` components | ~90 files (forms, sliders, nav, careers tools) |

## Fonts

| Source | Path | Notes |
|--------|------|-------|
| `next/font/google` | `app/layout.tsx` | Bricolage Grotesque + Hanken Grotesk, `display: "swap"` |
| `@fontsource-variable/*` | `package.json` dependencies | **Not imported** — dead weight |

## Images

| Pattern | Count (approx) | Notes |
|---------|----------------|-------|
| `next/image` imports | ~24 component files | `components/media/media-frame.tsx`, blocks, cards |
| Raw `<img>` | Legacy components (`components/hero.tsx`) | Older scaffold path |
| Media pipeline | `lib/media.ts`, GCS slots | `docs/media/MEDIA_PIPELINE.md` |
| `sharp` | dependency | Available for Next image optimization |

## Bundle / dependencies

- Large UI surface: full Radix/shadcn kit in `components/ui/`
- Charts: `recharts` (dashboard/admin paths)
- Carousel: `embla-carousel-react`
- No `@next/bundle-analyzer` in devDependencies

## Measurement scripts

| Script | Path | Output |
|--------|------|--------|
| Lighthouse | `scripts/lighthouse-redesign.mjs` | `artifacts/redesign/lh-*.json` |
| Browser audit | `scripts/pre-release-browser-audit.mjs` | `docs/audit/evidence/` |
| Adversarial probes | `scripts/adversarial-audit-probes.mjs` | overlay/UX findings |
| Ship gate | `scripts/ship-gate-mobile.mjs` | mobile screenshots |

## Core Web Vitals signals (from artifacts)

`artifacts/audit/local-summary.json` (local build on port 3010):
- **47 critical** findings — predominantly `TEXT-UNDER` (sticky header/footer covering content)
- **11 pass cells** / 55 fail cells

`artifacts/audit/preview-summary.json` (Vercel preview):
- **116 critical** — includes `CSS-MISSING` (likely audit environment artifact on preview)
- Sticky overlay issues persist across routes

## Long-lived client views

- Careers tools (paycheck estimator, schedule preview, job-fit quiz)
- Before/after slider, live chat widget
- No lesson-player-scale sessions identified
