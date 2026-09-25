---
name: audit-conversion
description: "Funnel + ad copy / content audit - message-match, CTA discipline, friction, brand voice"
---

<!-- Ported from this repo's .cursor/commands/audit-conversion.md. Body below is verbatim. -->

## How to run this in Trae

- Invocation args: "[--fix] [--scope <path>]". Default mode is discovery (read-only).
- Shared flow: audit-suite-core/_skeleton.md (repo-local wins over global).
- Registry: this repo's .cursor/commands/AUDIT_REGISTRY.yaml (repo wins over global).
# /audit-conversion — funnel + advertising copy / content audit

Follow the shared flow in `_skeleton.md`. Evaluates how well the funnel and its
copy move a visitor toward the intended action.

## Inventory
Map each funnel: entry (ad/landing) → offer → CTA → capture (form) → confirmation.
Note the traffic source and the promised message for each entry.

## Checks
- **Funnel completeness** — no missing stage; confirmation/thank-you closes the loop.
- **Message match** — landing headline/offer matches the ad/source promise; no
  scent break between click and page.
- **Value-prop clarity** — the offer and its benefit are obvious above the fold.
- **Single-CTA discipline** — one primary action per step; competing CTAs flagged.
- **Form friction** — field count, unnecessary required fields, unclear errors,
  mobile keyboard/input types, multi-step vs single.
- **Trust signals** — social proof, guarantees, compliance/credential cues placed
  near the decision point.
- **Voice consistency** — copy matches the brand-voice doc (if present); flag tone
  drift. For SureWealth lean on CE renewal-deadline urgency; for CutRates the
  seasonal aeration/fertilization offer.
- **Content gaps** — objections unanswered, missing FAQ, weak or absent CTA copy.

## Evidence
Funnel-stage screenshot + the specific copy/UX gap per finding. Copy suggestions
go in the remediation prompt, not applied in discovery mode.
