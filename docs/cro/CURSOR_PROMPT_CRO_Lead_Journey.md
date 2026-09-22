# Cut Rates Lawn Care — Conversion Rate Optimization: Analysis + Phased Cursor Prompt

**Target repo:** `xoate0100/CutRatesLawnWebSite` (Next.js App Router)
**Scope:** main marketing site only (not `CRL_ProposalGeneration`, not `CRL_Lights_Landing`)
**Prepared:** 2026-09-19
**Status of this document:** analysis is read-only and point-in-time (read from `main` on the date above). Part B is the executable prompt for Cursor.

---

# PART A — Conversion analysis (findings register)

Every finding below is anchored to a real file in the repo. Finding IDs are referenced by the phased plan in Part B, so Cursor can trace work back to a reason.

## A0. What the funnel actually is today

```
Homepage (app/page.tsx)
  ├─ Hero CTA ─────────────────────► /quote
  ├─ ServiceGrid ──"Learn more"────► /services/<slug>   (no quote CTA on the card)
  ├─ QuoteBand estimator ──────────► /quote?size=&property=&frequency=
  └─ StickyQuoteBar (mobile) ──────► /quote            (no tap-to-call)

Service page (components/blocks/service-detail-view.tsx)
  └─ hero + CTA ───────────────────► /quote?service=<id>   (no inline form)

Area page (app/service-areas/[slug]/page.tsx)
  └─ hero + CTA ───────────────────► /quote?area=<slug>

/quote (components/quote/quote-funnel.tsx)
  Step 1 Details → Step 2 Estimate → Step 3 Contact → Step 4 Done (client state only)
       │
       └─ POST /api/lead → GHL contact upsert + tags → (no workflow yet) → ???
```

The journey ends at "GHL contact created with three tags." There is no opportunity, no pipeline stage, no attribution on the record, and no automated first touch. **Lead-to-customer is currently unmeasurable**, which is the first thing to fix — you cannot optimize a conversion rate you cannot compute.

---

## A1. Measurement & segmentation — the blind spots

### F-CRO-101 — Conversions from non-paid traffic are silently discarded (**P0**)
`lib/analytics/core.ts`:

```ts
if (CONVERSION_EVENTS.has(event.event) && !hasAttribution(attribution)) {
  return false
}
```

`hasAttribution()` returns true only when `utm_source` or `gclid` is present. Organic search, Google Business Profile, direct, referral, and returning-visitor traffic therefore **never fire a conversion event at all**. GA4 and Google Ads see a paid-only picture of a business whose majority volume is almost certainly GBP/organic/word-of-mouth. Every conversion-rate number derived from this is wrong, and every "which channel converts" decision built on it is wrong. This single guard invalidates traffic segmentation before it starts.

Correct behavior: always fire the conversion; attach `traffic_type: paid | organic | direct | referral | unknown` and let GA4/Ads segment. Google Ads conversion tags already gate themselves on gclid.

### F-CRO-102 — Attribution is session-scoped and non-durable (**P1**)
`lib/analytics/gtm.ts` stores UTM and gclid in `sessionStorage`. A visitor who clicks an ad Tuesday and converts Thursday is attributed to nothing. There is no first-touch/last-touch split, no landing-page capture, no referrer capture, no click-ID coverage beyond `gclid` (`gbraid`, `wbraid`, `fbclid`, `msclkid` all missing). `CRL_Lights_Landing` already runs a more mature dual first-touch pattern — port it rather than reinventing it, and ratchet up the known consent-gate gap instead of copying it forward.

### F-CRO-103 — Attribution never reaches the server or the CRM (**P0**)
`app/api/lead/route.ts` `leadSchema` accepts: name, email, phone, service, message, source, idempotencyKey, honeypot, turnstile, estimate fields, lawn size, property type, frequency, address. **No UTM, no gclid, no landing page, no referrer, no session id, no device, no area.** `lib/ghl.ts` sends only name/email/phone/source plus three tags.

Consequences:
- GHL cannot report revenue or close rate by channel, campaign, service, or city.
- Google Ads **offline conversion import** is impossible — the gclid is never persisted anywhere that survives to the moment a lead becomes a customer. This is the highest-value single fix in the entire document for a business with a long consideration cycle and a phone-heavy close.
- Chris/sales reps cannot see what the lead searched for when they call.

### F-CRO-104 — No thank-you URL (**P1**)
`quote-funnel.tsx` renders the `done` step as client state. There is no `/thank-you` route, so there is no URL-based conversion destination for Ads, no per-service thank-you segmentation, no clean browser-history boundary, and no place to put the next-step content (what happens next, calendar link, referral ask) that reduces post-submit anxiety and cancellations.

### F-CRO-105 — An entire lead path is analytically invisible (**P1**)
`components/blocks/contact-form-block.tsx` imports nothing from `lib/analytics`. Contact-form submissions fire no `conversion_lead`, no `form_start`, nothing. `/schedule` uses `mailto:`/redirect (logged as F-CONV-002 in the existing audit) and `careers/apply` is `mailto:` (F-CONV-003). Phone clicks are tracked in the header and `PhoneLink`, but the sticky mobile CTA has **no call button at all**.

