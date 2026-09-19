# UI/UX Audit — Inventory

**Domain:** `audit-uiux`  
**Mode:** discovery (read-only)  
**Stack:** next  
**Audited:** 2026-09-01  
**Repo:** `C:\Users\Andy\source\repos\CutRatesLawnWebSite`

## Design system

| Layer | Location | Notes |
|-------|----------|-------|
| Theme tokens | `app/globals.css` | `--forest`, `--lime`, `--paper`, `--sage`, etc.; `html { overflow-x: clip }` |
| Typography | `app/layout.tsx` | Bricolage Grotesque (`--font-display`), Hanken Grotesk (`--font-body`) |
| shadcn/ui | `components/ui/*` | Button, Card, Input, Select, Slider, SectionHead, Sonner toaster |
| Brand blocks | `components/blocks/*` | SiteHeader, SiteFooter, StickyQuoteBar, InteriorHero, CTASection, etc. |
| Atmosphere | `components/atmosphere/*`, `.atm-*`, `.grain` | Hero planes, grain overlays, mow-stripe |
| Media presentation | `components/media/media-frame.tsx` | Slot-driven `next/image` with optional treatments |
| Layout helpers | `lib/layout.ts` | `pageWrap`, `pageWrapQuote` |

## Global chrome (sticky / fixed)

| Component | File | Behavior |
|-----------|------|----------|
| AnnouncementMarquee | `components/blocks/announcement-marquee.tsx` | Top strip above header |
| SiteHeader | `components/blocks/site-header.tsx` | `sticky top-0 z-[80]`; mobile drawer nav |
| StickyQuoteBar | `components/blocks/sticky-quote-bar.tsx` | Fixed bottom-left chip, `md:hidden`; hidden on `/quote` |
| LiveChat FAB | `components/live-chat.tsx` | Fixed bottom-right; scroll-gated; hidden on `/quote` |
| Main padding | `app/layout.tsx` | `main` has `pb-24 md:pb-0` for mobile sticky clearance |

## Careers page surface

| Asset | Path |
|-------|------|
| Careers landing | `app/careers/page.tsx` |
| Apply route | `app/careers/apply/page.tsx` |
| Job cards | `components/careers/job-cards.tsx` |
| Apply form (4-step) | `components/careers/apply-form.tsx` |
| Lang toggle | `components/careers/lang-toggle.tsx` |
| Interactive tools | `paycheck-estimator`, `schedule-preview`, `job-fit-quiz`, `career-path`, `first-day-preview`, `manager-expectations` |

Careers uses design tokens (`bg-forest`, `font-display`, `SectionHead`, `Button variant="lime"`) and one `MediaFrame` (`careers.hero`). Page includes an in-page careers footer strip **in addition to** global `SiteFooter`.

## Legacy / duplicate header implementations

Active in production layout: `components/blocks/site-header.tsx` (via `app/layout.tsx`).

Also present (not wired to root layout):

- `components/header.tsx`
- `components/site-header.tsx`
- `components/layout/header.tsx`

## Responsive audit tooling

| Script | Routes covered | Output |
|--------|----------------|--------|
| `scripts/responsive-ux-audit.mjs` | 11 routes — **no `/careers`** | `artifacts/audit/responsive-audit.json` |
| `scripts/adversarial-responsive-journey.mjs` | `/`, `/quote`, `/services/landscaping`, `/bundles` + journey probes | `artifacts/audit/adversarial/report.json` |
| `scripts/adversarial-wave2.mjs` | Home menu, quote stepper, sticky/chat collision | `artifacts/audit/adversarial/wave2.json` |
| `scripts/pre-release-browser-audit.mjs` | Includes `/careers` | CI smoke |

## Evidence artifacts (existing)

- `artifacts/audit/adversarial/report.json` — 41/41 cells pass on Vercel preview (2026-08-27)
- `artifacts/audit/adversarial/wave2.json` — sticky/chat collision OK at 390×844
- Screenshots under `artifacts/audit/adversarial/` and `artifacts/audit/`

## Component counts (approx.)

- `components/ui/`: 20+ shadcn primitives
- `components/blocks/`: 15+ marketing blocks
- `components/careers/`: 10 interactive modules
- Hardcoded hex outside theme: isolated (`components/blocks/hero.tsx` only in grep sweep)
