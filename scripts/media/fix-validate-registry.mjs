/**
 * Fix media:validate gaps: sha256 for legacy GCS binds + register existing bucket objects.
 * Run: node scripts/media/fix-validate-registry.mjs
 */
import { createHash } from 'node:crypto'
import {
  loadRegistry,
  saveRegistry,
  loadSlotMap,
  saveSlotMap,
  upsertAsset,
  PUBLIC_BASE,
} from './lib.mjs'

const BASE = PUBLIC_BASE

async function sha256Url(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  return {
    sha256: createHash('sha256').update(buf).digest('hex'),
    bytes: buf.length,
  }
}

function legacyAsset({ assetId, object, title, alt, usage, slots, author, notes }) {
  const url = `${BASE}/${object}`
  return {
    asset_id: assetId,
    slug: assetId.replace(/^(legacy-|gcs-)/, ''),
    status: 'published',
    title,
    author: author || 'Cut Rates Lawn Care',
    license_notes: notes || 'Pre-existing GCS object (not Envato Elements)',
    envato_url: null,
    envato_item_id: null,
    sha256: null, // filled after fetch
    bytes: null,
    public_base_url: BASE,
    object_prefix: '',
    variants: [
      {
        name: 'original',
        object,
        url,
      },
    ],
    slots: slots || [],
    alt,
    usage: usage || 'stock',
    category: 'legacy',
    notes: notes || 'Registered for media:validate integrity',
  }
}

const LEGACY = [
  legacyAsset({
    assetId: 'gcs-lawn-watering',
    object: 'lawn-with-automatic-watering-system-2023-11-27-04-52-32-utc.jpg',
    title: 'Lawn with automatic watering system',
    alt: 'Residential lawn with watering system',
    usage: 'hero',
    slots: [],
    notes: 'Legacy root-bucket object; home.hero now uses env-A9DYSMH',
  }),
  legacyAsset({
    assetId: 'gcs-cutrates-logo',
    object: 'cutrateshireslogo.png',
    title: 'Cut Rates hi-res logo',
    alt: 'Cut Rates Lawn Care',
    usage: 'logo',
    slots: ['header.logo'],
  }),
  legacyAsset({
    assetId: 'legacy-logo-white',
    object: 'images/branding/logo-white.svg',
    title: 'Cut Rates logo (white)',
    alt: 'Cut Rates Lawn Care',
    usage: 'logo',
    slots: ['branding.logo-white'],
  }),
  legacyAsset({
    assetId: 'legacy-service-cleanup',
    object: 'images/services/cleanup.jpg',
    title: 'Seasonal cleanup / irrigation stand-in',
    alt: 'Seasonal cleanup service',
    usage: 'card',
    slots: ['services.cleanup'],
  }),
  legacyAsset({
    assetId: 'legacy-testimonial-1',
    object: 'images/testimonials/customer-1.jpg',
    title: 'Testimonial customer 1',
    alt: 'Customer photo',
    usage: 'avatar',
    slots: ['testimonials.1'],
  }),
  legacyAsset({
    assetId: 'legacy-testimonial-2',
    object: 'images/testimonials/customer-2.jpg',
    title: 'Testimonial customer 2',
    alt: 'Customer photo',
    usage: 'avatar',
    slots: ['testimonials.2'],
  }),
  legacyAsset({
    assetId: 'legacy-testimonial-3',
    object: 'images/testimonials/customer-3.jpg',
    title: 'Testimonial customer 3',
    alt: 'Customer photo',
    usage: 'avatar',
    slots: ['testimonials.3'],
  }),
  legacyAsset({
    assetId: 'legacy-partner-kwch',
    object: 'images/partners/kwch-logo.png',
    title: 'KWCH 12 News logo',
    alt: 'KWCH 12 News',
    usage: 'logo',
    slots: ['partners.kwch'],
  }),
  legacyAsset({
    assetId: 'legacy-partner-google',
    object: 'images/partners/google-reviews.png',
    title: 'Google Reviews badge',
    alt: 'Google Reviews',
    usage: 'logo',
    slots: ['partners.google'],
  }),
  legacyAsset({
    assetId: 'legacy-partner-yelp',
    object: 'images/partners/yelp-logo.png',
    title: 'Yelp logo',
    alt: 'Yelp',
    usage: 'logo',
    slots: ['partners.yelp'],
  }),
]

