#!/usr/bin/env node
/**
 * media/inbox → validate → rename → stage + draft registry row
 */
import { statSync } from 'node:fs'
import sharp from 'sharp'
import {
  ALLOWED_EXT,
  REJECT_EXT,
  PATHS,
  ensureDirs,
  listInboxFiles,
  quarantine,
  sha256File,
  readMetaSidecar,
  resolveAssetId,
  slugify,
  loadRegistry,
  saveRegistry,
  upsertAsset,
  findAsset,
  objectPrefix,
  mimeFromExt,
  parseArgs,
  renameSync,
  copyFileSync,
  existsSync,
  unlinkSync,
  basename,
  extname,
  join,
  BUCKET,
  PUBLIC_BASE,
} from './lib.mjs'

async function ingestOne(filePath, opts) {
  const ext = extname(filePath).toLowerCase()
  const name = basename(filePath)

  if (REJECT_EXT.has(ext)) {
    quarantine(filePath, `rejected extension ${ext}`)
    return null
  }
  if (!ALLOWED_EXT.has(ext)) {
    quarantine(filePath, `unknown extension ${ext}`)
    return null
  }

  const sha = sha256File(filePath)
  const { meta, metaPath } = readMetaSidecar(filePath)
  const assetId = resolveAssetId(meta, sha)
  const registry = loadRegistry()
  const existing = findAsset(registry, assetId)

  if (existing?.sha256 === sha && (existing.status === 'uploaded' || existing.status === 'published')) {
    console.log(`skip (already uploaded): ${assetId}`)
    // still remove from inbox if present
    unlinkSync(filePath)
    if (metaPath && existsSync(metaPath)) unlinkSync(metaPath)
    return existing
  }

  const metaTitle = meta?.title || meta?.name || name.replace(ext, '')
  const slug = slugify(meta?.slug || metaTitle)
  const category = opts.category || meta?.category || existing?.usage || 'misc'
  const slot = opts.slot || meta?.slot || null
  const usage = opts.usage || meta?.usage || 'hero'

  let width = null
  let height = null
  try {
    const info = await sharp(filePath).metadata()
    width = info.width ?? null
    height = info.height ?? null
  } catch (e) {
    quarantine(filePath, `sharp failed: ${e.message}`)
    return null
  }

  const stagedName = `${assetId}${ext}`
  const stagedPath = join(PATHS.staging, stagedName)
  if (existsSync(stagedPath)) unlinkSync(stagedPath)
  renameSync(filePath, stagedPath)
  if (metaPath && existsSync(metaPath)) {
    const stagedMeta = join(PATHS.staging, `${assetId}.meta.json`)
    copyFileSync(metaPath, stagedMeta)
    unlinkSync(metaPath)
  }

  const prefix = objectPrefix({ category, slot: slot || 'unassigned', assetId })
  const asset = upsertAsset(registry, {
    asset_id: assetId,
    slug,
    status: 'staged',
    envato_item_id: meta?.envato_item_id || meta?.itemId || null,
    envato_url: meta?.envato_url || meta?.url || null,
    title: metaTitle,
    author: meta?.author || meta?.username || null,
    license_notes: meta?.license_notes || meta?.license || 'Envato Elements — confirm license before publish',
    downloaded_at: meta?.downloaded_at || new Date().toISOString(),
    source_filename: name,
    sha256: sha,
    bytes: statSync(stagedPath).size,
    width,
    height,
    mime: mimeFromExt(ext),
    bucket: BUCKET,
    object_prefix: prefix,
    public_base_url: PUBLIC_BASE,
    variants: existing?.variants || [],
    slots: slot ? Array.from(new Set([...(existing?.slots || []), slot])) : existing?.slots || [],
    alt: opts.alt || meta?.alt || metaTitle,
    tags: meta?.tags || [],
    usage,
    category,
    staged_path: `media/staging/${stagedName}`,
    ingested_by: process.env.USER || process.env.USERNAME || 'agent',
    notes: meta?.notes || '',
  })

  saveRegistry(registry)
  console.log(`staged ${assetId} → ${stagedPath}`)
  return asset
}

async function main() {
  ensureDirs()
  const opts = parseArgs()
  const files = listInboxFiles()
  if (!files.length) {
    console.log('inbox empty — nothing to ingest')
    return
  }
  for (const f of files) {
    await ingestOne(f, opts)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
