#!/usr/bin/env node
/**
 * Apply SLOT_MAP + MEDIA_REGISTRY → lib/generated/media-map.json
 */
import {
  PATHS,
  PUBLIC_BASE,
  loadRegistry,
  loadSlotMap,
  ensureDirs,
  writeFileSync,
  mkdirSync,
  dirname,
} from './lib.mjs'

function variantUrl(asset, variantName) {
  if (!asset) return null
  const v = (asset.variants || []).find((x) => x.name === variantName) || (asset.variants || [])[0]
  if (!v) return null
  if (v.url) return v.url
  if (v.object) return `${asset.public_base_url || PUBLIC_BASE}/${v.object}`
  return null
}

function main() {
  ensureDirs()
  const registry = loadRegistry()
  const slotMap = loadSlotMap()
  const byId = Object.fromEntries((registry.assets || []).map((a) => [a.asset_id, a]))

  const slots = {}
  for (const [slot, cfg] of Object.entries(slotMap.slots || {})) {
    const asset = cfg.asset_id ? byId[cfg.asset_id] : null
    const url = variantUrl(asset, cfg.variant) || cfg.fallback || null
    slots[slot] = {
      slot,
      asset_id: cfg.asset_id || null,
      variant: cfg.variant || null,
      url,
      fallback: cfg.fallback || null,
      alt: cfg.alt || asset?.alt || asset?.title || '',
      width: asset?.variants?.find((v) => v.name === cfg.variant)?.width || asset?.width || null,
      height: asset?.variants?.find((v) => v.name === cfg.variant)?.height || asset?.height || null,
      attribution: asset
        ? {
            title: asset.title || null,
            author: asset.author || null,
            envato_url: asset.envato_url || null,
            envato_item_id: asset.envato_item_id || null,
          }
        : null,
      status: asset?.status || null,
    }
  }

  const out = {
    generated_at: new Date().toISOString(),
    public_base_url: registry.public_base_url || PUBLIC_BASE,
    slots,
  }

  mkdirSync(dirname(PATHS.mediaMap), { recursive: true })
  writeFileSync(PATHS.mediaMap, JSON.stringify(out, null, 2) + '\n', 'utf8')
  console.log(`wrote ${PATHS.mediaMap} (${Object.keys(slots).length} slots)`)
}

main()
