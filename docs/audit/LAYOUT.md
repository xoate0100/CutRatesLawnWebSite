# Audit layout contract

**Suite SoT (current):**
- `EXECUTIVE_SUMMARY.md` — release-readiness verdict (only this name at root)
- `FINDINGS.md` — merged open/closed register (SoT after merge)
- `INDEX.md` — which commands ran / skipped
- `COVERAGE_MATRIX.md` — domain × coverage
- `REMEDIATION_PROMPT.md` — phased `--fix` prompt

**Domain packs:** `docs/audit/<domain>/{INVENTORY,FINDINGS,COVERAGE_MATRIX,REMEDIATION_PROMPT}.md`

**Archive:** Older numbered packs and pre-suite registers live under `docs/audit/archive/`. Do not treat archive copies as current.
