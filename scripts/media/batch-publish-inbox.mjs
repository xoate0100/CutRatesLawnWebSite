/**
 * Write Envato meta sidecars + publish primary slots one-by-one, then library stock.
 * Run: node scripts/media/batch-publish-inbox.mjs
 */
import { mkdirSync, renameSync, existsSync, writeFileSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'
import { spawnSync } from 'node:child_process'
import { ROOT, PATHS, ensureDirs, loadSlotMap, saveSlotMap } from './lib.mjs'

const HOLD = join(PATHS.inbox, '_hold')

const PRIMARIES = [
  {
    match: /^house-with-a-green-lawn-under-blue-sky/i,
    slot: 'home.hero',
    category: 'heroes',
    usage: 'hero',
    alt: 'House with a green lawn under blue sky',
    meta: {
      title: 'House with a green lawn under blue sky',
      author: 'wirestock',
      envato_url: 'https://elements.envato.com/house-with-a-green-lawn-under-blue-sky-A9DYSMH',
      envato_item_id: 'A9DYSMH',
    },
  },
  {
    match: /^home-sweet-home-real-estate/i,
    slot: 'about.hero',
    category: 'heroes',
    usage: 'hero',
    alt: 'Suburban home exterior — about Cut Rates Lawn Care',
    meta: {
      title: 'Home sweet home real estate exterior design mortgage!',
      author: 'maginnislaura',
      envato_url: 'https://elements.envato.com/home-sweet-home-real-estate-exterior-design-mortga-NVY3VZW',
      envato_item_id: 'NVY3VZW',
    },
  },
  {
    match: /^row-of-traditional-suburban-homes/i,
    slot: 'services.hero',
    category: 'heroes',
    usage: 'hero',
    alt: 'Suburban homes with lush green front lawns',
    meta: {
      title: 'Row of traditional suburban homes with lush green front lawns',
      author: 'krisprahl',
      envato_url: 'https://elements.envato.com/row-of-traditional-suburban-homes-with-lush-green--BQ2DHJ4',
      envato_item_id: 'BQ2DHJ4',
    },
  },
  {
    match: /^lawn-mover-on-green-grass/i,
    slot: 'services.mowing',
    category: 'services',
    usage: 'card',
    alt: 'Lawn mower on green grass',
    meta: {
      title: 'Lawn mover on green grass. Machine for cutting lawns.',
      author: 'erika8213',
      envato_url: 'https://elements.envato.com/lawn-mover-on-green-grass-machine-for-cutting-lawn-WL6S6J5',
      envato_item_id: 'WL6S6J5',
    },
  },
  {
    match: /^man-fertilizing-lawn-with-spreader/i,
    slot: 'services.fertilization',
    category: 'services',
    usage: 'card',
    alt: 'Man fertilizing lawn with spreader',
    meta: {
      title: 'Man fertilizing lawn with spreader in suburban yard',
      notes: 'Confirm Envato attribution if known',
    },
  },
  {
    match: /^worker-spraying-pesticide-onto-green-lawn/i,
    slot: 'services.weed-control',
    category: 'services',
    usage: 'card',
    alt: 'Worker spraying pesticide onto green lawn',
    meta: {
      title: 'Worker spraying pesticide onto green lawn outdoors, closeup. Pest control',
      author: 'africaimages',
      envato_url: 'https://elements.envato.com/worker-spraying-pesticide-onto-green-lawn-outdoors-L66HWHJ',
      envato_item_id: 'L66HWHJ',
    },
  },
  {
    match: /^residential-houses-in-suburban-neighborhood/i,
    slot: 'contact.hero',
    category: 'heroes',
    usage: 'hero',
    alt: 'Residential houses in a suburban neighborhood',
    meta: {
      title: 'Residential houses in suburban neighborhood in summer',
    },
  },
  {
    match: /^water-droplets-on-green-grass/i,
    slot: 'services.aeration',
    category: 'services',
    usage: 'card',
    alt: 'Water droplets on green grass',
    meta: {
      title: 'Water droplets on green grass field',
      notes: 'Interim stand-in for aeration until a better core-aeration photo is licensed',
    },
  },
]

const LIBRARY = [
  {
    match: /^mowed-green-frontyard/i,
    title: 'Mowed green frontyard grass before residential suburban house',
    author: 'Olena_Mykhaylova',
    envato_url: 'https://elements.envato.com/mowed-green-frontyard-grass-before-residential-sub-HBA9N9D',
    envato_item_id: 'HBA9N9D',
  },
  { match: /^suburban-home-exterior-with-manicured/i, title: 'Suburban home exterior with manicured lawn' },
  {
    match: /^lawn-care-worker-mows-grass/i,
    title: 'Lawn care worker mows grass in a sunny garden',
    author: 'duallogic',
    envato_url: 'https://elements.envato.com/lawn-care-worker-mows-grass-in-a-sunny-garden-duri-ETDTNU6',
    envato_item_id: 'ETDTNU6',
  },
  { match: /^man-mowing-the-lawn/i, title: 'Man mowing the lawn in his backyard' },
  {
    match: /^man-pushing-lawn-mower/i,
    title: 'Man pushing lawn mower. Lawn care background',
    author: 'Olena_Mykhaylova',
    envato_url: 'https://elements.envato.com/man-pushing-lawn-mower-lawn-care-background-place--J4XCY2H',
    envato_item_id: 'J4XCY2H',
  },
  { match: /^lawn-care-professional-sprays/i, title: 'Lawn care professional sprays garden with fertilizer' },
  {
    match: /^farmer-spraying-fertilizer/i,
    title: 'Farmer spraying fertilizer. Pest control',
    author: 'erika8213',
    envato_url: 'https://elements.envato.com/farmer-spraying-fertilizer-pest-control-and-plant--3J7CC29',
    envato_item_id: '3J7CC29',
  },
]

function listImages(dir = PATHS.inbox) {
  return readdirSync(dir)
    .filter((n) => !n.startsWith('.') && !n.startsWith('_') && !n.endsWith('.meta.json') && !n.includes('.dup-'))
    .map((n) => join(dir, n))
}

function writeMeta(filePath, payload) {
  const metaPath = filePath.replace(/\.[^.]+$/, '') + '.meta.json'
  writeFileSync(metaPath, JSON.stringify({ downloaded_at: new Date().toISOString(), ...payload }, null, 2))
}

function runNode(script, args = []) {
  const r = spawnSync(process.execPath, [join(ROOT, 'scripts/media', script), ...args], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  })
  if (r.status !== 0) throw new Error(`${script} failed (${r.status})`)
}

