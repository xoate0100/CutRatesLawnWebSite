# Integrations Audit — Remediation Prompt

Use this prompt for a follow-up `/audit-integrations --fix` session or human implementation sprint.

---

## Context

Cut Rates Lawn Next.js site integrates with **Go High Level** for leads, **FieldPortals** for customer accounts, and **Vercel** for hosting. Code paths in `lib/ghl.ts` and `/api/lead` are ready; **production GHL env and GHL workflows are not**. No GA4. Legacy Strapi and `/api/contact` stubs remain.

## Phase 1 — Unblock production leads (P1)

1. **Vercel env (GHL-OPS-001):** On project `v0-cut-rates-lawn-main-page`, set:
   - `GHL_PRIVATE_INTEGRATION_TOKEN`
   - `GHL_LOCATION_ID`
   - Optional: `GHL_CF_SERVICE_ID`, `GHL_CF_MESSAGE_ID`, `GHL_CF_REQUEST_ID`
2. **Smoke test (GHL-TEST-001):** Submit contact + quote on preview and production; confirm contact in GHL with tags `website-lead`, `source:*`, `service:*`.
3. **GHL workflows (GHL-WF-001):** Create automation: Contact Tag Added → `website-lead` → opportunity in New Leads / Fresh Lead + staff notify + TCPA-safe thank-you.
4. **Branching (GHL-WF-002/003):** Separate paths for `source:newsletter` vs `source:quote` vs `source:contact`; map service tags to opportunity naming/custom fields.

## Phase 2 — Hardening (P2)

5. Remove or dev-gate `app/api/google-reviews-debug/route.ts`.
6. Confirm all forms POST to `/api/lead` or `/api/newsletter`; delete `app/api/contact` stub or proxy to lead route.
7. Document FieldPortals authz test plan (`docs/audit/FIELDPORTALS_AUTHZ_NOTE.md`) and execute with vendor test accounts.
8. Decide Strapi fate: remove dead CMS clients or document as inactive; slim `/api/health` diagnostics.
9. Evaluate Vercel KV for lead `idempotencyKey` storage (replace in-memory `Map`).

## Phase 3 — Optional product (P3)

10. Wire GA4 behind consent when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
11. Enable Turnstile in production (`TURNSTILE_SECRET_KEY` + client widget).
12. Add webhook HMAC if using `CONTACT_FORM_WEBHOOK_URL`.

## Constraints

- Never commit PIT tokens or put GHL secrets in `NEXT_PUBLIC_*`.
- Do not change CI/CD deployment or `.env` on Vercel without human review (workspace rule).
- Run `npm run verify` before marking complete.

## Acceptance

- [ ] Production `/api/lead` returns 200 with GHL-only config (no webhook required)
- [ ] GHL workflow fires within SLA on test lead
- [ ] No public debug routes exposing API key metadata
- [ ] FieldPortals isolation documented (pass/fail with evidence)
- [ ] OUTSTANDING_TASKS.yaml GHL items updated to completed
