# Cursor Prompt — Autonomously Ship the Cut Rates Redesign (prototypes → Next.js → main), then mirror to Figma

> Paste into Cursor **Agent** on the `xoate0100/CutRatesLawnWebSite` repo. Run to completion.
> **Operate fully autonomously. Do not pause for confirmation, do not ask questions, do not wait for input.**
> **Source of truth = the prototypes in `docs/redesign/`** (Figma is NOT read — it's incomplete; it is a *write-only mirror output*, see §7).
> Reference files (place in repo first): `docs/redesign/CutRates_Design_System_Prototype.html` (home),
> `docs/redesign/CutRates_Design_System_v2_Media_and_Pages.html` (media layer + service detail),
> `docs/redesign/CutRates_Page_Templates.html` (service-area, quote, our-work, bundles, about, contact),
> `docs/redesign/CutRates_Media_Manifest.md`, `docs/media/ENVATO_PROPOSALS_REDESIGN.md`.

---

## Autonomy contract

- Run the whole job end-to-end without human intervention. Never stop to ask; make the reasonable call and keep going.
- **Self-heal:** on any build/test/lint/Lighthouse/Figma failure, diagnose, fix, re-run — loop until green (max 8 iterations per gate). Never merge red.
- **Definition of done:** (1) redesign merged to `main` with all gates green and dev server booting clean, AND (2) a **shareable Figma mirror** of the shipped site exists (§7) so it can be shown to a non-technical stakeholder as progress.
- The **only** thing you may not do autonomously is license/purchase Envato binaries (human/account action). Do **not** block on it: wire imagery through `getMedia(slot)` with fallbacks so the site renders fully; update `SLOT_MAP.yaml` + `docs/media/ENVATO_PROPOSALS_REDESIGN.md` for the async human licensing pass; proceed to merge.
- Guardrails below are hard rules, not checkpoints — satisfy them automatically; do not pause on them.

## Guardrails (must hold — enforce, don't ask)

- **Package manager = pnpm** (repo has `pnpm-lock.yaml`). Use `pnpm ...`, not npm. **Precondition:** the media pipeline (`lib/media.ts` `getMedia`, `docs/media/SLOT_MAP.yaml`, `scripts/media/*`, top-level `media/`) must exist in the checkout — if absent, `git pull` / checkout the branch that has it before starting; do not improvise media handling.

- Branch `feat/design-system-rebuild`; keep every commit green.
- **Do not break** the lead pipeline: GHL/CRM integration, form→API routes, quote-estimator server logic, Google Reviews fetch, auth/customer portal, SEO/structured data. Reskin their UI only; preserve contracts.
- **All imagery via the existing media pipeline** — `lib/media.ts` `getMedia(slot)` + `SLOT_MAP.yaml`. Never hardcode image URLs. Never commit binaries. Never auto-download Envato files.
- Do not delete existing routes; replace their UI. Respect `.cursor/rules/media-pipeline.mdc` and repo conventions.
- Every image has real `alt` (from slot `alt`). Honor `prefers-reduced-motion` everywhere.

---

## 1. Source of truth — the prototypes (build from these)

Implement the design from `docs/redesign/*`. These are complete, explicit, cover every page, and match the brand brief. Do **not** read design from the Figma file — it only contains an outdated homepage and would conflict (it shows mowing/fert/pest + Wichita-only; the correct brief is Landscaping-flagship + Wichita→KC). Figma is written to, not read from (§7).

**Brand brief (authoritative):** friendly, local, family-owned, down-to-earth voice; **Landscaping is the flagship** service; areas **Wichita → Kansas City / Leavenworth** (Wichita, Valley Center, Andover, Derby, Maize, Kansas City, Leavenworth); add **Aeration/Overseeding** + **Holiday Lights**; **"starting at"** pricing; residential bundles; **#1 goal = online quote requests** (quote-first CTAs everywhere).

## 2. Design tokens

Tokens in Tailwind theme + CSS vars; fonts via `next/font`.
```
--forest:#0B3A1E  --forest-2:#0F2E1B  --green:#1F6B3A  --green-soft:#2E7D42
--lime:#C8F135    --lime-2:#A9E22E     --cream:#F5F2E9  --paper:#FBFAF4
--ink:#12241A     --sage:#5D7064       --line:rgba(18,36,26,.12)  --line-lt:rgba(255,255,255,.14)
--r:20px  --r-lg:30px   shadow: 0 18px 50px -20px rgba(11,58,30,.45)
display="Bricolage Grotesque" (600/700/800) · body="Hanken Grotesk" (400–700)
Rule: lime = ACTION color only.
```
Global utils: grain overlay, mow-stripe, leaf pattern, `.reveal`. Gate all motion behind reduced-motion.

## 3. Component library (`components/ui` + `components/blocks`)

Primitives: `Button` (lime|ghost|dark), `Pill`, `Tag`, `Eyebrow`, `SectionHead`.
Media: `MediaFrame` (`slot`, `treatment[]`=duotone|grain|mask|stripe|ring, `aspect`, `priority`) → `getMedia(slot)` + `next/image` + fallback; `VideoFrame` (muted/autoplay/loop + poster; poster-only under reduced-motion).
Blocks: `AnnouncementMarquee`, `SiteHeader` (sticky/blur/nav-underline/mobile-menu), `Hero` (brush headline, glow parallax, trust chips, `StatCounter`), `RibbonMarquee`, `ServiceGrid`+`ServiceCard`+`FeatureCard` (Landscaping feature), `QuoteBand`+`QuoteEstimator` (wire to existing estimator + submit/CRM), `BeforeAfterSlider` (pointer + keyboard), `TestimonialMarquee`, `AreaChips`, `BundleCard`+`CompareTable`, `FAQAccordion`, `InteriorHero`, `Gallery` (filterable), `ProcessSteps`, `TeamGrid`, `ContactForm` (reskin existing) + `InfoList` + `MapBand`, `CTASection`, `StickyQuoteBar`, `SiteFooter`.
Motion hooks: `useReveal`, `useCountUp`, marquee CSS, rAF parallax — no-op under reduced-motion.
Render every block in a dev-only `/dev/components` route for QA.

## 4. Pages / routes (compose from blocks; keep existing paths)

`/` home · `/services` + `/services/[slug]` (all 9 + **aeration**, **holiday-lights**) · `/service-areas` + `/service-areas/[slug]` (7 towns) · `/quote` (stepper + estimator, existing submit) · `/our-work` · `/bundles` ("starting at" + compare) · `/about` · `/contact` · existing (blog, portal…) reskinned. Home + services lead with Landscaping. Match each prototype's block composition.

## 5. Motion & accessibility

Scroll reveals, count-ups, marquees, hero parallax, hover states, draggable before/after — all present, all disabled/reduced under `prefers-reduced-motion`. Keyboard focus (lime), semantic landmarks, `aria-expanded` on accordions, keyboard-operable slider, AA contrast.

## 6. Media integration (non-blocking)

Wire all imagery/video to `getMedia(slot)`. Add new slots to `SLOT_MAP.yaml` with fallbacks + alt (holiday-lights, snow-removal, `areas.<slug>.hero` ×7, `home.hero.video`, `pattern.leaf`, `icons.gardening` — block in `ENVATO_PROPOSALS_REDESIGN.md`). Keep that proposals file current. **Do not download binaries**; the site must render on fallbacks so the merge is never blocked by licensing.

## 7. Mirror to Figma — shareable stakeholder output (required deliverable)

After the site builds and passes validation (§8), mirror the **shipped** site into Figma file **`sxG4jdV7FXFf8KtkCfKy96`** so it is **presentable to a non-technical stakeholder as "build progress."** Use the Figma MCP write tools:

1. **Variables:** publish the §2 tokens as Figma variables (color / type / spacing / radius) via `use_figma`.
2. **Component library:** build `Button`, `Card`/`ServiceCard`, `Pill`, `Tag`, `Bundle`, `FAQ`, `InteriorHero` as real components with variants via `use_figma`.
3. **Page frames (the shareable part):** boot the app (`pnpm start` or the deployed URL) and run `generate_figma_design` against each route to capture pixel-perfect frames. Place them on a new page named **"Redesign — Build Progress"**, each labeled: Home (desktop + mobile), Services, Service Detail (Landscaping), Service Area (Derby), Quote, Our Work, Bundles, About, Contact. Add a cover/title frame: **"Cut Rates — Website Redesign · build progress · <date>"**.
4. **Code Connect:** map components → their Figma nodes (`send_code_connect_mappings`) so Figma ⇄ code stay linked.
5. **Tidy for sharing:** arrange frames in a clean readable grid, consistent names, and move the old outdated homepage frames (`12:x`) to an **"Archive"** page (do not delete). The result must be screenshot-ready to hand to a stakeholder.

This step is **required** but must **not block the merge**: if the Figma API errors, self-heal twice, then log to `docs/redesign/FIGMA_MIRROR.md` + `BUILD_REPORT.md` and continue. It may run post-merge against the deployed URL.

## 8. Browser testing (Playwright — must pass before merge)

Build + boot (`pnpm build && pnpm start` on a test port); run Playwright (Chromium + mobile):
- Every route 200, renders without an error boundary, **zero uncaught console errors**.
- Interactions: quote estimator updates on input; before/after drags; mobile menu opens; FAQ toggles; contact form validates (stub network).
- Lead path intact: quote submit hits existing endpoint (intercept); Google Reviews block renders.
- Responsive at 390px + 1440px; reduced-motion disables animation; focus visible; images have alt.
- Full-page screenshot per route → `artifacts/redesign/`; assert visual sanity (no `0×0` hero, fonts loaded).
- Lighthouse (mobile) on `/` + one service page ≥ 90 perf / 100 a11y (best-effort; fix regressions).
Commit the specs. Fix + re-run on any failure.

## 9. Validation gates → merge to `main`

Merge **only** when ALL green: build (pnpm) · typecheck · lint · Playwright (§8) · Lighthouse · no binaries staged · no hardcoded image URLs (grep) · existing API/CRM/estimator/reviews/portal contracts intact. Then autonomously:
1. Commit with a clear message + change summary.
2. Squash-merge `feat/design-system-rebuild` → `main` and push. If `main` CI exists, wait; if it fails, hotfix and re-merge — loop until `main` is green.
3. Post-merge: re-run the browser smoke test against the deployed/preview URL; hotfix if red.
4. Run the Figma mirror (§7) against the deployed URL if not already done.
5. Write `docs/redesign/BUILD_REPORT.md`: what shipped, routes, components→Figma Code Connect map, new media slots + human licensing checklist, screenshots, Lighthouse scores, and the Figma "Build Progress" page link for sharing.

## 10. Execution loop

branch → tokens/fonts/utils → primitives + MediaFrame + hooks → blocks (`/dev/components`) → pages (from prototypes) → wire estimator/CRM/reviews → new SLOT_MAP slots + getMedia → Playwright validation (§8) → gates (§9) → **merge to main** → post-merge smoke → **mirror to Figma (§7)** → BUILD_REPORT.

Proceed now, autonomously, until `main` is green, the redesign is live-validated, and the Figma "Build Progress" page is populated and shareable.
