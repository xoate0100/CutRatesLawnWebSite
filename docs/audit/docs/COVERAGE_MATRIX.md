# Documentation — Coverage Matrix

| Area | Checked | Result | Evidence |
|------|---------|--------|----------|
| README setup accuracy | Partial | **Gap** — npm vs pnpm | `README.md`, `package.json` |
| Script references in README | Partial | Missing e2e, media, audit scripts | `package.json` scripts |
| Cold-start doc accuracy | Partial | Says 33 pages; repo has 64 `page.tsx` | glob count |
| AI_CONTEXT freshness | Yes | **Stale** — Aug 2026, maturity "unknown" | `AI_CONTEXT.md` header |
| ACTIVE_PLAN ↔ OUTSTANDING_TASKS sync | Yes | **Pass** | both reference GHL tasks |
| Decision registry coverage | Yes | **Pass** for major forks | 6 DEC entries |
| CLAUDE.md / AGENTS.md | Yes | **Missing** | — |
| Integration docs (GHL) | Yes | **Pass** | `docs/integrations/GOHIGHLEVEL.md` |
| Media pipeline docs | Yes | **Pass** | `docs/media/MEDIA_PIPELINE.md` |
| Careers copy governance doc | Yes | **Pass** | YAML guidelines |
| Public API JSDoc | Yes | **Gap** | sparse |
| Stale/orphan docs | Partial | `docs/radix-ui-migration.md`, redesign docs may be historical | — |
| New contributor → running app | Partial | README works with npm; pnpm preferred | — |
| Regeneration command documented | Yes | **Pass** | `npm run agentic:context` |

**Coverage score:** 6 / 14 areas fully passing.
