# Remediation prompt — `/audit-all` follow-up

Run in **fix** mode only after human confirms ship.

## Phase 0 — Ship measurement + SSR (blocking)

1. Commit remediation tree on `main` (or PR).
2. Vercel Production **Redeploy** with **Clear build cache** so `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_GTM_CONTAINER_ID` bake into the client bundle.
3. Verify:
   - View Source on `/service-areas/wichita/lawn-care` contains an H1.
   - `/sitemap.xml` hosts are `https://cutrateslawn.com`.
   - Browser: GTM request fires; dataLayer shows configured container.
   - Console: no CSP blocks for googletagmanager / cloudflareinsights / googleads.

## Phase 1 — Lead path truth

1. Do **not** set `TURNSTILE_SECRET_KEY` alone. Either both Turnstile keys or neither.
2. Add Upstash Redis (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) for durable lead queue.
3. Confirm cron hits `/api/cron/lead-retry` with `CRON_SECRET`.
4. Human: submit labeled test quote `GHL-TEST-001` → confirm contact in GHL + tags + pipeline stage.

## Phase 2 — Product honesty

1. Owner decision on consent default (opt-in vs US opt-out) — do not change without legal sign-off.
2. Rewrite or noindex `/case-studies` and `/community`.
3. Replace interim hardscape/aeration media via Envato/own photos + `media:publish`.
4. Fix or remove `/schedule` → empty `/portal` path; document FieldPortals as SoT.

## Phase 3 — Regression

1. Keep E2E: thank-you without `rid` must not emit `conversion_lead`.
2. Keep E2E: mowing deep link lands on Property/address, not Estimate.
3. Add smoke: debug routes 404 in production.

## Do not

- Edit/delete existing GHL workflows, pipelines, tags, or custom fields.
- Invent placeholder customer emails.
- Wrap page trees in Suspense solely for `useSearchParams`.
