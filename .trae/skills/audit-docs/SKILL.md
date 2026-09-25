---
name: audit-docs
description: "Code & project documentation coverage - public APIs, ADRs, README, agentic context freshness"
---

<!-- Ported from this repo's .cursor/commands/audit-docs.md. Body below is verbatim. -->

## How to run this in Trae

- Invocation args: "[--fix] [--scope <path>]". Default mode is discovery (read-only).
- Shared flow: audit-suite-core/_skeleton.md (repo-local wins over global).
- Registry: this repo's .cursor/commands/AUDIT_REGISTRY.yaml (repo wins over global).
# /audit-docs — code & project documentation coverage

Follow the shared flow in `_skeleton.md`. Documentation completeness and accuracy.
Can be merged with `/audit-observability` into `/audit-code-quality`.

## Inventory
Public/exported APIs and their doc comments; project docs (`README`, `SETUP`,
numbered-spine docs); decision records (`DECISION_REGISTRY.yaml` / ADRs); agentic
context files (`CLAUDE.md`, `AGENTS.md`, `.mcp.json`, generated
`6_ai_runtime_context/AI_CONTEXT.md`).

## Checks
- **Public-API docs** — exported functions/components/types have accurate
  JSDoc/TSDoc where non-trivial; params/returns/throws documented.
- **README accuracy** — setup steps actually work; scripts/commands referenced
  exist; no stale instructions.
- **Decision coverage** — significant architectural choices have an ADR / registry
  entry; the registry isn't stale relative to the code.
- **Agentic context freshness** — `CLAUDE.md`/`AGENTS.md`/`AI_CONTEXT.md` reflect
  the current structure, stack, and conventions; `.mcp.json` matches available
  servers; regeneration is current.
- **Stale / orphaned docs** — docs describing removed features; contradictory docs;
  duplicate sources of truth.
- **Onboarding path** — a new contributor (or agent) can go from clone to running
  using only the docs.
- **Inline comment hygiene** — comments explain *why*, not restate *what*; no
  misleading/outdated comments.

## Evidence
File/symbol + the missing/incorrect doc per finding. Prioritize public surfaces
and agentic-context files (they steer future agent runs) over internal comments.
