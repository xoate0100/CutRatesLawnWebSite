# analytics.tracking

Page-level marketing analytics: GTM dataLayer events with UTM + GCLID attribution, forwarded to
env-gated GA4, Google Ads conversion, and Meta Pixel destinations.

## Mined from (Wave B.5)

| Source | Path | Exhibited behavior |
|---|---|---|
| CRL GTM utilities | `CRL_Lights_Landing/lib/gtm.ts` | `getUtmParams`, `getGclid`, sessionStorage capture, `gtmEvent` dataLayer push |
| CRL analytics core | `CRL_Lights_Landing/lib/analytics/core.ts` | `pushEvent` enrichment: timestamp, page context, UTM merge, session_id |
| CRL hooks | `CRL_Lights_Landing/hooks/useAnalytics.ts` | page_view, form/funnel, phone, conversion patterns |
| CRL standards | `CRL_Lights_Landing/docs/Analytics_Standards.md` | Event schema, required base fields, UTM auto-include, conversion params |
| gads methodology | `gads_documentation` | GA4 via GTM, Ads conversion + gclid pass-through, Meta Pixel via GTM tags |

## Operation (floor)

1. **Capture attribution** — on first page load, read `utm_*` and `gclid` from URL; persist in sessionStorage for later events.
2. **Emit event** — validate required fields; enrich with page context + stored attribution; push to `dataLayer`.
3. **Forward destinations** — when env-configured platform IDs are set, GTM tags route to GA4 / Google Ads / Meta; when unset, no-op silently (no console spam).

## Required events (floor)

| Event | Required fields | Attribution |
|---|---|---|
| `page_view` | `page_path`, `page_title` | UTM/gclid merged when present |
| `service_view` | `page_path`, `service_id`, `service_name` | UTM/gclid merged when present |
| `area_view` | `page_path`, `area_slug`, `area_name` | UTM/gclid merged when present |
| `funnel_step_view` | `page_path`, `funnel_id`, `step_name`, `step_number` | UTM/gclid merged when present |
| `phone_click` | `page_path`, `click_location` | UTM/gclid merged when present |
| `conversion_lead` | `page_path`, `transaction_id`, `conversion_value`, `currency` | **MUST** include `utm_source` or `gclid` (stored or inline) |

## Inputs (conformance floor)

| Field | Required | Notes |
|---|---|---|
| `event` | yes | Event payload with `event` name + required fields per taxonomy |
| `stored_attribution` | no | Session-persisted `utm_*` + `gclid` from first touch |
| `url_attribution` | no | Fresh URL params (simulates landing query string) |
| `destinations` | no | `{ ga4?, google_ads?, meta_pixel? }` — null/empty → no-op for that destination |

## Outputs (floor)

On `pass`:

- `datalayer_push` — enriched event object pushed (includes merged attribution when available)
- `attribution_captured` — boolean; true when utm_source or gclid present on conversion events
- `destinations_notified` — list of destination keys actually notified (env-gated; empty when IDs unset)

## Hard rejects

| Condition | `error_code` |
|---|---|
| Missing `event.event` or `event.page_path` | `EVENT_SCHEMA_INVALID` |
| `conversion_lead` missing `transaction_id` | `CONVERSION_ID_REQUIRED` |
| `conversion_lead` missing `conversion_value` | `CONVERSION_VALUE_REQUIRED` |
| Conversion without utm_source **and** without gclid | `ATTRIBUTION_REQUIRED` |

## Consumer overrides (agent_manifest)

Projects MAY override: event name prefix (e.g. `CutRates_*`), which funnel steps fire, destination env var names, weekly report recipient.
Projects MUST NOT drop attribution capture on conversion events or hardcode platform account IDs.
