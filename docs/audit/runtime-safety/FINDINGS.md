# Runtime Safety — Findings

**Mode:** discovery (read-only) | **Date:** 2026-09-01

## Summary

| Priority | Open |
|----------|------|
| P0 | 0 |
| P1 | 2 |
| P2 | 3 |
| P3 | 1 |

---

### F-RS-001 — `npm run verify` runs uncapped production build

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Non-termination |
| Status | Open |
| Agent-invocable | **Yes** |

**Evidence:** `scripts/verify.mjs` line 75: `execSync('pnpm run build', { stdio: 'pipe' })` with no timeout, memory cap, or exec_guard wrapper.

**Impact:** Hung or runaway build can block agent sessions indefinitely; stdout buffered in memory via `pipe`.

**Recommended guard:** `python -m agentic.exec_guard --timeout 600 --max-memory-mb 4096 -- pnpm run build`

---

### F-RS-002 — Node/npm scripts bypass `exec_guard` entirely

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Enforcement gap |
| Status | Open |
| Agent-invocable | **Yes** |

**Evidence:** `agentic/exec_guard.py` and `agentic/harness.py` exist but `verify.mjs`, Playwright, Lighthouse, and media scripts invoke subprocesses directly.

**Impact:** Documented safety seatbelt does not protect the primary agent verification path on this Node spoke.

---

### F-RS-003 — Playwright webServer forces full build per test session

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Process blast radius |
| Status | Open |
| Agent-invocable | **Yes** |

**Evidence:** `playwright.config.ts` `webServer.command`: `pnpm run build && pnpm exec next start -p ${PORT}`; `timeout: 300_000`.

**Impact:** 5+ minute startup; saturates CPU during parallel agent work; no exec_guard memory cap on build step.

**Recommended guard:** Reuse `next dev` locally; cap build with exec_guard in CI only.

---

### F-RS-004 — `pnpm dlx tsx` fetches unpinned runner during verify

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Security-of-execution |
| Status | Open |
| Agent-invocable | **Yes** |

**Evidence:** `package.json` `test:pricing` and `test:careers-math` use `pnpm dlx tsx` without lockfile pin.

**Impact:** Supply-chain risk; network dependency during verify gate.

**Fix:** Add `tsx` to devDependencies; invoke directly.

---

### F-RS-005 — Media publish scripts touch real GCS without sandbox guard

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | External side effects |
| Status | Open |
| Agent-invocable | **Yes** (via `media:publish`) |

**Evidence:** `scripts/media/publish.mjs`, `upload.mjs` — writes to `gs://site_photo_storage` per docs.

**Impact:** Mis-run publish could overwrite production assets.

**Fix:** Require explicit `NEEDS-ANDY` gate or `--dry-run` default for agents.

---

### F-RS-006 — Audit scripts can target production/preview URLs without confirmation

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | External side effects |
| Status | Open |
| Agent-invocable | **Yes** |

**Evidence:** `scripts/pre-release-browser-audit.mjs` defaults `AUDIT_BASE_URL` to `http://localhost:3001` but accepts any URL; adversarial probes ditto.

**Impact:** Accidental load against production if env mis-set.

**Fix:** Allowlist hosts in script; require `--i-know-what-im-doing` for non-localhost.
