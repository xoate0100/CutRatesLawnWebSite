---
name: audit-suite-core
description: "Shared spine for Andy's audit-* skills: execution contract, finding schema, severity model, output layout, registry, release runbooks (repo-local copy)."
---

# audit-suite-core (repo-local)

Support files for the audit-* skills, ported from this repo's .cursor/commands/.

| File | Purpose |
|------|---------|
| `_skeleton.md` | Shared execution contract every audit-* skill follows |
| `AUDIT_REGISTRY.yaml` | Ids, applies_to stack gates, output_dir, depends_on |
| `README.md` | Suite index |
| `_release-audit-suite.md` | Release runbook |
| `_release-runtime-safety.md`, `_ship-runtime-safety.md` | Runtime-safety runbooks |
| `validate_registry.mjs` (+ `.test.mjs`) | Registry validator |

Rules:
- Repo-local copy wins over the global copy under %USERPROFILE%\.trae\skills.
- Default mode is discovery (read-only). --fix only when Andy explicitly asks.
- Irreversible or cross-repo actions route through NEEDS-ANDY/GATES.yaml when present.
