# SEO — Coverage Matrix

| Area | Checked | Result | Evidence |
|------|---------|--------|----------|
| Unique title per route | Partial | **Gap** — home, pricing, schedule, referral lack page metadata | `app/page.tsx`, `app/pricing/page.tsx` |
| Meta description per route | Partial | Same gaps as titles | grep `export const metadata` |
| Canonical URLs | Partial | `metadataBase` set; per-route canonicals rare | `app/layout.tsx` |
| OG / Twitter cards | Partial | Root-level only for pages without overrides | `app/layout.tsx` |
| `robots.txt` | Yes | **Missing** | no `app/robots.ts` or `public/robots.txt` |
| XML sitemap | Yes | **Missing** | only HTML `/sitemap` page |
| Structured data (JSON-LD) | Yes | **Not deployed** | `components/json-ld.tsx` unused |
| LocalBusiness schema accuracy | Yes | **Placeholder defaults** | `createLocalBusinessData()` fallbacks |
| Single H1 per page | Suspected | Not statically verified all 64 routes | manual spot-check needed |
| Heading hierarchy | Suspected | Not measured | — |
| `noindex` on dev/test routes | Partial | Only `/dev/components` | `app/dev/components/page.tsx` |
| Internal linking / orphans | Partial | HTML sitemap incomplete | `app/sitemap/page.tsx` |
| `llms.txt` / AI discoverability | Yes | **Missing** | — |
| Core Web Vitals (ranking signal) | Deferred | See `docs/audit/optimization/` | Lighthouse scripts exist |
| Social image | Yes | Present via `mediaSrc("og.default")` | `app/layout.tsx` |

**Coverage score:** 6 / 14 areas fully passing.
