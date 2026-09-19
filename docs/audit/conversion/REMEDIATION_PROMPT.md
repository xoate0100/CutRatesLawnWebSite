# Conversion — Remediation Prompt

Run with `/audit-conversion --fix`. Coordinate with GHL outstanding tasks.

## Phase 1 — Lead capture reliability (P1)

1. Complete `GHL-OPS-001`: set `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID` on Vercel.
2. Build `GHL-WF-001` nurture workflow (tag `website-lead`).
3. Run `GHL-TEST-001` smoke: quote + contact → tagged contact in GHL.
4. Add user-facing fallback copy on 503 responses: show phone + email from `siteConfig`.

## Phase 2 — Funnel completion (P2)

1. **Schedule:** POST to `/api/lead` with `source: schedule`, preferred date in message body; keep mailto as secondary.
2. **Careers apply:** Replace mailto with `/api/lead` or dedicated `/api/careers-apply` route; tag `careers-applicant` in GHL.
3. Align `/referral` capture with same lead API pattern.

## Phase 3 — CTA discipline (P2)

1. Audit mobile overlay: adjust `StickyQuoteBar` z-index/padding per `TEXT-UNDER` findings.
2. Define one primary CTA per page type in a small config (`lib/cta-config.ts`).
3. Update `lib/fallback-data.ts` links to `/quote` for lead-gen CTAs.

## Phase 4 — Message match (P2)

1. Reconcile `app/pricing/page.tsx` dollar amounts with `lib/pricing/estimate.ts` or add disclaimer linking to quote estimator.
2. Ensure paid ad landing URLs use `?service=` query mapping in `quote-funnel.tsx`.

## Phase 5 — Copy governance (P3)

1. Add script `scripts/lint-careers-copy.mjs` scanning careers TSX + YAML against `copy_lint_rules.case_insensitive_reject_phrases`.
2. Wire into `npm run verify` or E2E suite for `/careers` and `/careers/apply`.
3. Extend E2E to cover `work-life balance` and full reject list from guidelines.

## Verification

```bash
npm run verify
pnpm run test:e2e -- tests/e2e/prospect-journey.spec.ts tests/e2e/careers-tools.spec.ts
# Manual: submit quote on preview deploy, confirm GHL contact
```
