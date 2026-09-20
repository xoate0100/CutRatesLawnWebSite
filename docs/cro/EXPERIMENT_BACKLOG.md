# Experiment backlog

Traffic is a local lawn company. Most tests will **not** reach classical significance quickly. Prefer sequential + qualitative for low-volume services (termite, lights).

| # | Hypothesis | Metric | Feasible? |
|---|---|---|---|
| 1 | Deep-link estimate (already shipped) lifts quote start vs blank `/quote` | form_start / sessions | Yes if ads send `service` |
| 2 | Sticky call vs quote-only | phone_click + conversion_lead | Mobile-only; run 4+ weeks |
| 3 | Name+mobile vs email required | conversion_lead | Shipped email-optional; don’t A/B reverse without 200 leads |
| 4 | `/lp/snow-removal` vs `/services/snow-removal` for paid snow | cost per lead | Seasonal window only |
| 5 | Budget band on landscaping | qualified rate | Qualitative first |

Harness: `experiment_variant` = hash(session_id) control|variant on every event. No third-party tester.
