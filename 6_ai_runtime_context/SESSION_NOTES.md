# Session notes (durable; AI_CONTEXT.md is regenerated)

updated: "2026-09-22"

## Package manager
Use **pnpm** (`pnpm@10.26.0`). Vercel install/build use pnpm (`vercel.json`).

## Lead production pass (LEAD-PROD-001) — 2026-09-18
- Removed before/after stock from home, our-work, service pages, testimonials.
- Pest page now covers termites, rodents, exclusions, trapping, and bed bugs.
- All service-detail pages now share the pest journey: hero + quote/call, included scope, offering cards → `/quote?service=…`, service-specific process, Google reviews, FAQs, closing CTA.
- 4.8 Google rating + rotating 5-star reviews on home/services; KWCH story linked.
- Inbox licenses published after gcloud reauth: snow tractor, holiday lights, power wash, commercial apartment, pest trap / bed bugs / exclusion.
- Snow: `sha-f2ed0b115ef2` → `services.snow-removal`. Holiday lights, power wash, commercial, and pest offering slots bound. `media:validate` ok.
- Quote funnel consult keys cover offering-level services (patio, driveway, seasonal-snow, etc.).

## Careers media (CAREERS-MEDIA-001) — completed 2026-09-04
Published preferred Envato licenses from inbox:
- `careers.hero` → `env-ANENAST`
- `careers.crew` → `env-RL37PZY`
- `careers.equipment` → `env-2KTRVRB`
- `careers.yard` → `env-D4R4EF5`

`pnpm run media:validate` ok. Commit `docs/media/*` + `lib/generated/media-map.json` for prod to pick up.

## Still blocked without interactive auth
- **GHL-WF-001:** HighLevel has no create-workflow API. After PIT rotation, `get-workflow` listed 31 automations; none is named for `website-lead`. Do **not** edit published FB/appointment flows or draft `Form Submission -> Confirmation`. Human creates NEW `Website Lead Nurture (cutrateslawn.com)` in GHL UI (`docs/cro/GHL_WORKFLOWS.md`).
- **GHL-TEST-001:** E2E form → GHL after production redeploy `dpl_7W5tE1tGqaUxfK2UPvmZ3P1swwC3` is READY (rotated PIT).

## GHL PIT rotation — 2026-09-22
- New token written in `.env.local` (no repo `.env` file). Synced to Vercel Production + Preview, Cursor user `mcp.json` LeadConnector header, and Windows User env. Old token must not be used.
- LeadConnector MCP re-authenticated after header change. No GHL workflow/pipeline/tag/field was created or edited.

## GHL Vercel env (GHL-OPS-001) — completed 2026-09-22
- Project `v0-cut-rates-lawn-main-page` Production + Preview: `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID` (existing Fresh Lead), `GHL_CF_SERVICE_ID`, `GHL_CF_MESSAGE_ID` (existing Service Requested / Your Message).
- Unrelated Vercel env left unchanged. `cutrates-homepage-preview` not touched.
- No HighLevel workflows, pipelines, tags, or custom fields were created or edited. Tag `website-lead` already existed (test contacts only).
- Production redeploy of current `main` started so serverless picks up stage + CF IDs.

## Brand logo — 2026-09-22
- Operator asset `Downloads/webstylizedlogo.png` → transparent PNG at `public/branding/cut-rates-logo.png`.
- Header + footer use `BrandLogo` (`header.logo` slot → local branding path). Favicon: `app/icon.png`.
- GCS `media:publish` blocked on expired gcloud auth; staged as `sha-d8dd853e8e2e`. After `gcloud auth login`, republish to CDN.


## Verify
`pnpm run verify`, `pnpm run media:validate`, `pnpm run test:e2e`
