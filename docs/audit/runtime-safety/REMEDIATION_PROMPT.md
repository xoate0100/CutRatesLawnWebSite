# Runtime Safety — Remediation Prompt

Run with `/audit-runtime-safety --fix`. Pair fixes with `exec_guard` caps per finding.

## Phase 1 — Verify gate hardening (P1)

1. Wrap build step in `verify.mjs`:
   ```bash
   python -m agentic.exec_guard --timeout 600 --max-memory-mb 4096 --max-output-bytes 5000000 -- pnpm run build
   ```
2. Add wall-timeout wrapper for entire verify script (e.g. 900s total).
3. Document in `docs/DEV_COLD_START_KNOWLEDGE.md` §6.

## Phase 2 — Pin test runners (P2)

1. Add `tsx` to `devDependencies`.
2. Change scripts to `tsx lib/pricing/estimate.test.ts` (no `pnpm dlx`).
3. Run under exec_guard in verify: `--timeout 30 --max-memory-mb 512`.

## Phase 3 — Playwright safety (P2)

1. Local: set `webServer.command` to `pnpm exec next dev -p ${PORT}` when `PLAYWRIGHT_DEV=1`.
2. CI: keep prod build but wrap with exec_guard `--timeout 300`.
3. Add `globalSetup` health check before tests start.

## Phase 4 — Media script gates (P2)

1. Add `DRY_RUN=1` default in `scripts/media/publish.mjs` unless `--confirm` passed.
2. Cross-check `NEEDS-ANDY/GATES.yaml` before real upload.
3. Log intended bucket/prefix before write.

## Phase 5 — Audit URL allowlist (P3)

1. In `pre-release-browser-audit.mjs` and `adversarial-audit-probes.mjs`, reject hosts outside `localhost`, `127.0.0.1`, `*.vercel.app` preview pattern unless `--force`.

## Phase 6 — Node exec_guard seam (optional)

Consider thin Node wrapper `scripts/run-guarded.mjs` calling Python exec_guard for cross-platform agent use without Python harness.

## Verification

```bash
python -m agentic.exec_guard --timeout 10 -- python -c "print('ok')"
npm run verify   # after wrapping build
pnpm run test:e2e -- --project=chromium tests/e2e/prospect-journey.spec.ts
```
