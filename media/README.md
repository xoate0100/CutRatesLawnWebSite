# Media drop folders

Operator runbook for Envato → GCS assets. Full pipeline: [`docs/media/MEDIA_PIPELINE.md`](../docs/media/MEDIA_PIPELINE.md).

| Folder | Purpose |
|--------|---------|
| `inbox/` | Drop licensed Downloads here (plus optional `*.meta.json` sidecars) |
| `staging/` | Renamed originals after ingest (pre-upload) |
| `processed/` | Local optimized variants (WebP sizes) |
| `quarantine/` | Rejected files (wrong type / failed validation) |

Binaries in these folders are **gitignored**. Commit only:

- `docs/media/MEDIA_REGISTRY.yaml`
- `docs/media/SLOT_MAP.yaml`
- `lib/generated/media-map.json`
- page/component wiring

## Quick publish

```bash
# After dropping a file into media/inbox/
npm run media:publish -- --slot home.hero --category hero --usage hero
npm run media:validate
```

## Env

See `.env.example` for `NEXT_PUBLIC_MEDIA_BASE_URL`, `GCS_MEDIA_BUCKET`, `GCS_MEDIA_PREFIX`.
