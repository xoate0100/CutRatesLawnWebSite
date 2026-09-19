# Journey Audit — Coverage Matrix

| Journey | Steps mapped | Automated test | Manual/code review | Result |
|---------|--------------|----------------|-------------------|--------|
| Home → Quote | 4 | adversarial + wave2 stepper | `quote-funnel.tsx`, `/api/lead` | **Pass** — API path exists; sticky hidden on quote |
| Home → Contact | 3 | link smoke only | `contact-form-block.tsx` | **Pass** — uses `/api/lead` |
| Service page → Quote | 2 | partial (`?service=` in code) | `serviceFromQuery` | **Pass** (code); not in adversarial E2E |
| Careers browse | 5+ sections | pre-release route list | `app/careers/page.tsx` | **Partial** — page loads; no funnel automation |
| Careers apply (inline) | 4 steps | none | `apply-form.tsx` | **Fail** — mailto handoff |
| Careers apply (dedicated) | 4 steps | ci-link-smoke 200 | `apply/page.tsx` | **Fail** — same mailto handoff |
| Mobile: menu → quote | 2 | wave2 menu probe | — | **Pass** |
| Mobile: sticky + chat coexist | scroll | wave2 collision | — | **Pass** at 390px |
| Mobile: careers | — | **not in adversarial** | long page, tools | **Unknown** |
| Galaxy-fold home | 1 | adversarial report | — | **Pass** |
| Galaxy-fold quote | 1 | adversarial report | — | **Pass** |

## Route coverage in automated journey scripts

| Route | responsive-ux | adversarial | wave2 | pre-release |
|-------|:-------------:|:-----------:|:-----:|:-----------:|
| `/` | yes | yes | yes | yes |
| `/quote` | yes | yes | yes | yes |
| `/contact` | yes | no | no | yes |
| `/careers` | no | no | no | yes |
| `/careers/apply` | no | no | no | smoke only |

## Mobile path checklist

| Check | Status | Source |
|-------|--------|--------|
| No horizontal overflow on core routes | Pass | adversarial `report.json` |
| Quote stepper fits 390px | Pass | wave2 `stepper` |
| Sticky quote does not cover H1 | Pass | adversarial metrics |
| Chat FAB vs sticky chip gap | Pass | wave2 `collision.ok` |
| Careers apply on phone | Not tested | — |
| mailto: apply on mobile without mail client | Risk | code review |
