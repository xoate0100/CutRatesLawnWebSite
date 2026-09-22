# Launch-day human inputs

Owner-only decisions and secrets. Agents must not invent these values.

| ID | Item | Status | Notes |
|----|------|--------|-------|
| H-1 | Consent mode | **Decided** | Owner chose `us_opt_out` (2026-09-22). Set `NEXT_PUBLIC_CONSENT_MODE=us_opt_out` on Vercel. |
| H-2 | Turnstile site + secret keys | **Needed** | Neither key on Vercel today (safe pair). Create Cloudflare Turnstile widget for `cutrateslawn.com` and set both, or leave both unset. |
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

**Absent:** `NEXT_PUBLIC_GA4_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_*`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_*`, `CONTACT_FORM_WEBHOOK_URL`, `RESEND_API_KEY`, `LEAD_NOTIFY_EMAIL`, `NEXT_PUBLIC_CONSENT_MODE` (to be set)
