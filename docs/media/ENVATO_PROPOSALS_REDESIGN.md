# Envato Elements — redesign slot proposals

**Date:** 2026-08-18
**Rule:** *Propose only.* Human licenses + downloads into `media/inbox/`, adds a `*.meta.json` sidecar (envato id, url, title, author), then runs the publish command. **Do not auto-download.**
**Asset id convention:** `env-<CODE>` where `<CODE>` is the trailing token in the Envato URL (e.g. `.../BQ2DHJ4` → `env-BQ2DHJ4`).

Curated for the redesign (Landscaping-flagship, friendly/local voice, Wichita→KC areas, aeration + holiday lights). Pick **one** per slot, or keep the existing bound asset if it's good enough.

---

## Photo slots

### `home.hero` (upgrade — the big banner)
| Title | Author | env id | URL |
|---|---|---|---|
| Modern house with beauty garden | bialasiewicz | env-PEC9MH8 | https://elements.envato.com/modern-house-with-beauty-garden-PEC9MH8 |
| Fresh lawn | mblach | env-LQRNMN9 | https://elements.envato.com/fresh-lawn-LQRNMN9 |
| Row of traditional suburban homes with lush green front lawns | krisprahl | env-BQ2DHJ4 | https://elements.envato.com/row-of-traditional-suburban-homes-with-lush-green--BQ2DHJ4 |

`npm run media:publish -- --slot home.hero --category heroes --usage hero`

### `services.landscaping` (FLAGSHIP)
| Title | Author | env id | URL |
|---|---|---|---|
| Backyard patio living space | maginnislaura | env-GAJUN2Z | https://elements.envato.com/backyard-patio-living-space-GAJUN2Z |
| Modern house with beauty garden | bialasiewicz | env-PEC9MH8 | https://elements.envato.com/modern-house-with-beauty-garden-PEC9MH8 |

`npm run media:publish -- --slot services.landscaping --category services --usage card`

### `services.mowing`
| Title | Author | env id | URL |
|---|---|---|---|
| Gardener worker cutting grass with mower in the backyard | MikeShots | env-RL37PZY | https://elements.envato.com/gardener-worker-cutting-grass-with-mower-in-the-ba-RL37PZY |

`npm run media:publish -- --slot services.mowing --category services --usage card`

### `services.fertilization`
| Title | Author | env id | URL |
|---|---|---|---|
| Gardener with push spreader fertilizing residential grass lawn | duallogic | env-R4E7PFX | https://elements.envato.com/gardener-with-push-spreader-fertilizing-residentia-R4E7PFX |

`npm run media:publish -- --slot services.fertilization --category services --usage card`

### `services.aeration`
| Title | Author | env id | URL |
|---|---|---|---|
| Landscaper with scarifier machine taking care of a lawn | duallogic | env-L6TVXH8 | https://elements.envato.com/landscaper-with-scarifier-machine-taking-care-of-a-L6TVXH8 |

`npm run media:publish -- --slot services.aeration --category services --usage card`

### `services.pest-control`
| Title | Author | env id | URL |
|---|---|---|---|
| Worker spraying pesticide onto green lawn (pest control) | africaimages | env-L66HWHJ | https://elements.envato.com/worker-spraying-pesticide-onto-green-lawn-outdoors-L66HWHJ |

`npm run media:publish -- --slot services.pest-control --category services --usage card`

### `services.holiday-lights` (NEW)
| Title | Author | env id | URL |
|---|---|---|---|
| House front yard illuminated with Christmas decorations | bilanol | env-FLXZS4X | https://elements.envato.com/house-front-yard-with-big-porch-brightly-illuminat-FLXZS4X |
| Home decorated with Christmas lights | Mint_Images | env-47LYLRB | https://elements.envato.com/51207-home-decorated-with-christmas-lights-47LYLRB |

`npm run media:publish -- --slot services.holiday-lights --category services --usage card`

### `services.snow-removal` (NEW)
| Title | Author | env id | URL |
|---|---|---|---|
| Man clearing snow in front of the house | Satura_ | env-KJ3AZK3 | https://elements.envato.com/a-man-cleans-and-clears-the-snow-in-front-of-the-h-KJ3AZK3 |

`npm run media:publish -- --slot services.snow-removal --category services --usage card`

### `services.commercial` / `page.commercial.*`
| Title | Author | env id | URL |
|---|---|---|---|
| Modern building surrounded by greenery | pro_creator | env-GRWWV3T | https://elements.envato.com/modern-building-surrounded-by-greenery-GRWWV3T |

`npm run media:publish -- --slot services.commercial --category services --usage card`

### `about.hero` / `services.hero` / `og.default`
| Title | Author | env id | URL |
|---|---|---|---|
| Row of traditional suburban homes with lush green front lawns | krisprahl | env-BQ2DHJ4 | https://elements.envato.com/row-of-traditional-suburban-homes-with-lush-green--BQ2DHJ4 |
| Modern house with beauty garden | bialasiewicz | env-PEC9MH8 | https://elements.envato.com/modern-house-with-beauty-garden-PEC9MH8 |

---

## Service-area heroes (NEW — 7 towns)

Slots: `areas.wichita.hero`, `areas.valley-center.hero`, `areas.andover.hero`, `areas.derby.hero`, `areas.maize.hero`, `areas.kansas-city.hero`, `areas.leavenworth.hero`.