function main() {
  ensureDirs()
  mkdirSync(HOLD, { recursive: true })

  const files = listImages()
  if (!files.length) {
    console.log('inbox empty')
    return
  }

  for (const f of files) {
    const dest = join(HOLD, basename(f))
    if (existsSync(dest)) renameSync(f, `${dest}.dup-${Date.now()}`)
    else renameSync(f, dest)
  }

  const held = readdirSync(HOLD).filter((n) => !n.endsWith('.meta.json') && !n.startsWith('.') && !n.includes('.dup-'))

  for (const name of held) {
    const full = join(HOLD, name)
    const primary = PRIMARIES.find((p) => p.match.test(name))
    const lib = LIBRARY.find((p) => p.match.test(name))
    if (primary) {
      writeMeta(full, {
        slot: primary.slot,
        category: primary.category,
        usage: primary.usage,
        alt: primary.alt,
        ...primary.meta,
      })
    } else if (lib) {
      writeMeta(full, {
        category: 'library',
        usage: 'stock',
        alt: lib.title,
        title: lib.title,
        author: lib.author || null,
        envato_url: lib.envato_url || null,
        envato_item_id: lib.envato_item_id || null,
        notes: 'Library alternate — not bound to a slot yet',
      })
    } else {
      writeMeta(full, {
        category: 'library',
        usage: 'stock',
        title: name.replace(/\.[^.]+$/, ''),
        notes: 'Unmatched inbox file',
      })
    }
  }

  for (const primary of PRIMARIES) {
    const name = held.find((n) => primary.match.test(n))
    if (!name) {
      console.warn(`MISSING primary for ${primary.slot}`)
      continue
    }
    const src = join(HOLD, name)
    const metaSrc = src.replace(/\.[^.]+$/, '') + '.meta.json'
    const dest = join(PATHS.inbox, name)
    const metaDest = dest.replace(/\.[^.]+$/, '') + '.meta.json'
    renameSync(src, dest)
    if (existsSync(metaSrc)) renameSync(metaSrc, metaDest)
    console.log(`\n=== publishing ${primary.slot} ← ${name} ===`)
    runNode('publish.mjs', [
      '--slot',
      primary.slot,
      '--category',
      primary.category,
      '--usage',
      primary.usage,
      '--alt',
      primary.alt,
    ])
  }

  const remaining = readdirSync(HOLD).filter((n) => !n.endsWith('.meta.json') && !n.startsWith('.') && !n.includes('.dup-'))
  for (const name of remaining) {
    renameSync(join(HOLD, name), join(PATHS.inbox, name))
    const metaSrc = join(HOLD, name.replace(/\.[^.]+$/, '') + '.meta.json')
    if (existsSync(metaSrc)) renameSync(metaSrc, join(PATHS.inbox, basename(metaSrc)))
  }

  if (listImages().length) {
    console.log('\n=== ingesting library alternates ===')
    for (const script of ['ingest.mjs', 'prepare.mjs', 'upload.mjs', 'register.mjs']) {
      runNode(script)
    }
  }

  const slotMap = loadSlotMap()
  if (slotMap.slots['home.hero']?.asset_id) {
    slotMap.slots['og.default'] = {
      ...(slotMap.slots['og.default'] || {}),
      asset_id: slotMap.slots['home.hero'].asset_id,
      variant: slotMap.slots['home.hero'].variant || 'w1920',
      fallback: slotMap.slots['og.default']?.fallback || '/placeholder.svg?height=630&width=1200',
      alt: slotMap.slots['og.default']?.alt || 'Cut Rates Lawn Care — Wichita KS',
    }
    saveSlotMap(slotMap)
    console.log('bound og.default → home.hero asset')
  }

  runNode('sync-site.mjs')
  console.log('\nbatch publish complete')
}

main()
