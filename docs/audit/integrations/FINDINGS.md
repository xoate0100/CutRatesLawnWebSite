# Integrations Audit — Findings

**Mode:** discovery | **Date:** 2026-09-01  
**Finding IDs:** INT-F-001 …

---

### INT-F-001 — GHL secrets not confirmed on Vercel production
- status: Confirmed (backlog); Vercel dashboard Suspected
- severity: high
- priority: **P1**
- affected: Production lead/quote/newsletter delivery
- method: examine
- repro: Deploy without `GHL_PRIVATE_INTEGRATION_TOKEN` + `GHL_LOCATION_ID`; submit `/api/lead` → 503 unless webhook/Resend set
- expected: Production forms create tagged GHL contacts
- actual: `OUTSTANDING_TASKS.yaml` GHL-OPS-001 still **pending**; docs say local PIT works, Vercel not set
- evidence: `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` (GHL-OPS-001), `docs/integrations/GOHIGHLEVEL.md` §Outstanding
- root_cause: Human ops step not completed
- impact: Leads lost in prod if no fallback channel configured
- fix: Set `GHL_*` on Vercel project `v0-cut-rates-lawn-main-page`; run GHL-TEST-001
- downstream: Workflows still need GHL-WF-001 even after env is set
- regression: E2E `prospect-journey.spec.ts` + manual GHL contact check

---

### INT-F-002 — GHL nurture workflows not built
- status: Confirmed
- severity: medium
- priority: **P1**
- affected: CRM automation (tags fire but no workflow)
- method: examine
- repro: Upsert contact → tags added → no automation in GHL UI
- expected: Tag `website-lead` triggers Fresh Lead opportunity + staff/customer notify
- actual: GHL-WF-001, GHL-WF-002, GHL-WF-003 all **pending**
- evidence: `OUTSTANDING_TASKS.yaml`, `GOHIGHLEVEL.md` §4
- root_cause: Automation built in code (tags) but not in GHL product
- impact: Staff not notified; no nurture SMS/email despite integration code
- fix: Create workflows per GOHIGHLEVEL.md; branch on `source:*` tags
- downstream: Newsletter path must not receive sales SMS (GHL-WF-002)
- regression: GHL-TEST-001 acceptance criteria

---

### INT-F-003 — FieldPortals authorization unvalidated
- status: Confirmed (scope gap)
- severity: medium
- priority: **P2**
- affected: Customer accounts at `cutrateslawn.fieldportals.com`
- method: examine
- repro: N/A in-repo — requires two test customer accounts
- expected: Customer A cannot access Customer B data; sessions expire; MFA/recovery documented
- actual: Site only redirects/links; no SSO bridge; authz **not tested**
- evidence: `docs/audit/FIELDPORTALS_AUTHZ_NOTE.md`, `app/portal/page.tsx`
- root_cause: External vendor boundary; no test harness in repo
- impact: Real PII may live in FieldPortals with unknown isolation posture
- fix: Vendor test accounts + isolation checklist; document in integrations doc
- downstream: e2e portal tests may flake on external dependency
- regression: Manual + optional nightly external test job

---

### INT-F-004 — No analytics integration (GA4)
- status: Confirmed
- severity: low
- priority: **P3**
- affected: Marketing measurement, conversion tracking
- method: examine
- repro: Search codebase for `gtag`, `GA_MEASUREMENT` → none in app code
- expected: Optional GA4 with consent when business enables it
- actual: `.env.example` has commented `NEXT_PUBLIC_GA_MEASUREMENT_ID`; no loader component
- evidence: `.env.example` L33–34, `app/layout.tsx`
- root_cause: Not yet prioritized
- impact: No funnel/analytics data in GA4
- fix: Add consent-gated GA4 component when measurement ID available
- downstream: Privacy policy may need cookie section update
- regression: Lint rule or test that GA only loads after consent

---

### INT-F-005 — Legacy `/api/contact` stub vs real `/api/lead` path
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `app/api/contact/route.ts`, `components/contact-form.tsx`
- method: examine
- repro: POST `/api/contact` → `{ success: true }` with no CRM delivery
- expected: All contact UI posts to `/api/lead` with GHL delivery
- actual: `/api/contact` still exists as DI/logger stub; current `contact-form` should use `/api/lead` (verify UI wiring)
- evidence: `app/api/contact/route.ts`, `app/api/lead/route.ts`
- root_cause: v0 scaffold residue
- impact: Miswired form would silently drop leads
- fix: Remove or redirect `/api/contact` to `/api/lead`; delete stub
- downstream: None if UI already on `/api/lead`
- regression: E2E contact submission asserts `/api/lead` response

