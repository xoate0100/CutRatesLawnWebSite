# Integrations Audit — Inventory

**Command:** `audit-integrations`  
**Mode:** discovery (read-only)  
**Stack:** next  
**Date:** 2026-09-01  
**Repo:** Cut Rates Lawn WebSite

## Summary

The site is a Next.js 14 marketing app with **server-side lead delivery** as the primary integration surface. CRM is Go High Level (LeadConnector); customer accounts live in **FieldPortals** (external). There is **no GA4/analytics** wired. Legacy **Strapi CMS** code remains but is not the active content path. Media is served from **Google Cloud Storage** (not an integration call path from runtime).

---

## Integration Matrix

| Integration | Role | Auth | Config / env | Code touchpoints | Status |
|-------------|------|------|--------------|------------------|--------|
| **Go High Level (LeadConnector)** | CRM contact upsert + workflow tags | Private Integration Token (server) | `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, optional `GHL_CF_*`, `GHL_LEAD_TAGS` | `lib/ghl.ts`, `app/api/lead/route.ts`, `app/api/newsletter/route.ts` | Code complete; **Vercel prod env pending** (GHL-OPS-001) |
| **FieldPortals** | Customer portal (billing/account) | External SaaS session | `NEXT_PUBLIC_CUSTOMER_PORTAL_URL` | `app/portal/page.tsx`, `lib/site-config.ts`, header/footer CTAs | Redirect/link only; **authz unvalidated** |
| **Vercel** | Hosting + serverless API routes | Dashboard / git deploy | `vercel.json`, project `v0-cut-rates-lawn-main-page` | All `app/api/*` | Active; install command mismatch with pnpm (see infra audit) |
| **Google Analytics 4** | Site analytics | N/A (not configured) | `NEXT_PUBLIC_GA_MEASUREMENT_ID` (commented in `.env.example`) | None found | **Not integrated** |
| **Cloudflare Turnstile** | Spam protection on leads | Site + secret keys | `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `app/api/lead/route.ts` (`verifyTurnstile`) | Optional — passes when secret unset |
| **Resend** | Email notification fallback | API key | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL` | `app/api/lead/route.ts`, `app/api/newsletter/route.ts` | Optional channel |
| **Webhook (n8n/etc.)** | Lead relay | URL secret | `CONTACT_FORM_WEBHOOK_URL`, `NEWSLETTER_WEBHOOK_URL` | Lead + newsletter routes | Optional channel |
| **Google Places API** | Live Google reviews | API key (server) | `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | `app/api/google-reviews/route.ts`, `lib/services/reviews/google-reviews-service.ts` | Implemented; env-dependent |
| **Strapi CMS** | Legacy headless CMS | Bearer token | `STRAPI_API_URL`, `STRAPI_API_TOKEN`, `NEXT_PUBLIC_STRAPI_API_URL` | `lib/api.ts`, `lib/api-client.ts`, `app/api/health/strapi/route.ts`, many hooks | **Orphaned** — site uses static/marketing content |
| **LeadConnector MCP** | Agent/operator CRM access | PIT in Cursor `mcp.json` | User env + MCP headers | `docs/integrations/GOHIGHLEVEL.md` | Local/dev operator tool, not runtime |

---

## Form → Delivery Flow

```
Contact / Quote / Newsletter UI
        │
        ▼
POST /api/lead  or  POST /api/newsletter
        │
        ├─► GHL contacts/upsert + tags (website-lead, source:*, service:*)
        ├─► CONTACT_FORM_WEBHOOK_URL / NEWSLETTER_WEBHOOK_URL (optional)
        └─► Resend email to LEAD_NOTIFY_EMAIL (optional)

Legacy stub (not used by current forms):
POST /api/contact  → logs only, no delivery
```

**Tag convention (GHL workflows):** `website-lead`, `source:contact|quote|newsletter`, `service:<slug>` — see `docs/integrations/GOHIGHLEVEL.md`.

---

## Third-Party Scripts (browser)

| Script / widget | Present? | Notes |
|-----------------|----------|-------|
| Google Analytics / gtag | No | Placeholder in `.env.example` only |
| GTM | No | — |
| GHL chat widget | No | `components/live-chat.tsx` is honest offline help (phone/email/links) |
| FieldPortals embed | No | External redirect only |
| Google Fonts | Yes | `next/font/google` (self-hosted at build) |
| Turnstile | Optional | Client widget not audited in this pass (env-gated) |

---

## API Routes (integration-relevant)

| Route | Purpose |
|-------|---------|
| `POST /api/lead` | Primary lead/quote delivery (GHL + fallbacks) |
| `POST /api/newsletter` | Newsletter subscribe (GHL + fallbacks) |
| `POST /api/contact` | **Legacy stub** — no CRM delivery |
| `GET /api/google-reviews` | Google Places proxy |
| `GET /api/google-reviews-debug` | **Debug** — exposes key/placeId metadata |
| `GET /api/health` | Runs Strapi diagnostics (may call external APIs) |
| `GET /api/health/strapi` | Strapi reachability |
| `GET /api/test`, `/api/simple`, `/api/html`, `/api/mock-homepage` | Dev/scaffold routes |

---

## Outstanding Backlog (from `6_ai_runtime_context/OUTSTANDING_TASKS.yaml`)

| ID | Item | Priority |
|----|------|----------|
| GHL-OPS-001 | Add `GHL_*` secrets to Vercel production | high |
| GHL-WF-001 | Workflow on tag `website-lead` | high |
| GHL-TEST-001 | E2E form → GHL smoke test | high |
| GHL-WF-002 | Source-specific branching | medium |
| GHL-WF-003 | Service tags + custom fields | medium |
| GHL-DEC-001 | Accept DEC-GHL-LEADCONNECTOR proposal | medium |

---

## Evidence Paths

- `lib/ghl.ts` — GHL client
- `app/api/lead/route.ts` — lead delivery orchestration
- `docs/integrations/GOHIGHLEVEL.md` — operator runbook
- `.env.example` — integration env contract
- `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` — open GHL/deploy tasks
- `docs/audit/FIELDPORTALS_AUTHZ_NOTE.md` — portal validation gap (F-018)
