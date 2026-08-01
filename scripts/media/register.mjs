#!/usr/bin/env node
/**
 * Upsert registry status / slot bindings after upload
 */
import {
  loadRegistry,
  saveRegistry,
  upsertAsset,
  loadSlotMap,
  saveSlotMap,
  parseArgs,
} from './lib.mjs'

function main() {
  const opts = parseArgs()
  const registry = loadRegistry()
  const filterId = opts['asset-id'] || opts.asset
  const slot = opts.slot
  const publish = opts.publish !== false && opts.publish !== 'false'

  let targets = registry.assets.filter((a) => a.status === 'uploaded' || a.status === 'published' || a.status === 'staged')
  if (filterId) targets = targets.filter((a) => a.asset_id === filterId)

  if (!targets.length) {
    console.log('nothing to register')
    return
  }

  const slotMap = loadSlotMap()
  if (!slotMap.slots) slotMap.slots = {}

  for (const asset of targets) {
    if (publish && asset.status === 'uploaded') {
      asset.status = 'published'
    }
    if (slot) {
      asset.slots = Array.from(new Set([...(asset.slots || []), slot]))
      const existing = slotMap.slots[slot] || {}
      slotMap.slots[slot] = {
        ...existing,
        asset_id: asset.asset_id,
        variant: opts.variant || existing.variant || (asset.usage === 'logo' ? 'original' : 'w1920'),
        fallback: existing.fallback || null,
        alt: opts.alt || existing.alt || asset.alt || asset.title,
      }
    }
    upsertAsset(registry, asset)
    console.log(`registered ${asset.asset_id} status=${asset.status}`)
  }

  saveRegistry(registry)
  if (slot) saveSlotMap(slotMap)
}

main()
