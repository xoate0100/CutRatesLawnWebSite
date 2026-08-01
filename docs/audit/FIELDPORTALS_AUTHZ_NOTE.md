# FieldPortals authorization validation (F-018)

**Status:** Manual / vendor task — not faked in this repo.

## Confirmed in-app

- `/portal` and Customer Portal CTAs redirect/link to `NEXT_PUBLIC_CUSTOMER_PORTAL_URL` (FieldPortals landing).
- Local `/dashboard` redirects to the same portal (no mock account chrome).

## Required before claiming authz production-ready

1. Two distinct customer test accounts in FieldPortals.
2. Negative tests: customer A cannot see B’s invoices/properties.
3. Session expiry / logout / password recovery exercised once each.
4. Document results under `docs/audit/evidence/` with date and tester.

Until then, treat FieldPortals isolation as **unvalidated**.
