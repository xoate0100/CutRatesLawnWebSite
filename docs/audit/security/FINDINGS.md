# Security Findings Register

**Audit:** `/audit-security-nist` (discovery)  
**Date:** 2026-09-01  
**Sorted by:** priority (P0 → P3)

---

### F-001 — Unauthenticated diagnostic endpoints leak configuration metadata
- status:        Confirmed
- severity:      high
- priority:      P0
- CVSS:          3.1 AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N (~5.3)
- NIST 800-30:   Likelihood: High × Impact: Moderate → High
- CSF:           ID.AM, PR.DS; 800-53 SI-11, SC-8
- CWE:           CWE-200 (Exposure of Sensitive Information)
- affected:      `/api/google-reviews-debug`, `/api-debug`, `/api/health`, `/admin/diagnostics`
- method:        examine
- repro:         `GET /api/google-reviews-debug` → JSON includes `placeIdValue`; `GET /api-debug` → `apiKeyFirstFive`, live Places probe; `GET /api/health` → `tokenValid`, Strapi URL, endpoint map
- expected:      Diagnostics gated to dev/admin or stripped in production
- actual:        Publicly reachable without auth; aids reconnaissance and API abuse
- evidence:      `app/api/google-reviews-debug/route.ts:5-11`, `app/api-debug/route.ts:8-16`, `app/api/health/route.ts:7-17`
- root_cause:    Debug routes shipped alongside production API surface; no env/middleware gate
- impact:        Attackers learn place IDs, partial key material, CMS connectivity — lowers bar for targeted abuse of Google/Strapi quotas
- fix:           Remove or guard behind `NODE_ENV !== 'production'` + shared secret header; strip sensitive fields from health responses in prod
- downstream:    Ops lose quick prod debug unless replaced with authenticated observability
- regression:    E2E test asserts 404 on `/api/google-reviews-debug` and `/api-debug` in production build

---

### F-002 — Mock authentication with known demo credentials in production code path
- status:        Confirmed
- severity:      high
- priority:      P1
- CVSS:          3.1 AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N (~6.5)
- NIST 800-30:   Likelihood: Moderate × Impact: Moderate → Moderate-High
- CSF:           PR.AC; 800-53 IA-2, IA-5
- CWE:           CWE-287, CWE-798
- affected:      `lib/auth.ts`, `/login`, `/register`, `/account`
- method:        examine
- repro:         Login with `user@example.com` / `password` → receives `mock-jwt-token` and user object
- expected:      No local auth OR redirect-only to FieldPortals; no hardcoded credentials
- actual:        Client-side mock accepts fixed credentials; register accepts any email
- evidence:      `lib/auth.ts:56-84`, `lib/auth.ts:102-114`
- root_cause:    Phase-3 placeholder auth never removed after portal redirect strategy
- impact:        Users may believe they have a real account; false sense of security; register creates fake users
- fix:           Remove mock auth paths; `/login`/`/account` redirect to FieldPortals; delete demo credential branch
- downstream:    Remove `AuthProvider` if unused; update middleware
- regression:    Test `/login` redirects to portal URL; no code path returns `mock-jwt-token`

---

### F-003 — Middleware cookie vs localStorage token mismatch breaks account protection
- status:        Confirmed
- severity:      high
- priority:      P1
- CSF:           PR.AC; 800-53 AC-3, SC-23
- CWE:           CWE-863 (Incorrect Authorization)
- affected:      `middleware.ts`, `lib/auth.ts`, `/account`
- method:        examine
- repro:         Successful mock login sets `localStorage` key `cut_rates_auth_token`; middleware checks cookie `auth_token` — never set. `/account` server component calls `getCurrentUser()` which returns null on server (no `window`)
- expected:      Single consistent session mechanism enforced server-side
- actual:        Middleware gate ineffective; account page always redirects to login server-side
- evidence:      `middleware.ts:7`, `lib/auth.ts:33-37`, `app/account/page.tsx:12-17`
- root_cause:    Auth implemented in two incompatible layers (cookie middleware vs localStorage client mock)
- impact:        Authorization boundary untested and incoherent; future wiring may ship without server validation
- fix:           Align on one model (external portal only) or implement HttpOnly Secure SameSite session cookie with server validation
- downstream:    Remove dead middleware matcher entries if portal-only
- regression:    Integration test: unauthenticated `/account` → redirect; authenticated session → 200

---

