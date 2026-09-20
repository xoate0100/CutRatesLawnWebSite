# CRO lead-journey — Findings

**Mode:** discovery (read-only) | **Recon date:** 2026-09-20 (`cro/phase-0-recon`) | **Resolution date:** 2026-09-20 (`cro/phase-1-measurement`)

Sections below are the original recon write-up (evidence as of Phase 0). Use the resolution table for current status. **Resolved** = code on this branch. **Deferred — human** = code path exists but production still fails until Andy finishes `docs/cro/HUMAN_FINISH_GUIDE.md`.

## Phase 6 resolution

| ID | Priority | Status | Notes |
|---|---|---|---|
| F-CRO-101 | P0 | **Resolved** | Conversions emit with `traffic_type`; never dropped for missing UTM. Vendor `analytics.tracking` suite still requires attribution (intentional split). |
| F-CRO-102 | P1 | **Resolved** | First-touch `localStorage` 90d + last-touch `sessionStorage`; click ids include gbraid/wbraid/fbclid/msclkid. |
| F-CRO-103 | P0 | **Resolved in code / deferred — human** | Lead schema + GHL custom fields carry click ids. Live CRM still needs PIT, CF IDs, workflows. |
| F-CRO-104 | P1 | **Resolved** | `/thank-you` and `/thank-you/[service]`. |
| F-CRO-105 | P1 | **Resolved** | Quote, contact, newsletter, phone, thank-you instrumented. |
| F-CRO-106 | P1 | **Resolved** | Funnel step / field / abandon / partial events. |
| F-CRO-107 | P1 | **Resolved in code / deferred — human** | Consent Mode default deny; H-CRO-001 legal copy review. |
| F-CRO-201 | P1 | **Resolved** | Quote-band + funnel params hydrate `/quote`. |
| F-CRO-202 | P1 | **Resolved** | Area carried on quote URLs and lead payload. |
| F-CRO-203 | P1 | **Resolved** | Shared `LAWN_SIZE_UI` (rates in `estimate.ts` untouched). |
| F-CRO-204 | P1 | **Resolved** | Service grid quote CTAs. |
| F-CRO-205 | P1 | **Resolved** | `/pricing` uses estimator “starting at”, not $99/$199 plans. H-CRO-014 CFO copy confirm. |
| F-CRO-301 | P0 | **Resolved** | Two-stage category → service picker. |
| F-CRO-302 | P0 | **Resolved** | Per-service schema; no lawn defaults on consults. |
| F-CRO-303 | P1 | **Resolved** | Consult/pest/snow/lights fields in `service-schema.ts`. |
| F-CRO-304 | P1 | **Resolved** | Address asked when the service needs a site. |
| F-CRO-305 | P2 | **Resolved** | Phone-primary contact; lastName no longer `"—"`. |
| F-CRO-306 | P1 | **Resolved** | Partial leads tagged `lead-status:partial`; must not complete the idempotency key. |
| F-CRO-307 | P2 | **Resolved** | Stepper follows actual schema. |
| F-CRO-308 | P2 | **Resolved** | Shared slider / field renderer. |
| F-CRO-309 | P2 | **Resolved** | Urgency / timeline / heard-about fields. |
| F-CRO-401 | P1 | **Resolved** | Indexed `/quote/[service]`; noindex `/lp/[service]`. |
| F-CRO-402 | P2 | **Resolved** | Area × service SSG. H-CRO-009 confirm deliverable combos. |
| F-CRO-403 | P2 | **Resolved** | `lib/season.ts` marquee/grid order. |
| F-CRO-404 | P2 | **Resolved** | Dead v0 headers/footers/forms moved to `components/_graveyard/`. Live `cta-section.tsx` kept. |
| F-CRO-406 | P2 | **Resolved** | Bundle/schedule query params flow into `/quote`. |
| F-CRO-407 | P2 | **Resolved** | `AnalyticsPhoneLink` wired on footer, hero, CTA, LP, thank-you. |
| F-CRO-408 | P1 | **Resolved** | Bundles no longer use fake `QuoteForm`; they link to `/quote`. |
| F-CRO-409 | P2 | **Resolved** | Sticky chip left + Call; chat FAB right; `max-w` leaves FAB room. |
| F-CRO-410 | P3 | **Resolved** | Newsletter fires `conversion_lead`. |
| F-CRO-411 | P2 | **Resolved** | No lastName placeholder dash. |
| F-CRO-501 | P0 | **Deferred — human** | Tags are written in code; SMS/email workflows are GHL UI (H-CRO-005). |
| F-CRO-502 | P1 | **Deferred — human** | Opportunity POST exists; needs pipeline stage + owner IDs. |
| F-CRO-503 | P2 | **Deferred — human** | Owner env keys; default is unset. |
| F-CRO-504 | P1 | **Deferred — human** | Redis REST store env-gated (H-CRO-002). Unset = in-process Maps (lost on serverless). |
| F-CRO-505 | P0 | **Deferred — human** | Queue + `/api/cron/lead-retry` (GET+POST). Needs Redis + `CRON_SECRET` + Vercel Cron. |

