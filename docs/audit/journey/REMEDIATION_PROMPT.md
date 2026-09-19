# Journey Remediation Prompt

Discovery: **0 P0 · 2 P1 · 4 P2**. Prioritize careers apply integration.

## Phase 1 — Careers apply → lead API (P1)

1. Extend `app/api/lead/route.ts` schema (or add `app/api/careers/apply/route.ts`) to accept:
   - `name`, `phone`, `zip`, `job`, `availability`, `canReach`, `experience`, `language`, `smsConsent`
   - `source: "careers"`, `idempotencyKey`
2. Replace `mailto:` in `CareersApplyForm.submit()` with `fetch` mirroring `ContactFormBlock` error/success UX
3. Map GHL custom fields / tags for careers pipeline (coordinate with GHL-OPS backlog)
4. Keep mailto as fallback only when API returns 5xx (optional)

## Phase 2 — Mobile & test coverage (P2)

1. Add to `adversarial-responsive-journey.mjs`:
   - `/careers` (scroll to `#apply`, open job card)
   - `/careers/apply?job=crew-member-i`
   - `/contact`
2. Add Playwright step: complete careers form through submit (mock API in test env)
3. Verify sticky quote + chat on careers page at iphone-se after scrolling to apply section

## Phase 3 — Spanish path (P2)

1. Minimum: translate apply form labels + step names when `lang === "es"` (share state from `CareersLangToggle` via context or URL `?lang=es`)
2. Or remove ES CTAs until copy is verified (align with UI/UX F-002)

## Phase 4 — Analytics & dedup (P3)

1. Single canonical apply URL: prefer `/careers/apply` with hash redirect from `#apply`
2. Emit `source: "careers"` + `jobId` on lead payload for funnel reporting

## Verification

```bash
npm run verify
# Manual: submit test careers application → confirm GHL contact or webhook receipt
AUDIT_BASE=http://127.0.0.1:3010 node scripts/adversarial-responsive-journey.mjs
```

Acceptance: careers apply succeeds without mail client; mobile adversarial matrix includes careers routes with zero `center-cover` / `doc-overflow` issues.
