# Phased Remediation Plan

**Audit date:** 2026-08-01  
Downstream risks called out per phase.

## Phase 0 — Immediate security, privacy, data integrity

| Action | Findings | Downstream risks |
|--------|----------|------------------|
| Upgrade Next.js to patched release; re-verify | F-001, F-017 | Breaking App Router / image config; retest all routes |
| Remove contact `console.log` of PII | F-016 | None material |
| Stop claiming success without delivery — disable submit or show “call us” until API exists | F-002 | Temporary conversion drop; message must be clear |
| Remove or noindex/redirect `/dashboard` | F-004 | Bookmarks break; prefer FieldPortals |
| Publish `/privacy` + `/terms` before any real PII capture | F-007 | Legal review lag |

## Phase 1 — Auth, authorization, core workflows

| Action | Findings | Downstream risks |
|--------|----------|------------------|
| Decide single customer system (FieldPortals) and remove mock account UI | F-004, F-018 | Need portal deep links for invoices/account |
| Implement contact lead API + provider | F-002, F-014 | Spam; need rate limit/Turnstile |
| Implement schedule handoff or booking | F-003 | Calendar TZ / capacity rules |
| Validate FieldPortals with two test customers | F-018 | Vendor access dependency |

## Phase 2 — Missing connections and state consistency

| Action | Findings | Downstream risks |
|--------|----------|------------------|
| Fix or remove all 18 broken internal links | F-005, F-015, F-021, F-023 | Content authorship |
| Newsletter provider + shared component | F-006 | Consent / CAN-SPAM |
| Quote engine or replace with lead CTA | F-008 | Pricing accuracy liability |
| Bind media slots to GCS (or import existing `images/*`) | F-009, F-020 | Cache headers; license attribution |
| Confirm production `not-found` returns 404 not 500 | F-019 | Build/deploy pipeline change |

## Phase 3 — Journey, navigation, product coherence

| Action | Findings | Downstream risks |
|--------|----------|------------------|
| Deduplicate About nav; fix social hrefs | F-022, F-013 | Brand URL inventory |
| Search: real or remove | F-010 | Index maintenance |
| Chat: real or remove | F-011 | Staffing |
| Referral: real codes + copy | F-012 | Fraud/abuse |
| Owner-approve claims/testimonials | F-024 | Legal |

## Phase 4 — Reliability, observability, recovery

- Structured server logs (no PII in client).
- Idempotency keys on lead create.
- Explicit failure UI + retry.
- Uptime checks on `/`, `/contact`, `/schedule`, `/portal` redirect.
- Maps key restrictions (F-025).

**Downstream:** Alert noise if checks too sensitive.

## Phase 5 — Automated regression

See `PROPOSED_TEST_SUITE.md`. Add CI job: link crawl, outcome-asserting form tests, npm audit gate, prod 404 smoke.

**Downstream:** Flaky external FieldPortals tests — isolate behind secret + nightly.

## Phase 6 — Architecture / future risk

- Minimal BFF for leads only; keep FieldPortals for accounts.
- CDN/custom domain for GCS if traffic grows.
- Content CMS if blog/case studies expand.
- Avoid resurrecting in-app dashboard without auth middleware.

**Downstream:** Scope creep — gate behind proposals (`DEC-MEDIA-PIPELINE` already proposed for media).