Merge to `main` is **blocked** until H-CRO-002, H-CRO-003, H-CRO-004, H-CRO-005, H-CRO-017 (see the finish guide).

## Summary (Phase 0 recon, historical)

| Priority | Confirmed / revised (open at recon) | Already-fixed at recon |
|----------|----------------------------|---------------|
| P0 | 5 | 0 |
| P1 | 12 | 0 |
| P2 | 14 | 0 |
| P3 | 1 | 0 |

New IDs from recon: **F-CRO-406** through **F-CRO-411**.

---

### F-CRO-101 — Conversions from non-paid traffic are silently discarded

| Field | Value |
|-------|-------|
| Priority | **P0** |
| Area | Measurement |
| Status | **Confirmed** (open) |

**Evidence:** `lib/analytics/core.ts` `hasAttribution()` is true only for `utm_source` or `gclid` (lines 39–41). `pushAnalyticsEvent` returns false for `CONVERSION_EVENTS` when that is false (lines 82–84). `CONVERSION_EVENTS` includes `conversion_lead` (`lib/analytics/types.ts`).

**Impact:** Organic, GBP, direct, referral, and returning visitors never fire a conversion. Channel conversion rates are not usable.

---

### F-CRO-102 — Attribution is session-scoped and non-durable

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Measurement |
| Status | **Confirmed** (open) |

**Evidence:** `lib/analytics/gtm.ts` `storeUtmParams` / `storeGclid` write `sessionStorage` only (lines 27–45). Keys captured: five UTMs + `gclid`. No first-touch `localStorage`, no `gbraid`/`wbraid`/`fbclid`/`msclkid`, no landing page, no referrer.

**Impact:** Ad click Tuesday → convert Thursday attributes as nothing. Ads offline import cannot wait for a later close even if the CRM stored the id (it does not).

---

### F-CRO-103 — Attribution never reaches the server or the CRM

| Field | Value |
|-------|-------|
| Priority | **P0** |
| Area | Measurement / CRM |
| Status | **Confirmed** (open) |

**Evidence:** `app/api/lead/route.ts` `leadSchema` (lines 7–27) has no UTM, gclid, landing, referrer, session, device, or area. `lib/ghl.ts` upserts name/email/phone/source and tags `website-lead` / `source:*` / `service:*` (lines 56–69, 90–149). No click-id custom field.

**Impact:** GHL cannot report close rate by campaign. Google Ads offline conversion import is impossible. Reps do not see how the lead arrived.

---

### F-CRO-104 — No thank-you URL

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Funnel architecture |
| Status | **Confirmed** (open) |

**Evidence:** `components/quote/quote-funnel.tsx` keeps `step === "done"` in client state. Glob of `app/thank-you/**` is empty. Contact success is an in-place card in `contact-form-block.tsx`.

