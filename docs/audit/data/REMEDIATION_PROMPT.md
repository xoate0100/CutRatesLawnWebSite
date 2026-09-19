# Data Audit — Remediation Prompt

## Context

Stateless Next.js app: media on **GCS** (`site_photo_storage`), CRM data in **GHL**, customer accounts in **FieldPortals**. No Supabase. Lead idempotency is in-memory.

## Phase 1 — Consistency (P2)

1. **Unify image paths:** Migrate pages still using `lib/image-constants.ts` / raw `<img>` to `mediaSrc()` + `next/image` per `docs/media/SLOT_MAP.yaml`.
2. **Run `media:validate`** after slot changes; commit updated `lib/generated/media-map.json`.
3. **Resolve Strapi:** Either delete unused CMS clients (`lib/api.ts`, schema discovery) or restore live Strapi with env documented in `.env.example`.

## Phase 2 — Durability (P2)

4. **Idempotency store:** Add Vercel KV (or Redis) for `idempotencyKey` in `/api/lead` and `/api/newsletter`; keep 24h TTL.
5. **Document GCS prefix rules:** Only licensed marketing assets in `cutrateslawn/prod`; never customer PII.

## Phase 3 — Ops (P3)

6. Enable GCS object versioning or monthly bucket export.
7. Add `media:prune --dry-run` comparing bucket listing to registry.
8. Optional: Cloud CDN custom domain in front of `storage.googleapis.com` for performance.

## Constraints

- Do not store lead PII in Next app filesystem or public env vars.
- Media upload uses operator `gcloud` credentials — not Vercel runtime.
- Run `npm run verify` before complete.

## Acceptance

- [ ] Single image resolution path for production pages
- [ ] Duplicate lead POST with same key does not double-notify
- [ ] Strapi either removed or explicitly operational
- [ ] DR note in `docs/media/MEDIA_PIPELINE.md`
