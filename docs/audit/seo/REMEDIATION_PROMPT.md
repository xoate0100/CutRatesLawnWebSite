# SEO — Remediation Prompt

Run with `/audit-seo --fix` or assign to an implementer. Phases are ordered; do not enable JSON-LD before data is verified.

## Phase 1 — Crawl infrastructure (P1)

1. Add `app/robots.ts`:
   - Allow `/` marketing routes
   - Disallow `/admin`, `/debug`, `/api-test`, `/dev`, `/test-*`, `/static-test`, `/google-reviews-test`
   - Point `sitemap` to `${siteConfig.url}/sitemap.xml`
2. Add `app/sitemap.ts` using `siteConfig.url`:
   - Static marketing routes from `scripts/pre-release-browser-audit.mjs` expected list
   - Dynamic slugs from blog, bundles, services, service-areas data sources
3. Keep `/sitemap` HTML page but sync link list with XML sitemap.

## Phase 2 — Structured data (P1)

1. Create server component `components/seo/local-business-json-ld.tsx` using verified fields from `lib/site-config.ts` (phone, address, URL).
2. Inject in `app/layout.tsx` or home page only — remove placeholder fallbacks in `createLocalBusinessData()`.
3. Add `Service` schema on individual service pages via `generateMetadata` companion or inline server JSON-LD.
4. Validate with Google Rich Results Test.

## Phase 3 — Per-route metadata (P2)

Add `metadata` exports to:
- `app/page.tsx` — unique home title/description
- `app/pricing/page.tsx`, `app/schedule/page.tsx`, `app/referral/page.tsx`
- Bundle sub-pages (`seasonal`, `residential`, `commercial`, `all`)
- `app/certifications/page.tsx`, `app/case-studies/page.tsx`, `app/community/page.tsx`

Pattern: reuse `siteConfig` + route-specific copy; include `openGraph` overrides where images differ.

## Phase 4 — AI discoverability (P2)

1. Add `public/llms.txt` summarizing:
   - Business name, service area (Wichita → KC corridor)
   - Primary URLs: `/quote`, `/contact`, `/services`, `/careers`
   - Fact registry pointer: verified pay/location policy for careers
2. Optionally add FAQ `FAQPage` JSON-LD on `/faq`.

## Phase 5 — Hygiene (P3)

- Remove `generator: "v0.dev"` from root metadata
- Add `robots: { index: false }` to all test/admin layout groups
- Delete or gate unused `components/structured-data.tsx` client pattern

## Verification

```bash
npm run verify
npm run build
# Manual: fetch /robots.txt, /sitemap.xml
# Manual: Rich Results Test on / and /services/lawn-care
```
