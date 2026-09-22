# Launch-day remediation report

**Branch:** `fix/launch-day-remediation`  
**Date:** 2026-09-22  
**Prompt:** `CURSOR_PROMPT_Launch_Day_Remediation.md`

## Finding states

| # | Finding | State | Evidence |
|---|---|---|---|
| 1 | Zero analytics / GTM | **FIXED** | Live `gtm_configured:true`; `gtm.js?id=GTM-KGVZJ93G`; root cause dynamic `process.env[key]` (`1c4afc8`) |
| 2 | Empty SSR HTML | **FIXED** | AnalyticsProvider sibling Suspense; live H1 on area pages |
| 3 | SITE_URL localhost | **FIXED** | Prod sitemap hosts `cutrateslawn.com` |
| 4 | Lead delivery / memory queue | **FIXED** (code) / **STUBBED** (Upstash) | 503 when not redis; cron daily `0 13 * * *`; HUMAN H-3 Upstash |
| 5 | Turnstile partial spends token | **FIXED** | Client + server skip token on partial; TurnstileField.reset on fail |
| 5b | Turnstile pair unset | **FIXED** (agent) | CF API created widget sitekey `0x4AAAAAAFAajSF3xINA13bR`; both keys on Vercel Prod+Preview; prod redeploy `dpl_2rf6kkdjnnNJStUDG9kyCrhV1rqv` |
| 6 | CSP blocks tracking | **FIXED** | Expanded wildcards; added `https://www.gstatic.com` for GTM Consent Mode `wcm/loader.js` |
| 7 | Funnel events ~5x | **FIXED** | useAnalytics memo + once-per-step view; complete on advance |
| 8 | Phantom conversions | **FIXED** | Thank-you requires real `rid` |
| 9 | Public debug routes | **FIXED** | Routes deleted; Playwright 42 passed (`no-debug-routes` + SSR) |
| 10 | Consent opt-in | **FIXED** | Owner chose us_opt_out; `NEXT_PUBLIC_CONSENT_MODE=us_opt_out` |
| 11 | Deep-link skips address | **FIXED** | Start on details; optional address on contact if missing |
| 12 | Synthetic emails | **FIXED** | Empty email + GHL omit; schema requires phone\|email |
| 13 | Review count 24 | **FIXED** | Constant 32 (fallback); live Places still preferred later |
| 14 | JSON-LD sameAs KWCH | **FIXED** | Removed; GBP Maps URL only |
| 15 | Dead blog posts | **DEFERRED** | Strapi 504; redirects remain; needs local MDX or empty state |
| 16 | Dead portal link | **FIXED** | `/portal` redirects to pestportals; schedule uses external URL |
| 17 | Referral TODO | **FIXED** | Honest copy; rewards behind env flag (prior pass) |
| 18 | Unverified pages | **FIXED** | certifications/case-studies/community → `notFound()` unless flag |
| 19 | Wrong imagery | **STUBBED** | Interim remaps; Envato proposals for owner (H-13) |
| 20 | Oversized images sizes | **DEFERRED** | Needs card-grid `sizes` pass |
| 21 | Throwaway weekly report | **FIXED** (scaffold) | Full `apps-script/weekly-report/**` + SETUP.md; human clasp install |
| 22 | Public repo | **INFO** | Noted; visibility unchanged |

## Env inventory
See `docs/launch/HUMAN_INPUTS.md`.

## Phase 9 gates (2026-09-22)

| Gate | Status |
|------|--------|
| `pnpm verify` (includes production build) | **PASS** |
| Analytics unit tests | **PASS** |
| Playwright `no-debug-routes` + `no-empty-html` | **PASS** (42) |
| Production crawl `scripts/phase9-prod-crawl.mjs` | **FAIL → fix in flight** — CSP `gstatic.com/wcm/loader.js`; missing `link[rel=canonical]` (middleware + generateMetadata on this branch) |
| Lighthouse mobile SEO ≥95 | Pending after preview deploy |
| GHL nurture workflow | **HUMAN** — copy + click path in `docs/cro/GHL_WORKFLOWS.md` |
| Apps Script clasp | **HUMAN** — `apps-script/weekly-report/SETUP.md` |
| Upstash Redis | **HUMAN** H-3 |
| Phase 3.6 test lead | **HUMAN** H-4 (owner mobile) |

Merge only when crawl + Lighthouse are green on preview.
