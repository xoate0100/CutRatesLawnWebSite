import fs from "node:fs"
import path from "node:path"

/**
 * Regression guard: only the root layout may import globals.css.
 * A second import (e.g. app/test-layout) caused Next.js to attach the full
 * Tailwind CSS chunk to that route only — production pages got fonts-only CSS
 * and looked unstyled / horizontally broken on mobile.
 */
const appDir = path.join(process.cwd(), "app")
const offenders = []

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p)
    else if (/\.(tsx|ts|jsx|js)$/.test(ent.name)) {
      const rel = path.relative(process.cwd(), p).replace(/\\/g, "/")
      if (rel === "app/layout.tsx") continue
      const text = fs.readFileSync(p, "utf8")
      if (/import\s+["'][^"']*globals\.css["']/.test(text)) offenders.push(rel)
    }
  }
}

walk(appDir)

if (offenders.length) {
  console.error("Duplicate globals.css imports (only app/layout.tsx may import it):")
  for (const o of offenders) console.error(" -", o)
  process.exit(1)
}

console.log("globals-css-import: ok (only app/layout.tsx)")
