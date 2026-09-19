# Optimization — Coverage Matrix

| Area | Checked | Result | Evidence |
|------|---------|--------|----------|
| LCP (hero images) | Partial | Media slots via `mediaSrc()` | `lib/media.ts` |
| CLS (fonts) | Yes | **Pass** — `next/font` + swap | `app/layout.tsx` |
| CLS (images) | Partial | `MediaFrame` uses sized containers | spot-check |
| CLS (sticky UI) | Yes | **Fail** | `artifacts/audit/local-summary.json` |
| INP / client JS | Suspected | Heavy client components on home | `"use client"` count |
| `next/image` usage | Partial | Legacy `<img>` in old Hero | `components/hero.tsx` |
| Image `priority` on LCP | Suspected | Not audited per-route | — |
| Bundle size analysis | Yes | **Not run** | no analyzer configured |
| RSC boundaries | Partial | LiveChat dynamically imported | `app/layout.tsx` |
| Dead dependencies | Yes | **Gap** — `@fontsource-*` unused | `package.json` |
| Font duplication | Yes | **Gap** | next/font + fontsource packages |
| CSS weight (Tailwind 3) | Suspected | Not measured | `tailwindcss@3.4` |
| Data fetching waterfalls | Partial | Static marketing site | minimal server fetch |
| Lighthouse scores | Partial | Script exists; artifacts not in repo root | `scripts/lighthouse-redesign.mjs` |
| Memory leaks (careers tools) | Suspected | Event listeners cleaned in sticky bar | `sticky-quote-bar.tsx` |

**Coverage score:** 3 / 15 areas fully passing.
