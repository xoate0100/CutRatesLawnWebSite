# Remediation Prompt — `/audit-all` follow-up

Use this prompt for a follow-up **`/audit-all --fix`** or targeted domain fixes.  
**Mode:** fix only when explicitly requested. Irreversible ops (Vercel env, GHL UI) require human approval per `NEEDS-ANDY/GATES.yaml`.

---

## Context

Cut Rates Lawn WebSite — Next.js 14 marketing site on Vercel. Discovery audit 2026-09-01 found **1 P0** and **14 P1** de-duplicated issues. Full register: `docs/audit/FINDINGS.md`. Domain detail under `docs/audit/<domain>/`.

**Do not** edit `5_reference_architectures/DECISION_REGISTRY.yaml` directly. Run `pnpm run verify` before marking done.

---

## Phase 0 — Immediate risk (P0)

1. **Gate or remove debug API routes in production**
   - Files: `app/api/google-reviews-debug/`, `app/api-debug/`, trim `app/api/health/route.ts`
   - Acceptance: Production build returns 404 on debug paths; health returns non-sensitive summary only
   - Regression: CI header/route smoke on preview deploy

---

## Phase 1 — Broken core (P1)

2. **GHL production wiring (human + code verify)**
   - Human: Add `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID` to Vercel (`GHL-OPS-001`)
   - Agent: Confirm `/api/lead` E2E creates tagged contact; document in `OUTSTANDING_TASKS.yaml`
   - Do not commit secrets

3. **Careers apply → `/api/lead`**
   - File: `components/careers/apply-form.tsx`
   - POST JSON with `source: "careers"`, job title, availability, language preference
   - Keep honest success/error UI; optional mailto as secondary CTA only
   - Extend `tests/e2e/careers-tools.spec.ts` for submit path (mock API or test env)

4. **Remove mock auth**
   - Files: `lib/auth.ts`, `app/login/`, `app/register/`, `app/account/`, `middleware.ts`
   - Redirect to FieldPortals / `siteConfig.customerPortalUrl`
   - Delete `user@example.com` credential branch

5. **Delete legacy `/api/contact`**
   - Remove route + `components/forms/contact-form.tsx` or rewire to `/api/lead`
   - Redact PII from `lib/api-helpers.ts` logging

6. **Security headers**
   - Add baseline headers in `next.config.mjs` (tune CSP for maps/chat when present)

7. **SEO foundations**
   - Add `app/sitemap.ts`, `app/robots.ts`
   - Wire LocalBusiness JSON-LD with `siteConfig` NAP

---

## Phase 2 — Platform alignment (P1)

8. **Vercel pnpm parity**
   - Update `vercel.json` to use pnpm; remove `npm install --legacy-peer-deps`
   - Verify preview deploy matches CI tree

9. **Next.js security upgrade (planned)**
   - Upgrade Next to patched line (≥15.5.16) with React compatibility check
   - Run `pnpm audit`, `pnpm run verify`, full Playwright suite

10. **Re-enable build quality gates**
    - Incrementally fix TS errors; set `ignoreBuildErrors: false` when clean
    - CI: `pnpm exec tsc --noEmit` + `pnpm run lint` as required checks

11. **Turnstile**
    - Set env vars; wire widget on `ContactFormBlock` and `QuoteFunnel`

12. **GHL workflows (human in GHL UI)**
    - GHL-WF-001 nurture on `website-lead` tag
    - GHL-WF-002 source branching; GHL-WF-003 custom fields

---

## Phase 3 — Product coherence (P2)

13. Careers in `responsive-ux-audit.mjs` + adversarial matrix  
14. Media: complete `ENVATO_PROPOSALS_CAREERS.md` license ingest (`CAREERS-MEDIA-001`)  
15. Replace mock search or remove `/search` from nav  
16. Wire or remove unused careers media slots (`careers.crew`, `careers.equipment`, `careers.yard`)  
17. Spanish careers copy stub or remove misleading ES toggle until verified  

---

## Phase 4 — Reliability (P2–P3)

18. Wrap `scripts/verify.mjs` build in `exec_guard` caps  
19. Add error tracking hook (optional Sentry) + `global-error.tsx`  
20. Refresh `6_ai_runtime_context/AI_CONTEXT.md` and README (pnpm, careers, GHL status)  

---

## Verification checklist

```bash
pnpm run verify
pnpm run media:validate
pnpm run test:e2e
# With server: pnpm run audit:links
pnpm audit --audit-level=high
```

Manual: submit quote + contact on preview → GHL contact visible; careers apply → CRM row; no debug routes on prod URL.

---

## Out of scope for autonomous fix

- Vercel secret values (human)
- GHL workflow UI configuration (human)
- FieldPortals penetration test (external)
- Next major upgrade without explicit approval if high regression risk
