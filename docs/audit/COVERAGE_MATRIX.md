# Coverage Matrix — `/audit-all`

**Date:** 2026-09-01

| Domain | Ran | Inventory | Live test | Key areas covered | Result |
|--------|:---:|-----------|-----------|-------------------|--------|
| security | ✅ | API routes, auth, middleware, headers | code examine | Debug endpoints, mock auth, Turnstile, rate limits | **1 P0, 5 P1** |
| completeness | ✅ | Routes, forms, lib stubs | code examine | Mock search/auth, GHL ops gap, orphan APIs | **4 P1** |
| uiux | ✅ | Components, careers, sticky chrome | script refs | Responsive matrix gap for careers | **0 P1** |
| media | ✅ | SLOT_MAP, registry, careers slots | `media:validate` | 39% null slots, attribution gaps | **3 P1** |
| optimization | ✅ | Fonts, bundles, audit artifacts | artifact read | Sticky overlay CLS, unused font pkgs | **0 P1** |
| journey | ✅ | Home, quote, contact, careers | adversarial JSON | Careers mailto gap | **2 P1** |
| conversion | ✅ | Funnels, CTAs, careers copy | code + guidelines | GHL prod, careers apply | **1 P1** |
| seo | ✅ | metadata, sitemap, JSON-LD | code examine | No sitemap/robots | **2 P1** |
| integrations | ✅ | GHL, FieldPortals, chat | backlog + code | GHL env + workflows | **2 P1** |
| data | ✅ | GCS, no DB | registry examine | Public GCS prefix, in-memory limits | **0 P1** |
| infra | ✅ | Vercel, CI, next.config | code examine | pnpm mismatch, build gates off | **3 P1** |
| dependencies | ✅ | package.json, lockfile | `pnpm audit` | Next CVEs, outdated stack | **2 P1** |
| observability | ✅ | API logging, errors | code examine | PII logs, no error tracking | **1 P1** |
| docs | ✅ | AI_CONTEXT, README, backlog | examine | Stale context, npm vs pnpm README | **0 P1** |
| runtime-safety | ✅ | verify.mjs, exec_guard | script examine | Uncapped build in verify | **2 P1** |

## Cross-cutting automation

| Script / gate | Ran this session | Notes |
|---------------|------------------|-------|
| `pnpm run verify` | ✅ | Build + governance green |
| `pnpm run media:validate` | ✅ | 3 attribution warnings |
| `pnpm run audit:links` | ❌ | Needs local server |
| `pnpm audit` | ✅ | 11+ high on next |
| Playwright careers E2E | — | Not re-run (prior session 5/5) |
| Adversarial responsive | — | Prior artifact 41/41 on `/`, `/quote` |

## Assessment gaps

- Link smoke not executed (no dev server).
- Production Vercel env vars not verified live (backlog only).
- FieldPortals authz not penetration-tested (external).
- Lighthouse/CWV not re-run this session.
