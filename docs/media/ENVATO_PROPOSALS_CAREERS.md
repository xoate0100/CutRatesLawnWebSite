# Envato Elements — careers site slot proposals

**Date:** 2026-08-27  
**Search session:** Envato MCP live (2026-08-27).  
**Rule:** Human clicks **License** on Elements, downloads into `media/inbox/` with a `*.meta.json` sidecar. Agent does **not** auto-download binaries. Then `pnpm run media:publish`.

**Figma note:** Hero prefers a *real Cut Rates crew photo at the yard*. Envato is a temporary stand-in.

**Asset id:** `env-<CODE>` from the Envato URL token.

---

## Bindings now (already licensed — no new download)

These slots are live in `SLOT_MAP.yaml` from prior ingest:

| Slot | Bound asset | Why |
|---|---|---|
| `careers.hero` | `env-ETDTNU6` | Licensed lawn-care worker mowing |
| `careers.crew` | `sha-f22b5ee0b651` | Licensed landscaper trimming |
| `careers.equipment` | `env-WL6S6J5` | Licensed commercial mower |
| `careers.yard` | `env-J4XCY2H` | Licensed suburban mowing (not a depot — temporary) |

---

## New licenses to pick (opened in browser)

License these four if they look right. Drop files in `media/inbox/` then tell the agent to publish.

### `careers.hero` — **pick** (crew at a landscape company)
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| **1 (preferred)** | Mixed race team of workers at a landscape company with a woman in the lead | Mint_Images | ANENAST | https://elements.envato.com/mixed-race-team-of-workers-at-a-landscape-company--ANENAST |
| 2 | Gardener worker cutting grass with mower in the backyard | MikeShots | RL37PZY | https://elements.envato.com/gardener-worker-cutting-grass-with-mower-in-the-ba-RL37PZY |
| 3 | Lawn care worker mows grass (already licensed) | duallogic | ETDTNU6 | already bound |

`pnpm run media:publish -- --slot careers.hero --category careers --usage hero --alt "Landscape crew at the yard"`

### `careers.crew` — **pick**
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| **1 (preferred)** | Gardener worker cutting grass with mower in the backyard | MikeShots | RL37PZY | https://elements.envato.com/gardener-worker-cutting-grass-with-mower-in-the-ba-RL37PZY |
| 2 | Lawn care worker mows grass in a sunny garden | duallogic | ETDTNU6 | already in library |
| 3 | Professional landscaper trimming (already licensed) | — | sha-f22b5ee0b651 | already bound |

`pnpm run media:publish -- --slot careers.crew --category careers --usage editorial`

### `careers.equipment` — **pick** (upgrade riding mower)
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| **1 (preferred)** | Big professional riding lawn mower with an operator | nikolast1 | 2KTRVRB | https://elements.envato.com/big-professional-riding-lawn-mower-with-an-operato-2KTRVRB |
| 2 | Professional gardener cutting grass on lawn mower in park | Lara-sh | ZPWSKFJ | https://elements.envato.com/professional-gardener-cutting-green-grass-on-lawn--ZPWSKFJ |
| 3 | Lawn mover on green grass (already licensed) | erika8213 | WL6S6J5 | already bound |

`pnpm run media:publish -- --slot careers.equipment --category careers --usage card`

### `careers.yard` — **pick**
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| **1 (preferred)** | Municipal professional house landscape lawn gardening mowing | Gorlovkv | D4R4EF5 | https://elements.envato.com/municipal-professional-house-landscape-lawn-garden-D4R4EF5 |
| 2 | Two wheelbarrows in the back of a pick up truck | bethanyellis28 | TPHLM6K | https://elements.envato.com/two-wheelbarrows-in-the-back-of-a-pick-up-truck-TPHLM6K |
| **Preferred when available** | Owned Valley Center yard photo | — | — | skip Envato |

`pnpm run media:publish -- --slot careers.yard --category careers --usage editorial`

---

## Rejected this search
- Volunteer / family / office handshake stock
- Solar crews, moving-house, farming tractors, excavators, dumpsters
- “Happy farmer couple” lifestyle shots

## Sidecar example (`media/inbox/<file>.meta.json`)

```json
{
  "title": "Mixed race team of workers at a landscape company",
  "author": "Mint_Images",
  "envato_url": "https://elements.envato.com/mixed-race-team-of-workers-at-a-landscape-company--ANENAST",
  "envato_item_id": "ANENAST",
  "slot": "careers.hero",
  "category": "careers",
  "usage": "hero",
  "alt": "Landscape crew standing with trucks at a landscape company"
}
```

## After ingest
```bash
pnpm run media:validate
pnpm run verify
```
Spot-check `/careers` hero + mobile overflow.