### F-004 — `/api/contact` logs PII and returns fake success without delivery
- status:        Confirmed
- severity:      high
- priority:      P1
- CSF:           PR.DS; 800-53 AU-2, SI-11
- CWE:           CWE-532 (Insertion of Sensitive Information into Log File)
- affected:      `app/api/contact/route.ts`, `components/forms/contact-form.tsx`
- method:        examine
- repro:         `POST /api/contact` with JSON body → `logger.info(..., { data })` logs full payload; returns `{ success: true }` with no GHL/webhook/email
- expected:      Deprecated route removed or proxied to `/api/lead`; no PII logging
- actual:        Orphaned stub still live and loggable
- evidence:      `app/api/contact/route.ts:16-27`
- root_cause:    Legacy v0 contact handler not deleted when `/api/lead` added
- impact:        PII in application logs; false success if legacy form component used
- fix:           Delete route or 410 redirect to `/api/lead`; redact PII from any retained logs
- downstream:    Remove `components/forms/contact-form.tsx` or rewire to `/api/lead`
- regression:    `POST /api/contact` returns 404/410; grep CI fails on `logger.info.*data` for contact

---

### F-005 — No global HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- status:        Confirmed
- severity:      medium
- priority:      P1
- CSF:           PR.DS; 800-53 SC-7, SC-23
- CWE:           CWE-693 (Protection Mechanism Failure)
- affected:      All HTML responses via `next.config.mjs`
- method:        examine
- repro:         Inspect `next.config.mjs` — no `headers()` export; only `images.contentSecurityPolicy` for SVG optimizer
- expected:      Baseline headers on all routes (CSP appropriate to Next/third parties, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, frame ancestors)
- actual:        Relies entirely on platform defaults (unverified)
- evidence:      `next.config.mjs:1-56`
- root_cause:    Headers never added during v0 → production migration
- impact:        Increased XSS/clickjacking/MIME-sniff risk vs hardened baseline
- fix:           Add `async headers()` in `next.config.mjs` or `middleware.ts` with tuned CSP for GTM/analytics when added
- downstream:    Third-party embeds (maps, chat) may need CSP allowlist updates
- regression:    CI header smoke on preview deployment

---

### F-006 — Turnstile spam protection bypassed when secret unset; UI never sends token
- status:        Confirmed
- severity:      medium
- priority:      P1
- CSF:           PR.DS; 800-53 SC-5, SI-4
- CWE:           CWE-799 (Improper Control of Interaction Frequency)
- affected:      `app/api/lead/route.ts`, `ContactFormBlock`, `QuoteFunnel`
- method:        examine
- repro:         Without `TURNSTILE_SECRET_KEY`, `verifyTurnstile` returns `true` (line 57). Forms POST without `turnstileToken` field
- expected:      Turnstile required in production OR alternative rate limit at edge; widget on all public lead forms
- actual:        Optional bypass + UI gap
- evidence:      `app/api/lead/route.ts:55-57`, `components/blocks/contact-form-block.tsx:49-61`, `components/quote/quote-funnel.tsx:129-148`
- root_cause:    Turnstile integrated server-side only; env and widget rollout incomplete
- impact:        Lead spam / GHL quota abuse when only in-memory rate limit applies
- fix:           Wire `NEXT_PUBLIC_TURNSTILE_SITE_KEY` widget; require secret in production; fail closed if missing in prod
- downstream:    E2E tests need Turnstile test keys
- regression:    Prod env check fails deploy without `TURNSTILE_SECRET_KEY`; form includes token

---

### F-007 — In-memory rate limiting and idempotency ineffective on serverless
- status:        Confirmed
- severity:      medium
- priority:      P2
- CSF:           PR.DS; 800-53 SC-5
- CWE:           CWE-770 (Allocation of Resources Without Limits)
- affected:      `app/api/lead/route.ts` (`seenKeys`, `ipHits` Maps)
- method:        examine
- repro:         Deploy to multi-instance serverless; each instance has separate Maps → limits reset per cold start/instance
- expected:      Edge rate limit (Vercel firewall, Upstash Redis, or CF) + durable idempotency store
- actual:        Process-local Maps only
- evidence:      `app/api/lead/route.ts:31-34`, `app/api/lead/route.ts:198-207`
- root_cause:    Single-node pattern applied to serverless runtime
- impact:        Abuse can exceed 8 req/min/IP under parallel instances
- fix:           Vercel WAF rate rules or Redis-backed limiter; idempotency via KV/D1
- downstream:    Slight latency increase for Redis round-trip
- regression:    Load test confirms 429 after threshold across instances

---

