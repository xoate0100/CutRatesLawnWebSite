# Cut Rates Lawn Website

Marketing and lead-generation site for Cut Rates Lawn Care. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. Package manager: **pnpm** (`packageManager` in `package.json`).

## Environment variables

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site URL for metadata (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_BUSINESS_*` | Phone, email, address shown on the site |
| `NEXT_PUBLIC_CUSTOMER_PORTAL_URL` | FieldPortals / customer login link |
| `GHL_PRIVATE_INTEGRATION_TOKEN` / `GHL_LOCATION_ID` | Go High Level lead upsert (production — human sets on Vercel) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Optional Cloudflare Turnstile on contact/quote |

All public config is read via `lib/site-config.ts`. See `.env.example` for the full list.

## Quick start

```bash
pnpm install
cp .env.example .env   # then edit .env with your values
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Development server |
| `pnpm run build` | Production build |
| `pnpm run lint` | ESLint |
| `pnpm run verify` | Full agentic verification (build via exec_guard + governance checks) |
| `pnpm run agentic:context` | Regenerate `6_ai_runtime_context/AI_CONTEXT.md` |
| `pnpm run media:validate` | Media slot / map validation |
| `pnpm run test:e2e` | Playwright suite |

## Careers & CRM

- Careers portal: `/careers`, `/careers/apply` — applications POST to `/api/lead` with `source: "careers"`.
- Customer login/register/account redirect to FieldPortals (`siteConfig.customerPortalUrl`).
- GHL production wiring and nurture workflows remain human ops — see `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` (`GHL-OPS-001`, `GHL-WF-001`–`003`).
- Preferred Envato upgrades for careers media: `CAREERS-MEDIA-001`.

## Development AI onboarding

Before implementing any feature, read in order:

1. [`docs/DEV_COLD_START_KNOWLEDGE.md`](docs/DEV_COLD_START_KNOWLEDGE.md)
2. [`6_ai_runtime_context/AI_CONTEXT.md`](6_ai_runtime_context/AI_CONTEXT.md)
3. [`5_reference_architectures/DECISION_REGISTRY.yaml`](5_reference_architectures/DECISION_REGISTRY.yaml)

Migration status: [`AGENTIC_UPGRADE_PLAN.md`](AGENTIC_UPGRADE_PLAN.md)

## Project structure

```
app/           Next.js App Router pages
components/    React components (shadcn/ui in components/ui/)
lib/           Shared utilities
hooks/         React hooks
docs/          Agentic and project documentation
0_phase0_bootstrap/   Governance config (read-only for agents)
5_reference_architectures/   Decision registry (proposal-only edits)
6_ai_runtime_context/   Active plan and AI context
```

## Agentic maturity

**L2.5 Single-Agent Sandbox** — see `0_phase0_bootstrap/AI_SANDBOX_RULES.md`.
