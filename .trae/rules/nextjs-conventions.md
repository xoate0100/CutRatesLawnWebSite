---
description: Next.js App Router and shadcn/ui conventions for this repo
globs: "{app,components,lib,hooks}/**/*.{ts,tsx}"
alwaysApply: false
---

# Next.js conventions (CutRatesLawnWebSite)

- **Routing:** App Router only; pages in `app/**/page.tsx`.
- **Imports:** Use `@/` path alias for repo-root imports.
- **UI primitives:** Add to `components/ui/` following existing shadcn + Radix + CVA patterns.
- **Client components:** Add `"use client"` only when needed (hooks, interactivity).
- **Metadata:** Prefer `viewport` export for `themeColor` (see known debt in cold-start doc).
- **Styling:** Tailwind utilities; use `cn()` from `lib/utils.ts` for conditional classes.
- **No backend:** This repo is static/marketing UI; do not add API routes without a new decision proposal.
