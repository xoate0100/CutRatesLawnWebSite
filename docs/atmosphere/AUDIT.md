# Atmosphere Audit — Cut Rates Lawn WebSite

**Date:** 2026-08-02 (intensity dial-up)  
**Depends on:** [`RECON.md`](./RECON.md), [`SYSTEM.md`](./SYSTEM.md)  
**Rubric:** 0 absent · 1 flat/default · 2 present · 3 polished  
**Severity:** below target tier → Low / Med / High (by gap × reach)

**Status:** Phases 2–3A shipped 2026-08-01; **intensity dial-up 2026-08-02** (grain, banding, full motif, scroll reveal). Media slots migrated; Envato proposals awaiting human license. See [`HUMAN_TASKS.md`](./HUMAN_TASKS.md).

---

## Intensity re-score (post dial-up) — Tier 1 home / about / services

Dimensions: **Mv** Movement · **Lk** Look · **Dy** Dynamics · **Ov** Overlays · **Bg** Backgrounds · **Fi** Fillers · **Ic** Icons · **Ph** Photos · **Gr** Graphics · **An** Animations

| Surface | Mv | Lk | Dy | Ov | Bg | Fi | Ic | Ph | Gr | An | Notes |
|---------|----|----|----|----|----|----|----|----|----|----|-------|
| `/` Home | 2 | 2 | 2 | 3 | 3 | 2 | 2 | 3 | 2 | 3 | Scroll reveal; full motif; grain 0.12–0.18; canvas-alt / deep-band banding |
| `/about` | 2 | 2 | 2 | 3 | 3 | 2 | 2 | 2 | 2 | 3 | Same shell + photo tint/scrim on team cards |
| `/services` | 1 | 2 | 2 | 2 | 2 | 1 | 2 | 3 | 1 | 1 | Photo tint/scrim; wash canvas; full SectionShell pass optional later |
| Header / Footer | 1 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 0 | 1 | Cascade tokens; not reworked this pass |

**Target for Tier 1:** ≥2 on Ov / Bg / An — **met on home/about** after dial-up.

### What changed vs “invisible” deploy

| Issue | Fix |
|-------|-----|
| Grain opacity 0.055 | → 0.12 + `.atm-grain-strong` 0.18 on heroes |
| Motif 112px strip | → `motifCoverage="full"` + ribs variant |
| Flat white sections | → `canvas-alt` / `wash` / `deep-band` / earth muted |
| Load-once enter only | → `AtmReveal` + `useReveal` for below-fold |
| Soft hover | → −6px lift + stronger shadow + focus-visible |

### Remaining gaps (optional)

- Bundles off-system blue gradient cleanup  
- Referral / careers campaign hero  
- Blog Tier-2 soft canvas + reveal  
- Carousel PRM audit on older testimonial widgets  
- True portfolio before/after photography (media H-ATM-09)

---

## 1. Intensity tier assignment (Appendix B)

| Surface group | Routes (representative) | Target tier |
|---------------|-------------------------|-------------|
| Landing / hero | `/` | **1 Full** |
| Marketing / proof | `/about`, `/our-work`, `/case-studies`, `/testimonials`, `/community`, `/certifications`, `/referral`, `/careers` | **1** |
| Feature / catalog | `/services`, `/services/*`, `/bundles`, `/bundles/*`, `/pricing` | **1** |
| Listing / hub | `/blog`, `/faq`, `/service-areas`, `/sitemap`, `/search` | **2 Medium** |
| Portal / account handoff | `/portal`, `/dashboard`, `/account` | **2** (keep calm; no campaign noise) |
| Forms / schedule | `/contact`, `/quote`, `/schedule`, `/careers/apply` | **3 Minimal** |
| Auth / legal | `/login`, `/register`, `/privacy`, `/terms` | **3** |
| Shared chrome | Header, Footer, LiveChat, root layout | Cascades all tiers |
| Fillers | `loading`, `not-found`, `error` | Match parent; 404 can be **2** branded |
| Admin / dev | `/admin/*`, `*-test`, `/debug` | Out of scope (no atmosphere spend) |

---

## Historical scores (pre dial-up, 2026-08-01)

Kept for trail — home was Ov≈1 Bg≈1 An≈0. See git history for full pre-dial tables.

---

## Cross-cutting unfinished tells

- [x] Flat solid section blocks  
- [x] Hard horizontal seams  
- [x] Pure-white fills  
- [x] Cards = default shadow only  
- [x] Dual imagery / media slots  
- [x] No entrance / scroll motion  
- [x] No `prefers-reduced-motion` policy  
- [x] Weak hero scrim craft  
- [x] **Intensity too low to perceive (2026-08-02 dial-up)**  
- [ ] Decorative CLS monitor after grain/motif layers  
- [ ] Specialty media (power wash, team, B/A) still null in places  

---

## Direction (unchanged)

**Atmosphere thesis:** “Trusted Midwestern outdoor craft” — deep lawn greens and soft earth warmth, photographic heroes with careful scrims, quiet motion, no playful kitsch.

**Don’t:** Decorate contact/quote/schedule/auth · mix icon families · purple/cream AI defaults.
