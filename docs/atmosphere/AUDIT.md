# Atmosphere Audit — Cut Rates Lawn WebSite

**Date:** 2026-08-01  
**Depends on:** [`RECON.md`](./RECON.md)  
**Rubric:** 0 absent · 1 flat/default · 2 present · 3 polished  
**Severity:** below target tier → Low / Med / High (by gap × reach)

**Status:** Phases 2–3A applied for S1–S3 (2026-08-01). Media slots migrated; Envato proposals awaiting human license. See [`HUMAN_TASKS.md`](./HUMAN_TASKS.md).

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

## 2. Surface scores (selected high-reach)

Dimensions: **Mv** Movement · **Lk** Look · **Dy** Dynamics · **Ov** Overlays · **Bg** Backgrounds · **Fi** Fillers · **Ic** Icons · **Ph** Photos · **Gr** Graphics · **An** Animations

### Shared chrome

| Surface | Mv | Lk | Dy | Ov | Bg | Fi | Ic | Ph | Gr | An | Target | Worst gaps | Severity |
|---------|----|----|----|----|----|----|----|----|----|----|--------|------------|----------|
| Header | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 2 | 0 | 0 | 1–2 cascade | Flat white bar; literal gray hover; no blur/scrim; logo via media slot ✓ | **High** |
| Footer | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 0 | cascade | Flat blocks; social optional | **Med** |
| Live chat | 1 | 1 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | 1 | util | Functional panel; no brand depth | Low |
| `loading.tsx` | 1 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | filler | Blue spinner; not brand skeleton | **Med** |
| `not-found` | 0 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 2 | Gray card; **blue** CTA (off-brand) | **Med** |

### Tier 1 marketing

| Surface | Mv | Lk | Dy | Ov | Bg | Fi | Ic | Ph | Gr | An | Target | Unfinished tells | Severity |
|---------|----|----|----|----|----|----|----|----|----|----|--------|------------------|----------|
| `/` Home | 0 | 1 | 1 | 1 | 1 | 0 | 1 | 2 | 0 | 0 | 1 | Full-bleed hero + black/50 scrim only; gray “Featured On”; white cards + hard seams; hardcoded `green-600`; uses `IMAGES` not media slots; no entrance motion; no OG image in layout metadata | **High** |
| `/services` | 0 | 2 | 1 | 0 | 1 | 0 | 2 | 2 | 0 | 0 | 1 | Better token use (`primary`, `muted-foreground`); still flat white canvas; card elevation only; no section gradients/overlays | **High** |
| `/bundles*` | 0 | 1 | 1 | 0 | 1 | 0 | 2 | 1 | 0 | 0 | 1 | Occasional `bg-gradient-to-r from-green-600 to-blue-600` (off-system); white cards | **Med** |
| `/pricing` | 0 | 1 | 1 | 0 | 1 | 0 | 2 | 0 | 0 | 0 | 1 | CheckCircle list; flat | **Med** |
| `/about`, `/our-work`, proof | 0 | 1 | 1 | 0 | 1 | 0 | 2 | 1–2 | 0 | 0 | 1 | Photo-capable but treatment inconsistent; hard seams | **High** |
| `/testimonials` | 0 | 1 | 2 | 0 | 1 | 1 | 2 | 1 | 0 | 1 | 1 | White cards; hover shadow; carousel timer (no reduced-motion gate) | **Med** |
| `/referral`, `/careers` | 0 | 1 | 1 | 0 | 1 | 0 | 2 | 0 | 0 | 0 | 1 | Campaign surfaces look like forms/utilities | **Med** |

### Tier 2 utility

