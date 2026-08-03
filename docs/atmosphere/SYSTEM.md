# Atmosphere System — Cut Rates Lawn

**Date:** 2026-08-02 (intensity dial-up)  
**Thesis:** Trusted Midwestern outdoor craft — deep lawn greens, soft earth warmth, photographic heroes with careful scrims, quiet motion.  
**Depends on:** [`RECON.md`](./RECON.md), [`AUDIT.md`](./AUDIT.md)

---

## Intensity calibration (2026-08-02)

| Layer | Before (invisible) | After (perceptible) |
|-------|--------------------|---------------------|
| `.atm-grain` opacity | 0.055 | **0.12** |
| `.atm-grain-strong` | — | **0.18** (hero default) |
| Section tones | Near-white only | `canvas` / `canvas-alt` / `wash` / `deep-band` / earth muted |
| Turf motif | 112px strip @ 0.4 | `motifCoverage="full"` @ **0.10–0.18** + `ribs` variant |
| Hero scrim / vignette | Soft | Stronger deep greens for AA + drama |
| Photo treatment | Rare | `.atm-photo-tint` + `.atm-photo-scrim` on service/proof imagery |
| Motion | Load-once `.atm-enter` | Hero keeps enter; below-fold uses **scroll** `.atm-reveal` via `useReveal` / `AtmReveal` |
| Hover lift | −3px | **−6px** + stronger `--atm-shadow-2` + `:focus-visible` |

Thesis preserved: depth and life without kitsch. PRM gate still forces static/visible.

---

## 1. Gradient family (token-driven)

| Recipe | Utility class | Use |
|--------|---------------|-----|
| Hero plane | `.atm-hero-scrim` | Dark green→black gradient over hero photos for AA text |
| Soft canvas | `.atm-canvas` | Page/section base |
| Earth band | `.atm-canvas-alt` | Warmer alternate section |
| Accent wash | `.atm-wash` | Mist → earth → background |
| Soft mesh | `.atm-deep-band` | Proof / mid marketing bands |
| Brand CTA | `.atm-cta-band` | Solid primary with subtle radial depth |

Colors from `--primary`, `--background`, `--foreground`, `--atm-earth`, `--atm-mist`, `--atm-deep`.

---

## 2. Overlay layer

| Layer | Class | Rules |
|-------|-------|-------|
| Film grain | `.atm-grain` | `aria-hidden`, `pointer-events-none`, opacity **0.12** |
| Strong grain | `.atm-grain-strong` | opacity **0.18** (heroes) |
| Vignette | `.atm-vignette` | Soft radial edge darkening on heroes |
| Photo tint | `.atm-photo-tint` | Green duotone multiply on imagery |
| Photo scrim | `.atm-photo-scrim` | Bottom-up depth on cards |

Print: grain / vignette / tint / photo-scrim hidden.

---

## 3. Motion vocabulary

| Token | Value | Trigger |
|-------|-------|---------|
| `--atm-dur-fast` | 150ms | Hover/focus |
| `--atm-dur` | 280ms | Entrance / state |
| `--atm-dur-slow` | 450ms | Section reveal |
| `--atm-ease` | cubic-bezier(0.22, 1, 0.36, 1) | Default |

| Class | When |
|-------|------|
| `.atm-enter` (+ delays) | Above-the-fold / hero load |
| `.atm-reveal` → `.atm-reveal-visible` | Scroll into view (`hooks/use-reveal.ts`, `AtmReveal`) |
| `.atm-hover-lift` | Cards / interactive surfaces |

**Required:** `@media (prefers-reduced-motion: reduce)` disables transforms/animations; reveal resolves to fully visible/static.

---

## 4. Elevation & seams

| Level | Token / class |
|-------|----------------|
| Flat | none |
| Raised | `--atm-shadow-1` / `.atm-elev-1` |
| Floating | `--atm-shadow-2` / `.atm-elev-2` |
| Section seam | `.atm-seam` |
| Soft fade seam | `.atm-seam-fade` (stronger hairline + primary mid tint) |

---

## 5. Motif

**Contour turf lines** + **ribs** variant — `components/atmosphere/turf-motif.tsx`.

`SectionShell` props: `motif`, `motifCoverage="band"|"full"`, `motifVariant`, `motifIntensity`, `texture`.

---

## 6. Imagery rules

| Surface tier | Photo | Illustration | Pure CSS |
|--------------|-------|--------------|----------|
| 1 Full | Heroes, proof, service cards | Empty-state spot only | Gradients + grain + motif |
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

Every `SLOT_MAP` entry has a fallback URL.  
`mediaSrc(slot)` always returns a string. Prefer `/placeholder.jpg` for optimizer safety.

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
| Grain / motif / section / reveal | `components/atmosphere/*` |
| Scroll reveal hook | `hooks/use-reveal.ts` |
| Empty / skeleton | `components/atmosphere/empty-state.tsx`, `components/ui/skeleton.tsx` |
| Media accessor | `lib/media.ts` |
| Slots | `docs/media/SLOT_MAP.yaml` → `lib/generated/media-map.json` |
