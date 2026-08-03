# Null-slot upload + bind checklist

**Purpose:** New media slots were added with `asset_id: null` so pages no longer hardcode `/placeholder.svg`. Until real photos are bound, they show `/placeholder.jpg` (optimizer-safe).

**Bucket:** `storage.googleapis.com/site_photo_storage/cutrateslawn/...`

## Process

1. Place photos in `media/inbox/` (with meta as usual).
2. Run media pipeline: ingest → prepare → upload → register.
3. Set `asset_id` + `variant` on the matching slot in `docs/media/SLOT_MAP.yaml`.
4. `npm run media:sync-site`
5. Commit `SLOT_MAP.yaml` + `lib/generated/media-map.json` and deploy.

## Slots to bind

### Our Work (priority — was 12 broken images)

| Slot | Suggested content |
|------|-------------------|
| `ourwork.lawn.1.before` / `.after` | Neglected → care package lawn |
| `ourwork.lawn.2.before` / `.after` | Drought-resistant yard |
| `ourwork.hardscape.1.before` / `.after` | Patio + fire pit |
| `ourwork.hardscape.2.before` / `.after` | Walkway + retaining wall |
| `ourwork.commercial.1.before` / `.after` | Office park grounds |
| `ourwork.commercial.2.before` / `.after` | Shopping center landscaping |

### Case studies

`casestudies.1`, `casestudies.2`, `casestudies.3`

### Gallery component fallbacks

`gallery.before`, `gallery.after`, `gallery.thumb`

### Other page covers

See `docs/atmosphere/HUMAN_TASKS.md` § H-ATM-09 for the full list (`page.*`, `services.pest-control`, team, etc.).
