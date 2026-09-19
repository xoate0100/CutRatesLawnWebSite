# UI/UX Audit — Findings

**Mode:** discovery  
**Priority key:** P0 = ship blocker · P1 = significant UX defect · P2 = polish / drift · P3 = nice-to-have

| ID | Priority | Title | Evidence |
|----|----------|-------|----------|
| F-001 | P2 | Careers routes omitted from authoritative responsive audit scripts | `scripts/responsive-ux-audit.mjs` `ROUTES` (lines 21–31) lacks `/careers`; adversarial matrix only covers 4 routes |
| F-002 | P2 | Careers language toggle does not change page content | `components/careers/lang-toggle.tsx` — `lang` state local only; ES button has `title` admitting copy is in progress |
| F-003 | P2 | Duplicate header component implementations risk design drift | Four header files exist; only `components/blocks/site-header.tsx` is mounted in `app/layout.tsx` |
| F-004 | P2 | Careers page renders two footers | `app/careers/page.tsx` inline `<footer>` (lines 366–401) plus global `SiteFooter` from layout |
| F-005 | P2 | Quote funnel token palette diverges from marketing pages | `components/quote/quote-funnel.tsx` uses `bg-primary`, `text-muted-foreground`; site chrome uses `forest`/`lime` |
| F-006 | P2 | Careers compliance links are non-interactive placeholders | `app/careers/page.tsx` — EEO and Hiring entity are `<span title=…>` without `href` or expandable content |
| F-007 | P3 | Mobile menu button may be under 44×44px touch guideline | `site-header.tsx` hamburger `px-3 py-2` with 20px icon — adversarial did not flag on audited routes |
| F-008 | P3 | Legacy header files retain old logo `mediaSrc` pattern | `components/header.tsx`, `components/layout/header.tsx` — unused but confusing for contributors |

## Summary

| Priority | Count |
|----------|------:|
| P0 | 0 |
| P1 | 0 |
| P2 | 6 |
| P3 | 2 |

**Verdict:** Core marketing routes pass automated responsive/sticky-chrome probes. No P0/P1 UI defects on audited paths. Careers and token consistency gaps remain.

## Top findings (detail)

### F-001 — Careers not in responsive audit matrix
Automated scripts that gate release confidence do not visit `/careers` or `/careers/apply`. The careers hero uses `clamp()` typography and a two-column grid that may regress on fold-width devices without CI coverage.

### F-002 — Language toggle is cosmetic
Applicants see EN/ES toggle in the hero but all body copy stays English. The ES path links to `#apply` with label "Aplicar en Español" while the toggle does not drive i18n — misleading for Spanish-primary users.

### F-004 — Double footer on careers
After the careers-specific footer strip, users still scroll into the global marketing footer — redundant links and visual weight on a long page.
