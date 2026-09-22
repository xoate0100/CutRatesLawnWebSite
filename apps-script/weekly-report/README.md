# Weekly website report (Google Apps Script)

Replaces the old GitHub Actions / `scripts/analytics/weekly-report.mjs` flow.

## Status
Scaffold in progress on branch `fix/launch-day-remediation`. Full clasp project files land in this folder:
- `appsscript.json`, `Config.gs`, `Ga4.gs`, `SearchConsole.gs`, `Ghl.gs`, `Sheet.gs`, `Email.gs`, `Health.gs`, `Main.gs`
- `KPI_DEFINITIONS.md`

## Owner setup (after files land)
1. `clasp create --title "Cut Rates Weekly Report" --type standalone`
2. `clasp push`
3. Enable Advanced Service **AnalyticsData**
4. Script Properties: see `docs/launch/HUMAN_INPUTS.md` (H-5, H-7, H-8) plus GHL token/location
5. Run `installTriggers()` once
6. Run `sendTestReport()` → deliverability check to `ALERT_TO`

Timezone: `America/Chicago`. Trigger: Monday 7:00 AM CT.
