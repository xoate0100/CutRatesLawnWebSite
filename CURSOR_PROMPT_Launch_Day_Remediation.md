# CURSOR PROMPT — cutrateslawn.com Launch-Day Remediation + Weekly Analytics Report

**Repo:** `xoate0100/CutRatesLawnWebSite` (Next.js App Router, Vercel, Cloudflare DNS)
**Live:** https://cutrateslawn.com (went live 2026-09-22)
**Mode:** Fully autonomous. Do not stop to ask questions. Self-heal on failures. Where a value only the owner can supply is missing, write it to `docs/launch/HUMAN_INPUTS.md`, stub it safely (feature stays off, never faked), and keep going.
**Branch:** `fix/launch-day-remediation` → PR → merge to `main` only when every gate in Phase 9 is green.

---

## 0. Context: what the audit found

A rendered crawl of all 152 sitemap pages plus the repo review produced the findings below. **Good news first:** there were zero 404s, zero broken images, all nav/service/area links resolve, www/http redirect correctly, and the quote estimator works through the final step.

The problems, in priority order:

| # | Severity | Finding |
|---|---|---|
| 1 | CRITICAL | **Zero analytics collected.** Live dataLayer reports `gtm_configured:false, destinations_configured:[]`. No request ever hits googletagmanager.com. The server-rendered `<noscript>` has `GTM-KGVZJ93G`, but the client bundle has no ID. `NEXT_PUBLIC_*` vars are inlined at build, so the env var was added after the build or isn't scoped to Production. |
| 2 | CRITICAL | **Every page ships empty HTML** (`BAILOUT_TO_CLIENT_SIDE_RENDERING`, no `<h1>` in server response on all pages). Root cause: `AnalyticsProvider` calls `useSearchParams()` and wraps `{children}` inside `<Suspense fallback={null}>` in `app/providers.tsx`. |
| 3 | CRITICAL | **`NEXT_PUBLIC_SITE_URL` unset in production.** sitemap.xml, robots.txt `Sitemap:`, all canonicals, `og:url`, and LocalBusiness JSON-LD `url` all say `http://localhost:3000`. |
| 4 | CRITICAL | **Lead delivery unverified and can silently lose leads.** Turnstile widget never renders client-side (no `NEXT_PUBLIC_TURNSTILE_SITE_KEY`). If `TURNSTILE_SECRET_KEY` is set server-side, every submit fails "Spam check failed". If delivery fails and Upstash isn't configured, `/api/lead` returns 202 `queued` into an in-memory Map on a serverless instance: the lead is lost, but the customer still sees the thank-you page. `vercel.json` has no cron, so `/api/cron/lead-retry` never runs. |
| 5 | CRITICAL | **Turnstile token is single-use but is spent by the partial-lead post.** `maybePartial()` sends the same token that the final submit later reuses, so the final submit fails. |
| 6 | HIGH | **CSP blocks tracking.** Cloudflare Web Analytics beacon is blocked on all 152 pages (console error on every page). `connect-src` lacks `*.google-analytics.com` / `*.analytics.google.com` (GA4 collect endpoints are regional), Google Ads (`googleads.g.doubleclick.net`, `www.google.com`, `googleadservices`), and Meta. `img-src` lacks `lh3.googleusercontent.com` (review avatars). |
| 7 | HIGH | **Funnel events inflated ~5x.** `useAnalytics()` returns a new object every render. `QuoteFunnel` lists `analytics` in effect deps, so `funnel_step_view` and `form_step_complete` re-fire on every re-render. |
| 8 | HIGH | **Phantom conversions.** `ThankYouClient` fires `conversion_lead` on any visit to `/thank-you/[service]`, including `rid=unknown` (direct visits, refreshes in new sessions). |
| 9 | HIGH | **Public debug/test routes in production:** `/debug`, `/api-test`, `/api-simple-test`, `/google-reviews-test`, `/image-test`, `/static-test`, `/test-layout`, `/test-page`. |
| 10 | HIGH | **Consent defaults everything to denied** with an opt-in banner. Most visitors will never be measured, and Ads conversions are gated on ads consent. This is an owner decision; see Phase 4. |
| 11 | MED | **Deep-link skips address.** The homepage mowing card (`/quote?size=…&property=…&frequency=…&service=mowing`) jumps straight to the Estimate step. The Property step, which is the only place the service address is collected, is skipped, so the lead arrives with no address and `qualifiedArea:false`. |
| 12 | MED | **Synthetic emails sent to GHL.** When email is blank, `quote.<phone>@leads.cutrateslawn.com` is sent. Any GHL email workflow will bounce and damage domain sender reputation. |
| 13 | MED | **Stale review count.** Hard-coded `GOOGLE_REVIEW_COUNT = 24` (`lib/google-reviews.ts`), `"4.8★ on Google from 24 reviews"` (`lib/marketing-content.ts`), and JSON-LD `aggregateRating.reviewCount: 24`. The live Places API (`/api/google-reviews`) returns **32**. |
| 14 | MED | **JSON-LD `sameAs` includes a KWCH news article.** `sameAs` must only list profiles of the business (GBP, Facebook, etc.). |
| 15 | MED | **Dead blog posts.** `/blog` links 3 posts (`/blog/10-tips-for-lush-green-lawn`, `/blog/benefits-of-professional-pest-control`, `/blog/seasonal-lawn-care-spring`) that redirect back to `/blog`. `/api/health/strapi` returns 504. |
| 16 | MED | **Dead portal link.** `/schedule` links to `/portal`, which renders empty. The real customer portal is `https://cutrateslawn.pestportals.com`. |
| 17 | MED | **`/referral` shows `TODO(owner-approval)` publicly** and is linked from the thank-you page. |
| 18 | MED | **Unverified template content is public.** `/certifications` claims NALP / ISA Certified Arborist / Ecological Landscaping Association certifications. `/case-studies` and `/community` are template filler (park clean-ups, school programs). These are unverified claims, a liability if untrue. |
| 19 | LOW | **Wrong or duplicate service imagery.** Landscaping and Hardscaping cards use the same `library/unassigned/sha-17ae8109f02b` image. The Pest Control card uses a `services-cleanup` image. Aeration uses "water droplets on grass". `Residential pest control` alt text sits on a weed-control original.jpg. |
| 20 | LOW | **Oversized images.** Below-the-fold homepage `next/image` requests use `w=3840` on a 390px mobile viewport, so `sizes` is missing or wrong. |
| 21 | LOW | **Throwaway weekly report.** The existing weekly report (`scripts/analytics/weekly-report.mjs` + `.github/workflows/analytics-weekly-report.yml`) only lists raw GA4 event counts and never actually sends email; it only writes an artifact. It is replaced by Phase 8. |
| 22 | INFO | **Public repo.** The repo is public. The secret scan was clean. Note in the report; do not change visibility. |

