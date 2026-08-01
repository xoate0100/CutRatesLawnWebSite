# Commit Strategy

## Traceability format

Every commit for plan-tracked work must include:

```
plan:<plan_id> component:<component> task:<id>
```

**Example:**
```
plan:agentic-upgrade-phase-1 component:web task:4

Add Cursor rules and verification scripts
```

## Frequency

- Commit after completing each logical unit (feature, fix, or plan task).
- Commit every 3–5 tasks when working through `ACTIVE_PLAN.yaml`.
- If more than 20 files change since last commit, commit before continuing.

## Verification before commit

1. Run `npm run verify`
2. Fix failures; do not use `--no-verify`
3. Regenerate context if governance files changed: `npm run agentic:context`

## What to commit together

- Code + related docs in the same commit when behavior changes.
- Governance scaffold files can be grouped by plan task.
- Never commit `.env`, `.vs/`, or `node_modules/`.

## Protected branches

- Use PRs for `main`/`master`; agent does not force-push.
