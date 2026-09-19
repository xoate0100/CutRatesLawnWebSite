# SEO — Inventory

**Audit:** `audit-seo` | **Mode:** discovery | **Stack:** next | **Date:** 2026-09-01

## Metadata sources

| Asset | Path | Notes |
|-------|------|-------|
| Root metadata | `app/layout.tsx` | `metadataBase`, title template, description, keywords, OG, Twitter, robots |
| Site URL | `lib/site-config.ts` | `NEXT_PUBLIC_SITE_URL` drives `metadataBase` |
| Page metadata | 37 of 64 `app/**/page.tsx` files | Export `metadata` or `generateMetadata` |
| Dynamic metadata | `app/blog/[slug]/page.tsx`, `app/bundles/[slug]/page.tsx`, `app/services/[slug]/page.tsx`, `app/service-areas/[slug]/page.tsx` | `generateMetadata` |

## Crawl / index files

| Expected | Present | Path |
|----------|---------|------|
| `robots.txt` / `app/robots.ts` | **No** | — |
| `sitemap.xml` / `app/sitemap.ts` | **No** | — |
| HTML sitemap page | Yes | `app/sitemap/page.tsx` → `/sitemap` (16 links, incomplete) |
| `llms.txt` | **No** | — |
| `public/robots.txt` | **No** | — |

## Structured data

| Component | Path | Wired to routes? |
|-----------|------|------------------|
| `JsonLd` | `components/json-ld.tsx` | **No** — not imported by any page |
| `StructuredData` | `components/structured-data.tsx` | **No** — client-only, unused |
| `SchemaMarkup` | `components/schema-markup.tsx` | **No** — unused |

`createLocalBusinessData()` contains placeholder fallbacks (fake phone, address, geo) when data is missing.

## Route metadata coverage (marketing)

| Route | Page-level metadata | Notes |
|-------|---------------------|-------|
| `/` | **No** | Inherits root default only |
| `/quote` | Yes | |
| `/contact` | Yes | |
| `/pricing` | **No** | |
| `/schedule` | **No** | |
| `/referral` | **No** | |
| `/careers` | Yes | |
| `/services/*` (static slugs) | Yes | 12 service pages |
| `/bundles` | Yes | Child bundle pages mostly inherit |
| `/blog` | Yes | Posts via `generateMetadata` |
| `/service-areas` | Yes | Slugs via `generateMetadata` |
| `/about`, `/faq`, `/our-work` | Yes | |
| `/portal`, `/dashboard` | **No** | |
| Dev/test routes | Mostly **No** | Only `app/dev/components/page.tsx` sets `noindex` |

## Internal linking

- Primary nav: `components/blocks/site-header.tsx`, `components/footer.tsx`
- HTML sitemap: 16 links; omits service sub-slugs, bundle slugs, service-area slugs, careers apply
- `scripts/pre-release-browser-audit.mjs` enumerates 29 expected marketing routes

## AI discoverability

- No `llms.txt` or `/.well-known/` AI manifest
- FAQ content on `/faq` (good extraction surface)
- Careers governance YAML (`docs/cut_rates_careers_copy_guidelines.yaml`) is agent-oriented but not web-served

## Prior audit artifacts

- `artifacts/audit/preview-summary.json`, `artifacts/audit/local-summary.json` — responsive overlay findings (conversion/UX overlap, not SEO-specific)