---

## 1. Hard rules

1. **Never fabricate:**
   - no fake certifications, reviews, review counts, stats, or referral rewards;
   - no placeholder IDs committed as real values;
   - no synthetic customer emails.
2. **Production leads are real revenue.** You may submit **exactly one** end-to-end test lead to production (Phase 3.6). Label it unmistakably, then delete it from GHL via API. No load tests against `/api/lead`.
3. **Do not change the legal consent posture on your own authority.** Implement the switch (Phase 4); leave the default as the owner specifies in `HUMAN_INPUTS.md`.
4. **Do not change repo visibility, DNS, or domain settings.** DNS is only touched in Phase 7, and only by adding a TXT record for Search Console verification.
5. **Never commit secrets.** Store them in Vercel env / Apps Script Script Properties only.
6. **Every finding in the table above must end in exactly one state** in `docs/launch/REMEDIATION_REPORT.md`: `FIXED (verified how)`, `STUBBED (awaiting HUMAN INPUT X)`, or `DEFERRED (reason)`.

---

## 2. Phase 1 — Environment (Vercel)

Use the Vercel CLI (`vercel env ls production`, `vercel env add`, `vercel env pull`) against the project that serves `cutrateslawn.com`.

1. **Inventory.** Record which of these exist in **Production** (names only, never values) in the report:
   - Site and tracking: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_CONTAINER_ID`, `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `NEXT_PUBLIC_META_PIXEL_ID`
   - Spam check: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`
   - Lead delivery: `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, `CONTACT_FORM_WEBHOOK_URL`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`
   - Queue and cron: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CRON_SECRET`
