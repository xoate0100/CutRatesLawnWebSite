# Completeness Findings Register

**Audit:** `/audit-completeness` (discovery)  
**Date:** 2026-09-01  
**Sorted by:** priority (P0 → P3)

---

### F-001 — Mock login/register/account contradicts FieldPortals customer portal strategy
- status:        Confirmed
- severity:      high
- priority:      P1
- affected:      `/login`, `/register`, `/account`, `lib/auth.ts`, `contexts/auth-context.tsx`, `middleware.ts`
- method:        trace
- repro:         Visit `/login` → mock auth with `user@example.com`/`password`; `/portal` and `/dashboard` redirect to FieldPortals — two competing account stories
- expected:      Single customer account path (FieldPortals); no mock local accounts
- actual:        Login/register UI still ships; mock users in localStorage; `/account` server redirect loop
- evidence:      `lib/auth.ts:51-84`, `app/dashboard/page.tsx:4-6`, `app/login/page.tsx`, `app/account/page.tsx:12-17`
- root_cause:    Portal redirect added without removing Phase-3 auth scaffold
- impact:        User confusion; broken `/account`; maintenance of dead code paths
- fix:           Replace login/register/account with portal redirects; remove AuthProvider if unused
- downstream:    Nav links to "account" need audit
- regression:    E2E: header "Customer portal" goes external; `/login` redirects

---

### F-002 — Site search returns hardcoded mock results, not CMS or index
- status:        Confirmed
- severity:      high
- priority:      P1
- affected:      `lib/search.ts`, `app/search/page.tsx`
- method:        examine
- repro:         `/search?q=anything` → same mock services/bundles/posts/FAQs regardless of query
- expected:      Search queries Strapi, static index, or external search service
- actual:        `performSearch` filters a fixed `mockResults` array after artificial delay
- evidence:      `lib/search.ts:20-60` ("For Phase 3 preparation, we'll simulate the API call")
- root_cause:    Search never wired to Strapi or client index
- impact:        Users see irrelevant results; SEO/internal discovery broken
- fix:           Implement Strapi full-text or build-time search index; remove mock array
- downstream:    Filter links (`?type=service`) need server-side filter support
- regression:    Search integration test with known CMS slug returns real hit

---

### F-003 — Lead delivery requires ops configuration; fails closed with 503 when unset
- status:        Confirmed
- severity:      high
- priority:      P1
- affected:      `app/api/lead/route.ts`, `app/api/newsletter/route.ts`, Vercel env
- method:        examine
- repro:         Deploy without `GHL_*`, webhook, or `RESEND_API_KEY` → form shows error / 503 with `manualContactRequired`
- expected:      Production has GHL env + workflows per `GHL-OPS-001` / `GOHIGHLEVEL.md`
- actual:        Code path correct; operational wiring outstanding in `OUTSTANDING_TASKS.yaml`
- evidence:      `app/api/lead/route.ts:74-79`, `6_ai_runtime_context/ACTIVE_TASK_POINTER.yaml`, `docs/atmosphere/HUMAN_TASKS.md` H-GHL-01
- root_cause:    Human-gated secrets and GHL UI workflows not completed
- impact:        Production lead loss if env missing; core conversion path blocked
- fix:           Complete Vercel env + GHL workflows; add deploy-time env validation
- downstream:    E2E lead smoke (`GHL-TEST-001`)
- regression:    CI/preview check for `isGhlConfigured()` or alternate channel

---

### F-004 — Legacy `/api/contact` stub and duplicate contact form components remain
- status:        Confirmed
- severity:      medium
- priority:      P1
- affected:      `app/api/contact/route.ts`, `components/forms/contact-form.tsx`, `components/contact-form.tsx`
- method:        trace
- repro:         `components/forms/contact-form.tsx:60` posts to `/api/contact` (log + fake success). `components/contact-form.tsx:43-44` fakes API with timeout. Production contact page uses `ContactFormBlock` → `/api/lead` (correct)
- expected:      One contact implementation wired to `/api/lead`
- actual:        Three contact form variants; two disconnected from lead pipeline
- evidence:      `app/contact/page.tsx:36` uses ContactFormBlock; grep shows no imports of legacy `ContactForm` in app routes
- root_cause:    v0 components retained after redesign
- impact:        Future dev may wire wrong form; `/api/contact` still reachable
- fix:           Delete stub route and unused components; grep guard in CI
- downstream:    Dev component gallery may reference old forms
- regression:    No `/api/contact` route; single `ContactFormBlock` export

