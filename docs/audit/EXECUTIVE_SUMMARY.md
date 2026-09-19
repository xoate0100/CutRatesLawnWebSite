# Executive Summary — Release Readiness

**Date:** 2026-09-01  
**Mode:** discovery (`/audit-all`)  
**Verdict:** **Not release-ready**

## Gate counts

| Priority | Open (de-duplicated) | Meaning |
|----------|---------------------:|---------|
| **P0** | **1** | Security / data exposure — fix before any prod promotion |
| **P1** | **14** | Broken core workflow, auth gap, or ops blocker |
| P2 | 24+ | Incomplete wiring, SEO, media, polish |
| P3 | 12+ | Docs, hardening, nice-to-have |

**Security gate:** NOT security-ready (1 P0 + multiple P1 security items). Defer to [security/FINDINGS.md](security/FINDINGS.md).

## What works

- **Quote + contact** POST to `/api/lead` with Zod validation, honeypot, idempotency, and GHL upsert code (`lib/ghl.ts`).
- **Careers portal** shipped with truth-first copy, interactive tools, and E2E tool tests — but apply is still `mailto:` only.
- **Mobile core paths** (`/`, `/quote`) pass adversarial responsive probes (41/41, Aug 2026).
- **Media pipeline** operational — 30 assets on GCS, careers slots bound to interim licensed imagery.
- **`pnpm run verify`** passes locally (build, governance, pricing + careers math).

## Top blockers (P0 / P1)

1. **P0 — Public debug APIs leak config** (`/api/google-reviews-debug`, `/api-debug`, verbose `/api/health`). Remove or gate in production.
2. **P1 — GHL not on Vercel prod** (`GHL-OPS-001`). Lead API returns 503 without fallback — quotes/contacts may not reach CRM.
3. **P1 — GHL workflows missing** (`GHL-WF-001`). Tags fire; no staff nurture automation.
4. **P1 — Next.js 14.2.35 high CVEs** — 11 high npm advisories; upgrade path to ≥15.5.16 required.
5. **P1 — Vercel uses npm + legacy-peer-deps** while CI uses pnpm — prod tree may diverge from lockfile.
6. **P1 — Mock auth + broken account path** — demo credentials in `lib/auth.ts`; middleware/cookie mismatch.
7. **P1 — Careers apply is mailto-only** — no CRM capture; fails on devices without mail client.
8. **P1 — No sitemap/robots; JSON-LD unwired** — SEO discovery gap.
9. **P1 — PII logged** in legacy `/api/contact` and helpers.
10. **P1 — No global security headers** (CSP, HSTS, frame options).

## Recommended next actions

1. **Human ops (today):** Vercel `GHL_*` secrets + GHL workflow smoke test.
2. **Phase 0 security:** Strip/gate debug routes; redact PII logs; add baseline headers.
3. **Phase 1 journeys:** Wire careers apply → `/api/lead` with `source:careers`; remove mock auth.
4. **Phase 2 platform:** Align Vercel on pnpm; plan Next security upgrade.
5. **Follow-up:** `/audit-all --fix` or domain `--fix` runs using [REMEDIATION_PROMPT.md](REMEDIATION_PROMPT.md).