2. **Set known values** (Production + Preview):
   - `NEXT_PUBLIC_SITE_URL=https://cutrateslawn.com`
   - `NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-KGVZJ93G`
3. **Turnstile must be a pair.** If exactly one of site key / secret exists, that is the "Spam check failed" trap. Resolve it:
   - If you can create a Turnstile widget via the Cloudflare API for `cutrateslawn.com`, do so and set both.
   - Otherwise **remove the orphaned secret** so the lead route stops rejecting, and log `HUMAN INPUT: Turnstile keys`.
4. **Upstash.** If absent, log `HUMAN INPUT: Upstash Redis`. Phase 3.4 makes the site honest without it.
5. **`CRON_SECRET`.** If absent, generate a random 32-byte value and set it.
6. **Rebuild.** After all env changes, redeploy with the build cache disabled (`vercel --prod --force` or equivalent), because `NEXT_PUBLIC_*` values are inlined at build.

---

## 3. Phase 2 — SSR bailout (Finding 2)

This fix was already validated in a local build (H1 present in server HTML afterward).

`components/analytics/analytics-provider.tsx` — rename to a childless tracker:

```tsx
"use client"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { initAnalyticsCapture, trackPageView } from "@/lib/analytics/core"

/** Sibling of page content — NEVER a wrapper. useSearchParams() bails its
 *  nearest Suspense boundary to CSR; wrapping {children} emptied every page's SSR HTML. */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  useEffect(() => { initAnalyticsCapture() }, [])
  useEffect(() => { trackPageView() }, [pathname, searchParams])
  return null
}
```

`app/providers.tsx` — render the tracker as a sibling:

```tsx
<Suspense fallback={null}><AnalyticsTracker /></Suspense>
{children}
```

Then audit every other client component that calls `useSearchParams()`, which at the time of audit meant:
- `components/quote/quote-funnel.tsx`
- `components/quote/thank-you-client.tsx`
- `components/careers/apply-client.tsx`

Each must sit inside the **smallest possible** `<Suspense>` with a **meaningful fallback** (a skeleton of the form, not `null`), so the surrounding page H1/copy still SSRs.

**Add a regression test** at `tests/ssr/no-empty-html.spec.ts`. Against a production build, it fetches raw HTML (no JS) for:
- `/`, `/services`, `/services/landscaping`, `/service-areas/wichita`, `/service-areas/kansas-city/lawn-care`, `/quote`, `/about`, `/contact`, `/bundles`, `/our-work`

For each page it asserts:
- exactly one `<h1>`
- more than 500 chars of visible text in `<main>`
- no `localhost` anywhere in the HTML

---

## 4. Phase 3 — Lead flow (Findings 4, 5, 11, 12)

### 3.1 Turnstile token
Only the final submit spends the token.

In `app/api/lead/route.ts`:

```ts
const turnstileOk = lead.leadStatus === "partial" ? true : await verifyTurnstile(lead.turnstileToken, ip)
```

Partials are still rate-limited and honeypot-checked.

In `quote-funnel.tsx`, send `turnstileToken` only when `status === "complete"`. After a failed complete submit, call `window.turnstile.reset()` via `TurnstileField` so a retry gets a fresh token. Expose a `reset` handle from `TurnstileField` to do this.

If a site key is configured but the token is still `null` when the user presses Submit, show "Verifying you're human…" and wait for the token. Don't fire the request without it.

### 3.2 Address on deep links
If the funnel initializes on `estimate` (details step skipped), render the Service address field on the Contact step. Make it optional there, to avoid friction; that validated patch used `useRef(step === "estimate")`. The patch rendered it optional, but it must still be sent when filled.