| Surface | Mv | Lk | Dy | Ov | Bg | Fi | Ic | Ph | Gr | An | Target | Notes | Severity |
|---------|----|----|----|----|----|----|----|----|----|----|--------|-------|----------|
| `/blog` | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 1 | 0 | 0 | 2 | Listing OK; empty/loading not polished | Low–Med |
| `/faq`, `/service-areas` | 0 | 1–2 | 1 | 0 | 1 | 0 | 2 | 0 | 0 | 0 | 2 | Accordion motion via Radix; flat page | Low |
| `/search` | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 0 | 2 | Utility | Low |
| Portal/dashboard | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 0 | 2 | Handoff/redirect oriented — keep calm | Low |

### Tier 3 focus

| Surface | Mv | Lk | Dy | Ov | Bg | Fi | Ic | Ph | Gr | An | Target | Notes | Severity |
|---------|----|----|----|----|----|----|----|----|----|----|--------|-------|----------|
| `/contact` | 0 | 1 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | 0 | 3 | Cards + honest status; **correctly calm** — do not decorate heavily | Low (keep) |
| `/quote`, `/schedule` | 0 | 1 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | 1 | 3 | Forms/spinners; keep Tier 3 | Low |
| Auth / legal | 0 | 1 | 1 | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 3 | Fine as minimal | Low |

---

## 3. Heatmap summary (average by group)

| Group | Mv | Lk | Dy | Ov | Bg | Fi | Ic | Ph | Gr | An |
|-------|----|----|----|----|----|----|----|----|----|----|
| Chrome | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 1 | 0 | 0 |
| Tier 1 marketing | 0 | 1 | 1 | 0–1 | 1 | 0 | 2 | 1–2 | 0 | 0 |
| Tier 2 utility | 0 | 1 | 1 | 0 | 1 | 1 | 2 | 0–1 | 0 | 0 |
| Tier 3 forms | 0 | 1 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | 0 |

**Strongest dimension today:** Icons (Lucide consistency ≈2).  
**Weakest:** Movement, Overlays, Graphics, Animations (≈0); Backgrounds stuck at flat white/gray (≈1).

---

## 4. Cross-cutting unfinished tells (Appendix D)

- [x] Flat solid section blocks (`bg-white`, `bg-gray-100`)  
- [x] Hard horizontal seams between sections  
- [x] Pure-white / cool-gray fills with little warmth  
- [x] Cards = default shadow only (no elevation system)  
- [x] Dual imagery (`IMAGES` vs `mediaSrc`) — homepage still legacy  
- [x] Placeholder SVG fallbacks still in slot map  
- [x] No branded empty states / skeleton system (loading = blue spinner)  
- [x] Near-zero page entrance / scroll motion; Radix-only micro-motion  
- [x] No `prefers-reduced-motion` policy in CSS  
- [x] Accent green used as Tailwind literals, not a full atmosphere system  
- [x] No dedicated OG/social image slot in layout metadata  
- [x] Default / off-brand 404 (blue button)  
- [ ] Decorative CLS — not confirmed high (few absolute layers yet); risk rises when adding heroes  
- [x] Hero text relies on crude `bg-black/50` only (weak scrim craft)  

---

## 5. Proposed treatments (by surface — preview only)

### Cascade first (shared)

1. **Header:** soft translucent `background/80` + blur token; border/elevation tokens; hover using `muted`/`accent`; optional slim brand gradient hairline.  
2. **Footer:** muted canvas + hairline seam; Lucide size scale already OK.  
3. **Global utilities (Phase 3A):** gradient recipes, grain overlay (aria-hidden), seam dividers, motion tokens + `prefers-reduced-motion`, elevation scale — all from `app/globals.css` / Tailwind tokens.  
4. **Loading / 404 / error:** brand skeleton + green primary CTA; illustration slot optional later.

### Tier 1

5. **Home:** full-bleed hero via `mediaSrc('home.hero')` (retire `IMAGES.HERO_*` on home); gradient + grain under text; section seams; service cards with elevation tokens; partner row as calm strip.  
6. **Services / bundles / proof:** soft canvas between sections; photo treatment (scrim/tint); keep Lucide; light entrance on cards (gated).  
7. **Referral / careers:** one campaign hero treatment without form distraction.

