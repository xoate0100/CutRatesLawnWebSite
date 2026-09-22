# Phase 3 — Service-aware form engine
**Date:** 2026-09-20

## Completed
- Taxonomy 8 categories / 36 services (`lib/quote/taxonomy.ts`) aligned to GHL labels
- Per-service field schema; consult payloads omit lawn defaults
- Two-stage picker; honest stepper; address first; name+mobile required
- Partial lead POST (`leadStatus: partial`) once name+phone exist
- Urgency + heard-about chips; E.164 normalize; inline errors

## Deviations
- Places autocomplete skipped (H-CRO-010); free-text address
- No parcel lookup (H-CRO-011)
- Landscaping photos: honest text, no fake uploader (H-CRO-015)
- Budget bands defaulted (H-CRO-008)

## Findings resolved
- F-CRO-301–309, 302 pollution, 411 lastName placeholder (server uses “Lead” not “—”)
