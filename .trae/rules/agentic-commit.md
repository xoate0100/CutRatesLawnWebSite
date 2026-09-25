---
description: Commit discipline and traceability for plan-tracked work
globs: "**/*"
alwaysApply: false
---

# Commits must complete the verification loop

When committing work for an `ACTIVE_PLAN` task:

1. `npm run verify`
2. Commit with traceability tags in the message body or subject.

## Required message format

```
plan:<plan_id> component:<component> task:<id>
```

## Rules

- Do not use `--no-verify` on git hooks.
- Commit incrementally; see `docs/COMMIT_STRATEGY.md`.
- Update `ACTIVE_TASK_POINTER.yaml` when a task is finished.
- Regenerate `AI_CONTEXT.md` if governance files changed.
