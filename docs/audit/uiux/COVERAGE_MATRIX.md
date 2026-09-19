# UI/UX Audit — Coverage Matrix

| Area | Inspected | Method | Result |
|------|-----------|--------|--------|
| Tailwind / CSS tokens | Yes | `app/globals.css`, layout, sample pages | Pass — brand vars present; `overflow-x: clip` on `html` |
| shadcn conformance | Yes | `components/ui/*`, quote funnel | Partial — quote funnel uses `primary`/`muted` shadcn tokens; marketing uses `forest`/`lime` |
| Atmosphere layer | Yes | globals, hero blocks, careers grain | Pass — `.grain`, `.atm-*` used on heroes |
| Sticky header | Yes | `site-header.tsx`, layout | Pass — sticky top, backdrop blur |
| Sticky quote bar | Yes | `sticky-quote-bar.tsx`, adversarial JSON | Pass — corner chip; no center-column cover in adversarial matrix |
| Live chat FAB | Yes | `live-chat.tsx`, wave2 collision | Pass — no overlap with sticky chip at 390px |
| Mobile nav | Yes | site-header, wave2 menu probe | Pass — drawer opens, 8 links |
| Touch targets | Partial | adversarial script thresholds | Pass on audited routes; careers not in matrix |
| Responsive overflow | Yes | adversarial `report.json` | Pass — 0 overflow findings across 10 viewports × 4 routes |
| Careers page layout | Yes | `app/careers/page.tsx` | Partial — conforms to tokens; double-footer; lang toggle non-functional for copy |
| Careers apply page | Yes | `app/careers/apply/page.tsx` | Pass — uses `pageWrap`, readable hierarchy |
| A11y focus / ARIA | Partial | code review | Partial — careers EEO/hiring entity are non-link spans |
| Dark mode | No | — | Not audited (single light-forward theme) |
| Figma drift | No | — | No Figma source bound in repo for Cut Rates redesign |

## Route × viewport matrix (automated)

**Source:** `artifacts/audit/adversarial/report.json` (2026-08-27, Vercel preview)

| Route | galaxy-fold | iphone-se | iphone-14 | pixel-7 | ipad | laptop | desktop | ultrawide |
|-------|:-----------:|:---------:|:---------:|:-------:|:----:|:------:|:-------:|:---------:|
| `/` | pass | pass | pass | pass | pass | pass | pass | pass |
| `/quote` | pass | pass | pass | pass | pass | pass | pass | pass |
| `/services/landscaping` | pass | pass | pass | pass | pass | pass | pass | pass |
| `/bundles` | pass | pass | pass | pass | pass | pass | pass | pass |

**Not in matrix:** `/careers`, `/careers/apply`, `/contact`, `/service-areas/*`

## Sticky chrome interaction (wave2)

| Check | iphone-14 (390×844) | Result |
|-------|---------------------|--------|
| Sticky quote visible after scroll | yes | Pass |
| Chat FAB collision with sticky | measured gap | Pass (`collision.ok: true`) |
| Quote stepper fits viewport | spans within 353px of 390 | Pass |
| Galaxy Fold 280px home H1 | h1Right 260 | Pass |
