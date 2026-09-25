---
description: Envato MCP + GCS media pipeline operator rules
globs:
  - media/**
  - docs/media/**
  - scripts/media/**
  - lib/media.ts
  - lib/generated/media-map.json
alwaysApply: false
---

# Media pipeline

## Flow

1. Search **Envato MCP** for slot intent; present a shortlist.
2. Human picks; open the Elements item URL in the browser.
3. Human licenses + downloads into `media/inbox/` (or Downloads → move to inbox).
4. Write sidecar `*.meta.json` beside the file (envato id/url/title/author).
5. Run `npm run media:publish -- --slot <slot> --category <cat> --usage <usage>`.
6. Update `SLOT_MAP.yaml` if publish did not bind the slot; `npm run media:sync-site`.
7. Commit registry / slot map / generated map / code — **never** inbox/staging/processed binaries.

## Never

- Commit Envato tokens or GCS service-account keys (use gcloud ADC).
- Hardcode `storage.googleapis.com/...` paths in pages — use `lib/media.ts`.
- Edit `DECISION_REGISTRY.yaml` for media ADR; propose under `proposals/`.
- Mass-replace placeholders without human review of the first production upload.

## Object keys

`gs://site_photo_storage/cutrateslawn/{env}/{category}/{slot}/{assetId}/{variant}.{ext}`
