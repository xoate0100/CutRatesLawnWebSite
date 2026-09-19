# Data Audit — Findings

**Mode:** discovery | **Date:** 2026-09-01

---

### DATA-F-001 — No application database (by design)
- status: Confirmed
- severity: info
- priority: **P3**
- affected: Architecture
- method: examine
- repro: No `supabase/`, no ORM, no SQL migrations
- expected: Marketing site may be stateless BFF
- actual: Leads forwarded to GHL; no local persistence
- evidence: `package.json` deps, repo structure
- root_cause: Intentional scope
- impact: Positive — smaller data breach surface in Next app
- fix: None required; document in cold-start doc
- downstream: Idempotency needs external store if required
- regression: N/A

---

### DATA-F-002 — Dual image resolution paths (registry vs legacy constants)
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: Homepage and service imagery
- method: examine
- repro: `app/page.tsx` uses `IMAGES` from `lib/image-constants.ts`; newer slots use `mediaSrc()`
- expected: Single source of truth via `media-map.json` / SLOT_MAP
- actual: Parallel legacy GCS hardcoded URLs coexist with Envato pipeline
- evidence: `docs/atmosphere/RECON.md`, `lib/image-constants.ts`, `lib/media.ts`
- root_cause: Incremental media migration (ATM-MEDIA-001) incomplete sitewide
- impact: Stale assets, missing Envato attribution, operator confusion
- fix: Migrate remaining pages to `mediaSrc()`; deprecate `IMAGES` constants
- downstream: Visual regression on key pages
- regression: `media:validate` + visual audit screenshots

---

### DATA-F-003 — GCS objects served as fully public URLs
- status: Confirmed
- severity: low
- priority: **P2**
- affected: `gs://site_photo_storage`
- method: examine
- repro: `NEXT_PUBLIC_MEDIA_BASE_URL` points to `storage.googleapis.com/...`
- expected: Public marketing assets OK; no private uploads in same prefix
- actual: All prod media under public bucket path
- evidence: `.env.example`, `scripts/media/upload.mjs`
- root_cause: Standard pattern for static marketing CDN
- impact: Any object in prefix is world-readable; operator must not upload private files here
- fix: Document prefix discipline; optional Cloud CDN + custom domain for performance
- downstream: IAM review if bucket shared with non-public assets
- regression: Bucket policy audit script

---

### DATA-F-004 — In-memory idempotency not durable on serverless
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: `POST /api/lead`, `POST /api/newsletter`
- method: examine
- repro: Same `idempotencyKey` across cold starts may deliver twice
- expected: At-most-once delivery semantics
- actual: Process-local `Map` with 24h prune
- evidence: `app/api/lead/route.ts` `seenKeys`
- root_cause: No KV/DB layer
- impact: Duplicate CRM contacts or emails under concurrency
- fix: Vercel KV / Redis for idempotency keys; GHL upsert mitigates duplicates partially
- downstream: Integration with INT-F-009
- regression: Duplicate POST integration test

---

### DATA-F-005 — No documented media backup / disaster recovery
- status: Confirmed
- severity: low
- priority: **P3**
- affected: GCS bucket + `media-map.json`
- method: examine
- repro: Docs describe upload pipeline, not restore from backup
- expected: Recovery path if bucket deleted or registry corrupted
- actual: Operator-dependent; Envato re-license as fallback noted in human tasks
- evidence: `docs/media/MEDIA_PIPELINE.md`, `OUTSTANDING_TASKS.yaml` CAREERS-MEDIA-001
- root_cause: Small-team ops gap
- impact: Extended outage if GCS prefix lost
- fix: Enable GCS versioning or periodic bucket sync; commit registry after every publish
- downstream: None
- regression: DR drill checklist

---

### DATA-F-006 — Strapi CMS data path unresolved
- status: Confirmed
- severity: medium
- priority: **P2**
- affected: Blog, services Strapi fetchers
- method: examine
- repro: `STRAPI_API_URL` defaults to production URL; mocks used in dev
- expected: Clear content SOR or removal
- actual: Legacy integration with schema discovery tooling still present
- evidence: `lib/services/cms/mock-data.ts`, `lib/schema-discovery.ts`
- root_cause: CMS pivot not completed
- impact: Accidental dependency on unavailable CMS; false admin notices
- fix: Archive Strapi layer or restore live CMS with documented contract
- downstream: Blog routing strategy
- regression: Build with no STRAPI_* env still serves core pages

---

### DATA-F-007 — Orphaned GCS objects after slot rebind (Suspected)
- status: Suspected
- severity: low
- priority: **P3**
- affected: `cutrateslawn/prod/*`
- method: interview
- repro: Rebind slot in SLOT_MAP without deleting old object
- expected: Lifecycle policy or script removes superseded objects
- actual: No `media:prune` script found in inventory
- evidence: Media scripts list (`media:upload`, `register`, etc.)
- root_cause: No garbage collection step
- impact: Storage cost creep; stale URLs if cached externally
- fix: Add optional prune script comparing registry to bucket listing
- downstream: Requires gcloud list permissions
- regression: Dry-run prune in CI

---

## Priority Summary

| Priority | Count | IDs |
|----------|-------|-----|
| P2 | 4 | DATA-F-002, DATA-F-003, DATA-F-004, DATA-F-006 |
| P3 | 3 | DATA-F-001, DATA-F-005, DATA-F-007 |

**No P0/P1 data findings** in-repo; RLS/security handoff to `/audit-security-nist` if Supabase added later.
