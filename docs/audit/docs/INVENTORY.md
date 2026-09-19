# Documentation — Inventory

**Audit:** `audit-docs` | **Mode:** discovery | **Stack:** next | **Date:** 2026-09-01

## Agentic context files

| File | Path | Last updated / status |
|------|------|----------------------|
| AI context (generated) | `6_ai_runtime_context/AI_CONTEXT.md` | Generated 2026-08-01 |
| Active plan | `6_ai_runtime_context/ACTIVE_PLAN.yaml` | `ghl-lead-workflows` active |
| Task pointer | `6_ai_runtime_context/ACTIVE_TASK_POINTER.yaml` | GHL-OPS-001 |
| Outstanding tasks | `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` | Updated 2026-08-27 |
| Cold start | `docs/DEV_COLD_START_KNOWLEDGE.md` | 2026-08-01 |
| Decision registry | `5_reference_architectures/DECISION_REGISTRY.yaml` | 6 accepted decisions |
| Sandbox rules | `0_phase0_bootstrap/AI_SANDBOX_RULES.md` | L2.5 spoke |
| Feature flags | `0_phase0_bootstrap/feature_flags.yml` | write_to paths |
| Migration plan | `AGENTIC_UPGRADE_PLAN.md` | Present |

## Missing agent entry points

| File | Status |
|------|--------|
| `CLAUDE.md` | **Not present** |
| `AGENTS.md` | **Not present** |
| `.mcp.json` | Not inventoried (may be user-local) |

## Project docs (`docs/`)

30 markdown/YAML files including:
- `docs/DEV_COLD_START_KNOWLEDGE.md` — primary onboarding
- `docs/integrations/GOHIGHLEVEL.md` — lead integration
- `docs/media/MEDIA_PIPELINE.md` — asset workflow
- `docs/cut_rates_careers_copy_guidelines.yaml` — careers governance
- `docs/atmosphere/*` — design system
- `docs/audit/*` — prior audit artifacts (security, completeness)

## README

- `README.md` — setup, scripts, agentic onboarding links
- Uses `npm` commands; `package.json` declares `packageManager: pnpm@10.26.0`

## Public API documentation

- Minimal JSDoc on non-trivial exports (`lib/careers/fact-registry.ts`, `lib/errors/logger.ts`)
- Most `components/` and `lib/` exports undocumented
- `schema-dts` types used in `components/json-ld.tsx` without exported docs

## Inline comments

- Governance headers in careers registry and lead API
- Legacy scaffold comments in older components
- `components/hero.tsx` debug-oriented comments

## Onboarding path test

Clone → `npm install` (README) vs `pnpm install` (lockfile) → `npm run dev` → read cold start → implement.
**Friction:** package manager mismatch.
