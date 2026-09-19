# Audit Suite Index

**Orchestrator:** `/audit-all` (discovery mode)  
**Date:** 2026-09-01  
**Stack:** `next` (Next.js 14.2.35, React 18, pnpm, Vercel)  
**Repo:** Cut Rates Lawn WebSite

## Commands run

| ID | Domain | Ran | Output |
|----|--------|:---:|--------|
| audit-security-nist | Security (NIST-aligned) | ✅ | [security/](security/) |
| audit-completeness | Incomplete / disconnected | ✅ | [completeness/](completeness/) |
| audit-uiux | Design system + UI/UX | ✅ | [uiux/](uiux/) |
| audit-media | Envato / GCS media pipeline | ✅ | [media/](media/) |
| audit-optimization | Performance / CWV | ✅ | [optimization/](optimization/) |
| audit-journey | User journey coherence | ✅ | [journey/](journey/) |
| audit-conversion | Funnel + copy | ✅ | [conversion/](conversion/) |
| audit-seo | SEO + AI discoverability | ✅ | [seo/](seo/) |
| audit-integrations | Third-party integrations | ✅ | [integrations/](integrations/) |
| audit-data | Database + storage | ✅ | [data/](data/) |
| audit-infra | Infra + deployment | ✅ | [infra/](infra/) |
| audit-dependencies | Dependencies + currency | ✅ | [dependencies/](dependencies/) |
| audit-observability | Logging + errors | ✅ | [observability/](observability/) |
| audit-docs | Documentation coverage | ✅ | [docs/](docs/) |
| audit-runtime-safety | Script execution safety | ✅ | [runtime-safety/](runtime-safety/) |

**Skipped:** None — all registry commands match the `next` stack.

## Skipped (stack gate)

None.

## Live evidence run this session

| Check | Result |
|-------|--------|
| `pnpm run verify` | ✅ PASS (build + governance + math tests) |
| `pnpm run media:validate` | ✅ OK (3 attribution warnings) |
| `pnpm run audit:links` | ❌ FAIL — no server on `127.0.0.1:3000` (needs running `next start`) |
| `pnpm audit --audit-level=high` | ❌ 11+ high advisories on `next@14.2.35` |

## Merged outputs (this folder)

- [FINDINGS.md](FINDINGS.md) — de-duplicated register across domains
- [COVERAGE_MATRIX.md](COVERAGE_MATRIX.md) — domain × ran × key areas
- [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) — release-readiness verdict
- [REMEDIATION_PROMPT.md](REMEDIATION_PROMPT.md) — phased fix prompt for `--fix` run

## Historical artifacts (pre-orchestrator)

Older single-pass audits remain for reference: `FINDINGS_REGISTER.md`, `REMEDIATION_PLAN.md`, `SYSTEM_INVENTORY.md`, `artifacts/audit/`.
