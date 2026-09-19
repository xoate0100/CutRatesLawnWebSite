# Session notes (durable; AI_CONTEXT.md is regenerated)

updated: "2026-09-18"

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
- **GHL-OPS-001 / Vercel env:** no local `.env`, Vercel CLI needs `vercel login`, then set `GHL_*` (and optional Turnstile) on `v0-cut-rates-lawn-main-page`.
- **GHL-WF-001–003:** HighLevel workflow UI (or LeadConnector MCP — not connected in this workspace).

## Done 2026-09-04 (agent)
- **QUALITY-TS-001:** `tsc --noEmit` clean; `ignoreBuildErrors: false`; CI Typecheck required. Legacy Strapi/admin/auth files quarantined with leading `// @ts-nocheck`.

## Verify
`pnpm run verify`, `pnpm run media:validate`, `pnpm run test:e2e`
