# Cut Rates Lawn Website

Marketing and lead-generation site for Cut Rates Lawn Care. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

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

All public config is read via `lib/site-config.ts`. See `.env.example` for the full list.

## Quick start

```bash
npm install
cp .env.example .env   # then edit .env with your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run verify` | Full agentic verification (build + governance checks) |
| `npm run agentic:context` | Regenerate `6_ai_runtime_context/AI_CONTEXT.md` |

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
