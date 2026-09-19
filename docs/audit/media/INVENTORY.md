# Media Audit — Inventory

**Domain:** `audit-media`  
**Mode:** discovery (read-only)  
**Audited:** 2026-09-01

## Registry files

| File | Purpose |
|------|---------|
| `docs/media/SLOT_MAP.yaml` | 100 slots → `asset_id`, variant, fallback, alt, notes |
| `docs/media/MEDIA_REGISTRY.yaml` | Published assets, GCS paths, Envato metadata, variants |
| `lib/generated/media-map.json` | Build-time resolved URLs + attribution (generated) |
| `lib/media.ts` | `getMedia`, `mediaSrc`, `mediaAlt`, `listMediaSlots` |

## Slot statistics

| Metric | Count |
|--------|------:|
| Total slots (`SLOT_MAP.yaml`) | 100 |
| Slots with `asset_id: null` | 39 (39%) |
| Careers slots defined | 4 (`careers.hero`, `careers.crew`, `careers.equipment`, `careers.yard`) |
| Careers slots used in TSX | 1 (`careers.hero` in `app/careers/page.tsx`) |

## Careers media bindings

| Slot | Asset | Published URL | In UI |
|------|-------|---------------|-------|
| `careers.hero` | `env-ETDTNU6` | GCS `…/env-ETDTNU6/w1920.webp` | Yes — `MediaFrame` hero |
| `careers.crew` | `sha-f22b5ee0b651` | GCS cleanup ingest | **No component reference** |
| `careers.equipment` | `env-WL6S6J5` | Reuse `services.mowing` | **No component reference** |
| `careers.yard` | `env-J4XCY2H` | GCS library unassigned | **No component reference** |

## Envato pipeline

| Artifact | Location |
|----------|----------|
| Operator workflow | `docs/media/MEDIA_PIPELINE.md` |
| Careers proposals | `docs/media/ENVATO_PROPOSALS_CAREERS.md` |
| Redesign proposals | `docs/media/ENVATO_PROPOSALS_REDESIGN.md` |
| Null-slot checklist | `docs/media/NULL_SLOT_UPLOAD_CHECKLIST.md` |
| Inbox coverage | `docs/media/INBOX_COVERAGE.md` |
| npm scripts | `media:publish`, `media:validate`, `media:map` (see `package.json`) |

Pipeline flow: Envato MCP search → human license/download → `media/inbox/*.meta.json` → `npm run media:publish -- --slot …` → registry + slot map + `media-map.json`.

## Runtime components

| Component | Attribution rendered? |
|-----------|----------------------|
| `components/media/media-frame.tsx` | No — uses `mediaSrc` / `mediaAlt` only |
| `components/media/video-frame.tsx` | No |
| `components/atmosphere/hero-plane.tsx` | No |
| Direct `mediaSrc()` / `<Image>` | No attribution UI |

## Null-slot clusters (39 slots)

Representative gaps:

- Team: `team.owner`, `team.manager`, `team.crew`
- Service areas: all `areas.*.hero` (8 slots)
- Power washing: `services.power-washing`, `page.powerwashing.*`, `page.services-all.powerwashing`
- Commercial pages: `page.commercial.4`–`6`
- Portfolio B/A: multiple `ourwork.*.before` / `after` null
- Redesign: `home.hero.video`, `services.holiday-lights`, `services.snow-removal`, `services.commercial`
- Certifications, blog avatar, bundle avatar

## Registry hygiene note

Many assets list spurious slots (`header.logo`, `services.cleanup`) in `MEDIA_REGISTRY.yaml` from validation scaffolding — not all are bound in `SLOT_MAP.yaml`.
