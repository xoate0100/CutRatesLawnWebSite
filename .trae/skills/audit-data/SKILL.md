---
name: audit-data
description: "Database & storage audit - Supabase schema/migrations/RLS design, indexes, CDN/storage strategy"
---

<!-- Ported from this repo's .cursor/commands/audit-data.md. Body below is verbatim. -->

## How to run this in Trae

- Invocation args: "[--fix] [--scope <path>]". Default mode is discovery (read-only).
- Shared flow: audit-suite-core/_skeleton.md (repo-local wins over global).
- Registry: this repo's .cursor/commands/AUDIT_REGISTRY.yaml (repo wins over global).
# /audit-data — database & storage audit

Follow the shared flow in `_skeleton.md`. Design/perf/integrity lens on data.
RLS *security* enforcement hands to `/audit-security-nist`; here RLS is reviewed
for correctness and performance. Supabase MCP available when connected.

## Inventory
Schemas/tables/columns and relationships; migrations (`supabase/migrations/`);
RLS policies; indexes; storage strategy (Supabase vs external — note SureWealth
media lives on **Google Cloud Storage + secure CDN**, not Supabase Storage); any
self-hosted db.

## Checks
- **Migration integrity** — migrations are ordered, reversible where feasible,
  and reflect the live schema; no drift between migrations and deployed db; no
  destructive migration without a guard.
- **RLS design** — policies exist for every table exposed to the client, are
  correct, and don't cause N+1 or full-scan performance cliffs.
- **Indexes & queries** — missing indexes on filtered/joined/ordered columns;
  N+1 access patterns; unbounded queries; missing pagination.
- **Constraints & integrity** — FKs, uniqueness, not-null, enums/check
  constraints; orphaned rows; data that violates intended invariants.
- **Storage strategy** — correct bucket/CDN routing; public vs signed access;
  cache headers/TTL on the CDN; no large blobs in Postgres that belong on CDN.
- **Backup / restore** — a restore path exists and is documented; PITR where
  warranted.
- **Data lifecycle** — soft vs hard delete consistency; retention; no orphaned
  storage objects after row deletion.

## Evidence
Table/policy/query + `explain`/measurement where possible per finding.
