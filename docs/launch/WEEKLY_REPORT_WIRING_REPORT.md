# Weekly report wiring — final report (2026-10-09)

**Branch:** `fix/weekly-report-wiring`  
**First email target:** Monday 2026-10-12, 7:00 AM America/Chicago (week 2026-10-05 → 2026-10-11)  
**GTM:** `GTM-KGVZJ93G` · **GA4:** `G-5X2990G1ZP`

## W1–W11 status

| ID | Status | Notes |
|----|--------|-------|
| W1 | **blocked-human** | Site now emits clean events; GTM still must forward via `runAllWiring` (or UI path in HUMAN_INPUTS). Until published, GA4 lead/phone/funnel counts stay **0**. |
| W2 | **fixed** | Newsletter uses `newsletter_signup`; not in CONVERSION/MARKETING sets. |
| W3 | **fixed** | Report filters `form_start` with `form_id=quote`. |
| W4 | **blocked-human** | `ensureGa4CustomDimensions()` ready; Andy must run `runAllWiring` once. |
| W5 | **fixed** | GHL Search Contacts with tag + dateAdded filters, pagination, skip undated. |
| W6 | **fixed** | GSC `dataState: 'all'`; impression-weighted position. |
| W7 | **fixed** | Module + provider dedupe for `page_view`; GTM trigger excludes `page_view`. |
| W8 | **fixed** | Single `gtmEvent` push + volatile key reset. |
| W9 | **fixed** | `LAST_SENT_WEEK` idempotent send; `REPORT_RECIPIENT` required (FAILED alert). |
| W10 | **fixed** | Value block with $449 tracking cost/contact; "Not yet measurable" when zero. |
| W11 | **fixed** | Committed on this branch; clasp pushed 10 `.gs` files + Wiring. |

## Test output

```
pnpm run report:test  → 20 checks passed
pnpm exec tsc --noEmit → clean
pnpm run lint → 0 errors
pnpm run test:analytics → PASS (traffic, contract, gtm-event, taxonomy)
```

## Live gate (`en=` collect)

**BLOCKED (human):** `runAllWiring` / GTM publish not executed via `clasp run` (API executable deployment not configured). Do not treat as failed.

DataLayer unit/e2e coverage present:

- `tests/e2e/analytics-wiring.spec.ts` — one `page_view` per navigation; `conversion_lead` + `lead_source=quote`
- `lib/analytics/gtm-event.test.ts` — no param leak after `phone_click`

After Andy publishes GTM, re-run Playwright against production (or preview with same container) and capture `**/g/collect*` `en=` values. Do **not** submit real leads.

## GTM version / rollback

- Clasp push completed to script `1xmMe9U-DEsqCr04XjWBwgA8bG3bHXYf7JTaTh3j3SbCCBla2j1Dljq9Q` (includes `Wiring.gs`).
- Live version id / `GTM_ROLLBACK_VERSION`: **not set until `runAllWiring` succeeds**. After that run, read Script Properties and record here.

## What Andy still has to click (order)

1. Apps Script → Project Settings → link standard GCP project; enable Analytics Data, Analytics Admin, Search Console, Tag Manager APIs.
2. Set Script Properties (`GA4_PROPERTY_ID`, `GSC_SITE_URL`, `REPORT_RECIPIENT`, `ALERT_TO`, GHL token/location, `MONTHLY_FEE_USD=449`).
3. Run **`runAllWiring`** → approve OAuth → confirm dimensions + GTM publish in logs.
4. Run **`debugGhl`**, then **`testSendToMe`** → read Health.
5. Run **`createWeeklyTrigger`**; Triggers → failure notifications **immediately**.
6. Share `weekly_kpis` Sheet with Chris and Jason (view).

Details: `apps-script/weekly-report/SETUP.md` and `docs/launch/HUMAN_INPUTS.md` § Weekly report wiring.

## What the 2026-10-12 email will / won't contain

**Will contain (if properties + trigger set):** week label Mon–Sun, sessions/users, GSC with `dataState=all` (Fri–Sun present as non-final), GHL website-lead counts if token works, Health notes, subject `Cut Rates website: N contacts, week of …`.

**Will be partial or zero until wiring mid-week publish:**

- GA4 `conversion_lead` / `phone_click` / filtered funnel — **0** until GTM event tag is live; then only collect from publish time forward.
- Splits by `lead_source`, `form_id`, `click_location`, `step_name`, `service_id` — Health notes + unsplit totals until custom dimensions exist **and** enough post-registration traffic accumulates.
- Value block: "Not yet measurable" if contacts = 0 (expected if GA4/GHL both empty for the week).
- Newsletter line appears only after `newsletter_signup` is forwarded (post-publish).

Never invent numbers; Health must say so plainly.
