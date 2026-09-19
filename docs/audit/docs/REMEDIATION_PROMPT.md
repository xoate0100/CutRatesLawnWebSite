# Documentation — Remediation Prompt

Run with `/audit-docs --fix`.

## Phase 1 — Agentic context refresh (P2)

1. Run `npm run agentic:context` to regenerate `AI_CONTEXT.md`.
2. Manually fix `Maturity` and `Layout` fields in generator template if still "unknown".
3. Sync `ACTIVE_PLAN.yaml` task statuses with `OUTSTANDING_TASKS.yaml` (careers media, atmosphere).

## Phase 2 — README and cold-start alignment (P2)

1. Update `README.md` to prefer `pnpm install` / `pnpm run dev` with npm as fallback.
2. Add scripts table rows: `test:e2e`, `media:publish`, `audit:browser`, `verify`.
3. Update `docs/DEV_COLD_START_KNOWLEDGE.md` §5 route table or replace with "see `app/` glob" note (~64 routes).
4. Add pointer to `docs/cut_rates_careers_copy_guidelines.yaml` in cold-start §7.

## Phase 3 — Agent entry files (P2)

1. Add root `AGENTS.md` pointing to:
   - `docs/DEV_COLD_START_KNOWLEDGE.md`
   - `6_ai_runtime_context/AI_CONTEXT.md`
   - `6_ai_runtime_context/OUTSTANDING_TASKS.yaml`
   - `.cursor/rules/agentic-session.mdc`
2. Optional: symlink or duplicate as `CLAUDE.md` for Claude Code users.

## Phase 4 — API docs (P3)

1. Add JSDoc to `lib/ghl.ts`, `lib/media.ts`, `lib/pricing/estimate.ts` public exports.
2. Document `/api/lead` contract in `docs/integrations/GOHIGHLEVEL.md` or new `docs/api/LEAD.md`.

## Phase 5 — Doc lifecycle (P3)

1. Archive completed redesign docs to `docs/redesign/archive/` or add "status: complete" banner.
2. Mark `docs/radix-ui-migration.md` as historical if migration is done.

## Verification

```bash
npm run agentic:context
npm run verify
# New clone test: pnpm install && pnpm run dev
```
