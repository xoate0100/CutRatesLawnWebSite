# Agentic Upgrade Plan — CutRatesLawnWebSite

**Migration completed:** 2026-07-15  
**Final verification:** `npm run verify` — PASSED  
**Reference projects:** `kiwi_project` (stateful_documenter), `project_initializer`  
**Maturity target:** L2.5 Single-Agent Sandbox (slim spoke)  
**Layout preset:** `nextjs_root`

---

## Current State Summary

| Aspect | State |
|--------|-------|
| **Stack** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix) |
| **Structure** | Flat Next.js root: `app/`, `components/`, `lib/`, `hooks/`, `public/`, `styles/` |
| **Package manager** | npm (`package-lock.json`) |
| **Build** | `next build` with strict TS + ESLint (DEC-0006) |
| **Lint** | `next lint` — no ESLint config (interactive prompt) |
| **Tests** | None |
| **CI** | None |
| **Agentic scaffolding** | None (no `.cursor/`, no decision registry, no runtime context) |
| **Docs** | No README; pages are marketing content only |

---

## Pattern Inventory → Gap Analysis

| # | Pattern | Status | Proposed Adaptation | Risk |
|---|---------|--------|---------------------|------|
| 1 | Governance hierarchy (constitution > state > context > chat) | Absent | `0_phase0_bootstrap/AI_SANDBOX_RULES.md` + `docs/DEV_COLD_START_KNOWLEDGE.md` | Low |
| 2 | Feature flags / permission registry | Absent | `0_phase0_bootstrap/feature_flags.yml` adapted for `nextjs_root` paths | Low |
| 3 | MVP specification (programming) | Absent | `0_phase0_bootstrap/MVP_SPECIFICATION.yaml` | Low |
| 4 | Cold-start knowledge base | Absent | `docs/DEV_COLD_START_KNOWLEDGE.md` | Low |
| 5 | Documentation index | Absent | `docs/MASTER_INDEX.md` | Low |
| 6 | Decision registry (ADR-as-data) | Absent | `5_reference_architectures/DECISION_REGISTRY.yaml` + `proposals/` | Low |
| 7 | Drift vectors catalog | Absent | `5_reference_architectures/DRIFT_VECTORS.yaml` | Low |
| 8 | Agent role graph | Absent | `5_reference_architectures/AGENT_REGISTRY.yaml` (simplified) | Low |
| 9 | AI runtime context (ACTIVE_PLAN, pointer) | Absent | `6_ai_runtime_context/` directory | Low |
| 10 | Auto-generated AI_CONTEXT.md | Absent | `scripts/generate-ai-context.mjs` | Low |
| 11 | Cursor rules (.mdc) | Absent | `.cursor/rules/agentic-*.mdc` | Low |
| 12 | Commit strategy / traceability tags | Absent | `docs/COMMIT_STRATEGY.md` + cursor rule | Low |
| 13 | Pre-commit hook stack (Python) | Absent | **Deferred** — use `npm run verify` smoke gate instead (no Python dep) | Low |
| 14 | Intent declaration contract | Absent | **Deferred** — overkill for marketing site spoke | Low |
| 15 | TDD enforcement gate | Absent | **Partial** — document in sandbox rules; no blocking until tests exist | Med |
| 16 | CI workflow | Absent | `.github/workflows/ci.yml` (build + verify) | Low |
| 17 | ESLint / lint gate | Partial | Add `.eslintrc.json` (Next.js strict) | Low |
| 18 | Meta-framework version manifest | Absent | `0_phase0_bootstrap/META_FRAMEWORK_VERSION.yaml` | Low |
| 19 | Bootstrap layout guidance | Absent | `6_ai_runtime_context/BOOTSTRAP_LAYOUT_GUIDANCE.md` | Low |
| 20 | Hub-and-spoke template updates | Absent | **Deferred** — spoke is self-contained | Low |
| 21 | Feedback loop to hub | Absent | **Deferred** | Low |
| 22 | JSON Schema validation layer | Absent | **Partial** — lightweight Node validators in `scripts/` | Low |
| 23 | README agent router | Absent | `README.md` with onboarding links | Low |
| 24 | Initialization marker (idempotency) | Absent | `.agentic-initialized` | Low |

### Analogies (reference → this repo)

| Reference pattern | This repo equivalent |
|-------------------|---------------------|
| `frontend/` component root | `app/`, `components/`, `lib/`, `hooks/` at repo root |
| Python `3_bootstrap_scripts/cli.py` | `npm run agentic:*` + `scripts/*.mjs` |
| `.pre-commit-config.yaml` (14 hooks) | `npm run verify` (build + registry + drift checks) |
| `enforce_tdd_cycle` pre-commit | Documented in sandbox rules; enforced when `tests/` exists |
| `INTENT_DECLARATION.json` | Not needed for static marketing site; use decision registry proposals |
| Kiwi three-plane architecture | N/A — replaced by Next.js App Router page/component conventions |
| `phase_gate.py` | Documented phase scope in `MVP_SPECIFICATION.yaml`; manual override |

---

## REQUIRES HUMAN REVIEW

| Item | Status | Notes |
|------|--------|-------|
| Enable TypeScript strict build | **Done** | `ignoreBuildErrors: false` (DEC-0006) |
| Enable ESLint during build | **Done** | `ignoreDuringBuilds: false` (DEC-0006) |
| Fix `themeColor` metadata warnings | **Done** | Moved to `viewport` export in `app/layout.tsx` |
| Deploy / Vercel configuration | **Done** | `vercel.json` added; uses `npm run verify` as build |
| `.env` / secrets configuration | **User** | Copy `.env.example` → `.env` and fill values |
| Full Python pre-commit stack | **Deferred** | DEC-0002; npm verify gate sufficient for spoke |

---

## Execution Plan

| # | Item | Status | Verification |
|---|------|--------|--------------|
| 1 | Create `AGENTIC_UPGRADE_PLAN.md` | verified | File exists |
| 2 | Scaffold `0_phase0_bootstrap/` (flags, sandbox, MVP, version) | verified | YAML/MD parse OK |
| 3 | Scaffold `5_reference_architectures/` (decisions, drift, agents) | verified | `npm run agentic:validate-registry` exit 0 |
| 4 | Scaffold `6_ai_runtime_context/` (plan, pointer, context, log) | verified | Files exist; context generated |
| 5 | Add `docs/` (cold-start, index, commit strategy) | verified | Links resolve |
| 6 | Add `.cursor/rules/` (session, commit, nextjs) | verified | Files exist |
| 7 | Add `scripts/` (verify, generate-context, validate-registry) | verified | `npm run verify` exit 0 |
| 8 | Add `README.md` agent router | verified | File exists |
| 9 | Add `.eslintrc.json` + update `package.json` scripts | verified | `npm install` + verify pass |
| 10 | Add `.github/workflows/ci.yml` | verified | YAML valid |
| 11 | Seed decision registry with migration decisions | verified | 5 decisions in registry |
| 12 | Write `.agentic-initialized` marker | verified | Idempotency marker present |
| 13 | Full-repo verification pass | verified | `npm run verify` exit 0 |

---

## Idempotency

Re-running this migration:
1. Checks `.agentic-initialized` and `0_phase0_bootstrap/META_FRAMEWORK_VERSION.yaml`
2. Skips scaffold files that already exist (unless version bump needed)
3. Regenerates `6_ai_runtime_context/AI_CONTEXT.md` from sources
4. Appends new decisions only if not already present in registry
