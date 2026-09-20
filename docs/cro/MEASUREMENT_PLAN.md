# Measurement plan

Pre-Phase-1 GA4 conversion counts are **not comparable** to post-Phase-1: they omitted organic/GBP/direct.

| KPI | Event / field | Segment |
|---|---|---|
| Quote start | `form_start` form_id=quote | service, traffic_type, device |
| Step completion | `form_step_complete` / `funnel_step_view` | service, device |
| Lead conversion | `conversion_lead` on `/thank-you` | traffic_type, service, area, gclid present |
| Partial capture | `partial_form_fill` + CRM `lead-status:partial` | service, step |
| Qualified | `qualifiedArea` on `/api/lead` | area, service |
| Lead→customer | GHL opportunity won (needs H-CRO-005) | service, channel |
| Revenue per lead | opportunity monetaryValue | campaign |

GA4: register custom dims `traffic_type`, `service_id`, `experiment_variant`. Ads: conversion action on `/thank-you` URL + later offline import (`scripts/analytics/export-offline-conversions.ts`).
