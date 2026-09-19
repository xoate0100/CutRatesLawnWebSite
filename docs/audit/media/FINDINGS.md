# Media Audit — Findings

**Mode:** discovery

| ID | Priority | Title | Evidence |
|----|----------|-------|----------|
| F-001 | P1 | 39% of media slots still unbound — widespread placeholder fallbacks | `SLOT_MAP.yaml`: 39/100 slots with `asset_id: null`; includes all service-area heroes, team photos, power-washing cluster |
| F-002 | P1 | `careers.crew` published without Envato attribution metadata | `lib/generated/media-map.json` — `author: null`, `envato_url: null`; registry entry `sha-f22b5ee0b651` has `author: null` |
| F-003 | P1 | Six registry assets retain "attribution pending" author placeholder | `MEDIA_REGISTRY.yaml` — `sha-1a0ddae6797d`, `sha-5c1d1dd0095b`, `sha-ba20accbcd23`, `sha-50ea64d6a870`, `sha-17ae8109f02b`, `sha-df83cbfdd6a5` |
| F-004 | P2 | Three careers slots bound but unused in UI | `careers.crew`, `careers.equipment`, `careers.yard` in SLOT_MAP; only `careers.hero` referenced in `app/careers/page.tsx` |
| F-005 | P2 | No attribution surface in components despite `MediaAttribution` type | `lib/media.ts` exposes attribution; `MediaFrame` / `hero-plane` never render credit |
| F-006 | P2 | Careers hero uses library stand-in, not preferred crew photo | `SLOT_MAP.yaml` notes + `ENVATO_PROPOSALS_CAREERS.md` — ANENAST crew photo proposed, not licensed |
| F-007 | P2 | Registry slot pollution obscures true bindings | Many assets list `header.logo` + `services.cleanup` in `MEDIA_REGISTRY.yaml` slots arrays unrelated to production SLOT_MAP |
| F-008 | P2 | Before/after portfolio slots use library stand-ins mislabeled as B/A | `ourwork.lawn.1.before` notes "not true before"; `gallery.before` same |
| F-009 | P3 | `careers.hero` asset lives under `library/unassigned/` prefix | GCS path in `media-map.json` — organizational debt, not user-facing |
| F-010 | P3 | Redesign slots (video, holiday lights, snow, commercial card) entirely null | `SLOT_MAP.yaml` lines 501–524 |

## Summary

| Priority | Count |
|----------|------:|
| P0 | 0 |
| P1 | 3 |
| P2 | 5 |
| P3 | 2 |

**Verdict:** Pipeline infrastructure is sound; licensing metadata gaps and placeholder prevalence are the main release risks. Careers media is bound but under-utilized.

## Top findings (detail)

### F-001 — High placeholder rate
Pages referencing null slots (e.g. service areas, power washing, team) render generic `/placeholder.jpg` — visible quality and trust impact on prospect and applicant journeys.

### F-002 — careers.crew attribution hole
Asset was ingested from Envato inbox without sidecar URL capture. Live on CDN with incomplete license record — compliance gap if slot is ever shown.

### F-004 — Unused careers slots
Ops bound `careers.crew`, `careers.equipment`, `careers.yard` per careers media plan but no `MediaFrame` / `HeroPlane` references exist — wasted ingest and misleading registry "bound" status for page coverage.
