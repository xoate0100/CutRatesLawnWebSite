# Security Remediation Prompt

**Source audit:** `/audit-security-nist` discovery (2026-09-01)  
**Mode for execution:** `/audit-security-nist --fix` (after human approval for prod env changes)

Use this prompt in a follow-up agent session. Do not edit `5_reference_architectures/DECISION_REGISTRY.yaml` directly.

---

## Context

Next.js marketing site with `/api/lead` (GHL + webhook + Resend), mock client auth, and several ungated debug/admin routes. Security gate: **1 P0, 5 P1** open.

## Phase 0 — Immediate risk (P0)

1. **Remove or production-gate diagnostic endpoints (F-001)**
   - Delete or wrap: `app/api/google-reviews-debug/route.ts`, `app/api-debug/route.ts`
   - Sanitize `app/api/health/route.ts` — return `{ ok: true }` only in production; move detailed diagnostics behind dev flag
   - Pattern: match `app/dev/components/page.tsx` (`notFound()` when `NODE_ENV === 'production'`)

2. **Verify no secrets in responses** — grep deploy preview for `placeId`, `apiKeyFirstFive`, `tokenValid`

## Phase 1 — Broken auth & PII handling (P1)

3. **Retire mock auth (F-002, F-003)**
   - Redirect `/login`, `/register`, `/account` to `siteConfig.customerPortalUrl`
   - Remove or stub `lib/auth.ts` mock branches; remove `AuthProvider` if unused
   - Update `middleware.ts` to match portal-only strategy OR delete account/login matchers
   - Document in `docs/integrations/` that customer auth is FieldPortals-only

4. **Delete `/api/contact` stub (F-004)**
   - Remove `app/api/contact/route.ts`
   - Delete or rewire `components/forms/contact-form.tsx` → `/api/lead`
   - Grep for `/api/contact` references

5. **Add global security headers (F-005)**
   - In `next.config.mjs`, add `async headers()` returning:
     - `X-Content-Type-Options: nosniff`
     - `Referrer-Policy: strict-origin-when-cross-origin`
     - `X-Frame-Options: DENY` (or `frame-ancestors` in CSP)
     - `Permissions-Policy` baseline
     - CSP tuned for current scripts (start report-only if needed)
   - Validate on Vercel preview with curl

6. **Turnstile production path (F-006)**
   - Add Turnstile widget to `ContactFormBlock` and `QuoteFunnel` when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set
   - In `/api/lead`, fail closed in production when `TURNSTILE_SECRET_KEY` missing
   - Document keys in `.env.example` (already present)

## Phase 2 — Hardening (P2)

7. **Edge rate limiting (F-007, F-012)** — Vercel firewall rules or shared Redis limiter for `/api/lead` and `/api/newsletter`

8. **Strip stack from API errors (F-008)** — `app/api/google-reviews/route.ts` catch block

9. **Gate admin/debug pages (F-009, F-010)** — production `notFound()` for `/admin/*`, `/debug`, test API routes

## Phase 3 — SDLC (P3)

10. **Re-enable build gates incrementally (F-011)** — track in separate debt task; do not block Phase 0–1

## Verification

```bash
npm run verify
```

Add tests:
- Prod route inventory: debug paths return 404
- Header smoke on preview URL
- Lead form POST without Turnstile fails in prod config test

## Out of scope (route to other audits)

- FieldPortals authorization → manual vendor test + `docs/audit/FIELDPORTALS_AUTHZ_NOTE.md`
- GHL workflow activation → `docs/integrations/GOHIGHLEVEL.md`, `NEEDS-ANDY` H-GHL-* tasks
- Dependency CVEs → `/audit-dependencies`
- Vercel env secrets → human via Vercel dashboard (do not commit)

## Constraints

- Discovery mode already complete — this prompt is for `--fix` only
- No CI/CD or `.env` production changes without human review per workspace rules
- Stay within `feature_flags.yml` write paths
