---
name: audit-optimization
description: "Runtime, memory & image optimization - Core Web Vitals, bundle, RSC boundaries, leaks"
---

<!-- Ported from this repo's .cursor/commands/audit-optimization.md. Body below is verbatim. -->

## How to run this in Trae

- Invocation args: "[--fix] [--scope <path>]". Default mode is discovery (read-only).
- Shared flow: audit-suite-core/_skeleton.md (repo-local wins over global).
- Registry: this repo's .cursor/commands/AUDIT_REGISTRY.yaml (repo wins over global).
# /audit-optimization — runtime, memory & image optimization

Follow the shared flow in `_skeleton.md`. Perf and resource efficiency across
render, bundle, and runtime.

## Inventory
Route list with render strategy (RSC/SSR/SSG/ISR/client); heavy dependencies;
image/video sources feeding LCP; long-lived client views (e.g. lesson players).

## Checks
- **Core Web Vitals** — LCP (usually a hero Envato asset — coordinate with
  `/audit-media`), CLS (unsized media, late fonts), INP (hydration/handler cost).
- **Images** — `next/image` vs raw `<img>`; correct `sizes`/`priority`;
  responsive srcset; modern formats.
- **Bundle** — analyze size; find large/duplicate deps; unnecessary client
  components; missing code-splitting/dynamic import; barrel-file bloat.
- **RSC/client boundaries** — `"use client"` pushed as deep as possible; no server
  data needlessly serialized to the client; no accidental client bundling of
  server-only code.
- **Memory / leaks** — long sessions (lesson players, dashboards): uncleared
  intervals/listeners/subscriptions, growing caches, detached nodes.
- **Fonts** — `next/font` usage, `display: swap`, subsetting, no layout shift.
- **CSS** — Tailwind 4 output weight; unused CSS; heavy runtime style recalculation.
- **Data fetching** — waterfalls, missing parallelization, over-fetching,
  missing caching/revalidation.

## Evidence
Measured numbers where possible (Lighthouse/bundle-analyzer output under the
output dir), route + metric per finding. Suspected if not measured live.
