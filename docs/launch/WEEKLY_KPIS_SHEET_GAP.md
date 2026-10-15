# weekly_kpis sheet — gap analysis (2026-10-15)

## Verdict

**Functional, but previously too thin for longitudinal tracking.** Upsert by `week_key` works; WoW email deltas read the sheet. Many KPIs computed for the Monday email were **not persisted**, so the Sheet looked “sparse” (blank `leads_contact`, empty phones during tracking-dark weeks, always-null `estimate_sum`).

## System-of-record boundary (Chris / FieldRoutes)

| Domain | System of record | Website sheet role |
|--------|------------------|-------------------|
| Sales lead **source** / disposition | **FieldRoutes** (sales team) | Do **not** duplicate attribution columns |
| Website demand (sessions, forms, phones, SEO) | GA4 / GSC / this sheet | Persist week grains for trends |
| Website-originating CRM count | GHL `website-lead` (filtered) | `contacts` after excluding careers/newsletter |

## Why it looked sparse

| Symptom | Cause |
|---------|--------|
| Empty phone / quote columns | `tracking_dark` or missing GA4 custom dims → blank, not fake 0 |
| `leads_contact` always empty | Never written (reserved); contact disposition lives in FieldRoutes |
| `estimate_sum` empty | No GHL contact custom field for estimates (`lib/ghl.ts` uses opportunity monetaryValue) |
| Few rows | Sheet only grows when `runWeeklyReport` / `testSendToMe` / `dryRun` runs |
| Header-only feel | Old schema stopped at 20 cols; email had richer metrics |

## Gaps → fixes (shipped in Sheet.gs / Report.gs)

| Gap | Fix |
|-----|-----|
| Missing engagement / SEO quality | Added `engaged_*`, `new_users`, `gsc_ctr`, `gsc_position` |
| Missing funnel quality | Added `quote_complete_rate` |
| Careers/newsletter inflating history | Persist `applicants_excluded`, `newsletter_ghl_excluded` |
| No won outcome trail | Persist `won_jobs`, `won_value` when GHL returns them |
| Device / geo demand | Persist mobile/desktop sessions + in-area users |
| Silent bad weeks | Persist `tracking_dark` + short `health_flags` |
| Fragile WoW indexes | `Sheet.COL` / `Sheet.cell()` instead of magic `[2]` / `[10]` |
| Unsorted history | `lastN` sorts by `week_key` |
| Header migrate | Pads old rows when columns expand |

## How to use the sheet longitudinally

1. One row per Monday `week_key` — re-runs **upsert**, do not append duplicates.
2. Chart `contacts`, `sessions`, `quote_complete_rate`, `gsc_clicks` over `week_key`.
3. Filter or flag weeks where `tracking_dark = 1` (numbers unreliable for custom events).
4. Compare website `contacts` to FieldRoutes website-sourced jobs — do not expect source-channel parity in this sheet.
5. After deploy: `clasp push -f`, run `testSendToMe` once to backfill the expanded columns for the current week.

## Still out of scope (intentional)

- Paid Ads spend columns beyond optional `cost_per_contact` (Ads not wired)
- Multi-channel sales attribution (FieldRoutes)
- Per-service / per-city matrix tabs (email already lists; add later if Chris wants pivots)
