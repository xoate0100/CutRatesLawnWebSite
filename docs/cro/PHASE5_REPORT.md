# Phase 5 — Close loop
**Date:** 2026-09-20

## Completed
- `lib/ghl.ts` extra tags, custom field env map, opportunity POST
- `lib/quote/routing.ts` commercial/urgent/out-of-area tags
- `scripts/ghl/ensure-custom-fields.ts` (needs PIT)
- `scripts/analytics/export-offline-conversions.ts` dry-run CSV from seed
- `docs/cro/GHL_WORKFLOWS.md` for GHL-WF-001/002/003

## Blocked / needs a human
- H-CRO-004 secrets, H-CRO-005 workflows, H-CRO-006 owners, H-CRO-012 field IDs, H-CRO-013 Ads action
- GHL-TEST-001 cannot pass without sandbox PIT

Opportunity create may 4xx without pipeline stage id — logged, contact still saved.