### F-008 — Google reviews error path may leak stack traces to clients
- status:        Confirmed
- severity:      medium
- priority:      P2
- CSF:           PR.DS; 800-53 SI-11
- CWE:           CWE-209 (Generation of Error Message Containing Sensitive Information)
- affected:      `app/api/google-reviews/route.ts`
- method:        examine
- repro:         Catch block sets `details: error.stack` on Response init (non-standard; may surface in body depending on framework handling)
- expected:      Generic client error; stack logged server-side only
- actual:        Stack captured in response construction
- evidence:      `app/api/google-reviews/route.ts:122-136`
- root_cause:    Debug-style error attachment left in route
- impact:        Path/internal structure disclosure to unauthenticated callers
- fix:           Remove `details` from client JSON; `console.error` server-side only
- downstream:    None
- regression:    API error test asserts no `stack` in response body

---

### F-009 — Admin and diagnostic pages publicly accessible
- status:        Confirmed
- severity:      medium
- priority:      P2
- CSF:           PR.AC; 800-53 AC-3
- CWE:           CWE-284 (Improper Access Control)
- affected:      `/admin/*`, `/debug`, `/admin/diagnostics`
- method:        examine
- repro:         Navigate to `/admin/setup`, `/admin/diagnostics`, `/debug` — no auth gate (unlike `/dev/components` prod guard)
- expected:      Admin surfaces blocked in production or behind auth
- actual:        Publicly reachable Strapi setup and API troubleshooter UI
- evidence:      `app/admin/setup/page.tsx`, `app/admin/diagnostics/page.tsx`, `app/debug/page.tsx`
- root_cause:    Admin routes treated as internal docs without access control
- impact:        Information about CMS integration; troubleshooter triggers `/api/health`
- fix:           `notFound()` in production or IP allowlist; move to dev-only route group
- downstream:    Team uses local dev for Strapi setup
- regression:    Prod GET `/admin/diagnostics` → 404

---

### F-010 — Dev/test API routes deployed without environment gate
- status:        Confirmed
- severity:      low
- priority:      P2
- CSF:           ID.AM; 800-53 CM-7
- CWE:           CWE-1188 (Insecure Default Initialization)
- affected:      `/api/test`, `/api/simple`, `/api/html`, `/api/mock-homepage`
- method:        examine
- repro:         `GET /api/test` → 200 "Hello World"
- expected:      Dev routes excluded from production builds or return 404
- actual:        Live handlers with no `NODE_ENV` check
- evidence:      `app/api/test/route.ts`, `app/api/simple/route.ts`, `app/api/html/route.ts`, `app/api/mock-homepage/route.ts`
- root_cause:    Scaffold endpoints not cleaned up
- impact:        Expanded attack surface; confusion for scanners
- fix:           Delete or guard with production `notFound`
- downstream:    None
- regression:    Route inventory test fails if unguarded test routes exist

---

### F-011 — TypeScript and ESLint errors ignored during production builds
- status:        Confirmed
- severity:      low
- priority:      P3
- CSF:           PR.DS; 800-218 PW.8
- CWE:           CWE-1127 (Compilation with Insufficient Warnings)
- affected:      `next.config.mjs`
- method:        examine
- repro:         `ignoreBuildErrors: true`, `ignoreDuringBuilds: true`
- expected:      CI/build fails on type and lint regressions
- actual:        Known debt bypassed for deploy velocity
- evidence:      `next.config.mjs:3-8`
- root_cause:    v0 sync legacy debt documented inline
- impact:        Security-relevant type errors may ship undetected
- fix:           Incremental debt burn-down; re-enable gates per package
- downstream:    May block deploy until debt fixed
- regression:    `npm run verify` enforces typecheck

---

### F-012 — Newsletter endpoint lacks IP rate limiting
- status:        Confirmed
- severity:      low
- priority:      P3
- CSF:           PR.DS; 800-53 SC-5
- CWE:           CWE-799
- affected:      `app/api/newsletter/route.ts`
- method:        examine
- repro:         Compare to `/api/lead` — no `ipHits` or equivalent
- expected:      Consistent abuse controls across PII ingestion endpoints
- actual:        Idempotency key only (per-key, in-memory)
- evidence:      `app/api/newsletter/route.ts:14-16`
- root_cause:    Newsletter route added without parity hardening
- impact:        Email endpoint abuse / GHL spam contacts
- fix:           Share rate-limit middleware with `/api/lead`
- downstream:    None
- regression:    429 after threshold on `/api/newsletter`

---

## Summary counts

| Priority | Count |
|----------|-------|
| P0 | 1 |
| P1 | 5 |
| P2 | 4 |
| P3 | 2 |
| **Total** | **12** |

## Release gate

**NOT security-ready** while F-001 (P0) and F-002–F-006 (P1) remain open.
