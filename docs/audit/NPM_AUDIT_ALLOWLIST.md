# npm audit allowlist (release gate)

**Goal:** 0 critical; high only with documented waiver.

## Current residual highs (after Next 14.2.35 + sharp 0.35.x)

Run `npm audit` after dependency updates. As of remediation:

| Package | Notes | Waiver |
|---------|--------|--------|
| `next` Image Optimizer remotePatterns DoS | App uses `images.unoptimized: true`; still reported on 14.2.35. Full fix may require Next 15/16 major. | **Waived until Next major upgrade** — track F-001 follow-up |
| nested `postcss` under next | Tied to Next release line; `npm audit fix --force` pulls Next 16 | **Waived with Next** |

Do **not** waive new criticals. Re-run audit on every dependency bump.

CI: `npm audit --audit-level=critical` fails the build; high review is manual via this file.
