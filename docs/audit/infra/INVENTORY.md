# Infrastructure Audit — Inventory

**Command:** `audit-infra`  
**Mode:** discovery (read-only)  
**Stack:** next  
**Date:** 2026-09-01

## Providers

| Provider | Role | Config location | Notes |
|----------|------|-----------------|-------|
| **Vercel** | Next.js hosting, serverless API routes, previews | `vercel.json`, dashboard project `v0-cut-rates-lawn-main-page` | Domain ref: `d7d7wkfp.cutrateslawn.com` (HUMAN_TASKS) |
| **GitHub Actions** | CI on push/PR to main/master | `.github/workflows/ci.yml` | Node 20, pnpm, `pnpm run verify` |
| **Google Cloud Storage** | Static media CDN origin | Env vars + `gcloud` scripts | Not Vercel-hosted; public bucket |
| **Go High Level** | CRM API from serverless functions | Vercel env (pending) | See integrations audit |
| **FieldPortals** | External customer portal | External DNS | Not hosted on Vercel |

**Cloudflare:** Turnstile verification endpoint only (`challenges.cloudflare.com`). No Workers in this repo.

**AWS / Supabase:** Not used.

---

## Deployment Configuration

### `vercel.json`

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### `next.config.mjs`

- `eslint.ignoreDuringBuilds: true`
- `typescript.ignoreBuildErrors: true`
- Image domains: `storage.googleapis.com`
- Redirects: `/account` → `/portal`, legacy blog/case-study paths, etc.

### `package.json`

- `packageManager`: `pnpm@10.26.0`
- Scripts: `build`, `verify`, `test:e2e`, audit scripts
- **No `engines` field** pinning Node version

---

## CI/CD Pipeline (`.github/workflows/ci.yml`)

| Step | Command | Notes |
|------|---------|-------|
| Checkout | `actions/checkout@v4` | |
| Package manager | `pnpm/action-setup@v4` | |
| Node | 20 + pnpm cache | |
| Install | `pnpm install --frozen-lockfile` | |
| Context | `pnpm run agentic:context` | |
| Verify | `pnpm run verify` | Build + governance gates |
| Audit | `pnpm audit --audit-level=critical \|\| true` | **continue-on-error: true** |
| Smoke | `next start` + `ci-link-smoke.mjs` | Link + 404 check |

No deploy job in workflow — deployment assumed via Vercel git integration.

---

## Environment Variables

### Public (`NEXT_PUBLIC_*`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL / OG |
| `NEXT_PUBLIC_BUSINESS_*` | Contact info |
| `NEXT_PUBLIC_CUSTOMER_PORTAL_URL` | FieldPortals |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | GCS public base |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Social metadata |
| Optional: GA, Turnstile site key, social URLs, Maps embed | Not set in example |

### Server-only

| Variable | Purpose |
|----------|---------|
| `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID` | CRM (**pending prod**) |
| `GHL_CF_*`, `GHL_LEAD_TAGS` | Optional GHL fields |
| `CONTACT_FORM_WEBHOOK_URL`, `NEWSLETTER_WEBHOOK_URL` | Webhooks |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL` | Email |
| `TURNSTILE_SECRET_KEY` | Spam |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Reviews |
| `STRAPI_API_URL`, `STRAPI_API_TOKEN` | Legacy CMS |
| `GCS_MEDIA_BUCKET`, `GCS_MEDIA_PREFIX` | Media scripts (local/CI ops) |

`.env` is gitignored; `.env.example` is the contract.

---

## Preview vs Production

| Concern | Preview | Production |
|---------|---------|------------|
| GHL lead delivery | Likely unset unless mirrored | **GHL-OPS-001 pending** |
| Public business env | Can use defaults | Should match live business data |
| Debug API routes | Same code deployed | `/api/google-reviews-debug` exposed |
| Build quality gates | TS/ESLint ignored at build | Same — risk in all envs |

**Suspected:** Preview deployments may accept real GHL writes if secrets copied — recommend separate GHL location or disable GHL on preview.

---

## Runtime

- API routes: `export const runtime = "nodejs"` on lead/newsletter
- No `middleware.ts` in inventory (i18n bypass CVE N/A for App Router default)
- Health: `/api/health` runs Strapi diagnostics (may slow/hang on external calls)

---

## DNS / TLS

Not verifiable from repo. Documented production domain: `cutrateslawn.com` / `d7d7wkfp.cutrateslawn.com` (Vercel alias per human tasks).

---

## Evidence Paths

- `vercel.json`, `next.config.mjs`, `.github/workflows/ci.yml`
- `.env.example`, `6_ai_runtime_context/OUTSTANDING_TASKS.yaml`
- `docs/atmosphere/HUMAN_TASKS.md` (H-OPS-02 Vercel deploy)
- `scripts/verify.mjs`
