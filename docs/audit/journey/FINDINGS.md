# Journey Audit — Findings

**Mode:** discovery

| ID | Priority | Title | Evidence |
|----|----------|-------|----------|
| F-001 | P1 | Careers application exits via `mailto:` — no server-side lead capture | `components/careers/apply-form.tsx` `submit()` builds `mailto:` URL; no `fetch('/api/lead')` or careers endpoint |
| F-002 | P1 | Applicant journey breaks on devices without configured email client | Same mailto pattern — common on shared/mobile kiosks |
| F-003 | P2 | Careers journeys absent from adversarial responsive test matrix | `adversarial-responsive-journey.mjs` `JOURNEY_ROUTES` lacks `/careers`, `/careers/apply`, `/contact` |
| F-004 | P2 | Spanish applicant path is incomplete | `lang-toggle.tsx` cosmetic; hero "Aplicar en Español" → `#apply` but form labels English only |
| F-005 | P2 | Two apply entry points with same mailto backend | `/careers#apply` and `/careers/apply?job=` — consistent but duplicates analytics surface |
| F-006 | P2 | Job card deep-link pre-fills title but not validated server-side | `apply-form.tsx` uses `initialJobId` from query client-side only |
| F-007 | P3 | Quote and contact converge on `/api/lead` — good pattern not extended to careers | `app/api/lead/route.ts` accepts `source` field; careers could use `source: "careers"` |
| F-008 | P3 | Live chat hidden on quote but not on careers apply | `live-chat.tsx` `hideOnQuote` only — FAB still competes for thumb zone on long apply scroll |

## Summary

| Priority | Count |
|----------|------:|
| P0 | 0 |
| P1 | 2 |
| P2 | 4 |
| P3 | 2 |

**Verdict:** Prospect journeys (home, quote, contact) are wired to `/api/lead` and pass mobile automation. Applicant careers journey is a **manual email handoff** — primary gap for hiring funnel reliability.

## Top findings (detail)

### F-001 — Careers apply not integrated with lead pipeline
Quote and contact forms POST structured JSON with idempotency, Turnstile, and GHL delivery. Careers form composes a mailto body and sets `window.location.href` — ops cannot track applicants in CRM unless the user completes send.

### F-003 — Test coverage gap for careers/contact mobile
Production confidence is high for `/` and `/quote` (41/41 adversarial cells pass). Careers and contact mobile layouts are unproven under fold-width and sticky-chrome probes.

### F-004 — Bilingual journey mismatch
Marketing promises EN | ES and shows a language toggle, but the apply form and most careers copy are English-only — friction for stated audience.
