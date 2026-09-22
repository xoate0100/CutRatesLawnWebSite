# Security and Authorization Review

**Audit date:** 2026-08-01  
**Classification guide:** Confirmed = observed live or in source; Suspected = plausible but unproven; N/A = no implementing surface; Unvalidated = external system.

## Executive security posture

This origin is largely a **static/marketing surface**. There is **no local authentication, session store, or API authorization layer**. The primary security issues are:

1. Framework/dependency vulnerabilities on an internet-facing app.
2. **Trust and privacy defects** (fake success while handling PII in the browser).
3. **Authorization fiction** (public mock dashboard).
4. **Unvalidated external portal** (FieldPortals) where real customer data likely lives.

## Authentication and session

| Check | Status |
|-------|--------|
| Local login / middleware | **N/A** — none |
| Session cookies for accounts | **N/A** |
| `/portal` | **Confirmed** redirect to FieldPortals |
| FieldPortals login, MFA, recovery, expiry, reuse | **Unvalidated** — needs vendor test accounts + their docs |
| Token storage on this origin | **N/A** |

## Authorization / IDOR / privilege escalation

| Check | Status |
|-------|--------|
| Role enforcement in Next | **Confirmed absent** |
| `/dashboard` anonymous access | **Confirmed defect** (F-004) |
| Cross-user data access in Next | **N/A** — no multi-user data API |
| Direct API manipulation | **Confirmed** no `/api` surface (404); reduces local IDOR but also means no real controls to test |
| Privilege escalation | **Suspected** only if dashboard later wired without guards |

## Input validation / XSS / injection

| Check | Result |
|-------|--------|
| Contact invalid email | Client HTML5 rejects |
| Contact `<script>` payload | Did not execute (`xssFlag: false`); still logged to console on “success” path |
| Server-side validation | **Absent** — no server |
| SQL/NoSQL injection | **N/A** — no DB |
| File upload | **N/A** |

## Secrets and debug exposure

| Item | Status |
|------|--------|
| `.env` gitignored | Expected; do not commit |
| Maps traffic API key | Third-party Maps network param (not authored in repo grep); review Maps embed restrictions |
| `console.log` of contact form PII | **Confirmed** (F-016) |
| Unsafe error pages | Dev 404 OK; prod missing-route **suspected/prior 500** (F-019) |

## Dependency failure / partial success

Forms report success with **zero** downstream attempt → **confirmed false partial-success** (F-002, F-003, F-006). Duplicate contact submit produced one dialog; without a server there is no idempotency key or durable duplicate detection.

## Race / duplicate / interrupted workflows

| Scenario | Result |
|----------|--------|
| Double-click contact | 1 alert observed; state cleared — still no lead |
| Refresh dashboard | Mock data still present (no session) |
| Schedule refresh | Selection lost (client state only) — **confirmed UX/data loss** |

## Required access to finish external validation

1. FieldPortals admin + two customer test accounts (isolation / IDOR).
2. Production Vercel URL + header dump.
3. CRM/email webhook test sink (or Resend test mode).
4. Scheduler system of record (if not FieldPortals).
5. GCS public-read verification for published objects.

Until (1) is done, **do not claim authorization boundaries are production-ready**.
