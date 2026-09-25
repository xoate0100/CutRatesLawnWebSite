---
name: audit-dependencies
description: "Dependencies & stack currency - versions, lockfile, tooling, engine constraints, unused deps"
---

<!-- Ported from this repo's .cursor/commands/audit-dependencies.md. Body below is verbatim. -->

## How to run this in Trae

- Invocation args: "[--fix] [--scope <path>]". Default mode is discovery (read-only).
- Shared flow: audit-suite-core/_skeleton.md (repo-local wins over global).
- Registry: this repo's .cursor/commands/AUDIT_REGISTRY.yaml (repo wins over global).
# /audit-dependencies — dependencies & stack currency

Follow the shared flow in `_skeleton.md`. Currency/maintenance/tooling lens.
CVE/vulnerability scanning belongs to `/audit-security-nist` — don't duplicate it
here; reference its findings.

## Inventory
Manifest + lockfile (`package.json`/`pnpm-lock.yaml`, or `requirements.txt` on
Python spokes); declared engines; tooling config (lefthook/husky, eslint,
prettier, tsconfig, CI). Note the target stack: Next 16.2.10 / React 19 /
TypeScript / Tailwind 4 / shadcn / pnpm.

## Checks
- **Outdated** — direct deps behind latest; distinguish patch/minor/major;
  flag end-of-life or unmaintained packages.
- **Deprecated / abandoned** — deprecated packages; better-maintained alternatives.
- **Lockfile integrity** — lockfile committed, in sync with manifest, single
  package manager (no mixed npm/pnpm/yarn lockfiles).
- **Engine / peer conflicts** — Node/React/TS version alignment; unmet or
  conflicting peer deps; `engines` pinned.
- **Unused / duplicate** — declared-but-unimported deps; multiple versions of the
  same lib bloating the tree.
- **Breaking-change exposure** — pending majors and the migration cost/risk;
  React 19 / Tailwind 4 / Next 16 gotchas.
- **Tooling config** — lint/format/type-check/hooks present and passing; CI runs
  them; consistent with the initializer standards.

## Evidence
Package + current vs available version + risk note per finding. Group upgrades by
risk in the remediation plan (safe patch batch vs breaking majors).