**Impact:** No stable Ads conversion destination, no post-submit next-step URL, back-button returns into a completed form.

---

### F-CRO-105 — Entire lead paths are analytically invisible

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Measurement |
| Status | **Revised** (open; careers path improved, tracking still missing) |

**Evidence:** `contact-form-block.tsx` imports no analytics. Sticky bar (`sticky-quote-bar.tsx` lines 64–69) is quote-only, no `tel:`. `AnalyticsPhoneLink` exists at `components/analytics/phone-link.tsx` and has **zero importers**. Header is the only `trackPhoneClick` caller. `/schedule` still uses `mailto:` / `/contact` (`app/schedule/page.tsx`). **Revision:** `components/careers/apply-form.tsx` now `POST`s `/api/lead` with `source:careers` and keeps mailto as backup — no longer mailto-only. Careers remains out of CRO implementation scope.

**Impact:** Contact, newsletter, schedule, most phone taps, and sticky CTA produce no conversion or phone events.

---

### F-CRO-106 — No mid-funnel diagnostics

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Measurement |
| Status | **Confirmed** (open) |

**Evidence:** `hooks/useAnalytics.ts` exposes `onFunnelStep` only among form diagnostics. Quote funnel fires `funnel_step_view` on step change (`quote-funnel.tsx` lines 189–197). No `form_start`, field engage, abandon, or partial-fill events in `lib/analytics/core.ts`.

**Impact:** Drop-off is a step index, not a field or a reason.

---

### F-CRO-107 — No consent gate

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Measurement / privacy |
| Status | **Confirmed** (open) |

**Evidence:** `lib/analytics/gtm.ts` `gtmEvent` pushes to `dataLayer` after `waitForGTM` with no consent check (lines 85–93).

**Impact:** Marketing tags can fire before consent; Ads-repo standard is not met.

---

### F-CRO-201 — Homepage estimator inputs are discarded on arrival

| Field | Value |
|-------|-------|
| Priority | **P0** |
| Area | Context continuity |
| Status | **Confirmed** (open) |

**Evidence:** `quote-band.tsx` links to `/quote?size=${lawnSize}&property=${propertyType}&frequency=${frequency}` (line 118). Funnel reads only `searchParams.get("service")` (`quote-funnel.tsx` lines 158–160). Band does not pass `service`.

**Impact:** Peak-intent visitors re-enter lawn size and see an empty service select. The on-page estimate reads as fake.

---

### F-CRO-202 — Area context is dropped

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Context continuity |
| Status | **Confirmed** (open) |

**Evidence:** `app/service-areas/[slug]/page.tsx` sets `ctaHref={`/quote?area=${area.slug}`}` (line 47). Funnel ignores `area`. Lead schema and GHL tags have no `area:`.

**Impact:** No geo segmentation of leads despite seven service areas.

---

### F-CRO-203 — The two estimators disagree on range

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Context continuity |
| Status | **Confirmed** (open) |

**Evidence:** QuoteBand slider `min={500} max={15000} step={250}` (`quote-band.tsx` lines 84–88). Funnel slider `min={500} max={10000} step={100}` (`quote-funnel.tsx` lines 374–376). `QUARTER_ACRE_SQ_FT = 10890` in `lib/pricing/estimate.ts`. Funnel cannot express a quarter-acre lawn; the band can. `calculateEstimate` itself has no max cap — UI range is the limiter.

**Impact:** Same property, two numbers, depending on entry. Raising the funnel max in Phase 2 must be checked against `estimate.test.ts` without changing rates.

---

### F-CRO-204 — Service cards have no quote CTA

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | CTA discipline |
| Status | **Confirmed** (open) |

**Evidence:** `service-grid.tsx` `ServiceCard` only “Learn more” to `service.href` (lines 39–44). Featured `FeatureCard` is “Explore landscaping” (line 81) because `SERVICES` marks landscaping `featured: true`.