### F-CRO-106 — No mid-funnel diagnostics (**P2**)
`useAnalytics().onFunnelStep` fires `funnel_step_view` on step change. There is no `form_start`, no field-level engagement, no `form_abandon` (beforeunload/visibilitychange), no `partial_form_fill`, no time-in-step. You will know 71% of people who reach step 3 never submit, but not which field killed them. `CRL_Lights_Landing` already has `partial_form_fill` — port it.

### F-CRO-107 — No consent gate (**P2**)
`gtmEvent()` fires unconditionally once GTM loads. `docs/Analytics_Standards.md` in the Ads repo requires consent gating before marketing tags fire. Carry the standard, not the gap.

---

## A2. Context loss — the funnel throws away what it already knows

### F-CRO-201 — The homepage estimator's inputs are discarded on arrival (**P0**)
`components/blocks/quote-band.tsx` links to:

```
/quote?size=${lawnSize}&property=${propertyType}&frequency=${frequency}
```

`components/quote/quote-funnel.tsx` reads exactly one param:

```ts
serviceFromQuery(searchParams.get("service"))
```

`size`, `property`, and `frequency` are **ignored**. A visitor who just spent 20 seconds dialing in a lawn size and seeing a real number lands on a blank step 1 and is asked for all of it again — and the band doesn't pass `service` either, so the service select is empty too. This is the single most expensive interaction defect on the site: it happens at peak intent, and the re-ask reads as "that estimate wasn't real."

### F-CRO-202 — Area context is dropped (**P1**)
Area pages link to `/quote?area=<slug>`. The funnel ignores `area`; it never reaches `/api/lead`; no `area:` tag is created in GHL. There is no geographic segmentation of leads anywhere in the system, despite seven service areas across two metros and an active KC-side expansion.

### F-CRO-203 — The two estimators disagree (**P2**)
`quote-band.tsx` slider: 500–15,000 sq ft, step 250. `quote-funnel.tsx` slider: 500–10,000, step 100. Quarter acre is 10,890 sq ft, so the funnel physically cannot express a property above the published residential tier ceiling, while the homepage can. Same property, two different numbers, depending on entry point.

### F-CRO-204 — Service cards have no quote CTA (**P2**)
`components/blocks/service-grid.tsx` cards offer only "Learn more." Every path to a quote from the homepage service grid costs an extra page load.

### F-CRO-205 — Pricing page contradicts the estimator (**P2**, previously logged F-CONV-005)
`/pricing` shows $99/$199 monthly plans; the estimator produces per-visit and per-month numbers from `lib/pricing/estimate.ts` (the CFO-authoritative model). Scent break.

---

## A3. Form design — asking the wrong things, of the wrong people, at the wrong time

### F-CRO-301 — One flat 35-option select (**P1**)
`SERVICE_LABELS` = 4 estimate services + 31 consult services in a single ungrouped `Select`. On mobile this is a Radix popover with a long scroll, no search, no grouping, and no visual hierarchy — "Termite Protection," "Retaining Walls," "Holiday Light Take-down," and "Lawn Mowing" all appear at the same level. A visitor who wants snow removal must scroll past thirty irrelevant options to find it.

Recommended structure: **two stages, tap-first** — 7–8 category tiles (Lawn Care · Fertilization & Weed · Pest & Termite · Landscaping & Hardscape · Snow & Ice · Holiday Lights · Exterior Cleaning · Commercial), then sub-service chips within the chosen category. Fall back to a grouped `SelectGroup` only where a tile grid won't fit.

### F-CRO-302 — Irrelevant data is collected and shipped on every lead (**P1**)
The lawn-size slider is correctly hidden for consult services — but `submitLead()` sends it regardless:

```ts
lawnSizeSqFt: lawnSize,      // always 2000 unless touched
propertyType,
frequency,                   // always "weekly"
```

So a termite lead arrives in GHL reading `Lawn size: 2000 sq ft · Frequency: weekly`. Staff learn to distrust the lead notes, and every downstream report on lawn size is polluted with defaults. This is the mirror image of Andy's complaint: the site doesn't ask for the wrong field, it *fabricates* it.

### F-CRO-303 — The fields that would actually qualify the job are never asked (**P1**)
No service in the consult set collects a single qualifying input. What each one needs:

| Service group | Qualifying fields that matter | Currently asked |
|---|---|---|
| Lawn mowing / fert / weed | lawn sq ft, frequency, property type, tier | lawn sq ft, frequency, property type |
| Aeration & overseeding | lawn sq ft, current turf condition, prior aeration | none |
| Termite | **home sq ft**, foundation type (slab/crawl/basement), stories, active sighting vs. prevention, real-estate deadline | none |
| Pest / rodent / bed bug | home sq ft, pest type, indoor/outdoor, severity/urgency, prior treatment | none |
| Snow & ice | **driveway/lot size band**, surface (asphalt/concrete/gravel), residential vs. commercial, trigger depth, salting, seasonal vs. per-push | none |
| Holiday lights | **linear ft of roofline**, stories, roof pitch/access, install + takedown + storage, own vs. supplied materials | none |
| Gutter cleaning | stories, roof type, linear ft, guards installed | none |
| Power washing | surfaces (driveway/siding/deck/fence), approx. area, last cleaned | none |
| Landscaping / hardscape | project type, rough budget band, timeline, design needed, photos | none |
| Commercial | # properties, site type, contract cycle, decision timeline, insurance/COI requirement, current vendor | property type radio only |

