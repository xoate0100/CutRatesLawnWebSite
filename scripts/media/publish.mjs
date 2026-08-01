#!/usr/bin/env node
/**
 * Full pipeline: ingest → prepare → upload → register → sync-site
 */
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { ROOT, parseArgs, ensureDirs } from './lib.mjs'

function run(script, extraArgs = []) {
  const file = join(ROOT, 'scripts/media', script)
  const r = spawnSync(process.execPath, [file, ...extraArgs], {
    cwd: ROOT,
    stdio: 'inherit',
    env: process.env,
  })
  if (r.status !== 0) process.exit(r.status || 1)
}

function main() {
  ensureDirs()
  const opts = parseArgs()
  const passthrough = []
  for (const key of ['slot', 'category', 'usage', 'alt', 'variant', 'asset-id', 'asset', 'force']) {
    if (opts[key] !== undefined && opts[key] !== true) {
      passthrough.push(`--${key}`, String(opts[key]))
    } else if (opts[key] === true) {
      passthrough.push(`--${key}`)
    }
  }
  if (opts['dry-run']) passthrough.push('--dry-run')

  console.log('→ ingest')
  run('ingest.mjs', passthrough)
  console.log('→ prepare')
  run('prepare.mjs', passthrough)
  console.log('→ upload')
  run('upload.mjs', passthrough)
  console.log('→ register')
  run('register.mjs', passthrough)
  console.log('→ sync-site')
  run('sync-site.mjs')
  console.log('publish complete')
}

main()