### 3.3 No synthetic emails
Remove the `quote.<phone>@leads.cutrateslawn.com` fallback.

Send `email: ""` when blank, and confirm `lib/ghl.ts` `leadToGhlInput` / `upsertLeadContact` omits the email field entirely when empty. The GHL upsert accepts phone-only.

Also apply this in the server schema: a lead must have **phone or email**. Add a Zod refine; the current schema accepts a lead with neither.

### 3.4 Never show a thank-you for a lost lead
In `/api/lead`, when delivery fails:
- **If `leadStoreMode() === "redis"`:** keep the 202 `queued` behavior; the durable queue will retry.
- **If `leadStoreMode() === "memory"`:** do **not** return `ok:true`. Return 503 with `manualContactRequired:true`, and log `console.error("lead_delivery_failed_no_durable_queue", { requestId })`.

On the client, a 503 shows a prominent message with the phone number as a tap-to-call button, plus the reference ID.

### 3.5 Retry cron
Add to `vercel.json`:

```json
"crons": [{ "path": "/api/cron/lead-retry", "schedule": "*/15 * * * *" }]
```

Before merging, check the Vercel plan. On Hobby, sub-daily crons fail deployment; use `"0 13 * * *"` there and note the limitation. Confirm `/api/cron/lead-retry` authorizes Vercel's `Authorization: Bearer $CRON_SECRET` header.

### 3.6 One production E2E test lead
Run this once, after the deploy that contains the Phase 1–3 changes.

Submit through the real UI with Playwright on `https://cutrateslawn.com/quote/pest-control`, using:
- name `ZZTEST Launch Audit`
- phone: the owner's test mobile from `HUMAN_INPUTS.md`. If absent, skip this step and log it; never use a random real-looking number.
- notes: `AUTOMATED LAUNCH TEST — DELETE`

Assert all of the following:
- redirect to `/thank-you/pest-control?rid=<uuid>`
- `conversion_lead` appears in `window.dataLayer` exactly once
- the contact exists in GHL (search via API by phone)

Then **delete that contact via GHL API**. Record the requestId and the deletion confirmation in the report.

---

## 5. Phase 4 — Tracking correctness (Findings 1, 6, 7, 8, 10)

1. **CSP** in `next.config.mjs`. Use this validated set:
   - `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com https://connect.facebook.net https://challenges.cloudflare.com https://static.cloudflareinsights.com`
   - `img-src 'self' data: blob: https://storage.googleapis.com https://*.google-analytics.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://*.google.com https://www.facebook.com https://lh3.googleusercontent.com`
   - `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.facebook.com https://challenges.cloudflare.com https://cloudflareinsights.com https://storage.googleapis.com`
   - `frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com https://td.doubleclick.net https://www.google.com https://maps.google.com`
2. **`hooks/useAnalytics.ts`.** Wrap the returned object in `useMemo` over all the `useCallback`s so its identity is stable.
3. **`form_step_complete`** must fire when a step is *completed* (on advance), not when it's viewed. Move the call from the step-view effect into the step-advance handlers. `funnel_step_view` stays on view, once per step per session. Add a guard keyed by `funnel_id+step`.
4. **`ThankYouClient`.** Return early when `!rid || rid === "unknown"`. Keep the existing sessionStorage dedupe.
5. **Consent switch.** Add `NEXT_PUBLIC_CONSENT_MODE` with two values:
   - `opt_in` (current behavior: all denied until Accept)
   - `us_opt_out`: default `analytics_storage`/`ad_storage`/`ad_user_data`/`ad_personalization` = `granted`. The banner becomes a dismissible notice with a "Turn off ads & analytics cookies" option that writes denied.

   Apply the mode in all three places: the `gtm-init` inline script, `lib/analytics/consent.ts` `DEFAULT_CONSENT`, and `allowMarketingTags()`.

   **Default in code stays `opt_in`.** Set the Vercel value from `HUMAN_INPUTS.md` ("Consent mode: opt_in | us_opt_out"). Add a line to the report: without `us_opt_out`, most visitors will never produce measurable GA4/Ads data, which weakens the weekly report. The legal call belongs to the owner.
