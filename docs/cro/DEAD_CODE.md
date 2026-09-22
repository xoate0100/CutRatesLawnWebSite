# CRO dead-code map

**Recon:** 2026-09-20 · `cro/phase-0-recon` (proposal)  
**Executed:** 2026-09-20 · `cro/phase-1-measurement` — unused v0 copies live under `components/_graveyard/` (see README there). `npm run build` after the batch move.

Live marketing chrome and the primary quote path live under `components/blocks/` and `components/quote/`. Do **not** resurrect graveyard files.

**Still live (intentionally not moved):** `components/cta-section.tsx` (legacy page imports), `components/newsletter-signup.tsx`, `components/layout/marketing-chrome.tsx`.

---

## Original proposal (Phase 0)

Proposal only at recon time. **Do not delete in Phase 0.** Execute quarantine in Phase 4 after measurement and funnel work, one file at a time, with `npm run build` green after each move.

## Rule of thumb

Live marketing chrome and the primary quote path live under `components/blocks/` and `components/quote/`. Files at `components/*.tsx` and `components/layout/` are mostly v0-era leftovers. Exceptions that are **still live** must not be quarantined until their callers are migrated:

- `components/cta-section.tsx` — still imported by pricing, bundles, referral, community, certifications, case-studies, `app/services/all`
- `components/quote-form.tsx` — still imported by `app/bundles/[slug]/page.tsx` (fake lead path)
- `components/newsletter-signup.tsx` — still imported by `app/blog/page.tsx`

## Proposed quarantine (`_graveyard/` or delete)

Move under `components/_graveyard/` (or delete if git history is enough) **only after** grep shows zero importers outside the graveyard.

| File | Why dead | Importers found | Risk if edited by mistake | Proposed action |
|---|---|---|---|---|
| `components/header.tsx` | Old sticky header | none | High — looks like “the header” | Quarantine |
| `components/site-header.tsx` | Alternate header | none (except it imports `mobile-nav`) | High | Quarantine with mobile-nav |
| `components/layout/header.tsx` | Third header | none | High | Quarantine |
| `components/mobile-nav.tsx` | Only used by dead `site-header.tsx` | `components/site-header.tsx` | Medium | Quarantine with site-header |
| `components/footer.tsx` | Old footer + newsletter | none (blog uses `NewsletterSignup` directly) | High | Quarantine |
| `components/site-footer.tsx` | Alternate footer | none | High | Quarantine |
| `components/layout/footer.tsx` | Third footer | none | Medium | Quarantine |
| `components/forms/quote-form.tsx` | Third quote form (~16 KB) | none | **Critical** — looks like the quote form | Quarantine first |
| `components/contact-form.tsx` | Independent zod/toast form, not `/api/lead` | none | High | Quarantine |
| `components/newsletter-form.tsx` | Unused vs `newsletter-signup` | none | Low | Quarantine |
| `components/layout/page-layout.tsx` | Unused page shell | none | Low | Quarantine |
| `components/analytics/phone-link.tsx` | `AnalyticsPhoneLink` never imported | none | Medium — people may “add tracking” here and nothing fires | Keep and **wire it**, or quarantine after replacing tel links |
| `components/forms/contact-form.tsx` | Deprecated re-export of live `ContactFormBlock` | none | Low (alias only) | Delete re-export after confirming no external barrels |

## Live but should be migrated (not dead)

Do **not** graveyard these until callers switch to the blocks/quote path.

| File | Live caller | Problem | Migration |
|---|---|---|---|
| `components/quote-form.tsx` | `app/bundles/[slug]/page.tsx` | `submitQuoteRequest` in `lib/api-helpers.ts` always returns success; no `/api/lead` | Replace with `QuoteFunnel` or a thin `/api/lead` wrapper; then quarantine |
| `components/cta-section.tsx` | pricing, several bundle/legacy pages | Duplicate of `blocks/cta-section.tsx`; different tokens | Swap imports to `@/components/blocks` |
| `lib/api-helpers.ts` `submitQuoteRequest` / `submitContactForm` | quote-form.tsx | Simulated delay + success | Delete after caller migration |
| `lib/api.ts` `submitQuoteRequest` | `components/forms/quote-form.tsx` (dead) | Simulated success | Delete with dead form |
| `app/services/[slug]/page.tsx` overlapping slugs | aliases | Duplicate route files for the 11 explicit services | Keep `[slug]` for aliases only; document; optional `generateStaticParams` = alias keys only |

## Do not quarantine

| File | Reason |
|---|---|
| `components/quote/quote-funnel.tsx` | Live `/quote` |
| `components/blocks/*` used by `app/layout.tsx` and service/home | Live chrome |
| `components/blocks/contact-form-block.tsx` | Live `/contact` |
| `lib/pricing/estimate.ts` | CFO pricing authority |
| `app/services/<slug>/page.tsx` explicit files | Live SEO URLs |

## Suggested Phase 4 order

1. Grep + quarantine `components/forms/quote-form.tsx` (highest mis-edit risk, zero callers).
2. Quarantine unused headers/footers/`mobile-nav` as a batch.
3. Migrate `app/bundles/[slug]` off `components/quote-form.tsx`, then quarantine it.
4. Point legacy pages at `blocks/cta-section.tsx`, then quarantine `components/cta-section.tsx`.
5. Narrow `app/services/[slug]/generateStaticParams` to alias slugs only (behavior-preserving).
6. Wire or delete `AnalyticsPhoneLink`.

Each step: one PR-sized change, `npm run build` green, no media binaries, no pricing formula edits.