### Tier 2

8. Soft page canvas + card elevation; skeletons for lists; no full-bleed mesh.

### Tier 3 (protect)

9. **Contact / quote / schedule / auth / legal:** token cleanup only (replace literal blues/grays); **no** grain/mesh/imagery competing with fields; preserve focus rings.

### Media (Phase 3B — after license)

10. Expand `SLOT_MAP.yaml`: home hero (already), services heroes, OG image, empty-state spot art, optional texture. Envato MCP propose → human license → `media:publish`.  
11. Migrate call sites from `lib/image-constants.ts` → `lib/media.ts` per recon question A/B.

---

## 6. Prioritized backlog (severity × reach)

| Pri | ID | Item | Why |
|-----|-----|------|-----|
| 1 | ATM-01 | Atmosphere **SYSTEM** tokens + utilities (gradients, grain, seams, motion+PRM, elevation) | Unblocks all surfaces without licenses |
| 2 | ATM-02 | Apply system to **Header / Footer / loading / 404** | Highest cascade |
| 3 | ATM-03 | Home Tier-1 pass (hero craft + sections + wire `home.hero` slot) | Primary marketing surface |
| 4 | ATM-04 | Services / bundles / proof Tier-1 pass | High traffic feature surfaces |
| 5 | ATM-05 | Token hygiene on forms (Tier 3) — literals → tokens only | Trust without distraction |
| 6 | ATM-06 | Slot map expansion + Envato proposals (heroes, OG, empty-state) | Imagery after 3A |
| 7 | ATM-07 | Migrate remaining `IMAGES` consumers → `mediaSrc` | Single media contract |
| 8 | ATM-08 | OG/social image slot + layout metadata | Share polish |
| 9 | ATM-09 | Blog/FAQ/search Tier-2 soft canvas | Lower reach |
| 10 | ATM-10 | Reduced-motion audit on carousels/spinners | A11y gate |

---

## 7. Direction proposal (for sign-off)

**Atmosphere thesis:** “Trusted Midwestern outdoor craft” — deep lawn greens and soft earth warmth, photographic heroes with careful scrims, quiet motion, no playful kitsch.

**Do:**

- Build a small reusable system in tokens (Phase 2 → 3A).  
- Full treatment on home + services/proof; medium on listings; minimal on forms.  
- Prefer CSS/`tailwindcss-animate`/inline SVG; **no new animation dependencies** unless approved.  
- Use existing Envato → GCS pipeline only.

**Don’t:**

- Decorate contact/quote/schedule/auth.  
- Mix new icon families.  
- Auto-download Envato binaries.  
- Add purple/cream “AI default” palettes.

**Suggested Phase 2–3 scope (pick one):**

- **S1 — Foundation + Home only** (ATM-01…03)  
- **S2 — Foundation + Home + Services/Bundles** (ATM-01…04) ← recommended  
- **S3 — Full customer marketing shell** (ATM-01…09, media follow-ups)

---

## 8. Go-ahead — executed 2026-08-01

User directed: complete remediation; migrate home/header **and** Envato searches; **S1 + S2 + S3**; continue without waiting; list human tasks.

| Item | Status |
|------|--------|
| Scope S3 | Implemented for high-reach surfaces (home, about, services, chrome, OG, Tier-3 hygiene) |
| Media cutover A | Done — home/about/services use `mediaSrc`; SLOT_MAP expanded with legacy GCS binds |
| Envato proposals | [`docs/media/ENVATO_PROPOSALS.md`](../media/ENVATO_PROPOSALS.md) |
| Human follow-ups | [`HUMAN_TASKS.md`](./HUMAN_TASKS.md) |

Remaining agent polish (optional later): bundles off-system blue gradient, referral/careers campaign hero, blog Tier-2, carousel PRM audit.

