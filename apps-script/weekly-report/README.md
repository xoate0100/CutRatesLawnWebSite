# Cut Rates — weekly website report (Apps Script)

Monday email + Sheet history for GA4, Search Console, and GHL website leads.

## Files

| File | Role |
|------|------|
| `appsscript.json` | Manifest, OAuth scopes, Analytics Data advanced service |
| `Config.gs` | Script Properties + defaults |
| `Ga4.gs` | GA4 Data API helpers |
| `SearchConsole.gs` | GSC searchAnalytics via UrlFetch |
| `Ghl.gs` | LeadConnector contact search (website-lead) |
| `Sheet.gs` | `weekly_kpis` upsert |
| `Ads.gs` | Optional spend stub (omits until wired) |
| `Report.gs` | Assemble + HTML email |
| `Main.gs` | `runWeeklyReport`, `dryRunWeeklyReport`, `createWeeklyTrigger` |
| `SETUP.md` | **Human install steps (start here)** |

## Quick start

See **[SETUP.md](./SETUP.md)** for clasp login, Script Properties, API enablement, and the Monday trigger.

```bash
cd apps-script/weekly-report
clasp create --title "Cut Rates Weekly Website Report" --type standalone --rootDir .
clasp push
clasp open
```

Then run `dryRunWeeklyReport` → `createWeeklyTrigger` → `runWeeklyReport`.
