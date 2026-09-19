# UI/UX Remediation Prompt

Use with `/audit-uiux --fix` or a focused implementation session. Discovery found **0 P0, 0 P1** — phase work by P2 items.

## Phase 1 — Coverage (P2)

1. Add `/careers` and `/careers/apply` to `scripts/responsive-ux-audit.mjs` `ROUTES` and `scripts/adversarial-responsive-journey.mjs` journey set.
2. Re-run audits against local (`AUDIT_BASE=http://127.0.0.1:3010`) and capture screenshots for careers at iphone-se and galaxy-fold.
3. Fix any new overflow, clip, or sticky-overlay hits before proceeding.

## Phase 2 — Careers UX (P2)

1. **Language toggle:** Either wire `CareersLangToggle` to a minimal `careers-i18n.ts` string map (hero + apply CTA at minimum) or remove ES affordances until copy is verified.
2. **Footer:** Drop the inline careers `<footer>` and move applicant privacy/EEO/accommodation links into a single `CareersFooterStrip` above global `SiteFooter`, or hide global footer on `/careers` via layout segment.
3. **Compliance links:** Replace `<span title=…>` EEO / hiring-entity placeholders with real `/privacy` anchors or a `/careers/eeo` content page.

## Phase 3 — Design-system consistency (P2–P3)

1. Align `QuoteFunnel` step pills and cards to brand tokens (`bg-forest`, `text-lime`, `border-line`) matching `SectionHead` / `Button variant="lime"`.
2. Delete or archive unused headers (`components/header.tsx`, `components/layout/header.tsx`, `components/site-header.tsx`) after confirming no imports — keep `components/blocks/site-header.tsx` as canonical.
3. Bump mobile menu button to `min-h-11 min-w-11` for WCAG 2.5.5 alignment.

## Verification

```bash
npm run verify
AUDIT_BASE=http://127.0.0.1:3010 node scripts/responsive-ux-audit.mjs
AUDIT_BASE=http://127.0.0.1:3010 node scripts/adversarial-responsive-journey.mjs
```

Acceptance: zero `critical`/`high` findings on careers routes; no duplicate footer visual regression on desktop.
