# Envato Elements — careers site slot proposals

**Date:** 2026-08-27 (updated 2026-09-04)  
**Search session:** Envato MCP live (2026-08-27).  
**Rule:** Human clicks **License** on Elements, downloads into `media/inbox/` with a `*.meta.json` sidecar. Agent does **not** auto-download binaries. Then `pnpm run media:publish`.

**Figma note:** Hero prefers a *real Cut Rates crew photo at the yard*. Envato is a temporary stand-in.

**Asset id:** `env-<CODE>` from the Envato URL token.

---

## Bindings now (licensed + published 2026-09-04)

| Slot | Bound asset | Author | Notes |
|---|---|---|---|
| `careers.hero` | `env-ANENAST` | Mint_Images | Preferred crew-at-yard stand-in |
| `careers.crew` | `env-RL37PZY` | MikeShots | Field mowing crew action |
| `careers.equipment` | `env-2KTRVRB` | nikolast1 | Commercial utility vehicle + trailer |
| `careers.yard` | `env-D4R4EF5` | Gorlovkv | Orange work truck / vegetation load |

Prior interim bindings (ETDTNU6 / sha-f22b5ee0b651 / WL6S6J5 / J4XCY2H) remain in the registry as library assets but are no longer slot-bound for careers.

---

## Rejected this search
- Volunteer / family / office handshake stock
- Solar crews, moving-house, farming tractors, excavators, dumpsters
- “Happy farmer couple” lifestyle shots

## After ingest
```bash
pnpm run media:validate
pnpm run verify
```
Spot-check `/careers` hero + mobile overflow.