A budget band and a timeline on landscaping/hardscape alone would let the reps triage the pipeline — and would support pricing discipline, because a quoted job with a captured budget band is harder to discount away in the field.

### F-CRO-304 — Address is optional, unused, and asked last (**P1**)
For a routed field-service business the service address is the most valuable single field: it validates service area before a rep touches the lead, it determines route density, and with a places autocomplete + parcel lookup it can *replace* the lawn-size slider entirely. Today it is an optional free-text box at the bottom of step 3, and nothing validates it against the seven service areas.

### F-CRO-305 — The contact step asks for too much, too late (**P1**)
Step 3 asks first name, last name, email, phone, address, notes, plus Turnstile — and validation requires first, last, **and** email **and** phone. For a business whose promise is "we text you," email should not be a hard gate. Minimum viable identity here is name + mobile. Everything else is enrichment that a follow-up text can collect.

`contact-form-block.tsx` is worse: it requires a message of at least 10 characters. Requiring prose is a conversion tax.

### F-CRO-306 — No partial-lead capture (**P2**)
Identity is collected only at the final step, so 100% of abandons are unrecoverable and invisible. Capturing name + phone at step transition (flagged `partial: true`, tagged `lead-status:partial`) converts silent abandons into a callable list — typically the highest-ROI single change in a multi-step home-services funnel.

### F-CRO-307 — The progress stepper lies (**P2**)
Four chips always render, but consult services jump `details → contact`, skipping "Estimate." The user watches step 2 be skipped and the labels no longer describe their journey.

### F-CRO-308 — Field mechanics (**P3**)
No phone masking/normalization to E.164, no inline validation until submit, no error summary or focus management on failure, no `inputMode`/`enterKeyHint` tuning for mobile keyboards, no autosave of in-progress state.

### F-CRO-309 — No urgency, timeline, or self-reported source (**P2**)
No "when do you need this," no "how did you hear about us." Self-reported attribution is the only reliable signal for word-of-mouth and yard-sign traffic, which no tracking pixel can ever capture, and it is a single tap.

---

## A4. Page architecture — one generic funnel for eleven different businesses

### F-CRO-401 — No service-specific funnel pages (**P1**)
Everything from paid, organic, and GBP lands on `/services/<slug>` or the generic `/quote`. Snow removal in January and termite control in May have nothing in common in copy, proof, urgency, seasonality, or price frame — but they share one page, one hero, one form, and one set of testimonials.

Recommended: a `/lp/[service]` route group for paid traffic (noindex, stripped nav, single CTA, inline service-specific form, service-specific proof and FAQ) plus `/quote/[service]` as indexed, segmented funnel entry points. Keep `/services/*` as the SEO/education layer with full nav, and let it hand off into the matching funnel.

### F-CRO-402 — Area pages don't segment by service (**P2**)
`app/service-areas/[slug]/page.tsx` renders `SERVICES.slice(0, 7)` — the same seven services, in the same order, for every town, with a `Lawn care & landscaping in {area}` title. There is no area × service matrix (`/service-areas/[area]/[service]`), which is exactly what both local SEO and geo-targeted Ads want, and exactly what the KC-side expansion needs.

### F-CRO-403 — No seasonal routing (**P2**)
Snow, holiday lights, and aeration are sharply seasonal and are currently static entries in a static grid. `RibbonMarquee` and `AnnouncementMarquee` already exist as surfaces; service ordering and homepage emphasis should be season-aware.

### F-CRO-404 — Route and component duplication creates a real risk of editing dead code (**P1 — read this before any refactor**)
- Service routes exist **twice**: explicit `app/services/<slug>/page.tsx` files *and* `app/services/[slug]/page.tsx` with `generateStaticParams()`.
- Quote forms exist **three** times: `components/quote/quote-funnel.tsx` (live), `components/forms/quote-form.tsx` (16.7 KB), `components/quote-form.tsx` (10.4 KB).
- Contact forms **twice**: `components/blocks/contact-form-block.tsx` (live), `components/contact-form.tsx`, plus `components/forms/contact-form.tsx`.
- Headers **four** times: `components/blocks/site-header.tsx` (live), `components/header.tsx` (16.2 KB), `components/layout/header.tsx`, `components/site-header.tsx`, plus `components/mobile-nav.tsx`.
- Footers and CTA sections likewise duplicated between `components/` and `components/blocks/`.

Any CRO work that starts by editing "the quote form" has a two-in-three chance of editing a corpse. Phase 0 exists for this.

---

## A5. Lead → customer — the half of the journey that doesn't exist yet

### F-CRO-501 — No CRM automation is live (**P0**)
`docs/integrations/GOHIGHLEVEL.md` lists `GHL-OPS-001` (secrets in Vercel), `GHL-WF-001` (workflow on `website-lead`), `GHL-TEST-001` (E2E smoke test) as **pending**. Meanwhile `/quote` promises "we text back fast." Nothing texts. Speed-to-lead is the dominant variable in home-services close rate; a lead that sits until someone opens the inbox converts at a fraction of one contacted in five minutes.

