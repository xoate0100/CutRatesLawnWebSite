# Envato Elements — lead-page photo shortlist

**Date:** 2026-09-18
**Rule:** *Propose only.* License + download into `media/inbox/` with a `*.meta.json` sidecar, then `npm run media:publish`. Do not auto-download.

These slots currently render placeholders (or a suburban-lawn stand-in). Pick **one** per slot.

---

## Priority (homepage + service cards)

### `services.holiday-lights`
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| 1 | Suburban house decorated with lights for Christmas | puhimec | env-YPUTQF5 | https://elements.envato.com/suburban-house-decorated-with-lights-for-christmas-YPUTQF5 |
| 2 | Brightly illuminated christmas decorations on front yard porch | bilanol | env-J2GWFRF | https://elements.envato.com/brightly-illuminated-christmas-decorations-on-fron-J2GWFRF |
| 3 | Christmas decorative yellow garlands lights fixed on house roof | travelarium | env-GM24FXL | https://elements.envato.com/christmas-decorative-yellow-garlands-lights-fixed--GM24FXL |

`npm run media:publish -- --slot services.holiday-lights --category services --usage card`

### `services.snow-removal`
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| 1 | Man shoveling the driveway after winter snowstorm | krisprahl | env-8XLGECN | https://elements.envato.com/man-shoveling-the-driveway-after-winter-snowstorm-8XLGECN |
| 2 | Man removing snow from house yard with shovel | africaimages | env-7D3DCXQ | https://elements.envato.com/man-removing-snow-from-house-yard-with-shovel-on-w-7D3DCXQ |
| 3 | A man cleans and clears the snow in front of the house | Satura_ | env-G9QLRW4 | https://elements.envato.com/a-man-cleans-and-clears-the-snow-in-front-of-the-h-G9QLRW4 |

`npm run media:publish -- --slot services.snow-removal --category services --usage card`

### `services.commercial` (upgrade — currently rebound to licensed `env-BQ2DHJ4`)
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| 1 | Modern building surrounded by greenery | pro_creator | env-GRWWV3T | https://elements.envato.com/modern-building-surrounded-by-greenery-GRWWV3T |
| 2 | Urban park in Silicon Valley | SundryPhotography | env-GXNQVKA | https://elements.envato.com/urban-park-in-silicon-valley-GXNQVKA |
| 3 | Grass field in front of the Austin oaks church | wirestock | env-CMEMWQ7 | https://elements.envato.com/grass-field-in-front-of-the-austin-oaks-church-und-CMEMWQ7 |

`npm run media:publish -- --slot services.commercial --category services --usage card`

### `services.power-washing` + `page.powerwashing.1–4` + `page.services-all.powerwashing`
| # | Title | Author | env id | URL |
|---|---|---|---|---|
| 1 | Man using a pressure washer to clean driveway | duallogic | env-FK8GYSJ | https://elements.envato.com/man-using-a-pressure-washer-to-clean-driveway-whil-FK8GYSJ |
| 2 | Power washing a house exterior during daylight | duallogic | env-NVDT3VZ | https://elements.envato.com/power-washing-a-house-exterior-during-daylight-in--NVDT3VZ |
| 3 | Men pressure washing house surrounding concrete | duallogic | env-67C9BSE | https://elements.envato.com/men-pressure-washing-house-surrounding-concrete-el-67C9BSE |
| 4 | Cleaning backyard with pressure washer | Daria_Nipot | env-QFVP6LN | https://elements.envato.com/cleaning-backyard-with-pressure-washer-spring-clea-QFVP6LN |

Publish FK8GYSJ (or NVDT3VZ) to `services.power-washing` first, then reuse for `page.services-all.powerwashing`. License extras for the inner power-washing page cards.

---

## Pest control (highest-value services)

Avoid cute pet-rat stock. Prefer technicians, inspections, sealing, or live traps.

### `page.pest.termite` / `page.pest.1`
| Title | Author | env id | URL |
|---|---|---|---|
| Pest control worker examining cabinet in kitchen with flashlight | LightFieldStudios | env-JYFMW3R | https://elements.envato.com/pest-control-worker-examining-cabinet-in-kitchen-w-JYFMW3R |
| Professional exterminator spraying pesticide | wasant1 | env-7KG98RC | https://elements.envato.com/professional-exterminator-in-work-wear-spraying-pe-7KG98RC |

### `page.pest.rodent` / `page.pest.trapping`
| Title | Author | env id | URL |
|---|---|---|---|
| Small brown mouse captured in a live trap outdoors | duallogic | env-JBUU698 | https://elements.envato.com/small-brown-mouse-captured-in-a-live-trap-outdoors-JBUU698 |
| Cropped view of exterminator standing near mouse and hole | LightFieldStudios | env-6NSVHT9 | https://elements.envato.com/cropped-view-of-exterminator-standing-near-mouse-a-6NSVHT9 |

### `page.pest.exclusion`
| Title | Author | env id | URL |
|---|---|---|---|
| Construction worker putting sealing foam tape on window | africaimages | env-5SS2HHS | https://elements.envato.com/construction-worker-putting-sealing-foam-tape-on-w-5SS2HHS |
| Young man wearing overalls sealing a door | lithiumphoto | env-B9G8G3F | https://elements.envato.com/young-man-wearing-overalls-sealing-a-door-B9G8G3F |

### `page.pest.bedbugs`
| Title | Author | env id | URL |
|---|---|---|---|
| Pest control worker examining bed with flashlight | africaimages | env-JLZ469W | https://elements.envato.com/pest-control-worker-examining-bed-with-flashlight--JLZ469W |

---

## Human checklist

1. Open the Envato URL → License → download into `media/inbox/`.
2. Sidecar `<file>.meta.json` with `envato_id`, `url`, `title`, `author`.
3. `pnpm run media:publish -- --slot <slot> --category services --usage card`
4. `pnpm run media:validate`
5. Commit registry / `SLOT_MAP.yaml` / `media-map.json` — never binaries.
