# Observability — Findings

**Mode:** discovery (read-only) | **Date:** 2026-09-01

## Summary

| Priority | Open |
|----------|------|
| P0 | 0 |
| P1 | 1 |
| P2 | 4 |
| P3 | 2 |

---

### F-OBS-001 — PII logged in contact API and helpers

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Log hygiene |
| Status | Open |

**Evidence:** `app/api/contact/route.ts` line 19: `logger.info("Contact form submission received", { data })`. `lib/api-helpers.ts` lines 72, 89: `console.log` with full quote/contact payloads.

**Impact:** Names, emails, phones may appear in Vercel/server logs; compliance and security risk.

---

### F-OBS-002 — No production error tracking service

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Alerting |
| Status | Open |

**Evidence:** `lib/errors/logger.ts` — `sendToErrorTrackingService` is a comment placeholder. No Sentry/Datadog SDK in `package.json`.

**Impact:** Client and server errors only visible in ephemeral console logs.

---

### F-OBS-003 — Missing `global-error.tsx`

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Error boundaries |
| Status | Open |

**Evidence:** `app/error.tsx` exports `GlobalError` but file is named `error.tsx`, not `global-error.tsx`. No layout-level recovery for root layout failures.

**Impact:** Root layout throws may white-screen without branded fallback.

---

### F-OBS-004 — Inconsistent API error response shapes

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | API errors |
| Status | Open |

**Evidence:** `/api/lead` returns `{ ok, error, requestId, issues? }`. `/api/contact` returns `{ success, message }`. Debug routes vary.

**Impact:** Client error handling cannot share one parser; harder to monitor.

---

### F-OBS-005 — Debug `console.log` in production code paths

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Log structure |
| Status | Open |

**Evidence:** `lib/smart-api.ts` logs cache hits and fetch URLs; `components/hero.tsx` logs on every render.

**Impact:** Log noise in production; potential URL/param leakage.

---

### F-OBS-006 — No request ID on all API routes

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Correlation |
| Status | Open |

**Evidence:** Only `/api/lead` generates `requestId` (UUID). Other routes lack correlation IDs.

**Impact:** Harder to trace multi-step failures across webhook/GHL/email delivery.

---

### F-OBS-007 — Debug API routes exposed in production build

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Observability / security overlap |
| Status | Open |

**Evidence:** `/api/test`, `/api/google-reviews-debug`, `/api/mock-homepage` ship in `app/api/`.

**Impact:** Unnecessary attack surface; diagnostic noise if probed.