---

### F-005 — Turnstile integrated server-side but not in lead capture UI
- status:        Confirmed
- severity:      medium
- priority:      P2
- affected:      `ContactFormBlock`, `QuoteFunnel`, `app/api/lead/route.ts`
- method:        trace
- repro:         Inspect form POST bodies — no `turnstileToken`; API skips verify when secret unset
- expected:      Widget on public forms when keys configured
- actual:        Server ready; client never sends token
- evidence:      `components/blocks/contact-form-block.tsx:52-61`, `app/api/lead/route.ts:234-237`
- root_cause:    Incomplete Turnstile rollout
- impact:        Spam leads if rate limit bypassed; incomplete anti-abuse story
- fix:           Add Turnstile component; pass token in POST body
- downstream:    See security F-006
- regression:    Form snapshot includes turnstile iframe when key set

---

### F-006 — Orphaned and duplicate API routes add maintenance surface
- status:        Confirmed
- severity:      medium
- priority:      P2
- affected:      `/api/contact`, `/api/reviews/google`, `/api/mock-homepage`, `/api/test`, `/api/simple`, `/api/html`
- method:        examine
- repro:         Grep callers — no app imports for test/mock routes; two Google reviews implementations
- expected:      Single reviews route; no scaffold endpoints in prod
- actual:        Dead routes remain deployable
- evidence:      `app/api/reviews/google/route.ts` vs `app/api/google-reviews/route.ts`
- root_cause:    Incremental migration without cleanup
- impact:        Confusion; security surface (see security audit)
- fix:           Delete orphans; consolidate reviews to one route
- downstream:    Update any scripts referencing old paths
- regression:    Route manifest test matches allowed list

---

### F-007 — Account page server auth check always fails (localStorage in RSC)
- status:        Confirmed
- severity:      medium
- priority:      P2
- affected:      `app/account/page.tsx`, `lib/auth.ts`
- method:        trace
- repro:         `getCurrentUser()` in server component → `typeof window === "undefined"` → null → redirect `/login`
- expected:      Server-readable session or remove page
- actual:        Page unusable even after client mock login
- evidence:      `lib/auth.ts:35-37`, `app/account/page.tsx:12-17`
- root_cause:    Client-only token store used in RSC
- impact:        Broken account workflow if mock auth retained
- fix:           Portal redirect (preferred) or move account to client-only with real API
- downstream:    Related to F-001
- regression:    `/account` behavior matches chosen strategy

---

### F-008 — Multiple conflicting `submitContactForm` implementations in lib layer
- status:        Confirmed
- severity:      low
- priority:      P2
- affected:      `lib/api.ts`, `lib/api-client.ts`, `lib/api-helpers.ts`, `lib/smart-api.ts`
- method:        examine
- repro:         Grep `submitContactForm` — 4+ variants targeting Strapi or stubs
- expected:      Single lead submission client or direct fetch to `/api/lead`
- actual:        Legacy Strapi form submission helpers coexist with new lead API
- evidence:      `lib/api.ts:488`, `lib/api-client.ts:158`, `lib/api-helpers.ts:83`
- root_cause:    CMS-era form code not pruned
- impact:        Developer may call wrong helper; Strapi path may not exist
- fix:           Deprecate Strapi submit helpers; export one `submitLead()` wrapper
- downstream:    Grep and update any callers
- regression:    Single export for lead submission

---

