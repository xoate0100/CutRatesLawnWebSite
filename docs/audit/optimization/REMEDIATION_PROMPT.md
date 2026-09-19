# Optimization — Remediation Prompt

Run with `/audit-optimization --fix`.

## Phase 1 — Mobile overlay / CLS (P2)

1. Fix `TEXT-UNDER` findings: ensure `main` has `padding-bottom` accounting for sticky bar on mobile (`app/layout.tsx` already has `pb-24 md:pb-0` — verify sufficiency).
2. Consider hiding `StickyQuoteBar` when focus is in form fields (contact, quote step 3).
3. Re-run `node scripts/ship-gate-mobile.mjs` and compare `artifacts/audit/local-summary.json`.

## Phase 2 — Bundle hygiene (P2)

1. Remove unused `@fontsource-variable/*` from `package.json`.
2. Add `@next/bundle-analyzer` devDependency and `analyze` script.
3. Dynamic-import heavy routes: `/careers` tools, `recharts` on dashboard only.

## Phase 3 — Image / LCP (P2)

1. Audit hero `MediaFrame` / `priority` flag on home LCP image.
2. Deprecate or delete `components/hero.tsx` if unused; grep for imports.
3. Ensure all hero paths use `next/image` with explicit `sizes`.

## Phase 4 — Measurement (P3)

1. Run `node scripts/lighthouse-redesign.mjs` against local prod server; commit `artifacts/redesign/lh-summary.json` baseline.
2. Add optional CI step: Lighthouse perf ≥ 80, a11y ≥ 90 (match script thresholds).
3. Document run procedure in `docs/audit/optimization/README.md`.

## Phase 5 — Playwright perf (P3)

1. Change `playwright.config.ts` to reuse existing server when `PLAYWRIGHT_BASE_URL` set.
2. Use `next dev` for local E2E where feasible; reserve full build for CI only.

## Verification

```bash
npm run verify
node scripts/lighthouse-redesign.mjs   # with server on :3010
pnpm run analyze                      # after adding analyzer
```
