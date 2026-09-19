# Dependencies Audit — Findings

**Mode:** discovery | **Date:** 2026-09-01  
*CVE scoring detail: cross-reference `/audit-security-nist` — this audit covers currency and maintenance.*

---

### DEP-F-001 — Next.js 14.2.35 behind patched line (11 high audit findings)
- status: Confirmed
- severity: high
- priority: **P1**
- affected: `next@14.2.35`
- method: test (`pnpm audit`)
- repro: `pnpm audit` → multiple GHSA entries for next <15.5.16
- expected: Current patched Next release for security advisories
- actual: 14.2.35; latest 16.3.4
- evidence: `pnpm audit` 2026-09-01; advisories GHSA-h25m-26qc-wcjf, GHSA-q4gf-8mx6-v5v3, GHSA-8h8q-6873-q5fj, GHSA-c4j6-fc7j-m34r, others
- root_cause: Stayed on v0 scaffold Next 14
- impact: DoS, RSC, middleware, SSRF class issues per advisories
- fix: Upgrade path: 14.2.35 → latest 14.x patch if available, then plan 15.5.16+ or 16.x with regression testing
- downstream: React 19, eslint-config-next, App Router changes
- regression: `pnpm run verify`, `test:e2e`, adversarial audit scripts

---

### DEP-F-002 — Core stack multiple majors behind initializer target
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: react 18, tailwind 3, typescript 5, zod 3
- method: test (`pnpm outdated`)
- repro: `pnpm outdated` shows next 16, react 19, tailwind 4, zod 4
- expected: Align with project_initializer `next` stack over time
- actual: React 18.3.1, Tailwind 3.4.x
- evidence: `pnpm outdated` output
- root_cause: Intentional stability on v0 fork
- impact: Missing framework features; growing upgrade cliff
- fix: Phased upgrade plan (Next first for security, then React, then Tailwind 4)
- downstream: Radix/shadcn compatibility matrix
- regression: Full verify + visual audit

---

### DEP-F-003 — dompurify patch available
- status: Confirmed
- severity: low
- priority: **P2**
- affected: `dompurify@3.3.1`
- method: test (`pnpm audit`, outdated)
- repro: Audit lists low XSS-class issues; latest 3.4.14
- expected: Patched dompurify
- actual: 3.3.1 pinned in package.json
- evidence: `package.json`, `pnpm audit`
- root_cause: Pin not bumped
- impact: Low-severity sanitization bypasses per GHSA
- fix: `pnpm update dompurify@^3.4.14`
- downstream: Test blog/HTML render paths using DOMPurify
- regression: Unit tests for sanitized HTML output

---

### DEP-F-004 — glob vulnerability via eslint-config-next (dev tree)
- status: Confirmed
- severity: high
- priority: **P2**
- affected: `eslint-config-next` → glob
- method: test (`pnpm audit`)
- repro: GHSA-5j98-mcp5-4vw2 — glob CLI injection
- expected: glob ≥10.5.0
- actual: Transitive via eslint-config-next@14.2.35
- evidence: `pnpm audit` paths `.>eslint-config-next>...>glob`
- root_cause: Old eslint-config-next lock
- impact: Dev/CI tooling risk (not production runtime unless glob CLI invoked)
- fix: Upgrade eslint-config-next with Next upgrade
- downstream: DEP-F-001
- regression: `pnpm audit` clean on dev tree

---

### DEP-F-005 — CI does not enforce lint, tsc, or high-severity audit
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `.github/workflows/ci.yml`, `next.config.mjs`
- method: examine
- repro: No `next lint` / `tsc` steps; audit continue-on-error
- expected: Dependency/tooling regressions caught pre-merge
- actual: verify script runs build with ignored TS errors
- evidence: `ci.yml`, `next.config.mjs`
- root_cause: v0 debt accommodation
- impact: Vulnerable/outdated deps merge unnoticed
- fix: Add strict CI steps; tighten audit threshold after DEP-F-001
- downstream: INF-F-002, INF-F-004
- regression: PR with intentional vuln fails CI

---

### DEP-F-006 — No engines field for Node
- status: Confirmed
- severity: low
- priority: **P3**
- affected: `package.json`
- method: examine
- repro: Missing `engines.node`
- expected: Match CI Node 20
- actual: Unspecified in manifest
- evidence: `package.json`
- root_cause: Omission
- impact: Local/Vercel Node mismatch risk
- fix: Add engines + `.nvmrc` optional
- downstream: INF-F-006
- regression: `pnpm install` on Node 18 warns/fails

---

### DEP-F-007 — Possibly underused direct dependencies (Suspected)
- status: Suspected
- severity: low
- priority: **P3**
- affected: `prismjs`, `recharts`, possibly others
- method: examine (grep)
- repro: Limited import sites vs bundle weight
- expected: Each direct dep used on production paths
- actual: Admin/docs/chart paths may not ship to users
- evidence: grep for `prismjs`, `recharts`
- root_cause: v0 scaffold breadth
- impact: Larger bundle, more audit surface
- fix: `depcheck` or knip pass; remove unused direct deps
- downstream: Smaller install tree
- regression: Build + e2e after removal

---

### DEP-F-008 — vercel.json npm + legacy-peer-deps diverges from pnpm lockfile
- status: Confirmed
- severity: medium
- priority: **P1**
- affected: Production dependency tree
- method: examine
- repro: Compare `vercel.json` vs `pnpm-lock.yaml`
- expected: Identical resolved tree in CI and Vercel
- actual: npm install --legacy-peer-deps on Vercel
- evidence: `vercel.json`, INF-F-001
- root_cause: Scaffold config
- impact: "Works in CI, different in prod" dependency bugs
- fix: Align Vercel to pnpm frozen lockfile
- downstream: Redeploy required
- regression: Hash lockfile in Vercel build logs

---

## Priority Summary

| Priority | Count | IDs |
|----------|-------|-----|
| P1 | 2 | DEP-F-001, DEP-F-008 |
| P2 | 4 | DEP-F-002, DEP-F-003, DEP-F-004, DEP-F-005 |
| P3 | 2 | DEP-F-006, DEP-F-007 |

**npm audit:** 46 total (11 high, 28 moderate, 7 low) as of 2026-09-01.
