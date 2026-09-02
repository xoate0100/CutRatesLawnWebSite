# analytics.tracking on CutRatesLawnWebSite

| Field | Value |
|---|---|
| Capability | `analytics.tracking@v1.0.0` |
| Lock | `CAPABILITIES.lock` |
| Vendor | `vendor/capabilities/analytics.tracking/` |
| Provider | `lib/analytics/` |
| Conformance | `pnpm analytics:conformance` |
| Weekly report | `pnpm analytics:weekly-report` (Mondays via GitHub Action) |

## Env vars (all optional — unset = no-op)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GTM_CONTAINER_ID` | GTM container |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | GA4 via GTM |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` | Ads conversion |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Ads conversion label |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta via GTM |
| `GA4_PROPERTY_ID` | Weekly report property |
| `GA4_DATA_API_CREDENTIALS_JSON` | Service account JSON for Data API |

See `docs/factory/ANALYTICS_TRACKING_REPORT.md` in project_initializer for human setup steps.
