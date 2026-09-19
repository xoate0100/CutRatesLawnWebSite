# Completeness Remediation Prompt

**Source audit:** `/audit-completeness` discovery (2026-09-01)  
**Mode for execution:** `/audit-completeness --fix`

---

## Context

Primary conversion paths (contact, quote, newsletter) are wired to `/api/lead` and `/api/newsletter` with GHL integration in `lib/ghl.ts`. Remaining gaps are mock auth/search, legacy contact stubs, ops env, and cleanup.

## Phase 0 — Ops blockers (human + agent)

1. **Complete GHL production wiring (F-003)** — human tasks H-GHL-01 through H-GHL-06 in `docs/atmosphere/HUMAN_TASKS.md`
   - Vercel: `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, optional `GHL_CF_*`
   - GHL UI: workflow on tag `website-lead`
   - Agent: add deploy check script asserting `isGhlConfigured()` in production

## Phase 1 — Broken / contradictory core (P1)

2. **Unify customer account story (F-001, F-007)**
   - Redirect `/login`, `/register`, `/account` → `siteConfig.customerPortalUrl`
   - Remove `lib/auth.ts` mock flows and `AuthProvider` if no longer needed
   - Simplify `middleware.ts` to remove cookie fiction

3. **Implement real search (F-002)**
   - Option A: Strapi REST search with `filters[$or]` on title/description
   - Option B: Build-time JSON index from CMS
   - Delete mock array in `lib/search.ts`
   - Wire `?type=` filter query params on search page

4. **Delete legacy contact stack (F-004, F-012)**
   - Remove `app/api/contact/route.ts`
   - Delete `components/forms/contact-form.tsx`, `components/contact-form.tsx`
   - Consolidate `submitContactForm` helpers (F-008) into one `lib/lead-client.ts` calling `/api/lead`

## Phase 2 — Missing connections (P2)

5. **Turnstile UI (F-005)** — shared widget component used by ContactFormBlock + QuoteFunnel

6. **API route cleanup (F-006)** — delete test/mock routes; keep single `app/api/google-reviews/route.ts`

7. **Privacy policy (F-009)** — replace shell after attorney review (human content)

8. **CMS mock guard (F-010)** — production fails without `STRAPI_API_TOKEN`; mock only in development

## Phase 3 — Product coherence (P3)

9. **Referral copy (F-011)** — owner confirms rewards or removes specific amounts

10. **Dev page gating (F-013)** — extract `requireDevelopment()` used by all test routes

## Verification

```bash
npm run verify
```

Add:
- E2E: contact + quote submit (mock GHL or test webhook sink)
- Search returns CMS-backed result for known slug
- Grep CI: no `mock-jwt-token`, no `/api/contact`, no `Phase 3 preparation` in lib/search

## Do not

- Rewrite working `ContactFormBlock` / `QuoteFunnel` / `schedule` handoff UX
- Change GHL tag names without updating `docs/integrations/GOHIGHLEVEL.md`
- Commit secrets or modify Vercel prod env autonomously

## Related audits

- Security F-001–F-006 overlap — coordinate with `/audit-security-nist --fix`
- Integrations detail → `/audit-integrations`
- Journey dead links → `/audit-journey`
