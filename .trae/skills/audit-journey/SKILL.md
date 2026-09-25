---
name: audit-journey
description: "User journey / flow coherence - route graph per role, dead ends, orphans, CTA + context loss"
---

<!-- Ported from this repo's .cursor/commands/audit-journey.md. Body below is verbatim. -->

## How to run this in Trae

- Invocation args: "[--fix] [--scope <path>]". Default mode is discovery (read-only).
- Shared flow: audit-suite-core/_skeleton.md (repo-local wins over global).
- Registry: this repo's .cursor/commands/AUDIT_REGISTRY.yaml (repo wins over global).
# /audit-journey — user journey / flow coherence

Follow the shared flow in `_skeleton.md`. Product logic and navigation, not
security (hand authz to `/audit-security-nist`).

## Inventory
Build the route graph from the App Router: every page, its links in/out, its
required role, and its place in a named workflow. Produce one journey map per role.

## Checks
- **Dead ends** — pages with no forward path or CTA; success screens that strand.
- **Circular navigation** — loops with no exit; menus that route back to self.
- **Orphaned / unreachable** — routes no navigation reaches; features with no entry.
- **CTA presence & consistency** — every step has a clear next action; labels and
  placement consistent across flows.
- **Lost context** — state dropped across steps (filters, selections, form data)
  on navigation, refresh, or back/forward.
- **Interrupted flows** — refresh mid-workflow, back button, duplicate submit;
  does the flow recover coherently?
- **Empty states** — first-run / no-data screens guide the user forward.
- **Named flows to verify end-to-end**:
  - SureWealth Education: sign-up → Missouri license capture → lesson player with
    seat-time gate → completion → auto-reporting status.
  - CutRates: landing → aeration/overseeding lead offer → fertilization-program
    signup → confirmation.

## Evidence
Route-graph artifact + the specific broken transition per finding.
