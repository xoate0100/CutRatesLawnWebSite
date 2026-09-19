# AI Execution Context — Auto-Generated

**Generated:** 2026-09-03 04:36:14
**Authority:** `0_phase0_bootstrap/AI_SANDBOX_RULES.md`
**Purpose:** Consolidated constraint context for AI sessions

> Regenerate: `npm run agentic:context`

---

## Governance

**Maturity:** unknown Single-Agent Sandbox
**Layout:** unknown

### Allowed write paths
- `app//`
- `components//`
- `lib//`
- `hooks//`
- `public//`
- `styles//`
- `docs//`
- `scripts//`
- `tests//`
- `proposals//`
- `6_ai_runtime_context//`
- `.cursor//`

### Locked (proposal-only)
- `0_phase0_bootstrap/`
- `5_reference_architectures/`

---

## Current State

| Field | Value |
|-------|-------|
| Plan | `ghl-lead-workflows` |
| Component | `web` |
| Current task | GHL-OPS-001 |
| Pointer status | active |

---

## Accepted Decisions

- **DEC-0001-REPO-MODEL**: (no summary)
- **DEC-0003-ADAPTER-MODEL**: (no summary)
- **DEC-0004-HOOK-RUNNER**: (no summary)
- **DEC-0005-GOVERNANCE-RUNTIME-SPLIT**: (no summary)

---

## Forbidden resurrection keywords

_None._

---

## Drift vectors

- `DV_HOOK_BYPASS`
- `DV_GOVERNANCE_DIRECT_EDIT`
- `DV_PREMATURE_ORCHESTRATION`
- `DV_DB_FROM_API`
- `DV_SPLIT_WITHOUT_CRITERIA`
- `DV_CI_GUARDRAIL_BYPASS`

---

## Session checklist

1. Read `docs/DEV_COLD_START_KNOWLEDGE.md`
2. Query decisions before architectural changes
3. Stay within write paths above
4. Run `pnpm run verify` before marking work complete
5. Read `6_ai_runtime_context/SESSION_NOTES.md` for careers/GHL/remediation status

---

## References

| File | Role |
|------|------|
| `docs/DEV_COLD_START_KNOWLEDGE.md` | Cold-start onboarding |
| `6_ai_runtime_context/ACTIVE_PLAN.yaml` | Task plan |
| `5_reference_architectures/DECISION_REGISTRY.yaml` | Decisions |
| `AGENTIC_UPGRADE_PLAN.md` | Migration status |

---

## Sandbox rules excerpt

# AI Sandbox Execution Rules (L2.5 Single-Agent)

You are the single authorized agent (Cursor Code). You may execute multi-step plans end-to-end.

## Allowed
- Read `6_ai_runtime_context/ACTIVE_PLAN.yaml` and execute tasks sequentially.
- Write/refactor/delete only in: `frontend/`, `backend/`, `shared/`, `tests/`, `docs/`, `scripts/`, `4_docs_index/`, `3_bootstrap_scripts/` (for meta-framework upgrades only), `6_ai_runtime_context/`, `agentic/`, `proposals/`.
- Run and fix pre-commit failures autonomously.
- Commit autonomously **only** if all pre-commit hooks pass.
- **State Transitions (GOVERNED):** Update `ACTIVE_TASK_POINTER.yaml` ONLY via `auto_advance_state.py` protocol:
  - Task completion gate must pass
  - Completion report must be generated
  - Transition must be logged
  - Pointer increments by exactly +1
- Update `INTENT_DECLARATION.json` before code changes.
- Append to `6_ai_runtime_context/ai_feedback_log.json` when guardrails fail.
- Write completion reports under `6_ai_runtime_context/` (TASK_COMPLETION_REPORTS).

## Required (MANDATORY - BLOCKING)

...
