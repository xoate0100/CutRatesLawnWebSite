# CURSOR PROMPT: Wire the Cut Rates Weekly Report End to End

**Repo:** `xoate0100/CutRatesLawnWebSite` (local: `C:\Users\Andy\source\repos\CutRatesLawnWebSite`, pwsh, no Unicode in console output)
**Target:** cutrateslawn.com GA4 `G-5X2990G1ZP`, GTM `GTM-KGVZJ93G`
**Goal:** The first real send is **Monday 2026-10-12, 7:00 AM America/Chicago**. It goes to Chris and Jason and covers 2026-10-05 to 2026-10-11, and every number in it must be true.
**Mode:** Work autonomously and self-heal on failures. If something needs a value or a click that only Andy can provide, add it to `docs/launch/HUMAN_INPUTS.md` under a dated `## Weekly report wiring` section, leave that piece safely off (never fake a number), and keep going.
**Branch:** `fix/weekly-report-wiring` -> PR -> merge to `main` only when every gate in Phase 7 is green.

---

## 0. What validation found (2026-10-09). Read this first.

The Apps Script code in `apps-script/weekly-report/` was validated offline. It passes a syntax check, the manifest parses, and an 8-check mock run (`test/mock-run.js`) passes. **The code is no longer the main problem. The data feeding it is.** A live Playwright session on cutrateslawn.com showed:

| # | Severity | Finding | Evidence |
|---|---|---|---|
| W1 | CRITICAL | **GTM forwards no custom events to GA4.** `phone_click`, `conversion_lead`, `form_start`, and `funnel_step_view` all reach `window.dataLayer`, but the only GA4 hits are the Google tag's own `page_view` and `user_engagement`. The report's leads, phone clicks, and quote funnel numbers will all read **0**. | Network: `collect en=page_view tid=G-5X2990G1ZP` and `en=user_engagement` only. dataLayer: `phone_click` x2 after a tel: click, with no matching collect hit. |
| W2 | HIGH | **`conversion_lead` fires from three sources:** quote thank-you (`components/quote/thank-you-client.tsx`), contact form (`components/blocks/contact-form-block.tsx:80`), and **newsletter signup** (`components/newsletter-signup.tsx:51`). Newsletter signups would be reported to Chris as leads. Also, `EVT_QUOTE_COMPLETE` = `conversion_lead`, so "quote completes" equals all leads. | Code. |
| W3 | HIGH | **`form_start` is shared** by `quote`, `contact`, and `newsletter` (it carries a `form_id` parameter). "Quote starts" are inflated. | Code. |
| W4 | HIGH | **GA4 custom dimensions are not registered** (`service_id`, `form_id`, `click_location`, `lead_source`). Leads by service and every per-form split are unavailable. The report already degrades gracefully and adds a Health note. | Report code path. |
| W5 | MEDIUM | **The GHL lead count is unreliable.** `Ghl.gs` calls `/contacts/search` with no date filter, no pagination, and `pageLimit: 100`, then filters by date on the client. Once there are more than 100 tagged contacts, past weeks undercount. Contacts with no date are counted in every week. The filter syntax has not been checked against the API. The site does apply the tags correctly (`lib/ghl.ts:73-77`: `website-lead`, `lead-status:partial` / `lead-status:complete`). | Code. |
| W6 | MEDIUM | **Search Console uses `dataState: 'final'`.** Final data lags 2 to 3 days, so on a Monday morning Fri through Sun are missing. Average position is an unweighted mean of daily positions. | `SearchConsole.gs`. |
| W7 | MEDIUM | `page_view` is pushed to dataLayer **twice** per page load (React effect double-fire). If any GA4 event tag ever matches `page_view`, page views double. | Live dataLayer. |
| W8 | MEDIUM | `gtmEvent()` in `lib/analytics/gtm.ts` pushes params as one dataLayer object and `{event}` 50 ms later as another. GTM's merged data model keeps old keys, so `service_id` / `area_slug` from one event leak into later events that don't set them. | Code. |
| W9 | LOW | Re-running `runWeeklyReport` for the same week sends a duplicate email. A missing `REPORT_RECIPIENT` silently falls back to `info@cutrateslawn.com`. Top landing pages are pulled unordered and then sliced at 50 before the sort. | Mock run. |
| W10 | LOW | The report doesn't justify the $449 fee. "Cost / contact" only shows if Ads spend is wired. The planned "is the tracking paying for itself" line was never built. | `Report.gs`. |
| W11 | INFO | The local working tree has fixes (manifest `script.send_mail`, event names, fail-soft, failure alert, `testSendToMe`) that are **not on `origin/main`**, which is still at `5a395be`. | `git diff`. |

---

## Phase 1: Commit what exists and add the offline gate

