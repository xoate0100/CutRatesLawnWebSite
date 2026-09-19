# Data Audit — Inventory

**Command:** `audit-data`  
**Mode:** discovery (read-only)  
**Stack:** next  
**Date:** 2026-09-01

## Summary

This site has **no application database** (no Supabase, no Postgres, no `supabase/migrations/`). Persistent data lives in **external systems** (GHL CRM, FieldPortals) and **Google Cloud Storage** for static media. Runtime state in API routes uses **in-memory Maps** (non-durable on serverless).

---

## Storage Systems

| System | Purpose | Location / bucket | Access model | Code / config |
|--------|---------|-------------------|--------------|---------------|
| **Google Cloud Storage** | Production images (Envato pipeline) | `gs://site_photo_storage` / prefix `cutrateslawn/prod` | Public HTTPS (`storage.googleapis.com`) | `NEXT_PUBLIC_MEDIA_BASE_URL`, `GCS_MEDIA_BUCKET`, `GCS_MEDIA_PREFIX` |
| **Media registry (build artifact)** | Slot → URL mapping | `lib/generated/media-map.json` | Committed JSON, built by `media:register` | `lib/media.ts`, `docs/media/SLOT_MAP.yaml` |
| **Legacy image constants** | Hardcoded GCS URLs | Same bucket, various paths | Public | `lib/image-constants.ts` |
| **Local media workspace** | Operator inbox/processed | `media/inbox`, `media/processed` | Gitignored working files | `scripts/media/*.mjs` |
| **Go High Level** | Contacts, tags, opportunities | LeadConnector SaaS | API (server token) | `lib/ghl.ts` |
| **FieldPortals** | Customer billing/account data | External SaaS | Browser session on vendor domain | N/A in repo |
| **Strapi (legacy)** | CMS content | `STRAPI_API_URL` (default `api.cutrateslawn.com`) | Bearer token | `lib/api.ts`, mock fallbacks |

**Supabase:** Not present — zero matches for `supabase/` directory or `@supabase/*` dependencies.

---

## Media Pipeline

```
Envato license → media/inbox
        │
        ▼
media:prepare → media:upload (gcloud storage cp)
        │
        ▼
gs://site_photo_storage/cutrateslawn/prod/{asset_id}/*
        │
        ▼
media:register → lib/generated/media-map.json
        │
        ▼
Runtime: mediaSrc(slot) / getMedia(slot)
```

Upload sets cache headers: `public,max-age=31536000,immutable` (`scripts/media/upload.mjs`).

---

## Application Data (in-process)

| Data | Store | Durability | Routes |
|------|-------|------------|--------|
| Lead idempotency keys | `Map` in `/api/lead` | Per serverless instance / cold start loss | `app/api/lead/route.ts` |
| Newsletter idempotency | `Map` in `/api/newsletter` | Same | `app/api/newsletter/route.ts` |
| IP rate-limit counters | `Map` in `/api/lead` | Same | `app/api/lead/route.ts` |

No file-based or DB session store in the Next app.

---

## Schemas / Migrations

| Artifact | Exists? |
|----------|---------|
| `supabase/migrations/` | No |
| SQL schema files | No |
| RLS policies | N/A |
| Prisma / Drizzle | No |

---

## Content Sources

| Source | Used for |
|--------|----------|
| Static TS/MDX in `app/`, `lib/marketing-content.ts` | Primary page copy |
| `lib/generated/media-map.json` | Image slots |
| `lib/image-constants.ts` | Legacy homepage/service images (parallel path) |
| Strapi API | Legacy blog/services (fallback/mock) |

---

## Environment Variables (data-related)

From `.env.example`:

- `NEXT_PUBLIC_MEDIA_BASE_URL=https://storage.googleapis.com/site_photo_storage`
- `GCS_MEDIA_BUCKET=site_photo_storage`
- `GCS_MEDIA_PREFIX=cutrateslawn/prod`
- `STRAPI_API_URL`, `STRAPI_API_TOKEN` (legacy)
- GHL vars (CRM, not local storage)

Operator upload requires **gcloud CLI** auth on developer machine (not in Vercel runtime).

---

## Evidence Paths

- `.env.example` — media + Strapi vars
- `scripts/media/lib.mjs`, `scripts/media/upload.mjs` — GCS upload
- `lib/media.ts`, `lib/generated/media-map.json` — runtime resolution
- `docs/media/MEDIA_PIPELINE.md` — operator runbook
- `docs/atmosphere/RECON.md` — dual image path note
