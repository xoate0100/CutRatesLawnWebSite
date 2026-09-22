# Audit INDEX — `/audit-all` 2026-09-22

**Stack:** Next.js 14 App Router (treated as `next` / `any`)  
**Mode:** discovery register refresh + Critical/High confirmation against production + Vercel env. Code remediations applied in-tree (awaiting ship).

## Commands

| Command | Ran? | Why / notes |
|---------|------|-------------|
| audit-security-nist | Partial | Confirmed CSP, debug surface, Turnstile posture; full NIST pack not re-walked end-to-end |
| audit-completeness | Partial | Deep-link address, referral TODO, certs, portal/schedule |
| audit-uiux | Skipped deep | No new UIUX crawl this pass |
| audit-media | Partial | Duplicate slots + aeration asset confirmed via `media-map.json` |
| audit-optimization | Skipped deep | SSR Suspense issue covered under journey/seo |
| audit-journey | Partial | Quote funnel, thank-you conversion gate |
| audit-conversion | Partial | GTM bake, consent default-off, funnel inflation |
| audit-seo | Partial | `NEXT_PUBLIC_SITE_URL`, empty SSR HTML |
| audit-integrations | Partial | GHL present; Turnstile/Upstash absent; Strapi 504 noted prior |
| audit-data | Skipped deep | No schema change this pass |
| audit-infra | Partial | Vercel env inventory |
| audit-dependencies | Skipped | Prior CVE notes retained |
| audit-observability | Partial | Debug routes removed |
| audit-docs | Skipped | |
| audit-runtime-safety | Partial | `npm run verify` / next build exercised |

## Domain outputs

| Domain | Path |
|--------|------|
| security | [security/](security/) |
| completeness | [completeness/](completeness/) |
| uiux | [uiux/](uiux/) |
| media | [media/](media/) |
| optimization | [optimization/](optimization/) |
| journey | [journey/](journey/) |
| conversion | [conversion/](conversion/) |
| seo | [seo/](seo/) |
| integrations | [integrations/](integrations/) |
| data | [data/](data/) |
| infra | [infra/](infra/) |
| dependencies | [dependencies/](dependencies/) |
| observability | [observability/](observability/) |
| docs | [docs/](docs/) |
| runtime-safety | [runtime-safety/](runtime-safety/) |

## Merged SoT

- [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)
- [FINDINGS.md](FINDINGS.md)
- [COVERAGE_MATRIX.md](COVERAGE_MATRIX.md)
- [REMEDIATION_PROMPT.md](REMEDIATION_PROMPT.md)
- [LAYOUT.md](LAYOUT.md)
