# Pre-Release Audit — Executive Summary

**Audit date:** 2026-08-01  
**Prior audit baseline:** 2026-07-21 (revalidated with live browser + adversarial probes)

## Release readiness

**NOT READY FOR PRODUCTION RELEASE**

This remains a broad Next.js 14 marketing prototype with external FieldPortals for customer accounts. All **29** local implemented routes return HTTP 200 in development. Mobile nav and basic interaction work. Critical product outcomes are still missing or false:

- Contact shows success while discarding the lead (no application XHR/fetch).
- Scheduling accepts input but creates no booking and shows no next step.
- Newsletter, chat, referral copy, and site search are mock/inert.
- Unauthenticated `/dashboard` presents a fake customer account surface.
- **18 of 41** discovered internal destinations return **404**.
- **123** placeholder image occurrences across crawled pages; hero/logo still resolve via `lib/media.ts` fallbacks (GCS pipeline exists but slots unbound).
- `next@14.2.16` remains a **critical** npm advisory source (11 vulnerable packages: 1 critical, 9 high, 1 moderate).
- FieldPortals auth, roles, sessions, recovery, and cross-customer isolation were **not** validated beyond confirming `/portal` redirects to the live landing URL.

Do **not** declare production-ready until critical conversion workflows produce verified downstream records and every real authorization boundary has negative tests.

## Audit scope completed (2026-08-01)

- Remapped architecture: 30 App Router pages (29 local + `/portal` redirect), **zero** `app/api` routes, no middleware/auth/DB/jobs in-repo.
- Live Microsoft Edge crawl via `scripts/pre-release-browser-audit.mjs` against `http://localhost:3001`.
- Adversarial probes via `scripts/adversarial-audit-probes.mjs` (XSS payload, invalid email, duplicate submit, API guessing, dashboard refresh, portal redirect, placeholder asset).
- Chrome DevTools inspection of homepage + contact (a11y tree, real business contact from env, placeholder imagery).
- `npm audit` dependency review.
- Code search for TODO/FIXME/mock/stub, forms without handlers, missing routes.
- Distinguished confirmed defects, suspected risks, N/A categories, and unvalidated external boundaries.

## Finding totals

| Severity | Count |
|----------|------:|
| Critical / P0 | 1 |
| High / P1–P2 | 11 |
| Medium | 10 |
| Low | 3 |
| **Total** | **25** |

## Strongest validated behavior

- 29/29 expected local routes HTTP 200 (dev).
- Contact HTML5 validation rejects invalid email; XSS-like payload did not set `window.__xss` (React text escape).
- `/portal` redirects to `https://cutrateslawn.fieldportals.com/landing/index` (200).
- Guessed `/api/*`, `/.env`, `/admin` → 404 (no accidental API surface).
- Mobile 390×844: menu button visible, no horizontal overflow.
- Phone/email/address on live pages resolve from site config (not scaffold defaults in this environment).
- `placeholder.svg?...` unexpectedly returns **200** `image/svg+xml` in dev (still placeholder content, not brand media).

## Critical validation limits

Could **not** fully validate:

- Production `next start` missing-route status: **revalidated 2026-08-01 → HTTP 404** on clean build (prior 500 not reproduced). Keep CI smoke.
- FieldPortals login, MFA, recovery, session expiry, IDOR, privilege escalation.
- CRM/email lead receipt, scheduler bookings, newsletter provider.
- Vercel production headers, env inventory, CDN caching.
- GCS object public-read + CDN behavior for unpublished media slots.

## Artifact index

| File | Purpose |
|------|---------|
| `SYSTEM_INVENTORY.md` | Architecture, roles, routes, journeys |
| `TEST_COVERAGE_MATRIX.md` | What was / was not validated |
| `FINDINGS_REGISTER.md` | Prioritized defects with full fields |
| `SECURITY_AUTHORIZATION_REVIEW.md` | Adversarial authz analysis |
| `INCOMPLETE_IMPLEMENTATION.md` | Mocks, dead controls, missing layers |
| `REMEDIATION_PLAN.md` | Phase 0–6 plan + downstream risks |
| `PROPOSED_TEST_SUITE.md` | Release-blocking automation |
| `evidence/browser-audit.json` | Edge crawl + workflow probes |
| `evidence/adversarial-probes.json` | Edge adversarial probes |

## Immediate go/no-go

Do not release publicly until:

1. Critical Next.js (and related) vulnerabilities remediated.
2. Contact and schedule either deliver verified outcomes or are replaced with truthful external/manual CTAs.
3. Mock `/dashboard` removed/redirected or properly authenticated.
4. Legal pages (`/privacy`, `/terms`) exist before collecting PII.
5. Unexpected internal 404s and inert primary CTAs fixed.
6. Placeholder imagery / claims owner-approved or replaced.
7. Outcome-asserting E2E in CI.
8. FieldPortals authorization boundaries validated with role test accounts.
