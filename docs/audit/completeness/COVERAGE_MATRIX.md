# Completeness Coverage Matrix

**Audit:** `/audit-completeness` (discovery)  
**Date:** 2026-09-01

| Check area | Method | Result | Evidence |
|------------|--------|--------|----------|
| Marker scan (TODO/FIXME/mock/stub) | examine | **FINDINGS** | `lib/auth.ts`, `lib/search.ts`, `app/api/contact`, privacy/referral TODOs |
| Dead controls (no handler) | examine | **PASS** | Primary CTAs wired; legacy `contact-form.tsx` fakes success |
| Unwired frontend (no backend) | examine | **FAIL** | Search mock; legacy contact forms |
| Orphaned backend (no caller) | examine | **FAIL** | `/api/contact`, `/api/reviews/google`, test routes |
| Unused data columns/tables | examine | N/A | No app DB |
| Missing loading/empty/error states | examine | **PARTIAL** | Lead forms have error states; search has empty state but fake data |
| Missing error handling | examine | **PARTIAL** | `/api/lead` 503 when unconfigured; contact stub always succeeds |
| Feature flags masking gaps | examine | **PASS** | No product flags hiding half-built features |
| Duplicated implementations | examine | **FAIL** | 3 contact forms, 2 google review routes, 4+ `submitContactForm` in lib |
| UI → API → domain → storage trace (contact) | trace | **PASS** | ContactFormBlock → `/api/lead` → `ghl.ts` |
| UI → API trace (quote) | trace | **PASS** | QuoteFunnel → `/api/lead` |
| UI → API trace (newsletter) | trace | **PASS** | NewsletterSignup → `/api/newsletter` |
| UI → API trace (schedule) | trace | **PASS** | Redirect handoff — documented honest UX |
| Auth UI → real auth | trace | **FAIL** | Mock localStorage vs FieldPortals |
| CMS content → pages | trace | **PARTIAL** | Strapi readers exist; mock fallback when token missing |
| GHL workflows end-to-end | interview | **UNVALIDATED** | Code ready; ops tasks open |
| Turnstile UI → API | trace | **FAIL** | API accepts token; forms don't send |
| Portal/dashboard | trace | **PASS** | Redirect to FieldPortals |

## Layer boundary diagram (lead capture — complete path)

```
ContactFormBlock / QuoteFunnel
  → POST /api/lead (Zod, rate limit, honeypot)
    → deliverLead()
      → upsertLeadContact() [GHL]
      → fetch(CONTACT_FORM_WEBHOOK_URL)
      → Resend email
```

## Layer boundary breaks

```
components/forms/contact-form.tsx → POST /api/contact → logger.info only → success JSON

lib/search.performSearch() → mock array (no Strapi)

lib/auth.loginUser() → localStorage mock (no API, no portal SSO)

getCurrentUser() in RSC → always null (localStorage unavailable server-side)
```

## Coverage gaps

- Production smoke: submit lead with live GHL env not run in this audit
- Strapi live vs mock content split not tested against deployed token
- Full route crawl for dead links deferred to `/audit-journey`
