# Dependencies Audit — Inventory

**Command:** `audit-dependencies`  
**Mode:** discovery (read-only)  
**Stack:** next  
**Date:** 2026-09-01

## Package Manager

| Item | Value |
|------|-------|
| Manager | **pnpm** 10.26.0 (`packageManager` field) |
| Lockfile | `pnpm-lock.yaml` (committed) |
| npm lockfile | None |
| yarn lockfile | None |

**Conflict:** `vercel.json` uses `npm install --legacy-peer-deps` (see INF-F-001).

---

## Core Stack (declared vs latest)

| Package | Declared | Latest (pnpm outdated 2026-09-01) | Gap |
|---------|----------|-----------------------------------|-----|
| next | 14.2.35 | 16.3.4 | **2 major** |
| react / react-dom | ^18.3.1 | 19.2.8 | **1 major** |
| typescript (dev) | ^5 | 7.0.2 | 2 major |
| tailwindcss (dev) | ^3.4.17 | 4.3.3 | **1 major** |
| eslint (dev) | ^8 | 10.9.1 | 2 major |
| eslint-config-next (dev) | 14.2.35 | 16.3.4 | aligned with next |
| zod | ^3.24.1 | 4.5.4 | 1 major |

Initializer target stack (registry): Next 16 / React 19 / Tailwind 4 — **this spoke is behind**.

---

## Dependency Counts

| Category | Count (approx.) |
|----------|-----------------|
| `dependencies` | 56 direct |
| `devDependencies` | 12 direct |
| Radix UI primitives | 20+ packages |

Notable direct deps: `sharp`, `dompurify`, `prismjs`, `recharts`, `qs`, full shadcn/Radix set.

---

## Tooling

| Tool | Config | CI runs? |
|------|--------|----------|
| ESLint | `.eslintrc.json`, `eslint-config-next` | Indirect via verify/build (ignored at build) |
| TypeScript | `tsconfig.json` | Build (errors ignored) |
| Playwright | `@playwright/test` | `test:e2e` not in CI workflow |
| Lighthouse | devDep | Used by audit scripts locally |
| Verify gate | `scripts/verify.mjs` | **Yes** — CI `pnpm run verify` |

No Husky/lefthook pre-commit in inventory.

---

## npm audit Summary (2026-09-01)

Command: `pnpm audit`

| Severity | Count |
|----------|-------|
| high | 11 |
| moderate | 28 |
| low | 7 |
| **Total** | **46** |

**Notable high advisories:**

- **next@14.2.35** — multiple DoS / RSC / middleware / SSRF advisories; patched in **≥15.5.16** (and various intermediate minors)
- **glob** (via `eslint-config-next`) — command injection in CLI; patched ≥10.5.0

**dompurify@3.3.1** — low-severity advisories; latest 3.4.14 available.

CI runs `pnpm audit --audit-level=critical` with `continue-on-error: true` — does not block merges.

Script `audit:npm-critical` exists in package.json for local/ops use.

---

## Engine Constraints

- `package.json`: **no `engines` field**
- CI: Node **20** (`.github/workflows/ci.yml`)

---

## Potentially Unused / Low-Use Direct Deps

| Package | Notes |
|---------|-------|
| `prismjs` | Syntax highlighting — grep shows limited/admin use |
| `recharts` | Charts — verify if rendered on production routes |
| `qs` | Query string — used in API helpers |

Full import graph not traced in discovery mode; treat as **Suspected** unused until import audit.

---

## Evidence

- `package.json`, `pnpm-lock.yaml`
- `pnpm audit` output (46 vulnerabilities)
- `pnpm outdated` output
- `.github/workflows/ci.yml`
- `docs/audit/NPM_AUDIT_ALLOWLIST.md` (if exceptions documented)
