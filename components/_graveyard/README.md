# Quarantined v0 chrome and fake forms

These files are **not imported** by live App Router pages. They stayed next to production components and were easy to edit by mistake (`components/header.tsx` looks like “the header”; live chrome is `components/blocks/site-header.tsx`).

Moved 2026-09-20 as Phase 4 leftover / Phase 6 close-out. Git history still has the originals. Do not re-import them.

| Original path | Why |
|---|---|
| `header.tsx` / `site-header.tsx` / `layout/header.tsx` / `mobile-nav.tsx` | Unused headers; live header is `components/blocks/site-header.tsx` |
| `footer.tsx` / `site-footer.tsx` / `layout/footer.tsx` | Unused footers; live footer is `components/blocks/site-footer.tsx` |
| `quote-form.tsx` | Fake success via `lib/api-helpers.ts`; bundles now link to `/quote` |
| `forms/quote-form.tsx` | Third unused quote form |
| `contact-form.tsx` / `forms/contact-form.tsx` | Unused vs `ContactFormBlock` → `/api/lead` |
| `newsletter-form.tsx` | Unused vs `newsletter-signup.tsx` |
| `layout/page-layout.tsx` | Unused page shell |

**Still live (do not move):** `components/cta-section.tsx` (legacy pages), `components/layout/marketing-chrome.tsx`, `components/quote/quote-funnel.tsx`, `components/blocks/*`.