const ATTR_DEFAULTS = {
  'sha-1a0ddae6797d': { author: 'Envato Elements (attribution pending)', notes: 'Licensed inbox asset; Envato URL not captured at ingest' },
  'sha-5c1d1dd0095b': { author: 'Envato Elements (attribution pending)', notes: 'Licensed inbox asset; Envato URL not captured at ingest' },
  'sha-ba20accbcd23': { author: 'Envato Elements (attribution pending)', notes: 'Licensed inbox asset; Envato URL not captured at ingest' },
  'sha-50ea64d6a870': { author: 'Envato Elements (attribution pending)', notes: 'Licensed inbox asset; Envato URL not captured at ingest' },
  'sha-17ae8109f02b': { author: 'Envato Elements (attribution pending)', notes: 'Licensed inbox asset; Envato URL not captured at ingest' },
  'sha-df83cbfdd6a5': { author: 'Envato Elements (attribution pending)', notes: 'Licensed inbox asset; Envato URL not captured at ingest' },
}

async function main() {
  const registry = loadRegistry()
  const slotMap = loadSlotMap()

  for (const draft of LEGACY) {
    const url = draft.variants[0].url
    process.stdout.write(`hashing ${draft.asset_id}… `)
    const { sha256, bytes } = await sha256Url(url)
    draft.sha256 = sha256
    draft.bytes = bytes
    console.log(sha256.slice(0, 12))
    upsertAsset(registry, draft)
  }

  for (const asset of registry.assets) {
    const patch = ATTR_DEFAULTS[asset.asset_id]
    if (patch) {
      if (!asset.author) asset.author = patch.author
      if (!asset.notes) asset.notes = patch.notes
      upsertAsset(registry, asset)
    }
    // Ensure gcs assets have author after upsert from LEGACY
    if ((asset.asset_id === 'gcs-lawn-watering' || asset.asset_id === 'gcs-cutrates-logo') && !asset.author) {
      asset.author = 'Cut Rates Lawn Care'
      upsertAsset(registry, asset)
    }
  }

  // Team photos missing from bucket — clear asset_id so validate + fallback work
  for (const slot of ['team.owner', 'team.manager', 'team.crew']) {
    if (slotMap.slots[slot]) {
      slotMap.slots[slot].asset_id = null
      slotMap.slots[slot].variant = null
      slotMap.slots[slot].notes = 'No GCS object yet — using placeholder fallback'
    }
  }

  // Ensure slot map still points at registered legacy ids where we registered them
  const ensureSlot = (slot, assetId, variant = 'original') => {
    if (!slotMap.slots[slot]) return
    slotMap.slots[slot].asset_id = assetId
    slotMap.slots[slot].variant = variant
  }
  ensureSlot('branding.logo-white', 'legacy-logo-white')
  ensureSlot('services.cleanup', 'legacy-service-cleanup')
  ensureSlot('testimonials.1', 'legacy-testimonial-1')
  ensureSlot('testimonials.2', 'legacy-testimonial-2')
  ensureSlot('testimonials.3', 'legacy-testimonial-3')
  ensureSlot('partners.kwch', 'legacy-partner-kwch')
  ensureSlot('partners.google', 'legacy-partner-google')
  ensureSlot('partners.yelp', 'legacy-partner-yelp')
  ensureSlot('header.logo', 'gcs-cutrates-logo')

  saveRegistry(registry)
  saveSlotMap(slotMap)
  console.log('registry + slot map updated')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
