# Infrastructure Audit — Findings

**Mode:** discovery | **Date:** 2026-09-01

---

### INF-F-001 — Vercel install uses npm while repo standard is pnpm
- status: Confirmed
- severity: medium
- priority: **P1**
- affected: Vercel builds
- method: examine
- repro: Compare `vercel.json` `installCommand` vs `packageManager` in `package.json` and CI
- expected: `pnpm install --frozen-lockfile` on Vercel
- actual: `npm install --legacy-peer-deps` + `npm run build`
- evidence: `vercel.json`, `.github/workflows/ci.yml`, `package.json` `packageManager: pnpm@10.26.0`
- root_cause: v0.dev scaffold defaults
- impact: Lockfile drift, different dependency tree in prod vs CI, `--legacy-peer-deps` masks conflicts
- fix: Remove custom install/build from `vercel.json` or set pnpm commands; enable Vercel pnpm support
- downstream: Re-verify production build after switch
- regression: Vercel preview deploy green + `pnpm run verify` locally

---

### INF-F-002 — TypeScript and ESLint errors ignored during production build
- status: Confirmed
- severity: medium
- priority: **P1**
- affected: `next.config.mjs`
- method: examine
- repro: `ignoreBuildErrors: true`, `ignoreDuringBuilds: true`
- expected: Build fails on type/lint regressions
- actual: Production deploys can ship with TS errors
- evidence: `next.config.mjs` L3–8
- root_cause: Legacy v0 type debt comment
- impact: Runtime bugs reach production; false confidence from green deploy
- fix: Incrementally fix types; re-enable gates or add CI `tsc --noEmit` + `next lint` as hard fail
- downstream: May block deploy until debt reduced
- regression: CI step `pnpm exec tsc --noEmit` without ignore flags

---

### INF-F-003 — GHL production env not confirmed on Vercel
- status: Confirmed (backlog)
- severity: high
- priority: **P1**
- affected: Production serverless API
- method: examine
- repro: `OUTSTANDING_TASKS.yaml` GHL-OPS-001 pending
- expected: `GHL_PRIVATE_INTEGRATION_TOKEN` + `GHL_LOCATION_ID` on prod project
- actual: Documented as not set on Vercel
- evidence: `6_ai_runtime_context/OUTSTANDING_TASKS.yaml`, `docs/atmosphere/HUMAN_TASKS.md` H-GHL-01
- root_cause: Human ops step
- impact: Lead API 503 in prod without fallback channels
- fix: Add secrets via Vercel dashboard (human review required)
- downstream: INT-F-001
- regression: GHL-TEST-001

---

### INF-F-004 — CI critical npm audit is non-blocking
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `.github/workflows/ci.yml`
- method: examine
- repro: Step uses `continue-on-error: true` and `|| true`
- expected: Critical/high CVEs fail CI or open tracked exception
- actual: Audit runs but does not gate merge
- evidence: `ci.yml` L31–33
- root_cause: Avoid blocking while debt addressed
- impact: Vulnerable deps ship (see dependencies audit — 11 high)
- fix: Fail on high+ after Next upgrade; use `docs/audit/NPM_AUDIT_ALLOWLIST.md` for exceptions
- downstream: DEP-F-001
- regression: CI fails when `pnpm audit --audit-level=high` exits non-zero

---

### INF-F-005 — Debug/scaffold API routes deployable to production
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `/api/google-reviews-debug`, `/api/test`, `/api/simple`, `/api/mock-homepage`, `/api/html`
- method: examine
- repro: Routes exist without env guard
- expected: Dev-only routes excluded from prod
- actual: Same bundle deploys all routes
- evidence: `app/api/google-reviews-debug/route.ts`, `app/api/test/route.ts`
- root_cause: Scaffold cleanup incomplete
- impact: Information disclosure, attack surface
- fix: Delete or wrap in `process.env.NODE_ENV !== 'production'` check
- downstream: Security audit cross-ref
- regression: Production URL returns 404 for debug paths

---

### INF-F-006 — No `engines` field in package.json
- status: Confirmed
- severity: low
- priority: **P3**
- affected: Node version alignment
- method: examine
- repro: CI uses Node 20; Vercel default may differ if not set in dashboard
- expected: `engines.node` matches CI and Vercel project setting
- actual: Only CI pins Node 20
- evidence: `package.json`, `ci.yml`
- root_cause: Omission
- impact: Subtle runtime differences between local/CI/Vercel
- fix: Add `"engines": { "node": ">=20 <21" }` and set Vercel Node 20
- downstream: None
- regression: Engine check in verify script

---

### INF-F-007 — Preview deployments may write to production CRM (Suspected)
- status: Suspected
- severity: medium
- priority: **P2**
- affected: Vercel preview URLs + GHL API
- method: interview
- repro: If GHL secrets copied to all Vercel envs, preview form submits create real contacts
- expected: Preview uses sandbox GHL location or disables CRM
- actual: Not documented in `.env.example` or GOHIGHLEVEL.md
- evidence: Vercel env scoping not in repo
- root_cause: Common Vercel env scope oversight
- impact: Test spam in production CRM
- fix: Scope GHL vars to Production only; use separate location for preview
- downstream: GHL-TEST-001 on preview
- regression: Preview deploy without GHL_* returns 503 on lead (acceptable)

---

### INF-F-008 — `/api/health` invokes external Strapi diagnostics at runtime
- status: Confirmed
- severity: low
- priority: **P3**
- affected: `app/api/health/route.ts`
- method: examine
- repro: GET `/api/health` → `runApiDiagnostics()` may call Strapi
- expected: Lightweight liveness probe
- actual: Potentially slow/failing health due to legacy CMS
- evidence: `lib/api-diagnostics.ts`
- root_cause: Legacy diagnostic bundle
- impact: False unhealthy status; SSRF-style external fetch from serverless
- fix: Split liveness (`{ ok: true }`) from deep diagnostics (admin-only)
- downstream: Monitoring alerts
- regression: Health returns 200 without STRAPI configured

---

## Priority Summary

| Priority | Count | IDs |
|----------|-------|-----|
| P1 | 3 | INF-F-001, INF-F-002, INF-F-003 |
| P2 | 3 | INF-F-004, INF-F-005, INF-F-007 |
| P3 | 2 | INF-F-006, INF-F-008 |

**Infra release gate:** 3 open P1 items (pnpm parity, build gates, GHL prod env).
