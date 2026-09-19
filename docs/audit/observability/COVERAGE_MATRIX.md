# Observability — Coverage Matrix

| Area | Checked | Result | Evidence |
|------|---------|--------|----------|
| Root error boundary | Yes | **Partial** | `app/error.tsx` exists |
| `global-error.tsx` | Yes | **Missing** | — |
| Per-route error boundaries | Yes | **Missing** | no nested `error.tsx` |
| API validation errors | Yes | **Pass** on `/api/lead` | Zod + structured JSON |
| API 5xx responses | Partial | Lead route good; others vary | route files |
| Silent failures | Yes | **Gap** | empty catches in some client forms |
| Structured logging | Partial | `lib/errors/logger.ts` exists; uneven adoption | grep `console.log` |
| No secrets in logs | Yes | **Gap** | contact route logs full PII |
| No PII in logs | Yes | **Gap** | `api-helpers.ts`, `/api/contact` |
| Request correlation ID | Partial | Lead API only | `requestId` in `/api/lead` |
| Production error tracking | Yes | **Not configured** | stub in `logger.ts` |
| Analytics distinct from logs | Yes | **Gap** | no GA4 in layout |
| Alerting hooks | Yes | **Missing** | — |
| Health endpoints | Yes | **Pass** | `/api/health` |

**Coverage score:** 3 / 14 areas fully passing.
