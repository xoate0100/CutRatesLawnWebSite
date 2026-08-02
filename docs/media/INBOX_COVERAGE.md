# Inbox coverage check — 2026-08-01

Compared your `media/inbox/` drop against priority slots in [`ENVATO_PROPOSALS.md`](./ENVATO_PROPOSALS.md).

## Bound to slots (ready after GCS upload)

| Slot | File / asset | Status |
|------|--------------|--------|
| `home.hero` | house-with-a-green-lawn… → `env-A9DYSMH` | prepared |
| `about.hero` | home-sweet-home… → `env-NVY3VZW` | prepared |
| `services.hero` | row-of-traditional-suburban… → `env-BQ2DHJ4` | prepared |
| `contact.hero` | residential-houses… → `sha-50ea64d6a870` | prepared |
| `og.default` | same as home.hero | prepared |
| `services.mowing` | lawn-mover-on-green-grass… → `env-WL6S6J5` | prepared |
| `services.fertilization` | man-fertilizing-lawn… → `sha-5c1d1dd0095b` | prepared |
| `services.weed-control` | worker-spraying-pesticide… → `env-L66HWHJ` | prepared |
| `services.aeration` | water-droplets… → `sha-df83cbfdd6a5` | prepared (stand-in) |

## Library stock (uploaded to registry, not slot-bound)

| Asset | Notes |
|-------|-------|
| `env-HBA9N9D` mowed frontyard | home.hero alternate |
| `env-ETDTNU6` worker mows | mowing alternate |
| `env-J4XCY2H` man pushing mower | mowing alternate |
| `env-3J7CC29` farmer spraying | fert/weed alternate |
| `sha-1a0ddae6797d` pro sprays fertilizer | alternate |
| `sha-ba20accbcd23` man mowing backyard | alternate |
| `sha-17ae8109f02b` suburban manicured lawn | hero alternate |

## Missing / incomplete

| Item | Action |
|------|--------|
| `services.cleanup` | Still legacy — incomplete landscaper `.crdownload` was quarantined; re-download when Chrome finishes |
| `worker-spraying…bush` `.crdownload` | Quarantined incomplete |
| Empty-state **ZIPs** (4) | Quarantined — pipeline rejects zip; extract a PNG/SVG into inbox if you want `empty.state` |
| Testimonials / team / partners | Not in this drop (still legacy GCS paths) |
| Exact “Man with seeder” fert pick | You used a strong spreader photo instead — fine |

## Pipeline status

1. ✅ Ingest + prepare (local WebP variants)
2. ⏳ Upload blocked — `gcloud` tokens expired (needs interactive login)
3. ⏳ Register publish + `media:sync-site` after upload
4. ⏳ Commit `media-map.json` + redeploy

## Redeploy answer

**No — you do not redeploy for every photo byte uploaded to GCS.**

- Images live on GCS; the site reads URLs from `lib/generated/media-map.json` (bundled at build).
- After a publish batch: run `media:sync-site`, **commit the map + SLOT_MAP/registry**, push once → **one** Vercel deploy.
- Overwriting the **same** GCS object URL with no map change → no redeploy.
- New asset IDs / new slot bindings → one redeploy after sync.
