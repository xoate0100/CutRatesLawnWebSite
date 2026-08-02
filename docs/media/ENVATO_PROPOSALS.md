# Envato Elements — slot proposals

**Date:** 2026-08-01  
**Rule:** Propose only. Human licenses + downloads into `media/inbox/`. Do not auto-download.

Current site slots already bind **legacy GCS** URLs (or published watering hero / logo) so the site works today. Use these shortlists to upgrade photographic quality.

Pick **one** candidate per slot (or skip if legacy asset is good enough).

---

## `home.hero` (upgrade)

Intent: Midwestern suburban lawn, landscape, no cluttered people-first crop if possible.

| # | Title | Author | URL |
|---|-------|--------|-----|
| 1 | House with a green lawn under blue sky | wirestock | https://elements.envato.com/house-with-a-green-lawn-under-blue-sky-A9DYSMH |
| 2 | Mowed green frontyard grass before residential suburban house | Olena_Mykhaylova | https://elements.envato.com/mowed-green-frontyard-grass-before-residential-sub-HBA9N9D |
| 3 | Row of traditional suburban homes with lush green front lawns | krisprahl | https://elements.envato.com/row-of-traditional-suburban-homes-with-lush-green--BQ2DHJ4 |
| 4 | Home and Yard | Mint_Images | https://elements.envato.com/home-and-yard-YQMXCLQ |
| 5 | Beautiful neighborhood stone facade house with well kept landscaping | MyLove4Art | https://elements.envato.com/beautiful-neighborhood-stone-facade-house-with-wel-GRREVHN |

**After license:** `npm run media:publish -- --slot home.hero --category heroes --usage hero`

---

## `services.mowing`

| # | Title | Author | URL |
|---|-------|--------|-----|
| 1 | Lawn mover on green grass. Machine for cutting lawns. | erika8213 | https://elements.envato.com/lawn-mover-on-green-grass-machine-for-cutting-lawn-WL6S6J5 |
| 2 | Lawn care worker mows grass in a sunny garden | duallogic | https://elements.envato.com/lawn-care-worker-mows-grass-in-a-sunny-garden-duri-ETDTNU6 |
| 3 | Man mowing the lawn in the backyard | borodai | https://elements.envato.com/man-mowing-the-lawn-in-the-backyard-LYH9EL3 |
| 4 | Man pushing lawn mower. Lawn care background | Olena_Mykhaylova | https://elements.envato.com/man-pushing-lawn-mower-lawn-care-background-place--J4XCY2H |
| 5 | Man moving a backyard lawn with lawn mower | Daria_Nipot | https://elements.envato.com/man-moving-a-backyard-lawn-with-lawn-mower-petrol--7MGZHUQ |

---

## `services.fertilization`

| # | Title | Author | URL |
|---|-------|--------|-----|
| 1 | Man with seeder | macniak | https://elements.envato.com/man-with-seeder-7LNYKUE |
| 2 | lawn watering | safakc1 | https://elements.envato.com/lawn-watering-EFKZ2KP |
| 3 | One Hand Pressure Pesticide Sprayer in Use | duallogic | https://elements.envato.com/one-hand-pressure-pesticide-sprayer-in-use-3SSYKXK |
| 4 | Worker spraying pesticide onto green lawn outdoors | africaimages | https://elements.envato.com/worker-spraying-pesticide-onto-green-lawn-outdoors-L66HWHJ |
| 5 | Farmer spraying fertilizer | erika8213 | https://elements.envato.com/farmer-spraying-fertilizer-pest-control-and-plant--3J7CC29 |

---

## `services.weed-control`

| # | Title | Author | URL |
|---|-------|--------|-----|
| 1 | Worker spraying pesticide onto green lawn outdoors | africaimages | https://elements.envato.com/worker-spraying-pesticide-onto-green-lawn-outdoors-L66HWHJ |
| 2 | Farmer spraying fertilizer (alt) | erika8213 | https://elements.envato.com/farmer-spraying-fertilizer-pest-control-and-plant--PK7E3SQ |
| 3 | Worker spraying pesticide onto green bush | africaimages | https://elements.envato.com/worker-spraying-pesticide-onto-green-bush-outdoors-ZK3ZLNS |
| 4 | Mowing Trimmer - Men Worker Cutting Grass | greenmiles83 | https://elements.envato.com/mowing-trimmer-men-worker-cutting-grass-DWWT5DN |
| 5 | One Hand Pressure Pesticide Sprayer in Use | duallogic | https://elements.envato.com/one-hand-pressure-pesticide-sprayer-in-use-3SSYKXK |

---

## `about.hero` / `services.hero` / `og.default`

Reuse home hero shortlist or:

| # | Title | Author | URL |
|---|-------|--------|-----|
| 1 | Home sweet home real estate exterior | maginnislaura | https://elements.envato.com/home-sweet-home-real-estate-exterior-design-mortga-NVY3VZW |
| 2 | Row of traditional suburban homes… | krisprahl | https://elements.envato.com/row-of-traditional-suburban-homes-with-lush-green--BQ2DHJ4 |
| 3 | Beautiful neighborhood stone facade… | MyLove4Art | https://elements.envato.com/beautiful-neighborhood-stone-facade-house-with-wel-GRREVHN |

---

## `empty.state` (optional graphic)

Prefer flat / vector, outdoor-friendly:

| # | Title | Author | URL |
|---|-------|--------|-----|
| 1 | Empty state illustration | orenjistudio | https://elements.envato.com/empty-state-illustration-KA52LY9 |
| 2 | Akura - Empty State Illustrations | kerismaker | https://elements.envato.com/akura-empty-state-illustrations-LEQDWCE |
| 3 | Farmer Cleaning the Garden - Flat Illustration | SlideFactory | https://elements.envato.com/farmer-cleaning-the-garden-flat-illustration-LBJPC2N |
| 4 | Empty State Illustration | slabdsgn | https://elements.envato.com/empty-state-illustration-VCRM2F8 |

Inline turf motif already covers 404 without a licensed graphic — empty-state license is optional.

---

## Grain / texture (optional — CSS grain already ships)

Tileable green textures searched; **not recommended** for hero overlays (CSS grain is enough). Skip unless art direction demands a photo grain pack.

---

## Publish checklist (per picked item)

1. Open Elements URL → License → Download into `media/inbox/`
2. Add sidecar `*.meta.json` (envato id, url, title, author)
3. `npm run media:publish -- --slot <slot> --category <cat> --usage <usage>`
4. `npm run media:sync-site`
5. Commit registry / SLOT_MAP / media-map / code — never binaries
