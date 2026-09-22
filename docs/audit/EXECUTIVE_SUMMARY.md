# Executive Summary — Release Readiness

**Date:** 2026-09-22  
**Mode:** `/audit-all` discovery + Critical/High production confirmation (live site + Vercel env + code)  
**Verdict:** **Not release-ready** — open P0/P1 remain (lead E2E unverified; Redis/Turnstile ops; measurement incomplete until redeploy)

## Gate counts (de-duplicated)

| Priority | Open | Closed this pass | Notes |
|----------|-----:|-----------------:|-------|
| **P0** | **2** | 2 patched in tree | Empty SSR HTML; GTM/SITE_URL bake — need force redeploy |
| **P1** | **5** | 6 patched in tree | Lead path, CSP, conversions, debug routes, fake emails |
| P2 | 8+ | — | Media/content/consent decisions |
| P3 | — | — | Docs/polish |

**Security gate:** Not security-ready until Turnstile/Upstash posture is decided and public debug surface stays gone after deploy. See [security/FINDINGS.md](security/FINDINGS.md).

## Confirmed Critical (production, pre-redeploy)

1. **No GTM in browser bundle** — live `dataLayer` reported `gtm_configured: false`. `NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-KGVZJ93G` and `NEXT_PUBLIC_SITE_URL=https://cutrateslawn.com` are now set on Vercel Production+Preview; **force rebuild still required** so `NEXT_PUBLIC_*` bake into the client bundle and sitemap/canonicals stop pointing at `localhost`.
2. **Empty SSR HTML** — `AnalyticsProvider` wrapped the whole tree in `Suspense(useSearchParams)`, so H1/copy were client-only across area×service pages. **Fixed in tree:** provider is side-effect-only sibling under Suspense; children SSR again.
3. **Lead delivery unverified** — no labeled GHL test lead submitted this pass. Vercel has `GHL_*` secrets; **no `TURNSTILE_*` or `UPSTASH_*`**. Without Turnstile secret, spam check is skipped (safe). Without Upstash, failed delivery uses in-memory queue (lost on cold start). **Human:** `GHL-TEST-001`.

## High — patched in workspace (awaiting ship)

| Issue | Fix |
|-------|-----|
| CSP blocks CF Insights / Ads / GA hosts | Expanded CSP in `next.config.mjs` |
| Funnel events ~5× | `useAnalytics` return memoized |
| Thank-you converts without `rid` | Gate `trackConversionLead` on real `rid` |
| Partial lead spends Turnstile | Token only on `complete` submits |
| Mowing deep-link skips address | Initial step always `details` when service resolved |
| Public debug pages | Removed `/debug`, `/api-test`, `/test-page`, `/test-layout`, `/image-test`, `/static-test`, `/google-reviews-test`, `/dev`, plus debug API stubs |
| Review count 24→32 | `GOOGLE_REVIEW_COUNT` + marketing string |
| Fake `@leads.cutrateslawn.com` emails | Empty email allowed; GHL omits invented addresses |
| Referral `TODO(owner-approval)` | Honest copy; thank-you no longer links `/referral` |
| Certifications NALP/ISA claims | Softened to training/standards (no third-party cert claims) |
| Landscaping≡hardscaping / aeration droplets | Distinct interim media-map bindings + honest alts |

## Still open (ops / product)

- Force production redeploy with build cache off (env + code).
- Optional: `NEXT_PUBLIC_GA4_MEASUREMENT_ID` if GTM does not inject GA4 alone.
- Configure Turnstile **both** site+secret keys together, or leave both unset.
- Configure Upstash Redis for durable lead retry + cron.
- Consent defaults off until Accept — owner legal call (documented, not changed).
- `/case-studies`, `/community` template tone; blog slug redirects; Strapi 504; `/schedule`→empty `/portal`.
- Replace interim hardscape/aeration assets with real photos via media pipeline.

## What to do next

1. Commit + push this remediation tree; force Production redeploy.
2. Andy: submit one labeled test quote → confirm GHL contact + tags.
3. Re-crawl SSR H1 on an area page and confirm `gtm_configured: true` + non-localhost sitemap.