**Impact:** Extra page load between homepage interest and `/quote`.

---

### F-CRO-205 — Pricing page contradicts the estimator

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Message match |
| Status | **Confirmed** (open) |

**Evidence:** `app/pricing/page.tsx` `pricingPlans` Basic `$99` / month and Premium `$199` / month (lines 8–20). Estimator uses `lib/pricing/estimate.ts` per-visit / per-month CFO model (`$45` standard residential mow through ¼ acre, etc.). Page uses legacy `components/cta-section.tsx`.

**Impact:** Scent break vs quote and vs lawn-care “from $45” labels.

---

### F-CRO-301 — One flat 36-option select

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Form design |
| Status | **Revised** (open; count is 36 not 35) |

**Evidence:** `quote-funnel.tsx` `ESTIMATE_LABELS` (4) + `CONSULT_LABELS` (32) merged into `SERVICE_LABELS`, rendered as a single ungrouped `Select` (lines 27–75, 356–367).

**Impact:** Mobile visitors scroll a long Radix list with no grouping or search.

---

### F-CRO-302 — Irrelevant lawn defaults shipped on every lead

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Form design / CRM hygiene |
| Status | **Confirmed** (open) |

**Evidence:** Consult services hide the slider (`quote-funnel.tsx` lines 370–398) but `submitLead` always sends `lawnSizeSqFt: lawnSize` (default 2000), `propertyType`, and `frequency` (default weekly) (lines 271–275). `/api/lead` folds those into the GHL message (route lines 82–89).

**Impact:** Termite/snow leads show “Lawn size: 2000 sq ft · Frequency: weekly.” Staff learn to ignore notes; reports on lawn size are polluted.

---

### F-CRO-303 — Qualifying fields for consult services are never asked

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** Consult path sets a placeholder quote and jumps to contact (`quote-funnel.tsx` lines 204–216). Contact fields are name, email, phone, address, notes only. No termite/snow/lights/commercial qualification schema.

**Impact:** Reps cannot triage. Budget/timeline/urgency never captured.

---

### F-CRO-304 — Address is optional, unused, and asked last

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** Address is a free-text input on the contact step; not required in `validateContact` (lines 234–241). No service-area check. Sent only if filled (`address: contact.address || undefined`).

**Impact:** Cannot auto-qualify service area or replace the lawn slider with a parcel lookup.

---

### F-CRO-305 — Contact step asks for too much; contact form taxes with prose

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** Quote `validateContact` requires first, last, email, **and** phone (lines 234–241). `ContactFormBlock` requires message ≥ 10 characters (lines 34–36) and splits a single name, using `"—"` when there is no last name (lines 49–51).

**Impact:** Extra fields at the last step; contact form punishes short “please call me” messages; GHL last names of `"—"` on single-name contacts.

---

### F-CRO-306 — No partial-lead capture

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** Identity is collected only on the last step. No `leadStatus: partial`, no `sendBeacon`, no mid-funnel POST.

**Impact:** Abandons are unrecoverable.

---

### F-CRO-307 — Progress stepper lies for consult services

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** Four chips always render: Details, Estimate, Contact, Done (`quote-funnel.tsx` lines 309–328). Consult `calculateQuote` sets `setStep("contact")` and `stepIndex` 3, skipping Estimate visually. Contact “Back” always `setStep("estimate")` (line 548), which is the skipped step for consult.

**Impact:** Users see step 2 skipped; back navigation is wrong for consult.

---

### F-CRO-308 — Field mechanics

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** No E.164 mask; errors only after submit; no error-summary focus; limited `autoComplete` on quote first/last; no `inputMode` on phone; no session autosave of in-progress quote state.

**Impact:** Mobile friction and avoidable validation failures.

---

### F-CRO-309 — No urgency, timeline, or self-reported source

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Form design |
| Status | **Confirmed** (open) |