1. Create the branch from the current working tree so the uncommitted fixes from W11 are kept.
2. `apps-script/weekly-report/test/mock-run.js` is already in the working tree. It loads every `.gs` file into a Node `vm` with stubbed `AnalyticsData`, `UrlFetchApp`, `MailApp`, `SpreadsheetApp`, `ScriptApp`, `PropertiesService`, `Session`, and `Utilities`, then asserts behavior. It currently passes 8/8. Commit it.
3. Add `"report:test": "node apps-script/weekly-report/test/mock-run.js"` to `package.json` and a step that runs it in `.github/workflows/ci.yml`.
4. Every change in Phases 3 to 5 must come with new assertions in `mock-run.js`. Required new cases are listed in each phase.

## Phase 2: Fix the site's event emission (W2, W7, W8)

1. **Newsletter is not a lead.** In `components/newsletter-signup.tsx`, replace `trackConversionLead(...)` with a new `trackNewsletterSignup()`.
   - Add the event `newsletter_signup` to `lib/analytics/types.ts` (interface plus union).
   - Add it to `core.ts` and `hooks/useAnalytics.ts`.
   - It must **not** be in `CONVERSION_EVENTS` / `MARKETING_EVENTS`.
2. **Every lead carries a source.** Add a required `lead_source: "quote" | "contact"` to `ConversionLeadEvent` and `trackConversionLead` params.
   - Quote thank-you passes `"quote"`.
   - The contact form passes `"contact"`.
   - Update `datalayer-contract.test.ts` and the vendored capability conformance (`lib/analytics/conformance-provider.mjs`) so the new field is in the contract. Run the capability-drift workflow locally if possible.
3. **One push per event.** In `gtmEvent()`, push a single object `{ event: eventName, ...payload }`. Remove the second `setTimeout` push.
   - Before each push, reset the volatile keys to `undefined`: `service_id`, `service_name`, `area_slug`, `area_name`, `form_id`, `field_name`, `step_name`, `step_number`, `click_location`, `lead_source`, `transaction_id`, `conversion_value`, `error_type`, `last_step`, `last_field`. Use one `dl.push({...resets})` immediately before the event push, so GTM's data model can't leak values between events.
   - Keep the `waitForGTM` behavior.
   - Add a unit test proving a `phone_click` pushed after a `conversion_lead` has `service_id === undefined` in the merged model.
4. **No duplicate `page_view`.** Find the double push (likely a `useEffect` in the analytics provider running twice, or both a route-change listener and an initial-load call). Guard it with a ref keyed on `pathname + search`. Add a Playwright assertion that one navigation produces exactly one dataLayer `page_view`.
5. Run `npm run lint`, `npm run typecheck` (or `tsc --noEmit`), `npm test`, and `npm run build`. All must pass.

## Phase 3: GA4 and GTM wiring, automated from Apps Script (W1, W4)

Cursor cannot click through the GTM or GA4 UIs. Apps Script, however, runs as Andy's Google account, which already owns both. So add the wiring as **idempotent Apps Script functions** that Andy runs once, alongside the report.

### 3a. `Wiring.gs` (new file)

**Manifest:** add the Advanced Services `TagManager` v2 and `AnalyticsAdmin` v1beta, plus these scopes:
- `https://www.googleapis.com/auth/tagmanager.edit.containers`
- `https://www.googleapis.com/auth/tagmanager.edit.containerversions`
- `https://www.googleapis.com/auth/tagmanager.publish`
- `https://www.googleapis.com/auth/analytics.edit`

**`ensureGa4CustomDimensions()`** uses `AnalyticsAdmin.Properties.CustomDimensions`.
- List the existing dimensions, then create only the missing EVENT-scoped ones: `service_id`, `area_slug`, `form_id`, `click_location`, `lead_source`, `funnel_id`, `step_name`.
- Log `created`, `already_present` for each.
- Never delete or archive anything.

**`ensureGa4KeyEvents()`** marks `conversion_lead` and `phone_click` as key events through the Admin API's `keyEvents` resource. If the property only exposes `conversionEvents`, use that and log which API was used.

**`ensureGtmEventForwarding()`** works in `GTM-KGVZJ93G`, found by listing `accounts` -> `containers` and matching `publicId`.
1. Create (or reuse) a workspace named `weekly-report-wiring`.
2. Ensure **Data Layer Variables** (v2) exist for: `service_id`, `service_name`, `area_slug`, `area_name`, `form_id`, `click_location`, `lead_source`, `funnel_id`, `step_name`, `step_number`, `transaction_id`, `conversion_value`, `currency`, `traffic_type`, `utm_source`, `utm_medium`, `utm_campaign`, `gclid`. Name them `DLV - <key>`.
3. Ensure one **Custom Event trigger** named `CE - CRL site events`, using regex `^(phone_click|conversion_lead|newsletter_signup|form_start|form_step_complete|form_abandon|partial_form_fill|form_error|funnel_step_view|service_view|area_view)$`.
   - Deliberately exclude `page_view`, because the Google tag already sends it (W7).
