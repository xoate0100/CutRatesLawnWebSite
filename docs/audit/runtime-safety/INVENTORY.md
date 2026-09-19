# Runtime Safety — Inventory

**Audit:** `audit-runtime-safety` | **Mode:** discovery | **Stack:** next | **Date:** 2026-09-01

## Agent-invocable execution paths

| Path | Invoker | Timeout / guard | Touches external |
|------|---------|-----------------|------------------|
| `npm run verify` → `scripts/verify.mjs` | Agents, CI | **None** — runs full `pnpm run build` | No |
| `pnpm run test:pricing` | verify.mjs | via `pnpm dlx tsx` | Network fetch for tsx |
| `pnpm run test:careers-math` | verify.mjs | via `pnpm dlx tsx` | Network fetch for tsx |
| `pnpm run test:e2e` | Manual / CI | Playwright 60s/test; webServer 300s | Local server only |
| `pnpm run build` | verify, Playwright webServer | No wall cap in verify | No |
| `scripts/pre-release-browser-audit.mjs` | `audit:browser` | **None** | Live URL if `AUDIT_BASE_URL` set |
| `scripts/adversarial-audit-probes.mjs` | `audit:adversarial` | **None** | Live URL |
| `scripts/lighthouse-redesign.mjs` | Manual | Chrome launch; no exec_guard | Local URL |
| `scripts/media/*.mjs` | `media:publish` etc. | **None** | GCS, real bucket |
| `agentic/exec_guard.py` | Harness (`agentic/harness.py`) | 300s default, memory/output caps | Subprocess only |
| `agentic/harness.py` | Meta-framework | Uses `run_guarded()` | — |

## Playwright safety config

| Setting | Value | Risk note |
|---------|-------|-----------|
| `fullyParallel` | `false` | Safer for local |
| `workers` | `1` | Limits CPU saturation |
| `timeout` | `60_000` ms per test | Adequate |
| `webServer.command` | `pnpm run build && next start` | **Full prod build every run** — 300s startup budget |
| `reuseExistingServer` | `!process.env.CI` | Good for local iteration |
| `forbidOnly` | CI only | Prevents `.only` leaks |

## verify.mjs checks

1. Scaffold marker, feature flags, decision registry, AI context, cold-start doc
2. Decision registry validation script
3. Pricing + careers math tests
4. globals.css import check
5. Governance path drift
6. **Full production build** (`pnpm run build` with `CI=true`)

**Does not use `exec_guard`.** No wall-timeout on build.

## Hazard classes observed (static)

| Class | Location | Severity |
|-------|----------|----------|
| Unbounded subprocess (build) | `verify.mjs`, Playwright webServer | Medium |
| `pnpm dlx` unpinned fetch | `test:pricing`, `test:careers-math` | Low |
| Media scripts → real GCS | `scripts/media/upload.mjs` | High if misconfigured |
| In-memory Maps (lead rate limit) | `app/api/lead/route.ts` | Not machine-kill; cold-start reset |
| No output cap on build stdout | `verify.mjs` `stdio: 'pipe'` | Low — build output buffered in memory |
| Audit scripts against production URL | `AUDIT_BASE_URL` env | Medium — read-only but hammers preview |

## Enforcement pair

- `agentic/exec_guard.py` — full implementation with Limits dataclass, JSONL log at `6_ai_runtime_context/EXEC_GUARD_LOG.jsonl`
- `agentic/harness.py` — wraps tool invocations with `run_guarded()`
- **Node scripts and npm verify bypass exec_guard**
