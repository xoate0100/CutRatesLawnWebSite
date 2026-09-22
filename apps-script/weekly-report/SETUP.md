# Apps Script weekly report — human setup

Source files live in `apps-script/weekly-report/`. Deploy once with [clasp](https://github.com/google/clasp) or paste into a new Apps Script project.

## What you get

- Monday 7:00 AM America/Chicago email to `REPORT_RECIPIENT`
- KPI row appended/updated in a Google Sheet (`weekly_kpis`)
- Pulls: GA4 (Analytics Data API), Search Console, optional GHL contacts tagged `website-lead`
- Does **not** invent Ads spend until Ads is wired

## One-time setup (clasp — preferred)

1. Install: `npm i -g @google/clasp` and `clasp login`.
2. Create a standalone script:
   ```bash
   cd apps-script/weekly-report
   clasp create --title "Cut Rates Weekly Website Report" --type standalone --rootDir .
   clasp push
   ```
3. Open the script: `clasp open` → **Project Settings** → note the Script ID.
4. **Services** (left sidebar → Services → Add):
   - Google Analytics Data API (`AnalyticsData`) — already declared in `appsscript.json`; confirm it shows as enabled.
5. **Script properties** (Project Settings → Script properties). Add:

| Key | Value |
|-----|--------|
| `GA4_PROPERTY_ID` | Numeric GA4 property id (Admin → Property settings) |
| `GSC_SITE_URL` | `https://cutrateslawn.com/` (must match Search Console property exactly) |
| `REPORT_RECIPIENT` | Owner email (e.g. your inbox) |
| `GHL_LOCATION_ID` | GHL location / sub-account id |
| `GHL_PRIVATE_TOKEN` | GHL Private Integration token with **Contacts → Read** |
| `TRACKED_QUERIES` | Optional comma list; defaults cover Wichita/Derby terms |

6. **OAuth / APIs** (first run will prompt):
   - Run `setupProperties` once (optional seed).
   - Run `dryRunWeeklyReport` — approve Analytics, Search Console, Sheets, Gmail, external request.
   - In [Google Cloud Console](https://console.cloud.google.com/) for this Apps Script’s GCP project, enable:
     - **Google Analytics Data API**
     - **Google Search Console API**
7. **Search Console access**: the Google account that owns the script must be a full user on the `https://cutrateslawn.com/` GSC property.
8. **GA4 access**: same account needs Viewer (or higher) on the GA4 property.
9. Create trigger: run `createWeeklyTrigger` once (Mondays 7am Chicago). Or: Triggers → Add → `runWeeklyReport` → Week timer → Monday 7–8am.
10. Confirm: run `runWeeklyReport` once; check email + Sheet URL in the log.

## Paste-only setup (no clasp)

1. [script.google.com](https://script.google.com) → New project → rename **Cut Rates Weekly Website Report**.
2. Delete `Code.gs`. Create files with the same names/contents as this folder:
   - `appsscript.json` (View → Show manifest file), then `Config.gs`, `Ga4.gs`, `SearchConsole.gs`, `Ghl.gs`, `Sheet.gs`, `Ads.gs`, `Report.gs`, `Main.gs`
3. Continue from step 4 in the clasp section above.

## Smoke test checklist

- [ ] `dryRunWeeklyReport` logs HTML with non-error GA4 sessions (or a clear Health note)
- [ ] Sheet `weekly_kpis` exists and has a row for last week
- [ ] Email arrives with subject `Cut Rates weekly report — …`
- [ ] Health mentions Ads only as “not connected” (expected)
- [ ] If GHL token missing: Health says so; contacts fall back to GA4 `conversion_lead`

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Missing Script Property: GA4_PROPERTY_ID` | Set property; no `properties/` prefix |
| GSC zero forever | Site URL must include trailing slash if that’s how the property was added; account must own property |
| GHL 401 | Rotate Private Integration token; scopes Contacts Read |
| Trigger wrong day | Project timezone must be `America/Chicago` (`appsscript.json`) |

## Security

- Never commit `GHL_PRIVATE_TOKEN` or clasp `.clasp.json` with tokens into git if it contains secrets.
- Prefer Script Properties over hardcoding in `Main.gs`.
