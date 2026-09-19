# Infrastructure Audit — Coverage Matrix

**Mode:** discovery | **Date:** 2026-09-01

| Area | Ran? | Method | Result |
|------|------|--------|--------|
| Vercel project config | Yes | examine `vercel.json` | npm install override; nextjs framework |
| Build command parity | Yes | compare CI vs Vercel | CI uses **pnpm**; Vercel uses **npm** |
| Node version pin | Yes | examine CI, package.json | CI Node 20; no `engines` in package.json |
| TypeScript/ESLint at build | Yes | examine `next.config.mjs` | **Both ignored** |
| CI verify gate | Yes | examine `ci.yml`, `verify.mjs` | Runs on PR/push |
| CI npm audit enforcement | Yes | examine ci.yml | Critical audit **non-blocking** |
| E2E / link smoke in CI | Yes | examine ci.yml | Post-build link smoke |
| Env var documentation | Yes | examine `.env.example` | Comprehensive |
| Prod secrets (GHL) | Yes | examine OUTSTANDING_TASKS | **Pending** — dashboard Suspected |
| Preview vs prod parity | Partial | examine docs | GHL on preview not documented |
| Debug routes in prod | Yes | examine `app/api/*` | google-reviews-debug, test routes |
| CDN / caching (Next) | Yes | examine next.config | GCS image optimizer; no global headers |
| IaC / Terraform | Yes | glob | **None** — manual Vercel/GCS |
| DNS / TLS / HSTS | No | dashboard | **Suspected** — needs Vercel/CF console |
| Cost / concurrency limits | No | dashboard | Not examined |
| Failover / health checks | Partial | examine `/api/health` | Exists; calls external Strapi |

**Coverage:** 12/16 areas examined in-repo; 4 require dashboard access.