Reuse the suburban-lawn shortlist across towns (or license per-town later):
| Title | Author | env id | URL |
|---|---|---|---|
| Row of traditional suburban homes with lush green front lawns | krisprahl | env-BQ2DHJ4 | https://elements.envato.com/row-of-traditional-suburban-homes-with-lush-green--BQ2DHJ4 |
| Fresh lawn | mblach | env-LQRNMN9 | https://elements.envato.com/fresh-lawn-LQRNMN9 |

`npm run media:publish -- --slot areas.<slug>.hero --category heroes --usage hero`

---

## Non-photo assets (handle per pipeline convention — flag if pipeline needs extending)

### `home.hero.video` (ambient hero loop)
| Title | Author | env id | URL |
|---|---|---|---|
| Juicy Grass Texture Aerial View 4K | Prodronemovie | env-REQJPMT | https://elements.envato.com/juicy-grass-texture-aerial-view-4-k-REQJPMT |
| Young Female Gardener Pushing Lawn Mower Near Wooden Gazebo | serhiibobyk | env-BCE7WNN | https://elements.envato.com/young-female-gardener-pushing-lawn-mower-near-wood-BCE7WNN |
> Muted autoplay loop + static poster (poster-only under reduced-motion).

### `pattern.leaf` (section background pattern)
| Seamless Green Botanical Leaf Pattern | drud | env-6JJMGPG | https://elements.envato.com/seamless-green-botanical-leaf-pattern-6JJMGPG |
> Tileable vector; use at 4–8% opacity, brand-tinted.

### `texture.green` (optional surface overlay — CSS grain already ships)
| Bright Green Texture | MalyskaStudio | env-YV2GTRN | https://elements.envato.com/bright-green-texture-YV2GTRN |
| Grunge Green Texture | MalyskaStudio | env-HNZXS5P | https://elements.envato.com/grunge-green-texture-HNZXS5P |

### `icons.gardening` (service/bundle icon set)
| 50 Gardening Line Green & Black Icons | IconBunny | env-U87634 | https://elements.envato.com/50-gardening-line-green-black-icons-U87634 |
| Gardening Icon Set Line Styles | Richard_2010 | env-A3LKL45 | https://elements.envato.com/gardening-icon-set-line-styles-A3LKL45 |
> Recolor to lime on dark / green on light for one consistent icon language.

### `motion.lottie` (micro-animation, accent moments only)
| Watering Plants Animation | Creattie | env-FPAZ5TC | https://elements.envato.com/watering-plants-animation-FPAZ5TC |
| Glass greenhouse with potted plants animation | Creattie | env-B8CDZNZ | https://elements.envato.com/glass-greenhouse-with-potted-plants-animation-B8CDZNZ |
> Empty states / "quote sent" confirmations only — never behind text.

### `font.display` (optional licensed display face)
| Gestavo Grotesk Sans | mooneseye | env-C5H4EUE | https://elements.envato.com/gestavo-grotesk-sans-C5H4EUE |
> Alt to Bricolage Grotesque if we don't want a Google-Fonts dependency for the display face.

---

## New slots to add to `SLOT_MAP.yaml`

> **Status (2026-08-23):** These slots are now present in `docs/media/SLOT_MAP.yaml` with `asset_id: null` and placeholder fallbacks. Run `npm run media:sync-site` after binding assets. Do not auto-download Envato.

```yaml
services.holiday-lights: { asset_id: null, variant: null, fallback: /placeholder.jpg?height=480&width=720, alt: Home exterior with holiday lights }
services.snow-removal:   { asset_id: null, variant: null, fallback: /placeholder.jpg?height=480&width=720, alt: Snow cleared from residential driveway }
services.commercial:     { asset_id: null, variant: null, fallback: /placeholder.jpg?height=480&width=720, alt: Commercial property with maintained grounds }
areas.wichita.hero:      { asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Wichita, KS }
areas.valley-center.hero:{ asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Valley Center, KS }
areas.andover.hero:      { asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Andover, KS }
areas.derby.hero:        { asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Derby, KS }
areas.maize.hero:        { asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Maize, KS }
areas.kansas-city.hero:  { asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Kansas City }
areas.leavenworth.hero:  { asset_id: null, variant: null, fallback: /placeholder.svg?height=600&width=1600, alt: Lawn care in Leavenworth, KS }
home.hero.video:         { asset_id: null, variant: null, fallback: /placeholder.svg?height=800&width=1920, alt: Aerial lawn loop }
pattern.leaf:            { asset_id: null, variant: null, fallback: /placeholder.svg?height=200&width=200, alt: Botanical leaf pattern }
icons.gardening:         { asset_id: null, variant: null, fallback: /placeholder.svg?height=64&width=64, alt: Gardening icon set }
```

---

## Per-item publish checklist

1. Open the Envato URL → **License** → download into `media/inbox/`.
2. Add sidecar `<file>.meta.json` → `{ "envato_id": "<CODE>", "url": "<url>", "title": "<title>", "author": "<author>" }`.
3. `npm run media:publish -- --slot <slot> --category <cat> --usage <usage>`
4. `npm run media:sync-site`
5. Commit registry / `SLOT_MAP.yaml` / `media-map.json` / code — **never binaries**.