### F-CRO-502 — No opportunity, no pipeline stage, no close-loop (**P0**)
`lib/ghl.ts` upserts a contact and adds three tags. It creates no opportunity, sets no value, and writes no custom fields unless `GHL_CF_*` env vars happen to be set. Without an opportunity record there is no stage, no won/lost, and therefore no lead→customer rate by service, channel, or area — the exact number this whole exercise is meant to move.

### F-CRO-503 — No routing or prioritization (**P2**)
A 14-property commercial snow contract and a one-time gutter clean enter the same undifferentiated bucket with the same tags. No value banding, no owner assignment, no SLA differentiation.

### F-CRO-504 — Idempotency and rate limiting are in-process (**P2**)
`seenKeys` and `ipHits` are module-level `Map`s in `app/api/lead/route.ts`. On Vercel's serverless runtime these reset on cold start and are not shared across instances, so duplicate leads can land and the rate limit is porous. Duplicates corrupt both CRM hygiene and every conversion count downstream.

### F-CRO-505 — Failed delivery loses the lead (**P2**)
When all delivery channels fail, the route returns 503 with `manualContactRequired: true` and the submission evaporates — no queue, no retry, no durable record. A visitor who completed a four-step form is shown an error and asked to call.

---

## A6. What to measure once this is fixed

Define these before changing anything, so improvement is provable:

| Metric | Definition | Segment by |
|---|---|---|
| Quote start rate | `form_start` ÷ funnel-page sessions | service, channel, device, area |
| Step completion | step *n* → *n+1* | service, device |
| Lead conversion rate | `conversion_lead` ÷ sessions | channel, campaign, service, area, device |
| Partial capture rate | partial leads ÷ abandons | service, step |
| Qualified rate | leads meeting service-area + field completeness | service, area |
| Speed to first touch | lead created → first outbound contact | source, hour of day |
| Lead→customer | opportunities won ÷ leads | service, channel, area, rep |
| Revenue per lead | won value ÷ leads | channel, campaign |
| Cost per customer | ad spend ÷ won | campaign |

Baseline is meaningless until F-CRO-101 and F-CRO-103 are fixed, because today's numbers describe paid traffic only.

---
---

# PART B — Cursor prompt (copy everything below this line)

> Paste into Cursor with the repo open. Suggested file location once accepted: `docs/cro/CURSOR_PROMPT_CRO_Lead_Journey.md`.

---

## Mission

You are working in `xoate0100/CutRatesLawnWebSite` (Next.js App Router, TypeScript, Tailwind, Radix/shadcn, GHL CRM, GTM/GA4 analytics). Your mission is a **conversion rate optimization and lead-journey rebuild**: make traffic properly segmented, make the quote journey service-aware and mobile-first, and close the loop from lead to customer so conversion rate becomes measurable by service, channel, campaign, device, and service area.

Work in **phases**. Each phase is a branch, a set of gates, and a written report. Do not begin a phase until the previous phase's gates are green. Do not merge to `main` until Phase 6 gates pass, unless a phase is explicitly marked independently mergeable.

## Ground rules

1. **Verify before you trust.** Part A of this document was written from a point-in-time read of `main`. Re-verify every finding against the current code before acting on it. If a finding is already fixed, record that in the phase report and move on. If a finding is worse than described, say so.
2. **Do not touch pricing authority.** `lib/pricing/estimate.ts` encodes CFO-approved numbers (`Updated_Services_Pricing_Model.csv`, KC-Fert, the commercial crew model). You may fix *input ranges* and *which inputs are collected*; you may not change rates, formulas, or constants. If a range change alters an output, flag it in the report and stop.
3. **Do not redesign the brand.** The design system, tokens, atmosphere utilities (`app/globals.css` `.atm-*`, `components/atmosphere/*`), and the media-slot pipeline (`docs/media/SLOT_MAP.yaml` → `lib/media.ts`) are settled. Reuse existing blocks and tokens. New components must consume existing tokens.
4. **Never commit media binaries.** New imagery goes through the existing propose-only Envato flow (`docs/media/ENVATO_PROPOSALS*.md`, `npm run media:publish`). The site must render on `getMedia()` fallbacks; licensing is async and must never block a merge.
5. **No secrets in `NEXT_PUBLIC_*`.** GHL PIT, GA4 service-account JSON, SMTP creds stay server-side. Any new env var is documented in `.env.example` with a `HUMAN SETUP:` callout.
6. **Additive, reversible, feature-flagged.** Every behavioral change ships behind an env flag or a config constant with the old path intact until its phase gate passes.
7. **Honest reporting.** If you cannot complete a task, write why in the report. Do not stub something and mark it done. If you find a defect not listed here, add it to the findings register with a new ID.

## Non-goals

Brand redesign · pricing model changes · careers/hiring surfaces · the customer portal/account area · `CRL_ProposalGeneration` · `CRL_Lights_Landing` (read it for patterns; do not modify it) · CMS/Strapi migration · any change to `capability-registry` governance policy.

---

## Phase 0 — Recon and guardrails (read-only)

**Branch:** `cro/phase-0-recon` · **Independently mergeable:** yes (docs only)

Because the repo contains multiple copies of the header, footer, quote form, and contact form, and duplicate service routes, the first job is to establish what is actually live.