6. **Remove the duplicated `gtag('consent','default',…)`.** It is currently pushed both by `gtm-init` and by `initConsentDefaults()`; keep exactly one source of truth.
7. **GTM container.** The site pushes a clean dataLayer, but the container must turn it into GA4/Ads hits.
   - If Tag Manager API credentials are available (see `HUMAN_INPUTS.md`), configure the container directly.
   - Otherwise generate `docs/analytics/gtm-container-import.json`, a valid GTM container export the owner imports with Merge. It must contain:
     - **GA4 Configuration (Google tag):** measurement ID from the `{{Const - GA4 ID}}` variable.
     - **GA4 event tags,** each with DLV parameters (`service_id`, `area_slug`, `form_id`, `step_name`, `step_number`, `location`, `conversion_value`, `transaction_id`, `traffic_type`), for these custom events:
       - `service_view`, `area_view`
       - `funnel_step_view`, `form_start`, `form_step_complete`, `form_abandon`, `partial_form_fill`, `form_error`
       - `phone_click`, `conversion_lead`
     - **Google Ads Conversion** on `conversion_lead` (value + transaction_id), with an **Ads Conversion Linker** tag.
     - **Consent settings** on every tag: `analytics_storage` for GA4, `ad_storage` + `ad_user_data` for Ads.
8. **GA4 admin checklist,** written to `docs/analytics/GA4_SETUP.md`:
   - mark `conversion_lead` and `phone_click` as **key events**
   - register the custom dimensions above
   - set data retention to 14 months
   - link Google Ads and Search Console
   - exclude internal traffic by the owner's IP

---

## 6. Phase 5 — Security / hygiene (Finding 9)

1. Delete these routes:
   - `app/debug`, `app/api-test`, `app/api-simple-test`, `app/google-reviews-test`
   - `app/image-test`, `app/static-test`, `app/test-layout`, `app/test-page`
2. Also audit `app/api/google-reviews-debug`, `app/api/test`, `app/api/simple`, `app/api/html`, `app/api/mock-homepage`, and `app/api-debug`. These currently 404 in production; confirm why. If they are gated, leave them. If they only 404 because of a build quirk, delete them.
3. Grep for imports of anything you deleted, then build.
4. Add `tests/e2e/no-debug-routes.spec.ts`, which asserts every deleted path returns 404.

---

## 7. Phase 6 — SEO + content integrity (Findings 3, 13–18, 20)

1. **Canonicals.** After Phase 1, verify every indexable page has a canonical of `https://cutrateslawn.com<path>`. 38 pages currently have none, including `/`, `/services/*`, and `/service-areas/<city>`.
   - Add them via `metadata.alternates.canonical` built from `siteConfig.url`.
   - Pages with query-param variants (`/quote?service=…`) canonicalize to the clean path.
2. **Reviews.**
   - Replace the hard-coded `24` with the live count from the existing Places API (`/api/google-reviews` logic, ISR-cached ~24h). Use `32` as the fallback constant, dated in a comment.
   - Update `lib/marketing-content.ts` to read the same source.
   - JSON-LD `aggregateRating` must use the same number the page displays.
3. **JSON-LD `sameAs`.**
   - Remove the KWCH article URL; it can stay as an on-page "As seen on" link.
   - Keep the GBP URL.
   - Add business social profiles **only** if found in `lib/site-config.ts` or `HUMAN_INPUTS.md`.
4. **Blog.**
   - If Strapi is unreachable (`/api/health/strapi` non-200), `/blog` must not list posts that cannot render.
   - Either fall back to local MDX/JSON posts that fully render, or show a "Articles coming soon" state.
   - Exclude non-rendering post URLs from the sitemap.
   - Log Strapi's status in the report.
5. **Portal.**
   - `/schedule`: replace the `/portal` link with the real portal `https://cutrateslawn.pestportals.com` (opens in a new tab, `rel="noopener"`).
   - Make `/portal` itself redirect (307) to the same URL. It is already robots-disallowed.
