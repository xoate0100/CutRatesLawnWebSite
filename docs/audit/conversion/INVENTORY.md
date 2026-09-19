# Conversion — Inventory

**Audit:** `audit-conversion` | **Mode:** discovery | **Stack:** next | **Date:** 2026-09-01

## Funnel map

| Funnel | Entry | Steps | Capture | Confirmation |
|--------|-------|-------|---------|--------------|
| **Quote** | `/quote`, hero CTAs, sticky bar, `?service=` deep links | Details → Estimate → Contact → Done | `POST /api/lead` (`source: quote`) | In-funnel success state + `requestId` |
| **Contact** | `/contact`, footer, fallback CTAs | Single form | `POST /api/lead` (`source: contact`) | Toast / inline success |
| **Schedule** | `/schedule` | Service + date picker | **mailto** or redirect to `/contact?service=&preferredDate=` | No API capture |
| **Careers apply** | `/careers#apply`, `/careers/apply` | 4-step wizard | **mailto:** to `siteConfig.email` | "Application started" + call CTA |
| **Newsletter** | Footer / signup components | Email field | `POST /api/newsletter` | Inline message |
| **Referral** | `/referral` | Form (client page) | Unclear / likely mailto or stub | Not traced in this audit |

## CTA surfaces

| Component | Path | Primary action |
|-----------|------|----------------|
| `Hero` (blocks) | `components/blocks/hero.tsx` | Quote + secondary |
| `QuoteBand` | `components/blocks/quote-band.tsx` | `/quote` |
| `StickyQuoteBar` | `components/blocks/sticky-quote-bar.tsx` | Floating chip → `/quote` |
| `CTASection` | `components/cta-section.tsx` | Configurable buttons |
| `SiteHeader` | `components/blocks/site-header.tsx` | "Get a quote" persistent |
| `siteConfig` CTAs | `lib/static-data.ts` → `ctaContent` | Mixed `/contact` links |

## Quote funnel detail

- Component: `components/quote/quote-funnel.tsx` (client, 4 steps)
- Pricing engine: `lib/pricing/estimate.ts` (unit-tested via `pnpm run test:pricing`)
- Lead API: `app/api/lead/route.ts` — Zod validation, honeypot, rate limit, idempotency, Turnstile optional, GHL/webhook/Resend delivery
- E2E: `tests/e2e/prospect-journey.spec.ts`, `tests/e2e/redesign.spec.ts`

## Careers copy governance

| Asset | Path | Role |
|-------|------|------|
| Copy guidelines (strict) | `docs/cut_rates_careers_copy_guidelines.yaml` | Reject phrases, fact verification rules |
| Fact registry | `lib/careers/fact-registry.ts` | Verified roles; null pay until Ops confirms |
| E2E lint | `tests/e2e/careers-tools.spec.ts` | Asserts no rejected culture phrases on `/careers` |

**Rejected phrases (sample from guidelines + E2E):** `competitive pay`, `join our family`, `work-life balance` (E2E only), plus 15+ in `copy_lint_rules.case_insensitive_reject_phrases`.

## Lead delivery status

- Code: `lib/ghl.ts`, `app/api/lead/route.ts`
- Backlog: `GHL-OPS-001`, `GHL-WF-001`, `GHL-TEST-001` in `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` — **production GHL env and nurture workflow pending**

## Trust signals

- Testimonials marquee, before/after slider, Google reviews components
- Careers trust grid (5 verified-fact cards)
- FAQ accordion on home and `/faq`
