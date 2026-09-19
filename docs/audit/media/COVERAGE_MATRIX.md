# Media Audit — Coverage Matrix

| Check | Covered | Evidence | Result |
|-------|---------|----------|--------|
| SLOT_MAP completeness | Yes | 100 slots enumerated | 61 bound, 39 null |
| MEDIA_REGISTRY sync | Yes | Cross-check `careers.*` | Bound assets published on GCS |
| `media-map.json` generation | Yes | `lib/generated/media-map.json` | Careers slots resolve to CDN URLs |
| `lib/media.ts` API | Yes | TypeScript | Attribution type exists but unused in UI |
| Envato ingest pipeline docs | Yes | `MEDIA_PIPELINE.md` | Documented |
| Careers Envato proposals | Yes | `ENVATO_PROPOSALS_CAREERS.md` | 4 upgrade candidates listed |
| Attribution in registry | Partial | `MEDIA_REGISTRY.yaml` grep | 6 assets `author: Envato Elements (attribution pending)`; multiple `envato_url: null` on sha-* ingests |
| Attribution on site | No | component grep | **Not rendered anywhere** |
| Careers slot usage in pages | Partial | code grep | 1/4 slots referenced |
| License traceability per live slot | Partial | `media-map.json` | `careers.crew` has null author + null envato_url |
| Placeholder fallbacks | Yes | null slots | `/placeholder.jpg` or `.svg` served via `mediaSrc` fallback chain |
| `media:validate` CI | Assumed | package scripts | Not re-run this audit session |

## Slot binding status by section

| Section | Slots | Null | Bound % |
|---------|------:|-----:|--------:|
| Heroes (home, services, about, contact) | 4 | 0 | 100% |
| Service cards | 12 | 4 | 67% |
| Our work / gallery | 14 | 6 | 57% |
| Page templates (commercial, pest, landscaping, etc.) | 28 | 10 | 64% |
| Service areas | 8 | 8 | 0% |
| Team | 3 | 3 | 0% |
| Careers | 4 | 0 | 100% bound / 25% used |
| Redesign / misc | 27 | 8 | 70% |

## Careers attribution detail (`media-map.json`)

| Slot | Author | envato_url |
|------|--------|------------|
| `careers.hero` | duallogic | present |
| `careers.crew` | **null** | **null** |
| `careers.equipment` | erika8213 | present |
| `careers.yard` | Olena_Mykhaylova | present |
