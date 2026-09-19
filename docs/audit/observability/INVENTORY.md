# Observability — Inventory

**Audit:** `audit-observability` | **Mode:** discovery | **Stack:** next | **Date:** 2026-09-01

## Error boundaries

| File | Scope | Notes |
|------|-------|-------|
| `app/error.tsx` | Root segment | Client component named `GlobalError`; logs to console |
| `app/global-error.tsx` | — | **Missing** (true global boundary not present) |
| Route-level `error.tsx` | — | **None** beyond root |
| `components/error-boundary.tsx` | Optional wrapper | Not globally applied |
| `components/global-error-boundary.tsx` | Legacy | Exists but not in layout tree |

## Logging infrastructure

| Module | Path | Transport |
|--------|------|-----------|
| Structured logger | `lib/errors/logger.ts` | `console.error/warn/info` by severity |
| Error formatter | `lib/errors/formatter.ts` | Normalizes unknown errors |
| DI logger service | `lib/services/logger/` | Used by `/api/contact` |
| App context | `lib/context/app-context.tsx` | Console passthrough |

Production error tracking: **stubbed** (`sendToErrorTrackingService` comment in `logger.ts`).

## API routes (12)

| Route | Error handling | Logging |
|-------|----------------|---------|
| `POST /api/lead` | Zod + try/catch paths; structured 400/429/503 | `console.info/error` with `requestId` |
| `POST /api/contact` | try/catch → 500 | `logger.info` with **full form data** |
| `GET /api/health` | try/catch → 500 JSON | Minimal |
| `GET /api/health/strapi` | Strapi probe | — |
| `POST /api/newsletter` | — | — |
| `GET /api/reviews/google` | catch → 500 | `console.error` |
| Debug routes | `/api/test`, `/api/simple`, `/api/google-reviews-debug`, `/api/mock-homepage`, `/api/html` | Dev/diagnostic |

## Console.log scatter (sample)

- `lib/smart-api.ts` — cache/fetch debug logs (8+ sites)
- `components/hero.tsx` — render debug logs
- `lib/api-helpers.ts` — logs submitted quote/contact data
- `lib/schema-types.ts` — type generation logs

## Analytics vs logs

- No GA4/gtag instrumentation found in `app/layout.tsx` during this audit
- Product events not distinguished from error logs

## Alerting

- No Sentry, Datadog, or Vercel log drain configuration in repo
- Lead API 503 responses include `manualContactRequired` flag for client UX only
