# Documentation — Findings

**Mode:** discovery (read-only) | **Date:** 2026-09-01

## Summary

| Priority | Open |
|----------|------|
| P0 | 0 |
| P1 | 0 |
| P2 | 4 |
| P3 | 2 |

---

### F-DOC-001 — AI_CONTEXT.md stale relative to current state

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Agentic context freshness |
| Status | Open |

**Evidence:** `6_ai_runtime_context/AI_CONTEXT.md` generated 2026-08-01; shows `Maturity: unknown`, `Layout: unknown`. OUTSTANDING_TASKS updated 2026-08-27 with careers media and atmosphere completions not reflected.

**Impact:** Agents may miss current backlog priorities and completed work.

---

### F-DOC-002 — README package manager mismatch

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | README accuracy |
| Status | Open |

**Evidence:** README uses `npm install` / `npm run dev`; `package.json` has `"packageManager": "pnpm@10.26.0"` and `scripts/verify.mjs` invokes `pnpm run build`.

**Impact:** New contributors hit wrong install path; verify gate expects pnpm.

---

### F-DOC-003 — Cold-start doc understates route count and script surface

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Onboarding path |
| Status | Open |

**Evidence:** `docs/DEV_COLD_START_KNOWLEDGE.md` §5 lists "33 static pages"; repo has 64 `page.tsx` files. Scripts table omits `test:e2e`, `media:*`, `audit:*` commands present in `package.json`.

**Impact:** Agents underestimate scope; may skip available verification tools.

---

### F-DOC-004 — No CLAUDE.md or AGENTS.md entry point

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Agentic context |
| Status | Open |

**Evidence:** Files not present at repo root. Cursor rules point to `AI_CONTEXT.md` and cold-start doc only.

**Impact:** Non-Cursor agents lack a single root pointer file.

---

### F-DOC-005 — Sparse JSDoc on public lib exports

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Public API docs |
| Status | Open |

**Evidence:** Key modules (`lib/ghl.ts`, `lib/pricing/estimate.ts`, `lib/media.ts`) lack param/return docs. Careers registry is an exception with good header comment.

**Impact:** Higher friction for agents implementing integrations.

---

### F-DOC-006 — Historical docs may contradict current stack

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Stale docs |
| Status | Open |

**Evidence:** `docs/radix-ui-migration.md`, `docs/redesign/*` describe migration phases that may be complete. Cold-start still references "v0-generated UI scaffold" as primary framing.

**Impact:** Agents may follow obsolete migration steps.