**Evidence:** Neither quote contact fields nor `leadSchema` include urgency or “how did you hear about us.”

**Impact:** Yard-sign and word-of-mouth traffic stay invisible even after pixel attribution is fixed.

---

### F-CRO-401 — No service-specific funnel pages

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Page architecture |
| Status | **Confirmed** (open) |

**Evidence:** One `/quote` + shared `ServiceDetailView`. No `app/lp/` or `app/quote/[service]/`. Service pages now have quote + call in `InteriorHero`, but still no inline form.

**Impact:** Snow and termite share one form, one proof stack, one thank-you (none).

---

### F-CRO-402 — Area pages do not segment by service

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Page architecture |
| Status | **Confirmed** (open) |

**Evidence:** `app/service-areas/[slug]/page.tsx` title is lawn/landscape; grid is `SERVICES.slice(0, 7)` (line 75). No `[area]/[service]` route.

**Impact:** Weak local SEO and no geo-specific Ads landing.

---

### F-CRO-403 — No seasonal routing

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Page architecture |
| Status | **Confirmed** (open) |

**Evidence:** `ServiceGrid` order is `featured` landscaping then the rest of `SERVICES`. `RibbonMarquee` / `AnnouncementMarquee` exist but are not driven by a `lib/season.ts` calendar for snow/lights/aeration.

**Impact:** Off-season services compete with in-season demand on the homepage.

---

### F-CRO-404 — Duplicate routes and components create mis-edit risk

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Page architecture |
| Status | **Revised** (open; one “dead” quote form is live on bundles) |

**Evidence:** See `INVENTORY.md` and `DEAD_CODE.md`. Explicit `app/services/<slug>` wins over `[slug]` for 11 URLs; `[slug]` still serves aliases. Quote implementations: funnel (live), `components/quote-form.tsx` (**live on bundles/[slug]**), `forms/quote-form.tsx` (dead). Contact: block (live), `contact-form.tsx` (dead), `forms/contact-form.tsx` (unused re-export). Headers/footers: blocks live; three+ copies unused.

**Impact:** CRO edits aimed at “the quote form” have a real chance of changing a corpse — or the fake bundle form instead of `/quote`.

---

### F-CRO-501 — No CRM automation is live

| Field | Value |
|-------|-------|
| Priority | **P0** |
| Area | Lead → customer |
| Status | **Confirmed** (open) |

**Evidence:** `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` `GHL-WF-001` / `GHL-OPS-001` / `GHL-TEST-001` are **pending**. `lib/ghl.ts` documents that automations should trigger on `website-lead`; none are in this repo. Copy on `/quote` still promises a fast text.

**Impact:** Speed-to-lead is unenforced. A contact in GHL (if secrets exist) does not imply an SMS or owner task.

---

### F-CRO-502 — No opportunity, pipeline stage, or close-loop

| Field | Value |
|-------|-------|
| Priority | **P0** |
| Area | Lead → customer |
| Status | **Confirmed** (open) |

**Evidence:** `lib/ghl.ts` has no opportunities API call. Custom fields only if `GHL_CF_*` env is set. No value, owner, or stage.

**Impact:** Lead→customer rate by service/channel/area cannot be computed.

---

### F-CRO-503 — No routing or prioritization

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Lead → customer |
| Status | **Confirmed** (open) |

**Evidence:** Every complete lead gets the same three tag families. No value banding, owner map, or SLA tag in code.

**Impact:** Commercial snow and a gutter clean enter the same bucket.

---

### F-CRO-504 — Idempotency and rate limiting are in-process

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Lead → customer |
| Status | **Confirmed** (open) |

**Evidence:** `app/api/lead/route.ts` `seenKeys` and `ipHits` are module-level `Map`s (lines 31–34). `app/api/newsletter/route.ts` has its own `seen` Map. Serverless instances do not share memory.

**Impact:** Duplicate CRM contacts and porous rate limits; conversion counts double-count.

---

