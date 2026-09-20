# CRO measurement baseline

**Mode:** discovery (read-only) · **Date:** 2026-09-20 · **Branch:** `cro/phase-0-recon`

This is a statement of **what numbers can be trusted today**, not a dashboard dump. Production secret values were **not** read from `.env` / Vercel. Configuration is inferred from code, `.env.example`, and `OUTSTANDING_TASKS.yaml`.

## Analytics runtime

| Piece | File | Current behavior |
|---|---|---|
| Enablement | `lib/analytics/config.ts` | `isAnalyticsEnabled()` is true only when `NEXT_PUBLIC_GTM_CONTAINER_ID` is set. Unset → silent no-op |
| GTM inject | `components/analytics/gtm-script.tsx` | Standard GTM snippet + noscript iframe when container id present |
| Boot | `components/analytics/analytics-provider.tsx` | `initAnalyticsCapture()` once; `trackPageView()` on pathname/search change |
| Capture | `lib/analytics/gtm.ts` | URL `utm_*` → `sessionStorage.utm_params` if `utm_source` present; `gclid` → `sessionStorage.gclid`. No localStorage, no TTL beyond the tab session, no `gbraid`/`wbraid`/`fbclid`/`msclkid`, no landing page, no referrer |
| Emit | `lib/analytics/core.ts` `pushAnalyticsEvent` | Merges stored + URL attribution; **drops** `conversion_lead` / `lead_conversion` / `conversion` unless `utm_source` **or** `gclid` is set |
| Consent | `gtmEvent()` | Fires as soon as GTM is loaded (or after 5s wait). No consent state |
| Destinations listed on events | `configuredDestinations()` | `ga4`, `google_ads`, `meta_pixel` ids if their `NEXT_PUBLIC_*` vars are set — listing is not the same as a working tag |

### Events the code can emit

| Event | Fired from | Survives F-CRO-101 gate? |
|---|---|---|
| `page_view` | AnalyticsProvider | Yes (not a conversion event) |
| `service_view` | `ServiceViewTracker` on service pages | Yes |
| `area_view` | `AreaViewTracker` on area pages | Yes |
| `funnel_step_view` | QuoteFunnel step change | Yes |
| `phone_click` | Header desktop + mobile menu only | Yes |
| `conversion_lead` | QuoteFunnel after `/api/lead` 200 | **No** unless UTM source or gclid |

Not implemented: `form_start`, `form_field_engage`, `form_abandon`, `partial_form_fill`, `form_error`, `traffic_type`, contact/newsletter/schedule conversions.

## Env vars (documented vs known-pending)

From `.env.example` (commented = expected, not necessarily set in prod):

| Variable | Role | Repo evidence it is live in production |
|---|---|---|
| `NEXT_PUBLIC_GTM_CONTAINER_ID` | Master analytics on/off | Unknown from repo. If unset, **all** client analytics are no-ops |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Listed on events | Unknown |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` / `_LABEL` | Ads conversion tag (via GTM) | Unknown |
| `NEXT_PUBLIC_META_PIXEL_ID` | Listed on events | Unknown |
| `GHL_PRIVATE_INTEGRATION_TOKEN` + `GHL_LOCATION_ID` | CRM upsert | **`GHL-OPS-001` status: pending** in `OUTSTANDING_TASKS.yaml` and `ACTIVE_PLAN.yaml` |
| `GHL_LEAD_TAGS`, `GHL_CF_*` | Extra tags / custom fields | Optional; `.env.example` documents recommended CF ids. No `GHL_CONTACT_SOURCE` |
| `CONTACT_FORM_WEBHOOK_URL`, `RESEND_API_KEY` | Fallback lead delivery | Optional; if GHL + these are all unset, `/api/lead` returns **503** |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Bot check | Optional; secret unset → Turnstile verify skipped |
| `GA4_PROPERTY_ID`, `GA4_DATA_API_CREDENTIALS_JSON`, SMTP report vars | Weekly report | Server-only; `HUMAN SETUP` callout in `lib/analytics/config.ts` |

Do not treat “code is ready” as “production is wired.” `GHL-OPS-001`, `GHL-WF-001`, and `GHL-TEST-001` are still pending.

## CRM / close-loop baseline

| Claim | Reality |
|---|---|
| Website creates a GHL contact | Code path exists (`lib/ghl.ts`). Production secrets pending human setup |
| Tags `website-lead`, `source:*`, `service:*` | Code adds them after upsert. Workflows that fire on those tags: **not built** (`GHL-WF-001`) |
| Opportunity / pipeline / owner | **Not in code.** No `/opportunities` call |
| Offline conversion (gclid → won) | Impossible: click ids never sent to `/api/lead` or GHL (F-CRO-103) |
| Speed-to-lead SMS | Not automated. Copy still says the team texts back |

## Which numbers are trustworthy

Assume GTM is configured in the environment under test. If it is not, **no client analytics number is trustworthy**.

| Number | Trust? | Why |
|---|---|---|
| Sessions / page views (GTM/GA4) | Conditional | `page_view` is not conversion-gated. Quality still depends on GTM container config (out of repo) |
| Service and area view events | Conditional | Fired without attribution gate |
| Funnel step views on `/quote` | Conditional | Fired; stepper still shows 4 steps for consult skips so step 2→3 rates are misleading (F-CRO-307) |
| Header phone clicks | Conditional | Only `header_desktop` / `header_mobile`. Footer, hero, CTA, sticky, quote-page tel, and `AnalyticsPhoneLink` are missing |
| **Lead conversion rate** | **No** | Organic, GBP, direct, referral, and returning visitors never emit `conversion_lead` (F-CRO-101). Paid-only picture |
| Channel / campaign conversion | **No** | Attribution is session-scoped and never stored on the lead (F-CRO-102, F-CRO-103) |
| Contact-form conversion | **No** | Zero analytics on `ContactFormBlock` |
| Newsletter / schedule conversion | **No** | Newsletter uninstrumented; schedule has no lead POST |
| Bundle-page “quotes” | **No** | `components/quote-form.tsx` fakes success and never hits `/api/lead` |
| Lead → customer / revenue per lead | **No** | No opportunity, no won/lost, no value on the CRM record (F-CRO-502) |
| Cost per customer | **No** | Offline import needs persisted gclid |
| Duplicate-lead counts | **No** | In-memory `seenKeys` on serverless (F-CRO-504) |

**Plain statement:** until F-CRO-101 and F-CRO-103 are fixed, any “conversion rate” derived from this site describes **paid click-id/UTM traffic that completed `/quote` in the same browser session**, not the business. Do not use current GA4 conversion counts to rank channels or to judge CRO experiments that include organic or GBP.

## Baseline metrics to start collecting in Phase 1

Definitions from Part A of `docs/cro/CURSOR_PROMPT_CRO_Lead_Journey.md` (quote start, step completion, lead conversion, partial capture, qualified rate, speed to first touch, lead→customer, revenue per lead, cost per customer). None of those denominators are honest today. Phase 1 exists to make them computable **before** UI experiments.
