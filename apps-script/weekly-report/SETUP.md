# Apps Script weekly report — setup (pwsh)

Source: `apps-script/weekly-report/`. First real send: **Monday 2026-10-12, 7:00 AM America/Chicago** to Chris and Jason.

Offline gate (no Google APIs):

```powershell
pnpm run report:test
```

## Deploy with clasp

```powershell
npm i -g @google/clasp
clasp login --status   # if not logged in: clasp login
cd apps-script/weekly-report
# If .clasp.json exists, reuse that script. Otherwise:
clasp create --title "Cut Rates Weekly Website Report" --type standalone --rootDir .
clasp push -f
```

`.claspignore` excludes `test/**` and `*.md`. Never commit `.clasp.json`.

## Andy's one-time list

1. In Apps Script, open **Project Settings**, link a **standard GCP project**, and enable:
   - Google Analytics Data API
   - Google Analytics Admin API
   - Search Console API
   - Tag Manager API
2. Confirm **Services** shows: `AnalyticsData`, `AnalyticsAdmin`, `TagManager` (from `appsscript.json`).
3. **Script properties:**

| Key | Value |
|-----|--------|
| `GA4_PROPERTY_ID` | Numeric GA4 property id |
| `GSC_SITE_URL` | Exactly as in Search Console (`sc-domain:cutrateslawn.com` or `https://cutrateslawn.com/`) |
| `REPORT_RECIPIENT` | Chris and Jason emails, comma-separated (required — no fallback) |
| `ALERT_TO` | Andy's email for FAILED alerts |
| `GHL_LOCATION_ID` | GHL location id |
| `GHL_PRIVATE_TOKEN` | Private Integration token (Contacts Read) |
| `MONTHLY_FEE_USD` | `449` |

4. Run `runAllWiring` and approve OAuth. Confirm the log shows GTM version published and custom dimensions created (or `already_present`).
5. Run `debugGhl` (counts only), then `testSendToMe`, and read the Health section.
6. Run `createWeeklyTrigger`. In Triggers, set failure notifications to **immediately**.
7. Share the `weekly_kpis` Sheet with Chris and Jason as viewers.

If Advanced Services or APIs are blocked by org policy, follow the UI click-path in `docs/launch/HUMAN_INPUTS.md` (Weekly report wiring) and keep the report running with Health notes.

## Rollback GTM

After `runAllWiring`, Script Property `GTM_ROLLBACK_VERSION` holds the prior live version id. Run `rollbackGtm()` to re-publish it.

## Local verification before merge

```powershell
pnpm run report:test
pnpm run lint
pnpm exec tsc --noEmit
pnpm run test:analytics
pnpm run build
```

Live GA4 collect proof (after GTM publish): Playwright `tests/e2e/analytics-wiring.spec.ts` against production or a preview with the same container. Do **not** submit real quote/contact/newsletter leads in production — intercept API routes.

## Security

- Never commit `GHL_PRIVATE_TOKEN` or `.clasp.json`.
- Prefer Script Properties over hardcoding.
