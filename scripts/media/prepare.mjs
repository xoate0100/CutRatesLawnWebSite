#!/usr/bin/env node
/**
 * Generate WebP variants from staged originals into media/processed/
 */
import { statSync } from 'node:fs'
import sharp from 'sharp'
import {
  PATHS,
  ROOT,
  ensureDirs,
  loadRegistry,
  saveRegistry,
  upsertAsset,
  parseArgs,
  existsSync,
  mkdirSync,
  join,
  readdirSync,
} from './lib.mjs'

const HERO_WIDTHS = [1920, 1280, 768]
const CARD_WIDTHS = [800, 400]

function widthsForUsage(usage) {
  if (usage === 'card' || usage === 'texture') return CARD_WIDTHS
  if (usage === 'logo') return [512, 256]
  return HERO_WIDTHS
}

async function prepareAsset(asset, { force = false } = {}) {
  if (!asset.staged_path) {
    console.warn(`skip ${asset.asset_id}: no staged_path`)
    return asset
  }
  const source = join(ROOT, asset.staged_path)
  if (!existsSync(source)) {
    console.warn(`skip ${asset.asset_id}: missing ${source}`)
    return asset
  }

  const outDir = join(PATHS.processed, asset.asset_id)
  mkdirSync(outDir, { recursive: true })
  const ext = source.match(/\.[^.]+$/)?.[0] || '.jpg'

  const variants = []
  const originalDest = join(outDir, `original${ext}`)
  if (!existsSync(originalDest) || force) {
    await sharp(source).rotate().toFile(originalDest)
  }
  const origMeta = await sharp(originalDest).metadata()
  variants.push({
    name: 'original',
    file: `media/processed/${asset.asset_id}/original${ext}`,
    width: origMeta.width,
    height: origMeta.height,
    format: origMeta.format,
    bytes: statSync(originalDest).size,
  })

  for (const w of widthsForUsage(asset.usage)) {
    const name = `w${w}`
    const fileName = `${name}.webp`
    const dest = join(outDir, fileName)
    if (!existsSync(dest) || force) {
      await sharp(source)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(dest)
    }
    const meta = await sharp(dest).metadata()
    variants.push({
      name,
      file: `media/processed/${asset.asset_id}/${fileName}`,
      width: meta.width,
      height: meta.height,
      format: 'webp',
      bytes: statSync(dest).size,
    })
  }

  asset.variants = variants
  console.log(`prepared ${asset.asset_id}: ${variants.map((v) => v.name).join(', ')}`)
  return asset
}

async function main() {
  ensureDirs()
  const opts = parseArgs()
  const registry = loadRegistry()
  const filterId = opts['asset-id'] || opts.asset
  let targets = registry.assets.filter(
    (a) => a.status === 'staged' || a.status === 'uploaded' || a.status === 'published',
  )
  if (filterId) targets = targets.filter((a) => a.asset_id === filterId)

  if (!targets.length) {
    const staged = existsSync(PATHS.staging)
      ? readdirSync(PATHS.staging).filter((n) => !n.endsWith('.meta.json') && !n.startsWith('.'))
      : []
    if (!staged.length) {
      console.log('nothing to prepare')
      return
    }
  }

  for (const asset of targets) {
    const updated = await prepareAsset(asset, { force: Boolean(opts.force) })
    upsertAsset(registry, updated)
  }
  saveRegistry(registry)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
