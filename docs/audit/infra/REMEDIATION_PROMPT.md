# Infrastructure Audit — Remediation Prompt

## Context

Next.js on **Vercel**, CI on **GitHub Actions** with **pnpm**. `vercel.json` still uses **npm**. Build ignores TS/ESLint errors. GHL secrets not on production Vercel per backlog.

## Phase 1 — Deploy parity (P1)

1. **Fix Vercel package manager:**
   - Remove `installCommand` / `buildCommand` from `vercel.json` OR set:
     - `installCommand`: `pnpm install --frozen-lockfile`
     - `buildCommand`: `pnpm run build`
   - Confirm Vercel project uses pnpm 10.x.
2. **GHL-OPS-001:** Add `GHL_*` to Vercel **Production** environment only (human gate).
3. **Scope preview env:** Do not copy GHL PIT to Preview unless using a sandbox GHL location.

## Phase 2 — Build quality (P1–P2)

4. Add CI jobs: `pnpm exec tsc --noEmit` and `pnpm run lint` (hard fail).
5. Plan to set `ignoreBuildErrors: false` after type debt burn-down.
6. Remove or prod-gate debug API routes (`google-reviews-debug`, `test`, `simple`, `mock-homepage`).

## Phase 3 — Hardening (P2–P3)

7. Make `pnpm audit --audit-level=high` blocking after Next upgrade (coordinate with dependencies audit).
8. Add `"engines": { "node": ">=20 <21" }` to `package.json`.
9. Replace `/api/health` with minimal liveness; move Strapi diagnostics to admin-only route.
10. Document Vercel domain + env matrix in `docs/DEV_COLD_START_KNOWLEDGE.md`.

## Constraints

- **Do not change CI/CD deployment or Vercel `.env` without human review** (workspace rule).
- Never commit secrets.
- Run `npm run verify` after infra code changes.

## Acceptance

- [ ] Vercel build uses same lockfile as CI (pnpm frozen)
- [ ] Production lead form succeeds with GHL-only config
- [ ] No public debug routes in production
- [ ] Preview deploys do not create prod CRM contacts
- [ ] Node 20 documented and enforced
