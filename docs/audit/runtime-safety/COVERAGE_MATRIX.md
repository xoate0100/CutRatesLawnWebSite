# Runtime Safety — Coverage Matrix

| Hazard class | Checked | Result | Evidence |
|--------------|---------|--------|----------|
| Non-termination / runaway compute | Yes | **Gap** — verify build uncapped | `verify.mjs` |
| Memory blowup | Partial | exec_guard has cap; verify does not | `exec_guard.py` |
| Unclosed handles | Suspected | Not traced | — |
| Pipe deadlock (child stdout) | Yes | **Pass** in exec_guard | drains stdio |
| Disk fill (artifacts) | Partial | `artifacts/audit/` untracked PNGs | git status |
| Destructive FS ops | Partial | media scripts write GCS | `scripts/media/` |
| Fork bomb / subprocess spawn | Partial | exec_guard `max_subprocesses: 64` | defaults |
| Production service side effects | Yes | **Gap** — media publish, audit URL | env-dependent |
| `eval` / dynamic exec | Yes | **Pass** — not found in scripts | grep |
| Test timeouts | Yes | **Pass** — Playwright 60s | `playwright.config.ts` |
| exec_guard on agent paths | Partial | Python harness only | Node bypass |
| Determinism | Partial | E2E uses real build | — |
| Cleanup on failure | Partial | Playwright retains traces | `retain-on-failure` |

**Coverage score:** 4 / 13 areas fully passing.
