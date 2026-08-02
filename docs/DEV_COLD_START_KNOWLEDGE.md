# Cut Rates Lawn — Cold Start Knowledge Base

**Purpose:** Single-document ingestion for development AI. Read this before implementing any feature.

**Audience:** Development AI (Cursor, agents, or engineers).

**Last Updated:** 2026-08-01

---

## 1. What This Project Is

- **CutRatesLawnWebSite** is a marketing and lead-generation website for Cut Rates Lawn Care.
- Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.
- **Scope:** Static/marketing pages (services, pricing, quote, schedule, contact, etc.). No live backend in this repo.
- **Origin:** v0-generated UI scaffold; pages under `app/` with shared layout in `app/layout.tsx`.

---

## 2. Non-Negotiable Constraints for Agents

1. **Do not break existing pages** — wrap, extend, or add alongside; never delete working routes.
2. **Respect decision registry** — read `5_reference_architectures/DECISION_REGISTRY.yaml` before structural changes.
3. **Preserve nextjs_root layout** — see DEC-0001; no `frontend/` normalization without human approval.
4. **Strict build gates** — TypeScript and ESLint run during `next build` (DEC-0006).
5. **Verify before done** — run `npm run verify` after substantive changes.

---

## 3. Architecture (App Router)

```
app/                    # Routes (file-based routing)
  layout.tsx            # Root layout, metadata, providers
  page.tsx              # Home
  [section]/page.tsx    # Section pages (services, bundles, etc.)
components/             # Shared UI
  ui/                   # shadcn primitives (Radix + CVA)
  header.tsx, footer.tsx
lib/utils.ts            # cn() and shared utilities
hooks/                  # use-mobile, use-toast
public/                 # Images and static files
```

**Path alias:** `@/*` maps to repo root (`tsconfig.json`).

---

## 4. UI Conventions

- **shadcn/ui** in `components/ui/` — add new primitives via shadcn CLI pattern, match existing CVA usage.
- **Theming:** `next-themes` via `components/theme-provider.tsx`.
- **Icons:** `lucide-react`.
- **Forms:** `react-hook-form` + `zod` where forms exist (contact, quote, schedule).
- **Styling:** Tailwind utility classes; `app/globals.css` for CSS variables.

---

## 5. Key Routes (33 static pages)

| Area | Paths |
|------|-------|
| Core | `/`, `/about`, `/contact`, `/faq` |
| Services | `/services`, `/services/*` (lawn-care, landscaping, etc.) |
| Bundles | `/bundles`, `/bundles/*` |
| Lead gen | `/quote`, `/schedule`, `/pricing`, `/referral` |
| Content | `/blog`, `/case-studies`, `/our-work`, `/community` |
| Other | `/careers`, `/certifications`, `/service-areas`, `/portal`, `/dashboard` |

---

## 6. Development Commands

```bash
npm run dev          # Local dev server
npm run build        # Production build
npm run lint         # ESLint (after config added)
npm run verify       # Full agentic verification gate
npm run agentic:context  # Regenerate AI_CONTEXT.md
npm run media:publish    # After dropping licensed assets in media/inbox/
npm run media:validate   # Registry integrity (+ optional --urls)
```

**Media pipeline:** Envato MCP (global Cursor OAuth) → human download into `media/inbox/` → `npm run media:publish` → `gs://site_photo_storage`. See `docs/media/MEDIA_PIPELINE.md` and `media/README.md`. Pages resolve slots via `lib/media.ts` (never hardcode GCS paths).

---

## 7. Agentic Workflow Entry Points

| Need | Read |
|------|------|
| Current task state | `6_ai_runtime_context/AI_CONTEXT.md` |
| Active plan | `6_ai_runtime_context/ACTIVE_PLAN.yaml` |
| Task pointer | `6_ai_runtime_context/ACTIVE_TASK_POINTER.yaml` |
| Open backlog | `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` |
| Settled decisions | `5_reference_architectures/DECISION_REGISTRY.yaml` |
| Write permissions | `0_phase0_bootstrap/feature_flags.yml` |
| Sandbox rules | `0_phase0_bootstrap/AI_SANDBOX_RULES.md` |
| Migration status | `AGENTIC_UPGRADE_PLAN.md` |
| Media assets | `docs/media/MEDIA_PIPELINE.md` |
| Go High Level / leads | `docs/integrations/GOHIGHLEVEL.md` |

**Current focus (2026-08-01):** plan `ghl-lead-workflows` — finish GHL tag workflows, Vercel `GHL_*` env, and E2E lead smoke tests. See outstanding IDs `GHL-OPS-001`, `GHL-WF-001`, `GHL-TEST-001`.

---

## 8. Pre-Implementation Checklist

Before any feature or refactor:

- [ ] Read this document and `AI_CONTEXT.md`
- [ ] Check `DECISION_REGISTRY.yaml` for relevant accepted decisions
- [ ] Confirm changes are within `permissions.write_to`
- [ ] No resurrection keywords in planned approach
- [ ] Plan doc updates if behavior changes
- [ ] Run `npm run verify` when done

---

## 9. Known Technical Debt

- Duplicate `hooks/use-mobile.tsx` and `components/ui/use-mobile.tsx`
- Duplicate `styles/globals.css` and `app/globals.css`
- Test suite not yet added (enable `enforce_tdd_cycle` when `tests/` exists)
