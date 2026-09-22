# Coverage matrix — `/audit-all` 2026-09-22

| Domain | Ran | Key areas covered | Gaps |
|--------|-----|-------------------|------|
| security | Partial | CSP, debug routes, Turnstile consistency | Full NIST control walk, auth IDOR |
| completeness | Partial | Referral, certs, deep-link address, portal | Careers mailto, mock auth residual |
| uiux | No | — | Responsive adversarial not re-run |
| media | Partial | Slot duplicate/wrong asset | Full slot inventory |
| optimization | No | — | CWV/Lighthouse not re-run |
| journey | Partial | Quote steps, thank-you rid gate | Full multi-service E2E in CI |
| conversion | Partial | GTM env, funnel memo, consent note | Live GTM after redeploy |
| seo | Partial | SITE_URL, SSR H1 cause | Post-deploy sitemap crawl |
| integrations | Partial | GHL env present; Turnstile/Upstash absent | Live GHL-TEST-001 |
| data | No | — | — |
| infra | Partial | Vercel env list | Installer npm vs pnpm |
| dependencies | No | — | Prior CVE list retained |
| observability | Partial | Debug removal | Structured logging review |
| docs | No | — | — |
| runtime-safety | Partial | next build green | Nested verify guard flake |

**Critical workflows tested this pass:** env inventory (yes), live GTM state pre-fix (yes), SSR root cause (code), lead E2E (no — avoided real CRM write).