6. **`/referral`.** Remove the `TODO(owner-approval)` text and the rewards section from public render.
   - Replace it with "Ask us about referral rewards — call (316) 925-5050."
   - Put the pending reward amounts behind `NEXT_PUBLIC_REFERRAL_REWARDS_APPROVED=true` (default unset).
7. **Unverified claims.** For `/certifications`, `/case-studies`, `/community`:
   - make each return `notFound()` unless `NEXT_PUBLIC_SHOW_UNVERIFIED_PAGES=true`;
   - remove them from nav, footer, and sitemap;
   - list each specific claim in `HUMAN_INPUTS.md` for the owner to confirm or strike.
   - **Do not rewrite them with new invented content.**
8. **Images (Findings 19, 20).** Work through the existing media pipeline:
   - `docs/media/SLOT_MAP.yaml`, `MEDIA_REGISTRY.yaml`, `lib/media.ts`, `npm run media:sync-site`.
   - **Hardscaping** must not share Landscaping's `sha-17ae8109f02b`. Assign a distinct registered asset if one exists in `MEDIA_REGISTRY.yaml`. Otherwise add a proposal row to `docs/media/ENVATO_PROPOSALS.md` and leave it for the owner; licensing is a human step and must not block the merge.
   - **Pest Control** should not use a `services-cleanup` asset. Same rule.
   - **Aeration** should show a core aerator or plugs, not water droplets. Same rule.
   - Fix all `alt` text to describe the actual image.
   - Add correct `sizes` to every `next/image` in card grids (e.g. `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`). No mobile request should ask for `w=3840`.
   - Verify with Playwright at 390px that no image request exceeds `w=1080`.
9. **Post-deploy SEO checks.**
   - `https://cutrateslawn.com/robots.txt` → `Sitemap: https://cutrateslawn.com/sitemap.xml`.
   - Sitemap `<loc>`s all start with `https://cutrateslawn.com`.
   - `lastmod` values are real content dates, not build time on every URL. Use per-page constants or git dates; if not feasible, omit `lastmod`.

---

## 8. Phase 7 — Search Console

If Cloudflare API access is available in this environment:
1. Add the DNS TXT verification record for a **Domain property** `cutrateslawn.com`.
2. Verify via the Search Console API.
3. Submit `https://cutrateslawn.com/sitemap.xml`.

Otherwise, write exact click-steps in `docs/analytics/SEARCH_CONSOLE_SETUP.md` and log a HUMAN INPUT. Touch no other DNS records.

---

## 9. Phase 8 — Weekly analytics report (Google Apps Script)

Replace the GitHub Actions report:
- delete `.github/workflows/analytics-weekly-report.yml` and `scripts/analytics/weekly-report.mjs`;
- keep `reportConfig` only if still referenced elsewhere; otherwise remove it.

Build in `apps-script/weekly-report/`, deployable with `clasp`:
- `appsscript.json`
- `Config.gs`, `Ga4.gs`, `SearchConsole.gs`, `Ghl.gs`, `Sheet.gs`, `Email.gs`, `Health.gs`, `Main.gs`
- `README.md` with clasp setup, required scopes, and a trigger install function

### 8.1 Architecture
1. **Standalone script** owned by the Workspace account that has GA4 access. It runs as that user, so no service account is needed.
2. **Manifest:**
   - Advanced Service **`AnalyticsData` v1beta** (GA4 Data API).
   - OAuth scopes: `analytics.readonly`, `webmasters.readonly`, `script.external_request`, `spreadsheets`, `gmail.send`, `script.scriptapp`.
   - `timeZone: "America/Chicago"`.
3. **Script Properties** (never hard-coded): `GA4_PROPERTY_ID`, `GSC_SITE_URL` (`sc-domain:cutrateslawn.com`), `GHL_TOKEN`, `GHL_LOCATION_ID`, `REPORT_TO`, `REPORT_CC`, `ALERT_TO`, `SHEET_ID`, `MONTHLY_FEE_USD=449`.
   - `REPORT_TO` = Chris and Jason; the email addresses come from `HUMAN_INPUTS.md`.
   - `ALERT_TO` = owner.
   - `SHEET_ID` is created on first run if blank.
