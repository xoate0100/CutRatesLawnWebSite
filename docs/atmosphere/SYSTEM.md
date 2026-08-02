# Atmosphere System — Cut Rates Lawn

**Date:** 2026-08-01  
**Thesis:** Trusted Midwestern outdoor craft — deep lawn greens, soft earth warmth, photographic heroes with careful scrims, quiet motion.  
**Depends on:** [`RECON.md`](./RECON.md), [`AUDIT.md`](./AUDIT.md)

---

## 1. Gradient family (token-driven)

| Recipe | Utility class | Use |
|--------|---------------|-----|
| Hero plane | `.atm-hero-scrim` | Dark green→black gradient over hero photos for AA text |
| Soft canvas | `.atm-canvas` | Page/section base (warm off-white from tokens) |
| Accent wash | `.atm-wash` | Soft primary tint behind CTAs / proof bands |
| Brand CTA | `.atm-cta-band` | Solid primary with subtle radial depth |

All colors from `--primary`, `--background`, `--foreground`, `--atm-earth`, `--atm-mist`.

---

## 2. Overlay layer

| Layer | Class | Rules |
|-------|-------|-------|
| Film grain | `.atm-grain` | `aria-hidden`, `pointer-events-none`, absolute, opacity ≤ 0.07; SVG feTurbulence data-URI |
| Vignette | `.atm-vignette` | Soft radial edge darkening on heroes only |
| Photo tint | `.atm-photo-tint` | Optional green duotone wash on imagery |

Print: `@media print { .atm-grain, .atm-vignette, .atm-photo-tint { display: none } }`

---

## 3. Motion vocabulary

| Token | Value | Trigger |
|-------|-------|---------|
| `--atm-dur-fast` | 150ms | Hover/focus |
| `--atm-dur` | 280ms | Entrance / state |
| `--atm-dur-slow` | 450ms | Section reveal |
| `--atm-ease` | cubic-bezier(0.22, 1, 0.36, 1) | Default |

Classes: `.atm-enter`, `.atm-hover-lift`  
**Required:** `@media (prefers-reduced-motion: reduce)` disables transforms/animations; static opacity fallbacks.

Reuse `tailwindcss-animate` for Radix; no new animation libraries.

---

## 4. Elevation & seams

| Level | Token / class |
|-------|----------------|
| Flat | none |
| Raised | `--atm-shadow-1` / `.atm-elev-1` |
| Floating | `--atm-shadow-2` / `.atm-elev-2` |
| Section seam | `.atm-seam` hairline using `--border` |
| Soft fade seam | `.atm-seam-fade` |

---

## 5. Motif

Single motif: **contour turf lines** — inline SVG `components/atmosphere/turf-motif.tsx`, token-colored (`primary` at low opacity). Use sparingly on Tier 1 section backgrounds only. `aria-hidden`.

---

## 6. Imagery rules

| Surface tier | Photo | Illustration | Pure CSS |
|--------------|-------|--------------|----------|
| 1 Full | Heroes, proof, service cards | Empty-state spot only | Gradients + grain |
| 2 Medium | Optional thumbs | Empty states | Canvas + elev |
| 3 Focus | None competing with fields | None | Token surfaces only |

Always: text over photo needs `.atm-hero-scrim`; set width/height on media; lazy-load below fold.

---

## 7. Icon policy

- **Family:** Lucide only (`components.json`).  
- Sizes: 16 / 20 / 24. Stroke default.  
- Functional icons inherit `currentColor`; decorative `aria-hidden`.

---

## 8. Fallback contract

Every `SLOT_MAP` entry has `fallback: /placeholder.svg?...`.  
`mediaSrc(slot)` always returns a string. CSS `.atm-media-fallback` provides muted canvas if image errors (optional onError).

---

## 9. Intensity application

- **Full:** home, services, bundles, pricing, about, our-work, testimonials, referral, careers  
- **Medium:** blog, faq, service-areas, search, sitemap, portal chrome  
- **Minimal:** contact, quote, schedule, apply, login, register, privacy, terms  

---

## 10. Implementation map

| Piece | Path |
|-------|------|
| Tokens + utilities | `app/globals.css` |
| Tailwind shadows/duration | `tailwind.config.ts` (extend) |
| Grain / motif / section | `components/atmosphere/*` |
| Empty / skeleton | `components/atmosphere/empty-state.tsx`, reuse `components/ui/skeleton.tsx` |
| Media accessor | `lib/media.ts` (unchanged API) |
| Slots | `docs/media/SLOT_MAP.yaml` → `lib/generated/media-map.json` |
