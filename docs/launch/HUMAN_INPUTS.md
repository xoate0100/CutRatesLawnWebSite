# Launch-day human inputs

Owner-only decisions and secrets. Agents must not invent these values.

| ID | Item | Status | Notes |
|----|------|--------|-------|
| H-1 | Consent mode | **Decided** | Owner chose `us_opt_out` (2026-09-22). Set `NEXT_PUBLIC_CONSENT_MODE=us_opt_out` on Vercel. |
| H-2 | Turnstile site + secret keys | **Done (agent)** | Cloudflare widget created; `NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFAajSF3xINA13bR` + `TURNSTILE_SECRET_KEY` set on Vercel Production+Preview. **Redeploy required** so the public site key bakes into the client bundle. Secret never committed. |
| H-3 | Upstash Redis REST URL + token | **Needed** | Absent. Without Redis, failed leads must not thank-you (503 + call CTA). |
| H-4 | Owner test mobile for Phase 3.6 | **Needed** | Required to submit the single labeled production test lead. |
| H-5 | GA4 measurement ID / property ID | Optional | Live GTM already loads `G-5X2990G1ZP`. Confirm property ID for Apps Script weekly report. |
| H-6 | Google Ads conversion ID/label | Optional | Live GTM loads `AW-16564037616`. Confirm conversion label for offline/import docs. |
| H-7 | Chris + Jason report emails (`REPORT_TO`) | **Needed** | Weekly Apps Script report recipients. |
| H-8 | `ALERT_TO` email | **Needed** | Tracking-health alerts. |
| H-9 | Tag Manager API or import | Optional | Prefer owner import of `docs/analytics/gtm-container-import.json` if API unavailable. |
| H-10 | Certifications claims (NALP/ISA/ELA) | **Confirm or strike** | Pages gated behind `NEXT_PUBLIC_SHOW_UNVERIFIED_PAGES`. |
| H-11 | Case-studies / community content | **Confirm or strike** | Same gate. |
| H-12 | Referral reward amounts | Pending | Shown only if `NEXT_PUBLIC_REFERRAL_REWARDS_APPROVED=true`. |
| H-13 | Envato licenses for hardscape/aeration/pest imagery | Pending | See `docs/media/ENVATO_PROPOSALS.md`. |
| H-14 | GBP link UTM tagging | Recommendation | Use `utm_source=gbp` on Google Business Profile website link. |
| H-15 | Search Console domain verify TXT | Optional | Agent can add CF TXT if API access; else follow `docs/analytics/SEARCH_CONSOLE_SETUP.md`. |

## Env inventory (Production names only, 2026-09-22)

**Present:** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GTM_CONTAINER_ID`, `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID`, `GHL_CF_SERVICE_ID`, `GHL_CF_MESSAGE_ID`, `CRON_SECRET`, `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`, `STRAPI_API_URL`, `STRAPI_API_TOKEN`, `NEXT_PUBLIC_STRAPI_API_URL`, `ENABLE_DEBUG`, `VERCEL`, `NEXT_VERSION`

**Present (added this remediation):** `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (redeploy so site key is in client bundle), `NEXT_PUBLIC_CONSENT_MODE=us_opt_out` (confirm on Vercel if not yet).

**Absent:** `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_*`, `NEXT_PUBLIC_META_PIXEL_ID`, `UPSTASH_REDIS_REST_*`, `CONTACT_FORM_WEBHOOK_URL`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`

## Weekly report wiring (2026-10-09)

Agents cannot invent tokens or click GTM/GA4 UIs. Complete these in order so the **2026-10-12 07:00 America/Chicago** email is truthful.

### Script properties (Apps Script project)

| Key | Who | Notes |
|-----|-----|--------|
| `GA4_PROPERTY_ID` | Andy | Numeric id for property behind `G-5X2990G1ZP` |
| `GSC_SITE_URL` | Andy | Exact GSC property string |
| `REPORT_RECIPIENT` | Andy | Chris + Jason (comma-separated). **Required** — missing value fails the run |
| `ALERT_TO` | Andy | Andy's email |
| `GHL_LOCATION_ID` / `GHL_PRIVATE_TOKEN` | Andy | Contacts Read PIT. Alias `GHL_PRIVATE_INTEGRATION_TOKEN` also accepted. **2026-10-09:** the PIT currently in `.env.local` returns `401 Invalid Private Integration token` on all LeadConnector endpoints — regenerate in GHL and update Script Properties + `.env.local` + Vercel. |
| `MONTHLY_FEE_USD` | Andy | `449` |

### Run in Apps Script (after `clasp push`)

`clasp push -f` already succeeded (2026-10-09) including `Wiring.gs`.  
`clasp run runAllWiring` failed with storage `NOT_FOUND` — the script is **not** linked for API executable runs. Run functions from the Apps Script editor UI instead:

1. Enable GCP APIs listed in `apps-script/weekly-report/SETUP.md`.
2. In the editor, run **`runAllWiring`** — creates GA4 dimensions + GTM event forwarder; publishes workspace `weekly-report-wiring`.
3. Run **`debugGhl`** — confirm counts only (no PII in logs).
4. Run **`testSendToMe`** — Andy receives a dry email; read Health.
5. Run **`createWeeklyTrigger`** — Mondays 7am Chicago; failure notifications **immediately**.
6. Share `weekly_kpis` Sheet with Chris and Jason (view).

### If Advanced Services / APIs are blocked

Manual GTM (`GTM-KGVZJ93G`) click-path (same as `ensureGtmEventForwarding`):

1. Workspace named `weekly-report-wiring`.
2. Data Layer Variables (v2): `DLV - <key>` for `service_id`, `service_name`, `area_slug`, `area_name`, `form_id`, `click_location`, `lead_source`, `funnel_id`, `step_name`, `step_number`, `transaction_id`, `conversion_value`, `currency`, `traffic_type`, `utm_source`, `utm_medium`, `utm_campaign`, `gclid`.
3. Custom Event trigger `CE - CRL site events` regex: `^(phone_click|conversion_lead|newsletter_signup|form_start|form_step_complete|form_abandon|partial_form_fill|form_error|funnel_step_view|service_view|area_view)$` (exclude `page_view`).
4. GA4 Event tag `GA4 Event - CRL site events` → `G-5X2990G1ZP`, event name `{{Event}}`, map all DLVs, consent require `analytics_storage`.
5. Publish version; note prior live version for rollback.
6. GA4 Admin → Custom definitions (event-scoped): `service_id`, `area_slug`, `form_id`, `click_location`, `lead_source`, `funnel_id`, `step_name`. Mark `conversion_lead` and `phone_click` as key events.

Until wiring runs, the report Health section must say GA4 lead/phone/funnel numbers will be **0**. Do not fake numbers.
