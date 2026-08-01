#!/usr/bin/env node
/**
 * Registry integrity + optional live URL HEAD checks
 */
import {
  loadRegistry,
  loadSlotMap,
  parseArgs,
  PUBLIC_BASE,
} from './lib.mjs'

async function headOk(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    if (res.ok) return true
    // some buckets disallow HEAD — try GET range
    const get = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    })
    return get.ok || get.status === 206
  } catch {
    return false
  }
}

async function main() {
  const opts = parseArgs()
  const checkUrls = Boolean(opts.urls || opts['check-urls'])
  const registry = loadRegistry()
  const slotMap = loadSlotMap()
  const errors = []
  const warnings = []

  const ids = new Set()
  for (const asset of registry.assets || []) {
    if (!asset.asset_id) errors.push('asset missing asset_id')
    if (ids.has(asset.asset_id)) errors.push(`duplicate asset_id ${asset.asset_id}`)
    ids.add(asset.asset_id)
    if (!asset.sha256) errors.push(`${asset.asset_id}: missing sha256`)
    if (asset.status === 'published' || asset.status === 'uploaded') {
      if (!asset.variants?.length) errors.push(`${asset.asset_id}: published/uploaded without variants`)
      if (!asset.envato_url && !asset.author) {
        warnings.push(`${asset.asset_id}: missing Envato attribution (url/author)`)
      }
      for (const v of asset.variants || []) {
        if (!v.object && !v.url) errors.push(`${asset.asset_id}/${v.name}: missing object/url`)
        if (checkUrls) {
          const url = v.url || (v.object ? `${asset.public_base_url || PUBLIC_BASE}/${v.object}` : null)
          if (url) {
            const ok = await headOk(url)
            if (!ok) errors.push(`${asset.asset_id}/${v.name}: URL check failed ${url}`)
          }
        }
      }
    }
  }

  for (const [slot, cfg] of Object.entries(slotMap.slots || {})) {
    if (cfg.asset_id && !ids.has(cfg.asset_id)) {
      errors.push(`slot ${slot} references missing asset_id ${cfg.asset_id}`)
    }
    if (!cfg.asset_id && !cfg.fallback) {
      warnings.push(`slot ${slot} has no asset_id and no fallback`)
    }
  }

  for (const w of warnings) console.warn(`warn: ${w}`)
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`)
    process.exit(1)
  }
  console.log(
    `validate ok — ${registry.assets?.length || 0} assets, ${Object.keys(slotMap.slots || {}).length} slots`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