4. Ensure one **GA4 Event tag** (`gaawe`) named `GA4 Event - CRL site events`:
   - measurement ID `G-5X2990G1ZP`
   - event name `{{Event}}`
   - event parameters mapped from every DLV above (parameter name = key)
   - `currency` and `value` set from `{{DLV - currency}}` / `{{DLV - conversion_value}}`
   - firing on the trigger above
   - **Consent:** set the tag's consent settings to require `analytics_storage`, matching the Consent Mode posture already in `GtmScript`. Do not weaken consent.
5. If an equivalent tag already exists, compare the parameters and update in place. Never create duplicates. Make the function idempotent: running it twice must result in zero changes.
6. **Publish:**
   - Before publishing, record the current live version id in Script Property `GTM_ROLLBACK_VERSION`.
   - Create a version named `weekly-report-wiring <yyyy-MM-dd HH:mm>` and publish it.
   - Add a `rollbackGtm()` function that re-publishes `GTM_ROLLBACK_VERSION`.
7. Log the container version URL.

**`runAllWiring()`** calls the three functions above in order and prints one summary line per item.

**New `mock-run.js` cases:**
- Stub `TagManager` and `AnalyticsAdmin`.
- Assert that a second `runAllWiring()` produces no create or update calls.
- Assert that the trigger regex excludes `page_view`.
- Assert that the publish path writes `GTM_ROLLBACK_VERSION` before publishing.

### 3b. Fallback

If either Advanced Service can't be enabled (an org policy or API-not-enabled error), do not block. Write the exact UI click-path for the same tag, trigger, variables, and dimensions into `HUMAN_INPUTS.md`, and keep the report running with Health notes.

## Phase 4: Report accuracy (W2 to W6, W9)

In `Report.gs` / `Ga4.gs`:

1. **Leads from the website:**
   - `conversion_lead`, split by `customEvent:lead_source`, into quote and contact counts.
   - Phone clicks: `phone_click`, split by `customEvent:click_location`.
   - Newsletter signups: their own line, labeled "not a lead."
2. **Quote funnel:** `form_start` filtered to `customEvent:form_id == quote`, then `funnel_step_view` by `step_name`, then `conversion_lead` with `lead_source == quote`. Show step-to-step drop-off.
3. **Fallback when dimensions are missing:** every query that uses a custom dimension falls back to the unsplit total, with a Health note naming the missing dimension and saying "run ensureGa4CustomDimensions()". Data only starts collecting after registration, so for the 2026-10-12 report a missing split is expected. Say so plainly and don't show zero.
4. **Landing pages:** add `orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]` and `limit` to the runReport body, and drop the client-side sort-after-slice.
5. **Search Console:**
   - `dataState: 'all'`.
   - Weight average position by impressions: `sum(position*impressions)/sum(impressions)`.
   - Read `GSC_SITE_URL` exactly as stored (`sc-domain:cutrateslawn.com` vs `https://cutrateslawn.com/`). On a 403/404, add a Health note quoting the response code.
6. **GoHighLevel:** rewrite `Ghl.websiteLeads` against the **current official LeadConnector "Search Contacts" docs**. Read them before coding and cite the doc URL in a code comment.
   - Use server-side filters for tag `website-lead` **and** a `dateAdded` range for the window.
   - Paginate until it's exhausted (`searchAfter` / page, per the docs).
   - Skip contacts with no date.
   - Return `{complete, partial, estimateSum, contacts}`. `estimateSum` is the sum of the estimate custom field that `lib/ghl.ts` writes; find its key there, and if there is none, return `null`, not 0.
   - Test it live with the real token through a function `debugGhl()` that logs counts only, never PII.
7. **Sending:**
   - `REPORT_RECIPIENT` is **required**. If it's missing, throw, which triggers the FAILED alert. Remove the `info@` fallback.
   - Idempotent send: store `LAST_SENT_WEEK` in Script Properties. `runWeeklyReport()` skips if the week was already sent. `forceResend()` overrides.
8. **The $449 value block** goes at the top of the email, computed only from real data:
   - "This week: N website contacts (Q quote, C contact, P phone taps). Tracking cost per contact: $X.XX." Here `X = MONTHLY_FEE_USD*12/52 / contacts`.
   - If GHL `estimateSum` is available: "$Y in estimates requested."
   - If contacts = 0 or any input is missing: "Not yet measurable: <reason>". Never print $0.00 or divide by zero.
   - Add week-over-week deltas and a 4-week average from the `weekly_kpis` Sheet (add `lastN()` back to `Sheet.gs`).
   - Add Sheet columns for each new KPI. If the header row is old, migrate it.