### F-CRO-505 — Failed delivery loses the lead

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Lead → customer |
| Status | **Confirmed** (open) |

**Evidence:** `deliverLead` failure returns 503 with `manualContactRequired: true` (`route.ts` lines 239–248). Quote funnel shows the error and does **not** fire conversion (lines 285–291) — better than treating 503 as success, but the payload is not queued. No retry store.

**Impact:** Completed four-step journeys vanish if GHL/webhook/Resend are down or unset.

---

## New findings (recon)

### F-CRO-406 — Bundle and schedule query context is also dropped

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Context continuity |
| Status | **Open** (new) |

**Evidence:** `BUNDLES` hrefs are `/quote?bundle=essentials|full-yard|estate` (`lib/marketing-content.ts`). Funnel ignores `bundle`. `app/schedule/page.tsx` sends `/contact?service=&preferredDate=`; `ContactFormBlock` does not read search params. Service is hardcoded `"General inquiry"`.

**Impact:** Two more high-intent entries reset context. Related to F-CRO-201/202.

---

### F-CRO-407 — Most phone links are untracked; AnalyticsPhoneLink is dead

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Measurement |
| Status | **Open** (new; split from F-CRO-105) |

**Evidence:** `trackPhoneClick` only in `blocks/site-header.tsx`. Footer (`site-footer.tsx` ~line 100), `InteriorHero` default `tel:`, `CTASection` default `tel:`, quote page hero tel, and sticky bar have no tracker. `components/analytics/phone-link.tsx` unused.

**Impact:** Phone-heavy close path is undercounted even for header-capable analytics.

---

### F-CRO-408 — Live bundle QuoteForm never creates a lead

| Field | Value |
|-------|-------|
| Priority | **P0** |
| Area | Funnel capture |
| Status | **Open** (new) |

**Evidence:** `app/bundles/[slug]/page.tsx` imports `QuoteForm` from `@/components/quote-form`. That form calls `submitQuoteRequest` in `lib/api-helpers.ts` (lines 67–76), which sleeps 1s and returns `{ success: true }` with no HTTP call. User sees success; CRM is empty.

**Impact:** Bundle pages manufacture false completions and lose real demand. Higher severity than the unused `forms/quote-form.tsx`.

---

### F-CRO-409 — Sticky quote chip and live-chat FAB share the mobile bottom edge

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | CTA discipline |
| Status | **Open** (new) |

**Evidence:** `StickyQuoteBar` is `fixed bottom-4 left-4 z-40 md:hidden`. `LiveChat` FAB is `fixed bottom-4 right-4 z-50`. Both appear after ~420–520px scroll, both hide on `/quote`. Related to older TEXT-UNDER sticky findings.

**Impact:** Dual mobile chrome competes with reading and with each other; still no tap-to-call on the quote chip.

---

### F-CRO-410 — Newsletter signup is uninstrumented

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Measurement |
| Status | **Open** (new) |

**Evidence:** `components/newsletter-signup.tsx` posts `/api/newsletter` with consent; no `useAnalytics` / `conversion_lead`. Live on `app/blog/page.tsx`. Dead footer copy also embeds it.

**Impact:** Email captures do not appear in the same conversion stream as quotes.

---

### F-CRO-411 — Contact lastName placeholder pollutes GHL

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | CRM hygiene |
| Status | **Open** (new; detail of F-CRO-305) |

**Evidence:** `contact-form-block.tsx` `lastName = nameParts.slice(1).join(" ") || "—"`. `leadSchema` requires `lastName` min 1, so the em dash is intentional to pass validation.

**Impact:** Contacts named “Chris —” in GHL; merge/search noise.

---

## Already-fixed

None of F-CRO-101–505 are already-fixed. Narrow improvements vs older conversion audit (F-CONV-*): quote and contact **no longer treat HTTP 503 as success**; quote `conversion_lead` waits for `res.ok`; careers apply now posts `/api/lead`. Those do not close the Part A IDs.
