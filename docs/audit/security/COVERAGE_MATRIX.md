# Security Coverage Matrix

**Audit:** `/audit-security-nist` (discovery)  
**Date:** 2026-09-01  
**Standards mapping:** NIST CSF 2.0 (Protect/Detect), SP 800-53 families noted per row

| Check area | CSF / 800-53 | Method | Result | Notes |
|------------|--------------|--------|--------|-------|
| IA — authentication enforcement | PR.AC, IA-2 | examine | **FAIL** | Mock auth in `lib/auth.ts`; demo credentials; no server session |
| IA — MFA / AAL | IA-2(1) | examine | N/A | No real identity system |
| Session — cookie flags | SC-23 | examine | **FAIL** | Middleware expects `auth_token` cookie; app sets `localStorage` only |
| Session — fixation / rotation | SC-23 | examine | N/A | No real sessions |
| Authorization — route protection | AC-3 | examine | **PARTIAL** | Middleware on `/account` ineffective; `/admin/*` open |
| Authorization — API per-endpoint | AC-3 | examine | **FAIL** | All API routes public; debug routes expose config |
| Authorization — IDOR | AC-3 | test | N/A | No per-user object APIs |
| API input validation | SI-10 | examine | **PASS** | `/api/lead`, `/api/newsletter` use Zod |
| API rate limiting | SC-5 | examine | **PARTIAL** | `/api/lead` in-memory only; `/api/newsletter` none |
| Spam / bot protection | SI-4 | examine | **FAIL** | Turnstile optional + UI not sending token |
| Injection (SQL/NoSQL/cmd) | SI-10 | examine | N/A | No DB queries in app |
| XSS — stored/reflected | SI-15 | examine | **PASS** (static review) | React default escaping; no user HTML render paths found |
| File upload | SC-18 | examine | N/A | No upload surface |
| TLS / HSTS | SC-8, SC-23 | examine | **SUSPECTED** | Delegated to Vercel; no `Strict-Transport-Security` in app config |
| Crypto — secrets in client | SC-28 | examine | **PASS** | GHL/Resend/Strapi tokens server-only |
| Secrets — repo / bundle scan | SI-7 | examine | **PASS** | `.env.example` placeholders only; no committed secrets found |
| Secrets — debug leakage | SI-11 | examine | **FAIL** | `/api-debug`, `/api/google-reviews-debug`, `/api/health` |
| Security headers (CSP, X-CTO, frame) | SC-7 | examine | **FAIL** | No global headers; SVG-only CSP |
| Error handling — info disclosure | SI-11 | examine | **PARTIAL** | `google-reviews/route.ts` may attach stack in response |
| Logging — PII in logs | AU-2 | examine | **FAIL** | `/api/contact` logs full submission body |
| Business logic — lead integrity | — | examine | **PARTIAL** | Idempotency on lead; contact stub false success |
| Business logic — partial delivery | — | examine | **PASS** | `/api/lead` returns 503 if no channel configured |
| Supply chain — dep CVEs | SR-3 | examine | **NOT RUN** | Deferred to `/audit-dependencies` |
| External portal authz | — | interview | **UNVALIDATED** | FieldPortals out of repo scope |

## Coverage gaps

- No live penetration test or dynamic header scan against production URL
- FieldPortals authorization not testable without vendor credentials
- GHL workflow/tag behavior not verified against live sub-account
- Turnstile not tested end-to-end (UI unwired)

## Release gate (security)

**NOT security-ready** — 1× P0, 5× P1 open. Auth boundary untested for real users; diagnostic endpoints lack access control.
