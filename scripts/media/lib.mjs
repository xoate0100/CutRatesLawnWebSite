import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, renameSync, copyFileSync, unlinkSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const ROOT = resolve(__dirname, '../..')

export const PATHS = {
  inbox: join(ROOT, 'media/inbox'),
  staging: join(ROOT, 'media/staging'),
  processed: join(ROOT, 'media/processed'),
  quarantine: join(ROOT, 'media/quarantine'),
  registry: join(ROOT, 'docs/media/MEDIA_REGISTRY.yaml'),
  slotMap: join(ROOT, 'docs/media/SLOT_MAP.yaml'),
  mediaMap: join(ROOT, 'lib/generated/media-map.json'),
}

export const BUCKET = process.env.GCS_MEDIA_BUCKET || 'site_photo_storage'
export const PREFIX = process.env.GCS_MEDIA_PREFIX || 'cutrateslawn/prod'
export const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL ||
  `https://storage.googleapis.com/${BUCKET}`

export const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.tif', '.tiff'])
export const REJECT_EXT = new Set(['.zip', '.exe', '.msi', '.bat', '.cmd', '.ps1', '.js', '.mjs', '.sh'])

export function ensureDirs() {
  for (const p of [PATHS.inbox, PATHS.staging, PATHS.processed, PATHS.quarantine, dirname(PATHS.mediaMap)]) {
    mkdirSync(p, { recursive: true })
  }
}

export function sha256File(filePath) {
  const hash = createHash('sha256')
  hash.update(readFileSync(filePath))
  return hash.digest('hex')
}

export function shortHash(hex, n = 12) {
  return hex.slice(0, n)
}

export function loadYaml(filePath) {
  if (!existsSync(filePath)) return null
  return parseYaml(readFileSync(filePath, 'utf8'))
}

export function saveYaml(filePath, data) {
  writeFileSync(filePath, stringifyYaml(data, { lineWidth: 120 }), 'utf8')
}

export function loadRegistry() {
  const data = loadYaml(PATHS.registry) || {
    version: 1,
    bucket: BUCKET,
    default_prefix: PREFIX,
    public_base_url: PUBLIC_BASE,
    assets: [],
  }
  if (!Array.isArray(data.assets)) data.assets = []
  return data
}

export function saveRegistry(registry) {
  registry.updated_at = new Date().toISOString()
  saveYaml(PATHS.registry, registry)
}

export function loadSlotMap() {
  return (
    loadYaml(PATHS.slotMap) || {
      version: 1,
      slots: {},
    }
  )
}

export function saveSlotMap(slotMap) {
  saveYaml(PATHS.slotMap, slotMap)
}

export function findAsset(registry, assetId) {
  return registry.assets.find((a) => a.asset_id === assetId)
}

export function upsertAsset(registry, asset) {
  const idx = registry.assets.findIndex((a) => a.asset_id === asset.asset_id)
  asset.updated_at = new Date().toISOString()
  if (idx >= 0) registry.assets[idx] = { ...registry.assets[idx], ...asset }
  else registry.assets.push(asset)
  return registry.assets[idx >= 0 ? idx : registry.assets.length - 1]
}

export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (!next || next.startsWith('--')) out[key] = true
      else {
        out[key] = next
        i++
      }
    } else out._.push(a)
  }
  return out
}

export function readMetaSidecar(imagePath) {
  const metaPath = imagePath.replace(/\.[^.]+$/, '') + '.meta.json'
  if (!existsSync(metaPath)) return { meta: null, metaPath }
  try {
    return { meta: JSON.parse(readFileSync(metaPath, 'utf8')), metaPath }
  } catch {
    return { meta: null, metaPath }
  }
}

export function resolveAssetId(meta, sha) {
  if (meta?.envato_item_id) return `env-${String(meta.envato_item_id)}`
  if (meta?.itemId) return `env-${String(meta.itemId)}`
  return `sha-${shortHash(sha)}`
}

export function slugify(input) {
  return String(input || 'asset')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'asset'
}

export function objectPrefix({ category, slot, assetId }) {
  const slotPart = String(slot || 'unassigned').replace(/\./g, '-')
  return `${PREFIX}/${category || 'misc'}/${slotPart}/${assetId}`
}

export function findGcloud() {
  const candidates = [
    process.env.GCLOUD_PATH,
    'gcloud',
    join(process.env.LOCALAPPDATA || '', 'google-cloud-sdk', 'google-cloud-sdk', 'bin', 'gcloud.cmd'),
    join(process.env.LOCALAPPDATA || '', 'Google', 'Cloud SDK', 'google-cloud-sdk', 'bin', 'gcloud.cmd'),
    'C:\\Program Files (x86)\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd',
    'C:\\Program Files\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd',
  ].filter(Boolean)

  for (const c of candidates) {
    if (c === 'gcloud') {
      const r = spawnSync(c, ['--version'], { encoding: 'utf8', shell: true })
      if (r.status === 0) return c
      continue
    }
    if (existsSync(c)) return c
  }
  return null
}

export function runGcloud(args, { dryRun = false } = {}) {
  const bin = findGcloud()
  if (!bin) {
    throw new Error(
      'gcloud not found. Install Google Cloud SDK and ensure gcloud is on PATH, or set GCLOUD_PATH.',
    )
  }
  if (dryRun) {
    console.log(`[dry-run] ${bin} ${args.join(' ')}`)
    return { status: 0, stdout: '', stderr: '' }
  }
  const r = spawnSync(bin, args, { encoding: 'utf8', shell: false })
  if (r.status !== 0) {
    throw new Error(`gcloud failed (${r.status}): ${r.stderr || r.stdout}`)
  }
  return r
}

export function listInboxFiles() {
  ensureDirs()
  return readdirSync(PATHS.inbox)
    .filter((name) => !name.startsWith('.'))
    .filter((name) => !name.endsWith('.meta.json'))
    .map((name) => join(PATHS.inbox, name))
}

export function quarantine(filePath, reason) {
  ensureDirs()
  const dest = join(PATHS.quarantine, basename(filePath))
  renameSync(filePath, dest)
  writeFileSync(dest + '.reason.txt', reason, 'utf8')
  console.warn(`quarantined ${basename(filePath)}: ${reason}`)
  return dest
}

export function mimeFromExt(ext) {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.avif': 'image/avif',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
  }
  return map[ext.toLowerCase()] || 'application/octet-stream'
}

export { basename, dirname, extname, join, existsSync, mkdirSync, readFileSync, writeFileSync, renameSync, copyFileSync, unlinkSync, readdirSync }
