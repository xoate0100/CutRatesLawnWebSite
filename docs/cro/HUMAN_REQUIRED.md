# CRO human-required log

**Rule:** Do not silently skip. Log the need, apply a documented default, keep building.

Updated: 2026-09-20

| ID | Needed from | What | Default used in code | Status |
|---|---|---|---|---|
| H-CRO-001 | Andy / legal | Consent banner copy and default (checkpoint 5) | Default **deny** ads + analytics storage; allow first-party `dataLayer`. Banner: Accept all / Essential only. Copy in `components/consent/consent-banner.tsx` | Code shipped; **human must review legal wording** |
| H-CRO-002 | Andy / Vercel | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | In-process Maps + loud `HUMAN SETUP` warning | **Unset → F-CRO-504 still true in prod** |
| H-CRO-003 | Andy / Vercel | Cron for `/api/cron/lead-retry` + `CRON_SECRET` | Route exists; no `vercel.json` cron added (deploy config is human-reviewed) | **Must add Vercel Cron in dashboard** |
| H-CRO-004 | Andy | GHL PIT + location on Vercel (`GHL-OPS-001`) | Code path ready; 503/queue if unset | **Pending — do not treat as live CRM** |
| H-CRO-005 | Andy / GHL UI | Workflows SMS/email (`GHL-WF-001/002/003`) | Spec in `docs/cro/GHL_WORKFLOWS.md`; MCP cannot finish without scopes | **Manual GHL build required** |
| H-CRO-006 | Andy / sales | Owner assignment (checkpoint 3) | Env `GHL_OWNER_SALES_ID`, `GHL_OWNER_DEFAULT_ID`; if unset, no owner on opportunity | **Pending IDs** |
| H-CRO-007 | Andy / ads | Which `/lp/*` first (checkpoint 1) | **All 11 `SERVICES` ids** get `/lp/[service]` (seasonal order is separate) | Confirm spend priority anytime |
| H-CRO-008 | Andy / reps | Landscaping budget bands (checkpoint 2) | Under $2k / $2–5k / $5–15k / $15k+ / Not sure; timelines ASAP / this month / this season / planning | **Reps should confirm** |
| H-CRO-009 | Andy / ops | Area × service combinations (checkpoint 6) | All 7 areas × all 11 services | **Remove any combo you cannot deliver** |
| H-CRO-010 | Andy / Google Cloud | Places autocomplete key `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Free-text address fallback | Optional upgrade |
| H-CRO-011 | Andy | Parcel/lot-size provider | Slider remains confirmation; no fake parcel lookup | Optional later |
| H-CRO-012 | Andy / GHL | Run `npx tsx scripts/ghl/ensure-custom-fields.ts` against sandbox then prod | Script prints field IDs for `.env` | **Needs PIT** |
| H-CRO-013 | Andy | Google Ads offline conversion action name + `GOOGLE_ADS_CUSTOMER_ID` | Export script dry-run only | After GHL wins exist |
| H-CRO-014 | Andy | `/pricing` reconciliation (checkpoint 4) | **Implemented:** estimator “starting at” from `lib/pricing/estimate.ts`, not $99/$199 static plans | Confirm copy with CFO |
| H-CRO-015 | Andy | Photo upload for landscaping quotes | Honest: “Text photos after we reply” — no fake uploader | Media pipeline already human-licensed |
| H-CRO-016 | Andy | `NEXT_PUBLIC_GTM_CONTAINER_ID` on Vercel | GTM script no-op if unset; first-party `dataLayer` still fills | Confirm container + Consent Mode tags |
| H-CRO-017 | Andy | Merge to `main` | Phase branches only; `human_review_required_for_merge: true` | **Do not merge without Andy** |
