# Dependencies Audit — Remediation Prompt

## Context

pnpm monorepo spoke on **Next 14.2.35 / React 18 / Tailwind 3**. `pnpm audit` reports **46 vulnerabilities (11 high)**. Vercel uses npm with `--legacy-peer-deps`, diverging from `pnpm-lock.yaml`.

## Phase 1 — Security patches (P1)

1. **Align Vercel with pnpm** (see INF-F-001 / DEP-F-008) before dependency changes.
2. **Next.js upgrade** (minimum security line):
   - Research latest **14.2.x** patch if available without major jump
   - Target **≥15.5.16** or current **16.x** per advisory patched versions
   - Run `pnpm run verify`, `pnpm test:e2e`, `pnpm run audit:adversarial`
3. **Bump dompurify** to `^3.4.14` (patch).

## Phase 2 — CI enforcement (P2)

4. Add to `.github/workflows/ci.yml`:
   - `pnpm exec tsc --noEmit`
   - `pnpm run lint`
   - `pnpm audit --audit-level=high` (fail after Phase 1)
5. Document any allowed exceptions in `docs/audit/NPM_AUDIT_ALLOWLIST.md`.

## Phase 3 — Stack currency (P2, planned)

6. Plan React 19 + Next 16 + eslint-config-next 16 upgrade (coordinate with initializer stack).
7. Plan Tailwind 4 migration (separate effort; many class/config changes).
8. Evaluate Zod 4 migration for API schemas.

## Phase 4 — Cleanup (P3)

9. Run `depcheck` / knip — remove unused direct deps (`prismjs`, `recharts` if confirmed).
10. Add `"engines": { "node": ">=20 <21" }`.

## Constraints

- Do not run `pnpm audit fix --force` without review (may bump majors).
- Run `npm run verify` after each upgrade step.
- Cross-reference `/audit-security-nist` for CVSS prioritization.

## Acceptance

- [ ] `pnpm audit` zero high (or documented allowlist)
- [ ] Vercel and CI resolve identical lockfile
- [ ] `tsc` and `lint` pass in CI without `ignoreBuildErrors`
- [ ] E2E green on target Next version
