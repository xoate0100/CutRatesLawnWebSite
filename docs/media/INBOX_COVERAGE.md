# Inbox coverage — updated 2026-08-02

## Verdict

Your second inbox drop was **almost entirely a re-download of the first batch**. Those photos were **already ingested, uploaded to GCS, and registered**. Prefer that first set; do **not** re-publish.

| Inbox file (2nd drop) | Status | First-set asset | Where it lives |
|----------------------|--------|-----------------|----------------|
| house-with-a-green-lawn… | EXACT SHA dup | `env-A9DYSMH` | GCS + `home.hero` / `og.default` |
| home-sweet-home… | EXACT SHA dup | `env-NVY3VZW` | `about.hero` |
| row-of-traditional-suburban… (+ `(1)` copy) | EXACT SHA dup | `env-BQ2DHJ4` | `services.hero` |
| residential-houses… | EXACT SHA dup | `sha-50ea64d6a870` | `contact.hero` |
| lawn-mover-on-green-grass… | EXACT SHA dup | `env-WL6S6J5` | `services.mowing` |
| man-fertilizing-lawn… | EXACT SHA dup | `sha-5c1d1dd0095b` | `services.fertilization` |
| worker-spraying…lawn… (+ `(1)` copy) | EXACT SHA dup | `env-L66HWHJ` | `services.weed-control` |
| water-droplets… | EXACT SHA dup | `sha-df83cbfdd6a5` | `services.aeration` |
| mowed-green-frontyard… | EXACT SHA dup | `env-HBA9N9D` | library (now also case/gallery stand-ins) |
| lawn-care-worker-mows… | EXACT SHA dup | `env-ETDTNU6` | library |
| man-pushing-lawn-mower… | EXACT SHA dup | `env-J4XCY2H` | library |
| farmer-spraying… | EXACT SHA dup | `env-3J7CC29` | library |
| lawn-care-professional-sprays… | EXACT SHA dup | `sha-1a0ddae6797d` | library |
| man-mowing-the-lawn-in-his-backyard… | EXACT SHA dup | `sha-ba20accbcd23` | library |
| suburban-home-exterior… | EXACT SHA dup | `sha-17ae8109f02b` | library |
| **man-mows-the-lawn-on-a-sunny-day…** | **NEW** | `sha-7b1c0a70183b` | published 2026-08-02 |
| **professional-landscaper-trimming…** | **NEW** | `sha-f22b5ee0b651` | `services.cleanup` |
| **worker-spraying…bush…** | **NEW** | `sha-9a459a99270d` | `services.pest-control` |

Public base: `https://storage.googleapis.com/site_photo_storage/cutrateslawn/prod/...`

## What we did

1. **SHA-compared** inbox ↔ `MEDIA_REGISTRY.yaml` (exact byte match on 17 files).
2. **Moved duplicates** to `media/archive/already_in_registry/` (safe to delete for disk space).
3. **Kept only 3 new files** in `media/inbox/`, then published them to GCS.
4. **Rebound 38+ null page slots** to the **first-batch** library (no re-upload).
5. Fixed `services.cleanup` to the landscaper (`sha-f22b5ee0b651`), not the bush spray.

## Remaining true gaps (still need new photos)

| Need | Why stock lawn set is not enough |
|------|----------------------------------|
| Real **before/after** portfolio | `ourwork.*.before` (most still null); afters use library stand-ins |
| Power washing | `services.power-washing`, `page.powerwashing.*`, `page.services-all.powerwashing` |
| Team headshots | `team.owner` / `manager` / `crew` |
| Certification logos | `page.certifications.*` |
| Empty-state graphic | `empty.state` (optional) |
| Snow / irrigation / parking | several `page.commercial.*` still null |

## Operator note

Next time: check `docs/media/MEDIA_REGISTRY.yaml` `source_filename` / SHA before re-downloading Envato items. Pipeline now skips directories under inbox and ignores `_` prefixes.
