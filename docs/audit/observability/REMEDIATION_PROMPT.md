# Observability — Remediation Prompt

Run with `/audit-observability --fix`. Cross-ref `/audit-security-nist` for AU controls.

## Phase 1 — PII in logs (P1)

1. Redact `email`, `phone`, `firstName`, `lastName` in `app/api/contact/route.ts` — log `requestId` + field names only.
2. Remove or gate `console.log` in `lib/api-helpers.ts` behind `NODE_ENV === 'development'`.
3. Add ESLint rule or grep check in `verify.mjs` banning `console.log` in `app/api/**`.

## Phase 2 — Error tracking (P2)

1. Add Sentry (or Vercel integration) for Next.js 14 App Router.
2. Wire `logDetailedError()` to forward HIGH/CRITICAL severities.
3. Add `app/global-error.tsx` with Sentry capture + branded UI.

## Phase 3 — API consistency (P2)

1. Standardize error envelope: `{ ok: false, error: string, requestId: string, code?: string }`.
2. Apply to `/api/contact`, `/api/newsletter`, `/api/reviews/google`.
3. Generate `requestId` in shared middleware or helper (`lib/api-response.ts`).

## Phase 4 — Log cleanup (P2)

1. Replace `lib/smart-api.ts` debug logs with structured logger at `debug` level (disabled in prod).
2. Delete or quarantine `components/hero.tsx` debug logs.
3. Document logging conventions in `docs/DEV_COLD_START_KNOWLEDGE.md`.

## Phase 5 — Route hygiene (P3)

1. Guard debug API routes with `NODE_ENV !== 'production'` or remove from production bundle.
2. Add nested `error.tsx` for `/quote`, `/careers`, `/contact` client-heavy segments.

## Verification

```bash
npm run verify
# Submit test lead; confirm logs show requestId without raw email
# Trigger intentional error; confirm Sentry event (if configured)
```
