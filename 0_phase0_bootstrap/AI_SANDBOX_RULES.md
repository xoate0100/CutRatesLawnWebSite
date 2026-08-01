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

- Include traceability tags: `plan:<plan_id> component:<component> task:<id>`.
- Commit incrementally (every 3–5 tasks or after a logical unit).
- See `docs/COMMIT_STRATEGY.md`.

### Documentation

- Update `docs/*` when behavior or structure changes.
- Regenerate context: `npm run agentic:context`.

## Forbidden

- Editing `0_phase0_bootstrap/` or `5_reference_architectures/` directly (use `proposals/` for new decisions).
- Changing CI/CD deployment config without human review.
- Modifying `.env` or secrets.
- Using `--no-verify` on git hooks (when installed).
- Re-introducing keywords from `DECISION_REGISTRY.yaml` `resurrection_trigger_keywords`.

## Failure protocol

1. Attempt local fix within current task scope.
2. If failure persists after two attempts: append to `6_ai_runtime_context/ai_feedback_log.json` and stop.
3. Do not delete or rewrite existing working page code to fit patterns — wrap, extend, or add alongside.
