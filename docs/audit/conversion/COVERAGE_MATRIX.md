# Conversion — Coverage Matrix

| Area | Checked | Result | Evidence |
|------|---------|--------|----------|
| Quote funnel completeness | Yes | **Pass** | 4 steps ending in API submit |
| Contact funnel completeness | Yes | **Pass** | `/api/lead` wired |
| Schedule funnel capture | Yes | **Gap** | mailto / contact redirect only |
| Careers apply capture | Yes | **Gap** | mailto only, no CRM |
| Message match (ad → landing) | Partial | `?service=` on quote works | `quote-funnel.tsx` |
| Value prop above fold | Yes | **Pass** on quote/careers | spot-check |
| Single-CTA discipline | Yes | **Gap** | header + sticky bar + inline CTAs |
| Form friction (quote) | Yes | **Pass** | multi-step, validated |
| Form friction (careers) | Yes | **Pass** | 4 steps, mobile-tested |
| Trust near decision point | Partial | Quote has phone fallback | `/quote` hero |
| Careers rejected phrases | Yes | **Pass** (E2E) | `careers-tools.spec.ts` |
| Careers fact registry | Yes | **Pass** | null pay fields omitted |
| Lead delivery production | Yes | **Blocked** | `GHL-OPS-001` pending |
| Pricing page ↔ estimator alignment | Yes | **Gap** | static $99/$199 vs estimator |
| Voice / seasonal offer copy | Partial | Not fully audited | — |

**Coverage score:** 7 / 15 areas fully passing.