4. **Trigger.** A time-driven trigger every **Monday 7:00 AM CT** covers the prior full week, **Mon 00:00 → Sun 23:59 CT**, compared against the week before it. `installTriggers()` must be idempotent.
5. **Data sources:**
   - GA4 via `AnalyticsData.Properties.runReport`
   - Search Console via `UrlFetchApp` to `https://searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query`, with `ScriptApp.getOAuthToken()`
   - GoHighLevel via `UrlFetchApp` to the LeadConnector API with the private integration token (contacts/opportunities created in range, filtered to the website source/tag the lead route applies)
6. **History.** Append one row per week to the Sheet tab `weekly_kpis`, with one column per KPI below, so every email shows week-over-week trends and a 4-week average.
7. **Idempotent weekly run.** If the row for that week already exists, update it in place and don't send a duplicate email unless `forceSend` is set.

### 8.2 KPIs (exact definitions go in `apps-script/weekly-report/KPI_DEFINITIONS.md`)

**A. Results** (the headline block)
1. **Website leads:** GHL contacts created from the site in the week.
   - This is the source of truth; GA4 `conversion_lead` is shown alongside as a cross-check.
   - Split completed vs. partial (abandoned-form capture).
2. **Phone clicks:** GA4 `phone_click`, split by `location`.
3. **Total contacts from the site** = website leads + phone clicks.
4. **Lead conversion rate** = completed leads ÷ sessions.
5. **Cost per website contact** = `MONTHLY_FEE_USD × 12 / 52` ÷ total contacts.
6. **Pipeline:** sum of `estimateAmount` on the week's leads, plus GHL opportunity value / won count when available.
7. **"Is the tracking paying for itself" line**, computed only from real data, e.g. "This week: 14 contacts at $6.64 each; $2,180 in estimates requested." If any input is missing, print "not yet measurable — <reason>", never zero.

**B. Traffic**
1. Users, new users, sessions, and engaged-session rate.
2. Sessions by default channel group: Organic Search, Paid Search, Direct, Referral, Organic Social, Unassigned. Also include Google Business Profile, defined as utm_source `gbp` if the GBP link is UTM-tagged; add that tagging to `HUMAN_INPUTS.md` as a recommendation.
3. Device split.
4. Top 10 landing pages, with sessions and leads for each.
5. Service interest: `service_view` counts by `service_id`.
6. Area interest: `area_view` by `area_slug` and leads by area. **Wichita vs. Kansas City** must be its own row, since KC expansion is a strategic goal.

**C. Quote funnel**
1. Funnel: `form_start` → each `form_step_complete` step → `conversion_lead`.
2. Step-to-step drop-off %, and the biggest leak called out in plain English.
3. `form_error` top fields.
4. `form_abandon` by last step.

**D. Search visibility** (Search Console)
1. Clicks, impressions, CTR, and average position vs. the prior week.
2. Top 10 queries.
3. A tracked-terms table: "lawn care wichita", "landscaping wichita", "pest control wichita", "aeration kansas city", "lawn care overland park", and "holiday lights wichita". Editable list in Config.

**E. Tracking health** (proves the monitoring itself is working)
1. GA4 events received this week vs. last; flag a >40% drop.
2. % of GHL website leads that carry attribution: gclid or utm, from the `lastTouch` fields the lead route writes into the message and custom fields.
3. GA4 `conversion_lead` count vs. GHL website-lead count. A mismatch over 20% is flagged "tracking gap".
4. A zero-lead week or a zero-GA4-events day triggers an **immediate alert email to `ALERT_TO`**, sent separately from the weekly report.

### 8.3 Email
1. **Format:** HTML via `GmailApp.sendEmail` with a plain-text fallback. Subject: `Cut Rates Website — Week of <Mon d> | <N> contacts (<±x%> WoW)`.
2. **Mobile-first layout:** a single 600px column with inline CSS, brand dark green `#0B3A1E` and cream `#FBFAF4`.
   - Four big-number tiles: Contacts, Leads, Phone Clicks, Cost/Contact, each with a WoW arrow.
   - Then sections A–E, with simple tables and CSS bar graphics. No external images; CSP isn't a concern in email, but Gmail strips a lot, so keep it inline.
