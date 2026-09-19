# Media Remediation Prompt

Discovery: **0 P0 · 3 P1 · 5 P2**. Run with `/audit-media --fix` after human Envato licenses where noted.

## Phase 1 — Attribution & compliance (P1)

1. Backfill `sha-f22b5ee0b651` (`careers.crew`) Envato metadata:
   - Locate original inbox file or re-search Envato for "professional landscaper trimming tall grass"
   - Update `MEDIA_REGISTRY.yaml` `author`, `envato_url`, `envato_item_id`
   - Run `npm run media:map` and verify `media-map.json` attribution block
2. Resolve six `attribution pending` sha-* assets — add sidecar `*.meta.json` retroactively or re-ingest with `media:publish`
3. Run `npm run media:validate` until clean

## Phase 2 — Careers slot utilization (P2)

1. Add `MediaFrame` (or `HeroPlane`) references per `ENVATO_PROPOSALS_CAREERS.md`:
   - `careers.crew` in trust grid or training section
   - `careers.equipment` in equipment/training block
   - `careers.yard` in "where you report" / Valley Center section
2. License preferred assets (ANENAST hero, RL37PZY crew, 2KTRVRB equipment, D4R4EF5 yard) per proposals doc
3. Publish with:
   ```bash
   npm run media:publish -- --slot careers.hero --category careers --usage hero
   ```

## Phase 3 — Null-slot burn-down (P1–P2)

Priority order from `NULL_SLOT_UPLOAD_CHECKLIST.md`:

1. Service area heroes (`areas.*.hero`) — 8 slots
2. `services.power-washing` + `page.powerwashing.*`
3. Team portraits (`team.*`)
4. Redesign seasonal cards (`services.holiday-lights`, `services.snow-removal`)

## Phase 4 — Attribution UI (P2)

1. Add optional `showAttribution` prop to `MediaFrame` rendering a visually subtle caption when `getMedia(slot).attribution?.envato_url` exists
2. Or centralize in `/licenses` page listing all Envato Elements used

## Phase 5 — Registry hygiene (P2)

1. Strip spurious `header.logo` / `services.cleanup` entries from asset `slots:` arrays where SLOT_MAP does not bind them
2. Move `env-ETDTNU6` object prefix from `library/unassigned/` to `careers/hero/` on next republish

## Verification

```bash
npm run media:validate
npm run verify
```

Spot-check: `/careers`, `/service-areas/derby`, `/services/power-washing` (if routed), `/image-test`