### Tasks

1. Build a live-surface map. For every route under `app/`, resolve which component tree actually renders. Explicitly resolve:
   - `app/services/<slug>/page.tsx` (explicit) vs `app/services/[slug]/page.tsx` (dynamic) — which wins, and are both reachable?
   - `components/quote/quote-funnel.tsx` vs `components/forms/quote-form.tsx` vs `components/quote-form.tsx`
   - `components/blocks/contact-form-block.tsx` vs `components/contact-form.tsx` vs `components/forms/contact-form.tsx`
   - `components/blocks/site-header.tsx` vs `components/header.tsx` vs `components/layout/header.tsx` vs `components/site-header.tsx` vs `components/mobile-nav.tsx`
   - footers and CTA sections under `components/` vs `components/blocks/`
2. Produce `docs/cro/INVENTORY.md`: every conversion surface (form, CTA, phone link, funnel step), its file, whether it is live or dead, where it posts, and what it tracks.
3. Produce `docs/cro/DEAD_CODE.md`: unreferenced duplicates, with a proposed quarantine plan (move to `_graveyard/` or delete) — **proposal only, no deletion in Phase 0**.
4. Produce `docs/cro/BASELINE.md`: current GTM/GA4 config state, which env vars are set vs. missing, and a plain statement of which numbers are currently trustworthy and which are not (see F-CRO-101).
5. Re-verify every F-CRO-* finding in Part A. Output `docs/cro/FINDINGS.md` in the same format as `docs/audit/*/FINDINGS.md` (the repo's established audit format), each with Priority / Area / Status / Evidence / Impact.

### Gates
- `npm run build` clean; zero code changes in the diff outside `docs/`.
- Every finding in Part A marked confirmed / already-fixed / revised, with file-and-line evidence.

---

## Phase 1 — Measurement truth

**Branch:** `cro/phase-1-measurement` · Fixes F-CRO-101 through F-CRO-107, F-CRO-504, F-CRO-505

Nothing downstream can be evaluated until the analytics layer stops lying. Do this first even though it ships no visible UI.

### Tasks

1. **Remove the attribution gate on conversions.** In `lib/analytics/core.ts`, delete the early return that drops conversion events without `utm_source`/`gclid`. Replace with a classifier that always fires the event and attaches `traffic_type: 'paid' | 'organic' | 'direct' | 'referral' | 'internal' | 'unknown'`, derived from click IDs, UTMs, and `document.referrer`. Add a regression test asserting an unattributed conversion fires.
2. **Durable attribution.** Rewrite `lib/analytics/gtm.ts` storage:
   - first-touch → `localStorage`, 90-day TTL, never overwritten once set
   - last-touch → `sessionStorage`, overwritten each session
   - capture `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, all five UTMs, `landing_page`, `referrer`, `first_seen_at`
   - port the proven dual first-touch pattern from `CRL_Lights_Landing/lib/gtm.ts`; do **not** port its missing consent gate
3. **Consent gating.** Add a consent state (default deny for marketing/ads, allow for essential) checked inside `gtmEvent()` before marketing tags fire, per `docs/Analytics_Standards.md` in the Ads repo. Ship a minimal, brand-consistent consent control. Note honestly in the report that `CRL_Lights_Landing` still lacks this.
4. **Funnel diagnostics.** Add to `lib/analytics/core.ts` + `hooks/useAnalytics.ts`: `form_start`, `form_field_engage` (first interaction per field, no values), `form_step_complete`, `form_abandon` (visibilitychange + beforeunload, with last step and last field), `partial_form_fill`, `form_error` (field + error type, never the value). Naming follows the existing `{category}_{action}_{object}` convention.
5. **Instrument every lead surface.** Wire the above plus `conversion_lead` into `contact-form-block.tsx`, `newsletter-*`, `/schedule`, and every phone link. Add a tap-to-call button to `components/blocks/sticky-quote-bar.tsx` alongside the quote CTA, tracked as `phone_click` with `click_location: 'sticky_mobile'`.
6. **Extend the lead API contract.** In `app/api/lead/route.ts`, extend `leadSchema` (all optional, all validated, all length-capped) with: `firstTouch` and `lastTouch` objects (source/medium/campaign/term/content/landing_page/referrer/click ids/timestamp), `sessionId`, `deviceType`, `pagePath`, `areaSlug`, `serviceId`, `subServiceId`, `leadStatus: 'complete' | 'partial'`, and a typed `serviceDetails` record for per-service answers (Phase 3 fills this).
7. **Thank-you routes.** Add `app/thank-you/page.tsx` and `app/thank-you/[service]/page.tsx`. Redirect the funnel's `done` state to the URL (preserving the request id via query or session). Put genuinely useful next-step content there: what happens next and when, the phone number, and the referral ask. Fire the conversion on the thank-you page so there is a stable URL destination for Ads.
8. **Durable idempotency and rate limiting.** Replace the in-process `Map`s with a shared store (Vercel KV or Upstash Redis, env-gated; fall back to current behavior with a loud warning when unset). Add a durable failure queue so a lead that fails all delivery channels is persisted and retried rather than lost.
9. **Tests.** Playwright specs asserting the exact `dataLayer` payloads for: organic conversion, paid conversion, partial fill, abandon, phone click, contact form. A `dataLayer` contract test that fails when a required field disappears.

### Gates
- Conversion fires with zero query params present (the F-CRO-101 regression test).
- Every lead surface emits its events; contract tests green.
- `/thank-you` reachable and indexed as `noindex`.
- `.env.example` documents every new variable with `HUMAN SETUP:` callouts.
- `docs/cro/PHASE1_REPORT.md` written.

---

## Phase 2 — Context continuity

**Branch:** `cro/phase-2-continuity` · Fixes F-CRO-201 through F-CRO-205

Stop the funnel from discarding what the visitor already told it.

### Tasks

1. Create `lib/funnel/params.ts` as the single source of truth for funnel context: parse, validate, and persist `service`, `subservice`, `area`, `size`, `property`, `frequency`, `tier`, `campaign`, `source`. Round-trip through `sessionStorage` so context survives a page hop or a refresh.
2. Rewrite `quote-funnel.tsx` hydration to read **all** of it, not just `service`. Arriving with `size`/`property`/`frequency` must pre-fill those controls and, where the service is estimable, land the visitor directly on the **Estimate** step with the number already computed — they should see their number, not a blank form.
3. Make `quote-band.tsx` pass `service=mowing` (or the selected service once the band offers a choice) along with its other params, so the funnel is never entered blank from the homepage.
4. Thread `area` through: hydrate it, display it ("Serving Derby, KS"), send it to `/api/lead`, and tag it in GHL as `area:<slug>`. Validate the entered address against the service-area list and set a `qualified_area: true|false` flag on the lead.
5. Unify the estimator inputs: one shared constant set for min/max/step/default, used by both `quote-band.tsx` and `quote-funnel.tsx`. Raise the funnel ceiling to match the band and to clear the ¼-acre boundary (10,890 sq ft). Confirm with `lib/pricing/estimate.test.ts` that no output changes for inputs in the old range; if any does, stop and report.
6. Add a per-card primary CTA to `components/blocks/service-grid.tsx` ("Get a quote →" to `/quote?service=<id>`) alongside "Learn more."
7. Resolve the `/pricing` vs estimator mismatch (F-CRO-205): either restate `/pricing` in the estimator's terms or replace the static plans with live `lib/pricing/estimate.ts`-derived "starting at" numbers. Propose both in the report; implement the one that preserves the CFO model.

### Gates
- Playwright: entering `/quote?service=mowing&size=7500&property=residential&frequency=biweekly` lands on Estimate with all four values reflected and a computed number.
- Playwright: entering from an area page produces a lead payload containing `areaSlug`.
- No change to any `estimate.test.ts` expected value.
- `docs/cro/PHASE2_REPORT.md` written.

---

## Phase 3 — Service-aware form engine

**Branch:** `cro/phase-3-form-engine` · Fixes F-CRO-301 through F-CRO-309, F-CRO-302's data pollution

This is the core of the request: the form must adapt to the service. Build it as **data, not branches** — a declarative schema that one renderer consumes — so adding a service later is a data edit, not a refactor.

### Tasks

1. **Build the taxonomy.** Create `lib/quote/taxonomy.ts`: 7–8 categories, each with sub-services, each mapped to its `/services/<slug>` page, its `SERVICE_LABELS` key (preserve the existing GHL label strings so current tags and workflows keep working), an `estimable: boolean`, and season metadata. Reconcile against `lib/marketing-content.ts` `SERVICES` and `getServiceSlugs()` so the taxonomy and the site's service list cannot drift.

2. **Build the field schema.** Create `lib/quote/service-schema.ts` — per service: the ordered field set, types, validation, help text, conditional visibility, and GHL custom-field mapping. Minimum coverage:
   - **Lawn (mow/fert/weed/full-service):** lawn sq ft, frequency, property type, tier
   - **Aeration/overseed:** lawn sq ft, turf condition, last aerated
   - **Termite:** home sq ft, foundation type, stories, active sighting vs. prevention, real-estate deadline
   - **Pest/rodent/bed bug:** home sq ft, pest type, indoor/outdoor, urgency, prior treatment
   - **Snow & ice:** driveway/lot size band, surface, residential/commercial, trigger depth, salting, seasonal vs. per-push
   - **Holiday lights:** roofline linear ft, stories, access/pitch, install+takedown+storage, materials owned or supplied
   - **Gutter cleaning:** stories, linear ft, guards, roof type
   - **Power washing:** surfaces (multi-select), approx. area, last cleaned
   - **Landscaping/hardscape:** project type, budget band, timeline, design needed, optional photo upload
   - **Commercial:** number of properties, site type, contract cycle, decision timeline, COI/insurance requirement, current vendor
   
   Every field carries `sendToCrm: true|false` and a stable key. **A field that is not in the active service's schema is never sent** — this kills the `lawnSizeSqFt: 2000` pollution on termite and snow leads (F-CRO-302).

3. **Two-stage service picker.** Replace the 35-option `Select` with category tiles (min 44 px touch targets, icon + label, 2-up on mobile) then sub-service chips. Keep a grouped `SelectGroup` fallback for narrow contexts and preserve keyboard/screen-reader parity. Deep links skip straight to the matched sub-service.

4. **Address first.** Move service address to the top of the flow with a places autocomplete (env-gated; graceful free-text fallback). Validate against service areas immediately and, for lawn services, offer a derived lot-size estimate the visitor can accept or override — so the slider becomes a confirmation, not a chore.

5. **Reduce the identity ask.** Step "Contact" becomes name + mobile required; email optional and clearly labeled optional; notes optional; last name optional (split from a single "Name" field server-side, as `contact-form-block.tsx` already does). Drop the ≥10-character message requirement in `contact-form-block.tsx`.

6. **Partial lead capture.** Once name + phone exist, POST a `leadStatus: 'partial'` lead on step transition and on abandon (`sendBeacon`), tagged `lead-status:partial` in GHL, upgraded in place on completion via the same `idempotencyKey`. Never create a duplicate contact.

7. **Honest progress.** Render the stepper from the active service's actual step list so consult services show three steps, not four with one skipped. Label steps by content ("Property → Your details → Done"), not by generic numbers.

8. **Field mechanics.** Phone masking + E.164 normalization, `inputMode`/`enterKeyHint`/`autoComplete` on every input, inline validation on blur, an error summary with focus management on failed submit, in-progress autosave to `sessionStorage`.

9. **Urgency + self-reported source.** Add a one-tap urgency/timeline control and a "How did you hear about us?" chip row on the final step. Send both to GHL; include self-reported source in the weekly report alongside tracked attribution.

10. **Keep the estimate promise honest.** For estimable services the number still comes from `lib/pricing/estimate.ts`, unchanged. For consult services, replace the current "Custom quote"/`amount: 0` placeholder with a clear expectation: what happens next, typical turnaround, and — where defensible — a "starting at" range sourced from existing bundle/pricing data.

### Gates
- Playwright, mobile viewport (390 × 844), one spec per service group: correct fields shown, irrelevant fields absent from **both UI and payload**.
- Snapshot test: a termite lead payload contains `homeSquareFeet` and contains **no** `lawnSizeSqFt` or `frequency`.
- Axe accessibility pass on the picker and every field type.
- Lighthouse mobile ≥ 90 performance / ≥ 95 accessibility on `/quote`.
- `docs/cro/FORM_SCHEMA.md` documents the schema shape and how to add a service.
- `docs/cro/PHASE3_REPORT.md` written.

---

## Phase 4 — Landing and funnel page architecture

**Branch:** `cro/phase-4-landing-pages` · Fixes F-CRO-401 through F-CRO-404

### Tasks

1. **Quarantine the duplicates first** (executing Phase 0's proposal): resolve the `app/services/<slug>` vs `[slug]` collision to a single pattern, and remove or `_graveyard/` the dead header/footer/form copies. One behavioral change at a time, build green after each.
2. **`/lp/[service]` route group** for paid traffic: own minimal layout (logo + phone, no nav, no footer links), `noindex, nofollow`, matched-message hero driven by the taxonomy, service-specific proof and FAQ, the Phase 3 form **inline above the fold on mobile**, one CTA, no outbound links except tap-to-call. Campaign params flow straight into the form.
3. **`/quote/[service]`** as indexed, segmented funnel entries with full nav, canonical to themselves, linked from the matching `/services/<slug>`. `/quote` remains the generic router.
4. **Area × service matrix:** `app/service-areas/[area]/[service]/page.tsx` generated from taxonomy × areas, with localized copy, local testimonials via `testimonialsForArea`, `LocalBusiness` + `Service` JSON-LD, and canonical/sitemap wiring. Generate only combinations the business actually serves. Update `app/sitemap.ts` and `app/robots.ts` accordingly.
5. **Replace the generic area service grid:** order services per area by what that market actually sells (KC side vs Wichita), not `SERVICES.slice(0, 7)`.
6. **Seasonal ordering:** a `lib/season.ts` helper driving service-grid order, homepage emphasis, and the announcement marquee (snow Oct–Mar, lights Sep–Dec, aeration Aug–Oct, fertilization Mar–Jun). Deterministic, testable, overridable by env for previews.
7. **Redirects and hygiene:** no orphaned URLs, no duplicate canonicals, every new route in the sitemap, `/lp/*` excluded from the sitemap and disallowed in robots.

### Gates
- Every generated route builds, renders, and returns 200; no canonical collisions.
- `/lp/*` verified `noindex` and free of nav leakage.
- Playwright: a paid visitor landing on `/lp/snow-removal?gclid=test` can submit without a page change, and the lead carries service + click id + area.
- Lighthouse mobile ≥ 90 on one `/lp/*`, one `/quote/[service]`, one area × service page.
- `docs/cro/PHASE4_REPORT.md` + an updated site map diagram.

---

## Phase 5 — Lead → customer close loop

**Branch:** `cro/phase-5-close-loop` · Fixes F-CRO-501 through F-CRO-505, F-CRO-103

### Tasks

1. **Write attribution and qualification into the CRM.** Extend `lib/ghl.ts` to map the full Phase 1/3 payload into GHL custom fields: service, sub-service, all `serviceDetails` answers, estimate amount/unit, address, area, qualified-area flag, first-touch and last-touch attribution, all click ids, device, landing page, self-reported source, urgency, lead status. Ship `scripts/ghl/ensure-custom-fields.ts` to create/verify the fields and emit their IDs, so this is not a manual copy-paste job.
2. **Create opportunities.** On every complete lead, create a GHL opportunity in the New Leads pipeline with monetary value from the estimate (or a service-default band), owner assignment per routing rules, and the same attribution fields. This is what makes lead→customer computable.
3. **Routing and prioritization.** Rules in `lib/quote/routing.ts`: commercial and multi-property → sales owner; seasonal urgent (active pest sighting, snow event pending) → priority tag + SLA tag; out-of-service-area → `unqualified:out-of-area` and a distinct workflow. Tags stay additive so existing `website-lead` / `source:*` / `service:*` workflows keep firing.
4. **Speed to lead.** Specify (and build where the API allows, via the LeadConnector MCP) the workflows currently pending as `GHL-WF-001/002/003`: instant SMS + email acknowledgment naming the specific service and the expected callback window, internal notification, opportunity creation, and a follow-up cadence branching on `source:quote` vs `source:contact` vs `lead-status:partial`. Where MCP scopes block a step, write the exact manual build instructions into `docs/cro/GHL_WORKFLOWS.md` — do not silently skip it. Update both `OUTSTANDING_TASKS.yaml` and `ACTIVE_PLAN.yaml` status fields as items complete, per the repo's convention.
5. **Offline conversion export.** Build `scripts/analytics/export-offline-conversions.ts`: read won/stage-changed opportunities from GHL, join on the stored click id, emit Google Ads offline-conversion-import format (and a GA4 Measurement Protocol variant). Env-gated, dry-run by default, documented. This is what finally tells the business which campaigns produce *customers* rather than form fills.
6. **Extend weekly reporting.** The existing `$449/mo` weekly report gains segmentation: leads and customers by service, channel, campaign, area, and device; funnel step completion; speed-to-first-touch; partial-capture recovery rate; cost per customer where spend data is available.

### Gates
- End-to-end smoke test (`GHL-TEST-001`): submission → contact with all custom fields populated → opportunity created with value and owner → tags correct. Run against a sandbox location.
- Offline export dry run produces a valid file from seed data.
- `docs/cro/GHL_WORKFLOWS.md` complete enough for a non-developer to finish any step blocked by API scope.
- `docs/cro/PHASE5_REPORT.md` written; `OUTSTANDING_TASKS.yaml` and `ACTIVE_PLAN.yaml` updated.

---

## Phase 6 — Validation, documentation, experiment harness

**Branch:** `cro/phase-6-validation`

### Tasks

1. Full Playwright suite at 390 × 844, 768 × 1024, and 1440 × 900: every service path, every entry point (home band, service page, area page, `/lp/*`, direct), abandon and resume, error and retry.
2. Lighthouse on homepage, `/quote`, one `/quote/[service]`, one `/lp/*`, one area × service page — mobile ≥ 90 performance, ≥ 95 accessibility, CLS < 0.1.
3. `dataLayer` contract tests as CI gates; the build fails if a required conversion field disappears.
4. Write `docs/cro/MEASUREMENT_PLAN.md`: the KPI table from Part A §A6 with exact event/field definitions, the GA4 exploration and Looker setup needed, and a plain-language statement that pre-Phase-1 numbers are not comparable to post-Phase-1 numbers and why.
5. Write `docs/cro/EXPERIMENT_BACKLOG.md`: a prioritized test list with hypothesis, metric, minimum detectable effect, and rough sample-size feasibility given current traffic. Be honest where traffic cannot support a statistically valid test — for low-volume services, say so and recommend sequential/qualitative evaluation instead.
6. Build a minimal bucketing harness (deterministic hash on session id → variant, variant on every event) for the tests that *are* feasible. No third-party testing tool.
7. Final `docs/cro/EXECUTIVE_SUMMARY.md` — written for a business reader, not a developer: what was broken, what changed, what to watch weekly, and what genuinely needs a human decision.

### Gates
- All suites green across all three viewports.
- No `console.error` on any conversion path.
- Every `F-CRO-*` finding marked resolved / deferred-with-reason / not-reproducible.
- Merge to `main` only when all of the above hold.

---

## Reporting format (every phase)

`docs/cro/PHASE<N>_REPORT.md`:

```markdown
# Phase <N> — <name>
**Branch:** · **Commits:** · **Date:**

## Completed
- <task> — <files touched> — <how verified>

## Deviations from the plan
- <what and why>

## Findings resolved
- F-CRO-NNN — <how>

## New findings
- F-CRO-NNN — Priority / Evidence / Impact

## Blocked / needs a human
- <item> — <exactly what is needed and from whom>

## Gate results
| Gate | Result | Evidence |
```

## Human-decision checkpoints

Stop and ask rather than guessing:

1. Which services get dedicated `/lp/*` pages first (ad spend and seasonality decide this, not code).
2. Budget bands and timeline options for landscaping/hardscape — these must match how the reps actually qualify, and they interact with pricing discipline.
3. Owner assignment rules for routing (who gets commercial, who gets overflow).
4. The `/pricing` reconciliation choice from Phase 2, task 7.
5. Consent-banner wording and default state.
6. Which area × service combinations the business genuinely serves — do not generate pages for work that can't be delivered.