3. **Closing items:** 3 auto-generated "What to act on this week" bullets derived from rules. Examples:
   - biggest funnel leak
   - a landing page with high sessions and 0 leads
   - a tracked term that dropped more than 3 positions
   - an attribution gap

   Also a link to the Google Sheet.
4. **Tone:** plain English for business owners. No GA jargon without a one-line explanation.
5. **Test mode:** a `sendTestReport()` function sends only to `ALERT_TO`.

### 8.4 Verification
1. Include `test_*.gs` functions that run each fetcher against the live property and log the row counts.
2. Run `clasp push`, then `sendTestReport()`, and attach the rendered HTML to the report as `docs/analytics/sample-weekly-report.html`.
3. If GA4 has no data yet (fresh property), the email must still render, showing "collecting — first full week ends <date>".

---

## 10. Phase 9 — Gates (all must pass before merging to `main`)

1. `pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck` (or `tsc --noEmit`) `&& pnpm build`
2. Unit tests, including the existing `lib/analytics/datalayer-contract.test.ts`, `traffic.test.ts`, and `lib/quote/taxonomy.test.ts`.
3. Playwright, including the new specs:
   - `tests/ssr/no-empty-html.spec.ts`
   - `tests/e2e/no-debug-routes.spec.ts`
   - the updated `tests/e2e/quote-funnel.spec.ts`. With a mocked `/api/lead` route, it asserts:
     - `funnel_step_view` fires exactly once per step
     - `form_step_complete` fires only on advance
     - `conversion_lead` fires once with the returned rid
     - no `conversion_lead` on `/thank-you/mowing` without `rid`
     - the partial lead has no turnstile token and the complete lead has one (when a site key is configured)
     - the deep-link flow shows the address field on the Contact step
4. **Preview-deployment crawl** of every sitemap URL at a 390px viewport. It must report:
   - 0 non-200 responses
   - 0 broken images
   - 0 CSP console errors
   - 0 `localhost` strings
   - `gtm_configured:true` in the dataLayer
   - at least one request to `googletagmanager.com/gtm.js`
   - canonical present on every indexable page
5. **Lighthouse (mobile)** on `/`, `/quote`, and `/service-areas/wichita`. SEO score must be ≥ 95. Report Performance; it doesn't block the merge, but record the before/after LCP.
6. **Post-merge production smoke** (same checks as 4, against `https://cutrateslawn.com`), then the single Phase 3.6 test lead.

If a gate fails, fix and re-run. Do not weaken or skip a test to get green; if a test itself is wrong, fix it and explain why in the report.

---

## 11. Deliverables

- `docs/launch/REMEDIATION_REPORT.md`. It contains:
  - every one of the 22 findings with its final state and evidence (command output, screenshots, requestIds)
  - the env var inventory (names only)
  - before/after metrics: pages with SSR H1 (0 → N), localhost refs (N → 0), CSP errors per page (1 → 0), events per funnel step (~5 → 1)
- `docs/launch/HUMAN_INPUTS.md`: a consolidated checklist of everything only the owner can do or decide:
  - GA4 measurement ID and property ID if not discoverable
  - Turnstile keys
  - Upstash Redis
  - GHL token if missing
  - owner test mobile number
  - consent-mode decision
  - Chris's and Jason's report email addresses
  - Tag Manager API access or GTM import
  - claims to confirm on the certifications/case-studies/community pages
  - referral reward amounts
  - Envato licensing for the proposed images
  - GBP link UTM tagging
- `docs/analytics/GA4_SETUP.md`, `docs/analytics/SEARCH_CONSOLE_SETUP.md`, `docs/analytics/gtm-container-import.json` (if not configured directly)
- `apps-script/weekly-report/**` with a README, plus `docs/analytics/sample-weekly-report.html`
- The merged PR, titled `fix: launch-day remediation + weekly analytics report`, with the report summary as the PR body.
