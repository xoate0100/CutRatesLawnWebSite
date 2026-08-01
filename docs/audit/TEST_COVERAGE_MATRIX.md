# Test Coverage Matrix

**Audit date:** 2026-08-01  
**Bases:** `http://localhost:3001` (dev), Edge Playwright + Chrome DevTools

| Area | Method | Result | Notes |
|------|--------|--------|-------|
| Route crawl (29 expected) | Playwright Edge | **Pass** | All HTTP 200 |
| Internal link crawl (41) | Playwright Edge | **Fail** | 18 × 404 |
| Contact happy path | Playwright + network | **Defect** | Success alert; no app POST |
| Contact invalid email | Adversarial | **Pass (client)** | `validity.valid=false` |
| Contact XSS-like payload | Adversarial | **Pass (client)** | `window.__xss` false |
| Contact double-submit | Adversarial | **Partial** | 1 dialog; no server idempotency (no server) |
| Newsletter | Playwright | **Defect** | Navigates to `/?` |
| Schedule continue | Playwright | **Defect** | No success UI / network |
| Quote calculate | Playwright | **Defect** | `$0 per service` |
| Dashboard anonymous | Playwright + refresh | **Defect** | 200 “Your Dashboard” persists |
| Portal redirect | Adversarial | **Pass (redirect)** | FieldPortals landing 200 |
| API surface guessing | Adversarial | **Pass** | 404s |
| Mobile home 390×844 | Playwright | **Pass** | Menu visible; no overflow |
| Placeholder count | Crawl | **Fail (content)** | 123 img placeholders |
| Back/forward | Adversarial | **Inconclusive** | Probe errored (`ERR_ABORTED`); prior audit saw OK |
| Production missing routes | `next start :3002` clean build | **404 confirmed** | Prior 500 not reproduced; keep smoke test |
| Concurrent build vs dev | Observed | **Defect (ops)** | Dirty `.next` prerender failures |
| npm audit | CLI | **Fail** | 1 critical (next), 9 high, 1 moderate |
| FieldPortals authz | — | **Unvalidated** | Needs test accounts |
| CRM / email / booking DB | — | **N/A / absent** | No backend |
| File upload | — | **N/A** | No upload UI |
| Session / token / IDOR | — | **N/A in-app** | No local auth |
| Media pipeline dry-run | Prior session | **Partial** | Local publish dry-run OK; live upload not in this audit pass |
| E2E suite in CI | Static | **Gap** | Playwright exists; not asserted as release gate for outcomes |

## Non-applicable (no implementation)

Server-side RBAC, JWT reuse, password reset, multi-tenant IDOR inside Next, race on transactional writes, job retries — **absent**. Risks shift to (a) false UI implying those features exist, and (b) FieldPortals once customers leave this origin.
