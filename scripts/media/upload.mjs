#!/usr/bin/env node
/**
 * Upload processed variants to gs://site_photo_storage/...
 */
import { basename } from 'node:path'
import {
  BUCKET,
  PUBLIC_BASE,
  ROOT,
  ensureDirs,
  loadRegistry,
  saveRegistry,
  upsertAsset,
  parseArgs,
  runGcloud,
  existsSync,
  join,
  mimeFromExt,
  extname,
} from './lib.mjs'

function contentTypeFor(filePath) {
  return mimeFromExt(extname(filePath))
}

async function uploadAsset(asset, { dryRun = false } = {}) {
  if (!asset.variants?.length) {
    throw new Error(`${asset.asset_id}: no variants — run media:prepare first`)
  }
  if (!asset.object_prefix) {
    throw new Error(`${asset.asset_id}: missing object_prefix`)
  }

  const uploaded = []
  for (const variant of asset.variants) {
    const local = join(ROOT, variant.file)
    if (!existsSync(local)) {
      throw new Error(`missing local file ${local}`)
    }
    const objectName = `${asset.object_prefix}/${basename(variant.file)}`
    const gsUri = `gs://${BUCKET}/${objectName}`
    const ct = contentTypeFor(local)

    runGcloud(
      [
        'storage',
        'cp',
        local,
        gsUri,
        `--cache-control=public, max-age=31536000, immutable`,
        `--content-type=${ct}`,
      ],
      { dryRun },
    )

    uploaded.push({
      ...variant,
      object: objectName,
      url: `${PUBLIC_BASE}/${objectName}`,
      ...(dryRun ? { dry_run: true } : {}),
    })
  }

  asset.variants = uploaded
  asset.status = dryRun ? 'staged' : 'uploaded'
  asset.public_base_url = PUBLIC_BASE
  console.log(`${dryRun ? 'dry-run mapped' : 'uploaded'} ${asset.asset_id} (${uploaded.length} objects)`)
  return asset
}

function needsUpload(asset) {
  if (!asset.variants?.length) return false
  if (asset.status === 'staged') return true
  return asset.variants.some((v) => v.file && !v.object)
}

async function main() {
  ensureDirs()
  const opts = parseArgs()
  const dryRun = Boolean(opts['dry-run'])
  const filterId = opts['asset-id'] || opts.asset
  const registry = loadRegistry()
  let targets = registry.assets.filter(needsUpload)
  if (filterId) targets = targets.filter((a) => a.asset_id === filterId)

  if (!targets.length) {
    console.log('nothing to upload')
    return
  }

  try {
    runGcloud(['storage', 'ls', `gs://${BUCKET}`], { dryRun })
  } catch (e) {
    console.error('Bucket list failed — refusing upload:', e.message)
    process.exit(1)
  }

  for (const asset of targets) {
    const updated = await uploadAsset(asset, { dryRun })
    upsertAsset(registry, updated)
  }
  saveRegistry(registry)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
