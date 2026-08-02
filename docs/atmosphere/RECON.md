# Atmosphere Recon — Cut Rates Lawn WebSite

**Date:** 2026-08-01  
**Scope:** Discover stack, tokens, media pipeline, surfaces, gates, brand.  
**Method:** Repo inspection only (no invented paths).

---

## 1. Stack

| Item | Found |
|------|--------|
| Framework | **Next.js 14.2.35** (App Router) — `package.json`, `app/` |
| React | **18.3.1** |
| Rendering | RSC + client components (`"use client"` on forms/chat/providers). Mixed static generation; some API routes `force-dynamic`. |
| Styling | **Tailwind CSS 3.4** + PostCSS (`tailwind.config.ts`, `postcss.config.mjs`) |
| Component kit | **shadcn/ui** (`components.json`: style `default`, RSC, CSS variables, Lucide) + **Radix** primitives under `components/ui/` |
| Icons | **lucide-react** (`components.json` `iconLibrary: lucide`) |
| Animation libs | **No** framer-motion / GSAP / Lottie. Motion via **`tailwindcss-animate`** + Tailwind `animate-*` / Radix open/close classes. |
| Images | Mix of raw `<img>`, occasional `next/image`, GCS URLs. `sharp` present for Next image pipeline. |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` on several forms |
| Font | **`next/font/google` → Inter** in `app/layout.tsx` |
| Theme | `next-themes` via `app/providers.tsx` / `components/theme-provider.tsx` |
| Charts | `recharts` (admin/dev surfaces) |
| Carousel | `embla-carousel-react` |

**Duplicate / drift notes**

- Two global CSS trees: **`app/globals.css`** (active — imported by `app/layout.tsx`) vs **`styles/globals.css`** (alternate token set, Geist refs — not wired by root layout).
- Two image systems (see §3).

---

## 2. Design tokens

**Primary source (live):** `app/globals.css` CSS variables under `:root` / `.dark`, mapped in `tailwind.config.ts` → `hsl(var(--*))`.

| Token group | Location | Notes |
|-------------|----------|--------|
| Color | `--background`, `--foreground`, `--primary` (≈ green `142 76% 36%`), `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--ring`, card/popover | shadcn HSL channels |
| Radius | `--radius: 0.5rem` → `rounded-lg/md/sm` | |
| Spacing | Tailwind default scale | No custom spacing tokens |
| Type | Inter only; Tailwind default type scale | No display/serif tokens; no motion-duration tokens |
| Elevation | Ad-hoc Tailwind `shadow-sm/md/lg/xl` | No named elevation scale |
| Motion | Accordion keyframes in `tailwind.config.ts`; Radix `animate-in/out` | **No** `prefers-reduced-motion` utilities found in CSS |

**Brand-vs-utility drift:** Marketing pages often hardcode `green-600`, `blue-600`, `gray-*`, `bg-white` instead of `primary` / `background` / `muted` tokens (e.g. home CTAs, 404 button is `blue-600`).

---

## 3. Media / Envato pipeline (confirmed)

**Contract (documented + scripted):**

```
Envato MCP (global ~/.cursor/mcp.json → https://mcp.envato.com/mcp)
  → human licenses / downloads
  → media/inbox/
  → npm run media:ingest | prepare | upload | register | sync-site | publish
  → docs/media/MEDIA_REGISTRY.yaml + SLOT_MAP.yaml
  → lib/generated/media-map.json
  → lib/media.ts (getMedia / mediaSrc / mediaAlt)
  → https://storage.googleapis.com/site_photo_storage/...
  → attribution on registry entries
```

| Link | Path / evidence |
|------|-----------------|
| Docs | `docs/media/MEDIA_PIPELINE.md`, `docs/media/SLOT_MAP.yaml`, `docs/media/MEDIA_REGISTRY.yaml` |
| Scripts | `scripts/media/{ingest,prepare,upload,register,sync-site,publish,validate,lib}.mjs` |
| Accessor | `lib/media.ts` + `lib/generated/media-map.json` |
| Inbox | `media/inbox|staging|processed|quarantine/` (+ `.gitkeep`) |
| Cursor rule | `.cursor/rules/media-pipeline.mdc` |
| Envato MCP | Global `mcp.json` key `envato` |
| Bucket | `gs://site_photo_storage` (`NEXT_PUBLIC_MEDIA_BASE_URL`) |

**Slots currently in map:** only `home.hero`, `header.logo` (both `published` in generated map).

**Parallel legacy path (still dominates homepage):** `lib/image-constants.ts` hardcodes GCS URLs (`IMAGES.HERO_HOME`, services, partners, etc.). Home (`app/page.tsx`) uses **`IMAGES`**, not `mediaSrc()`.

**Gaps (do not invent a second pipeline):**

1. Slot map coverage is thin vs. pages that still use `IMAGES` / placeholders.  
2. Homepage not wired through `lib/media.ts`.  
3. Many slots lack width/height → CLS risk when swapping assets.  
4. Envato attribution often null on published GCS-legacy assets.

**Minimal addition if expanding imagery:** extend `SLOT_MAP.yaml` + run existing `media:*` scripts; migrate call sites from `IMAGES` → `mediaSrc(slot)` — do not add a new CDN or inbox.

---

## 4. Surfaces inventory

### Shared chrome

| Surface | File(s) | Archetype (App B) |
|---------|---------|-------------------|
| Root layout | `app/layout.tsx` | chrome (affects all) |
| Header | `components/header.tsx` | chrome / nav |
| Footer | `components/footer.tsx` | chrome |
| Live chat | `components/live-chat.tsx` | overlay utility |
| Providers / toaster | `app/providers.tsx`, `components/ui/sonner.tsx` | system |
| Loading | `app/loading.tsx` | filler |
| 404 | `app/not-found.tsx` | filler / error |
| Error | `app/error.tsx`, `app/error/page.tsx` | filler / error |

### Marketing / pride (Tier 1 candidates)

| Route | Archetype |
|-------|-----------|
| `/` | landing / hero |
| `/about`, `/our-work`, `/case-studies`, `/testimonials`, `/community`, `/certifications` | brand / proof |
| `/services`, `/services/*`, `/services/[slug]` | feature / catalog |
| `/bundles`, `/bundles/*`, `/bundles/[slug]` | pricing-adjacent feature |
| `/pricing` | pricing |
| `/careers`, `/referral` | campaign / recruit |

### Utility / medium (Tier 2)

| Route | Archetype |
|-------|-----------|
| `/blog`, `/blog/[slug]` | listing + reading |
| `/faq`, `/service-areas`, `/sitemap` | utility content |
| `/search` | utility |
| `/portal`, `/dashboard`, `/account` | portal / hub (often redirect/handoff) |
| `/admin/*`, `/docs/content-types` | internal tools |

### Focus / minimal (Tier 3)

| Route | Archetype |
|-------|-----------|
| `/contact`, `/quote`, `/schedule`, `/careers/apply` | data-entry forms |
| `/login`, `/register` | auth |
| `/privacy`, `/terms` | legal reading |

### Dev / non-customer (exclude from atmosphere polish unless needed)

`/debug`, `/api-test`, `/api-simple-test`, `/image-test`, `/static-test`, `/test-page`, `/test-layout`, `/google-reviews-test`

**Approx. customer-facing page count:** ~45 distinct marketing/utility routes (excluding admin/dev).

---

## 5. Quality gates

| Gate | Evidence |
|------|----------|
| Lint | `eslint` + `eslint-config-next`; `npm run lint` |
| Build | `next build`; CI runs `npm run verify` |
| Verify | `scripts/verify.mjs` (scaffold + registry + production build) |
| CI | `.github/workflows/ci.yml` — npm ci, agentic:context, verify, npm audit critical, link smoke |
| E2E | Playwright: `tests/e2e/*.spec.ts`, `playwright.config.ts` |
| Browser audit scripts | `scripts/pre-release-browser-audit.mjs`, `ci-link-smoke.mjs`, `adversarial-audit-probes.mjs` |
| Visual regression | **Not found** |
| Perf budgets (LCP/CLS media weight) | **Not found** as formal budget file |
| TypeScript | `strict: true` in `tsconfig.json`; build may ignore errors via `next.config.mjs` `ignoreBuildErrors: true` (debt) |

---

## 6. Brand read

| Aspect | Observation |
|--------|-------------|
| Palette | Lawn-care green primary (`--primary` ≈ HSL 142°); lots of literal Tailwind greens/blues/grays on marketing |
| Typography | Inter, utilitarian; bold section titles; no display face |
| Logo | GCS branding assets + slot `header.logo` |
| Tone | Practical, local service, trust/value (“Cut Rates”) — **mid-regulated**: professional outdoor services, not playful consumer lifestyle |
| Atmosphere ceiling | Tier 1 allowed on marketing heroes/proof; stay Tier 3 on forms/auth/legal. Avoid purple/cream/AI-generic looks; keep outdoors green/earth depth |

**Brand position:** ~**3–4 / 10** on playful↔serious scale (toward serious/trustworthy). Atmosphere should add depth (scrims, photo craft, soft motion) without carnival excess.

---

## 7. One consolidated question (before Phase 2+)

Atmosphere work can proceed on **code/CSS (Phase 3A)** without new licenses. For imagery (3B):

**Should Phase 3B prioritize (A) migrating the live homepage + header off `lib/image-constants.ts` onto existing `lib/media.ts` slots, or (B) only defining new Envato slots while leaving the legacy `IMAGES` map until a later cutover?**

(Pipeline itself is clear; no need to invent another.)

---

## 8. Recon verdict

Ready for Phase 1 audit. Highest-leverage unfinished tells already visible: flat gray/white sections, hard seams, Inter+literal greens, dual media accessors, almost no intentional page motion / no reduced-motion policy, default 404, thin slot map vs. photo-heavy marketing intent.