### F-009 — Privacy policy is attorney-review shell, not production legal text
- status:        Confirmed
- severity:      medium
- priority:      P2
- affected:      `app/privacy/page.tsx`
- method:        examine
- repro:         Page displays "Draft shell pending attorney review"
- expected:      Attorney-approved policy before collecting emails/leads at scale
- actual:        TODO comments; minimal placeholder copy
- evidence:      `app/privacy/page.tsx:17-26`
- root_cause:    Legal content not yet delivered
- impact:        Compliance gap for newsletter consent and lead PII
- fix:           Replace with approved policy; link from forms already points here
- downstream:    May need cookie/consent banner
- regression:    No `TODO(attorney-review)` in privacy page

---

### F-010 — CMS mock fallback serves placeholder content when Strapi token absent
- status:        Confirmed
- severity:      low
- priority:      P2
- affected:      `lib/services/cms-service.ts`, `lib/services/cms/mock-data.ts`, `lib/api-client.ts`
- method:        examine
- repro:         Run without `STRAPI_API_TOKEN` → `getMockData` returns scaffold content
- expected:      Production always uses live CMS or fails visibly
- actual:        Silent mock fallback in development pattern may mask misconfiguration
- evidence:      `lib/services/cms-service.ts:19-31`, `lib/api-client.ts:16`
- root_cause:    Dev ergonomics pattern without strict prod guard
- impact:        Preview/staging could show fake services if token missing
- fix:           Fail closed in production when token missing; mock only in `NODE_ENV === 'development'`
- downstream:    Build-time content validation
- regression:    Prod build without token logs error / empty state

---

### F-011 — Referral program amounts marked pending owner confirmation
- status:        Confirmed
- severity:      low
- priority:      P3
- affected:      `app/referral/page.tsx`
- method:        examine
- repro:         Page copy: "Rewards listed below are pending owner confirmation"
- expected:      Confirmed marketing claims before publish
- actual:        TODO(owner-approval) for $50 / 20% amounts
- evidence:      `app/referral/page.tsx:40-42`
- root_cause:    Business policy not finalized
- impact:        Product coherence / advertising accuracy
- fix:           Owner confirms amounts or soften copy further
- downstream:    None technical
- regression:    Content review checklist

---

### F-012 — Unused `components/contact-form.tsx` simulates success without API call
- status:        Confirmed
- severity:      low
- priority:      P3
- affected:      `components/contact-form.tsx`
- method:        examine
- repro:         `onSubmit` uses `setTimeout` 1500ms then toast success — no network
- expected:      Component removed or wired to `/api/lead`
- actual:        Dead code; not imported by current app pages
- evidence:      `components/contact-form.tsx:43-50`; no app imports
- root_cause:    v0 component superseded by ContactFormBlock
- impact:        Risk if re-imported without review
- fix:           Delete file
- downstream:    None
- regression:    Grep fails on fake `setTimeout` contact submit

---

### F-013 — Dev/test pages lack production guards (except `/dev/components`)
- status:        Confirmed
- severity:      low
- priority:      P3
- affected:      `/debug`, `/api-test`, `/static-test`, `/google-reviews-test`, `/image-test`, `/test-page`, etc.
- method:        examine
- repro:         Compare `app/dev/components/page.tsx:62-64` (`notFound` in prod) vs `app/debug/page.tsx` (no guard)
- expected:      All dev surfaces 404 in production
- actual:        Inconsistent gating
- evidence:      `app/debug/page.tsx`, `app/api-test/page.tsx` (exist in route list)
- root_cause:    Partial hardening during redesign
- impact:        Unprofessional URLs indexed; extra test UI in prod
- fix:           Shared `devOnly()` helper or route group with prod block
- downstream:    robots.txt noindex as belt-and-suspenders
- regression:    Prod crawl finds no `/debug` 200

---

## Summary counts

| Priority | Count |
|----------|-------|
| P0 | 0 |
| P1 | 4 |
| P2 | 6 |
| P3 | 3 |
| **Total** | **13** |

## Release readiness (completeness)

Core lead path (`ContactFormBlock` / `QuoteFunnel` → `/api/lead`) is **implemented in code** but **operationally incomplete** until GHL/env tasks close (F-003). Search, auth, and legacy forms remain disconnected.
