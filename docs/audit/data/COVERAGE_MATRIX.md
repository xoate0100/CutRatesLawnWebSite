# Data Audit — Coverage Matrix

**Mode:** discovery | **Date:** 2026-09-01

| Area | Ran? | Method | Result |
|------|------|--------|--------|
| Supabase / Postgres usage | Yes | glob, grep | **None** |
| Migration integrity | N/A | — | No app DB |
| RLS / client-exposed tables | N/A | — | No DB |
| GCS bucket + prefix config | Yes | examine `.env.example`, media scripts | `site_photo_storage` / `cutrateslawn/prod` |
| Public vs signed media access | Yes | examine upload cache headers | **Public** objects with long immutable cache |
| CDN strategy | Yes | examine `next.config.mjs` images | `storage.googleapis.com` allowed; no custom CDN domain |
| Media registry integrity | Yes | examine `media-map.json`, SLOT_MAP | Registry committed; dual legacy path remains |
| Orphaned GCS objects | No | examine GCS bucket | Requires gcloud access — **Suspected** drift |
| In-memory API state | Yes | examine lead/newsletter routes | Non-durable Maps |
| Strapi as external datastore | Yes | examine API clients | Legacy; mock fallbacks |
| Backup / restore for media | Yes | examine docs | Operator pipeline docs only; no automated backup |
| Data lifecycle (delete) | No | examine GCS | No automated purge on slot rebind — **Suspected** |
| PII storage in Next app | Yes | examine routes | PII forwarded to GHL/Resend, not stored locally |
| FieldPortals customer data | No | interview | External — not in repo |

**Coverage:** 10/13 areas examined; 3 need cloud dashboard or vendor access.
