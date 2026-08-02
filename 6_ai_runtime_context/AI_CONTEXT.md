# AI Execution Context — Auto-Generated

**Generated:** 2026-08-01 19:39:58
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

- **DEC-0001-LAYOUT-PRESET**: Keep flat nextjs_root layout (app/, components/, lib/, hooks/) at repo root.
- **DEC-0002-VERIFY-GATE**: Use npm-based verify gate (scripts/verify.mjs) instead of full Python
- **DEC-0004-AGENTIC-SPOKE-DEPTH**: Adopt slim L2.5 spoke: governance dirs, decision registry, cursor rules,
- **DEC-0005-SHADCN-UI-PATTERN**: Continue using shadcn/ui components in components/ui/. New UI primitives
- **DEC-0006-QUALITY-HARDENING**: Phase 2 quality hardening completed: strict TypeScript and ESLint during

---

## Forbidden resurrection keywords

_None._

---

## Drift vectors

- `DV_RESTRUCTURE_WITHOUT_DECISION`
- `DV_BUILD_STRICTNESS_CREEP`
- `DV_GOVERNANCE_PATH_DRIFT`
- `DV_POINTER_WITHOUT_DELIVERABLES`
- `DV_BUSINESS_LOGIC_REWRITE`
- `DV_DOC_LIFECYCLE_DRIFT`

---

## Session checklist

1. Read `docs/DEV_COLD_START_KNOWLEDGE.md`
2. Query decisions before architectural changes
3. Stay within write paths above
4. Run `npm run verify` before marking work complete

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

You are the single authorized agent (Cursor). Execute multi-step plans end-to-end within scope.

## Allowed

- Read `6_ai_runtime_context/ACTIVE_PLAN.yaml` and execute tasks sequentially.
- Write/refactor only in paths listed in `0_phase0_bootstrap/feature_flags.yml` → `permissions.write_to`.
- Run `npm run verify` and fix failures autonomously before considering work complete.
- Commit autonomously only when verification passes.

## Required

### Session start

1. Read `6_ai_runtime_context/AI_CONTEXT.md`.
2. Read `docs/DEV_COLD_START_KNOWLEDGE.md` before implementing features.
3. Query `5_reference_architectures/DECISION_REGISTRY.yaml` before architectural changes.

### Commits
...