---

### INT-F-006 — Google reviews debug route exposes config metadata
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `GET /api/google-reviews-debug`
- method: examine
- repro: Call route → returns `apiKeyLength`, `placeIdValue`
- expected: Debug routes disabled or auth-gated in production
- actual: Public route leaks whether keys are set and place ID value
- evidence: `app/api/google-reviews-debug/route.ts`
- root_cause: Dev convenience left in tree
- impact: Recon aid for attackers; hand full CVE review to `/audit-security-nist`
- fix: Remove route or gate behind `NODE_ENV === 'development'` / admin secret
- downstream: None
- regression: Production build must not expose `/api/google-reviews-debug`

---

### INT-F-007 — Turnstile optional (spam gate disabled when unset)
- status: Confirmed
- severity: low
- priority: **P3**
- affected: `POST /api/lead`
- method: examine
- repro: Omit `TURNSTILE_SECRET_KEY` → `verifyTurnstile` returns true
- expected: Production has Turnstile configured
- actual: Documented as optional in `.env.example`
- evidence: `app/api/lead/route.ts` L55–57
- root_cause: Gradual rollout design
- impact: Higher bot spam volume on lead endpoint (rate limit only)
- fix: Set Turnstile keys on Vercel prod; fail closed when `NODE_ENV=production`
- downstream: UX adds widget to forms
- regression: Lead test with/without valid token

---

### INT-F-008 — Strapi CMS integration orphaned
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `lib/api.ts`, blog/services Strapi paths, `/api/health`
- method: examine
- repro: Site renders static/marketing content; Strapi calls fall back to mocks or fail silently
- expected: Single content source of truth
- actual: Large Strapi client surface remains; `STRAPI_API_URL` defaults to `api.cutrateslawn.com`
- evidence: `lib/api-client.ts`, `lib/services/cms/mock-data.ts`, `components/admin-notice.tsx`
- root_cause: Pivot from headless CMS to static/v0 content without cleanup
- impact: Confusion, accidental calls to dead CMS, health noise
- fix: Archive Strapi code paths or document as inactive; trim health diagnostics
- downstream: Blog may need explicit static strategy
- regression: `npm run verify` + no runtime Strapi fetch on home/quote

---

### INT-F-009 — In-memory idempotency/rate-limit not durable on serverless
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `app/api/lead/route.ts`, `app/api/newsletter/route.ts`
- method: examine
- repro: Cold start or multi-instance → duplicate deliveries possible; rate limit per instance
- expected: Durable idempotency for lead writes
- actual: `Map` in process memory
- evidence: `seenKeys`, `ipHits` in lead route
- root_cause: Simple implementation without KV/Redis
- impact: Duplicate GHL contacts or emails under load; weak abuse protection
- fix: Vercel KV / Upstash Redis for idempotency keys; or rely on GHL upsert + webhook idempotency headers only
- downstream: Cost of KV service
- regression: Load test duplicate POST with same `idempotencyKey`

---

### INT-F-010 — Outbound webhooks lack signature verification
- status: Confirmed
- severity: low
- priority: **P3**
- affected: `CONTACT_FORM_WEBHOOK_URL`, `NEWSLETTER_WEBHOOK_URL`
- method: examine
- repro: Inspect webhook `fetch` — JSON POST only, no shared secret header beyond Idempotency-Key
- expected: Receiver can authenticate sender
- actual: No `X-Webhook-Signature` or similar
- evidence: `app/api/lead/route.ts` webhook block
- root_cause: Simple integration pattern
- impact: Webhook URL leak allows forged posts to n8n (receiver-side risk)
- fix: Add HMAC header with `WEBHOOK_SIGNING_SECRET` when using webhooks
- downstream: n8n workflow must validate
- regression: Unit test signature generation

---

## Priority Summary

| Priority | Count | IDs |
|----------|-------|-----|
| P1 | 2 | INT-F-001, INT-F-002 |
| P2 | 5 | INT-F-003, INT-F-005, INT-F-006, INT-F-008, INT-F-009 |
| P3 | 3 | INT-F-004, INT-F-007, INT-F-010 |

**Open P0/P1 gate:** 2 P1 findings block full integration readiness (GHL prod env + workflows).