9. **Email polish:** inline-styled HTML table layout (Gmail strips `<style>`), with the value block first and Health last. The subject is `Cut Rates website: N contacts, week of <Mon date>`.

**New `mock-run.js` cases:**
- Newsletter is excluded from leads.
- Quote starts are filtered by `form_id`.
- A 250-contact paginated GHL mock counts correctly across pages.
- An undated GHL contact is skipped.
- The second run in the same week sends no email.
- A missing `REPORT_RECIPIENT` sends the FAILED alert.
- Zero contacts prints "Not yet measurable".
- GSC body has `dataState: 'all'`.
- Landing request has `orderBys`.

## Phase 5: Docs

- Rewrite `SETUP.md` for the final flow. The steps are in Phase 6. Use pwsh syntax.
- Update `KPI_DEFINITIONS.md` with the exact source and filter for every number in the email.
- Add `.clasp.json` to `.gitignore`.

## Phase 6: Deploy (run locally in pwsh; Andy is signed in)

```
npm i -g @google/clasp
clasp login --status   # if not logged in: clasp login
cd apps-script/weekly-report
# If .clasp.json exists, reuse that script. Otherwise:
clasp create --title "Cut Rates Weekly Website Report" --type standalone --rootDir .
clasp push -f
```

- Exclude `test/` from the push: add a `.claspignore` with `test/**` and `*.md`.
- After the push, Cursor should try `clasp run` for the steps below. If `clasp run` isn't set up (it needs the script linked to a standard GCP project with the Apps Script API enabled and an API-executable deployment), write the exact list for Andy into `HUMAN_INPUTS.md` and stop there. **Never invent IDs or tokens.**

**Andy's one-time list** (also goes verbatim into `SETUP.md`):
1. In Apps Script, open **Project Settings**, link a standard GCP project, and enable these APIs: Google Analytics Data API, Google Analytics Admin API, Search Console API, Tag Manager API.
2. Script properties:
   - `GA4_PROPERTY_ID` (numeric)
   - `GSC_SITE_URL` (exactly as in GSC)
   - `REPORT_RECIPIENT` = `<chris>,<jason>`
   - `ALERT_TO` = Andy
   - `GHL_LOCATION_ID`
   - `GHL_PRIVATE_TOKEN` (Contacts Read)
   - `MONTHLY_FEE_USD` = `449`
3. Run `runAllWiring` and approve OAuth. Confirm the log shows the GTM version published and the dimensions created.
4. Run `debugGhl`, then `testSendToMe`, and read the Health section.
5. Run `createWeeklyTrigger`. In Triggers, set failure notifications to **immediately**.
6. Share the `weekly_kpis` Sheet with Chris and Jason as viewers.

## Phase 7: Gates (all must be green before merge)

1. `npm run report:test` passes, with all new cases.
2. Lint, typecheck, unit tests, and `npm run build` pass.
3. **Live wiring proof.** Add `e2e/analytics-wiring.spec.ts` and run it against production **after** the GTM publish, or against a Vercel preview with the same container. Read the hits from network requests to `**/g/collect*` (both the query string and the batched POST body, which carries one hit per line).
   - Homepage load: exactly one `en=page_view`.
   - Clicking a `tel:` link (prevent navigation) gives `en=phone_click` with `ep.click_location`.
   - Newsletter (preview only, or production with the submit request intercepted and fulfilled by Playwright `route`): gives `en=newsletter_signup` and **no** `en=conversion_lead`.
   - `/quote` step 1 interaction gives `en=form_start` with `ep.form_id=quote`.
   - **Do not submit a real quote, contact, or newsletter lead in production**, because it would land in GHL. Intercept the API route with Playwright `route.fulfill`, and cover `conversion_lead` with `lead_source` in the unit and contract tests.
   - If the GTM publish is still pending human action, mark this gate **BLOCKED (human)**, not failed. The PR may merge with the site fixes, but the final report must say plainly that the GA4 lead numbers will be 0 until the wiring runs.
4. The capability-drift workflow is green, or the drift is explained in the PR with the conformance fixture updated.

## Phase 8: Final report

Write `docs/launch/WEEKLY_REPORT_WIRING_REPORT.md` covering:
- W1 to W11, each with a status of fixed, blocked-human, or n/a
- test output
- live gate results with the captured `en=` list
- GTM version id and rollback id
- what Andy still has to click, in order
- what the 2026-10-12 email will and won't contain

The 10-12 email covers 10-05 to 10-11. Custom dimensions and GTM forwarding only collect from when they're published, so state which splits will be partial in that first email.

Commit messages end with:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```
