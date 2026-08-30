/**
 * Hero layout gate: no text/image overlap at desktop grid widths,
 * readable headline breaks, no horizontal overflow on mobile.
 */
import { chromium } from "@playwright/test"

const BASE = process.env.AUDIT_BASE || "http://127.0.0.1:3010"
const VIEWPORTS = [
  { w: 390, h: 844, label: "mobile" },
  { w: 768, h: 900, label: "tablet" },
  { w: 1024, h: 900, label: "lg-grid" },
  { w: 1280, h: 900, label: "xl" },
  { w: 1440, h: 900, label: "desktop" },
]

const browser = await chromium.launch({ headless: true })
const failures = []

function fail(label, detail) {
  failures.push({ label, detail })
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } })
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 })
  await page.waitForTimeout(300)

  const result = await page.evaluate(() => {
    const h1 = document.querySelector("section h1")
    const span = h1?.querySelector("span")
    const textCol = h1?.closest(".min-w-0")
    const imgCol = document.querySelector("section .relative.z-0")
    const img = imgCol?.querySelector("img")
    const hr = h1?.getBoundingClientRect()
    const sr = span?.getBoundingClientRect()
    const tr = textCol?.getBoundingClientRect()
    const ir = imgCol?.getBoundingClientRect()

    const lineCount = h1
      ? h1.innerText
          .trim()
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean).length
      : 0

    const intersects = (a, b) =>
      a && b
        ? !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
        : false

    return {
      h1Text: (h1?.innerText || "").replace(/\s+/g, " ").trim(),
      lineCount,
      spanWhiteSpace: span ? getComputedStyle(span).whiteSpace : null,
      spanOverlapsImgCol: intersects(sr, ir),
      h1OverlapsImg: intersects(hr, ir),
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      gridCols: textCol?.parentElement
        ? getComputedStyle(textCol.parentElement).gridTemplateColumns
        : null,
    }
  })

  if (!/lawn/i.test(result.h1Text) || !/runaround/i.test(result.h1Text)) {
    fail(vp.label, `Missing headline text: ${result.h1Text}`)
  }
  if (result.docOverflow > 1) fail(vp.label, `Horizontal overflow ${result.docOverflow}px`)
  if (result.h1OverlapsImg || result.spanOverlapsImgCol) {
    fail(vp.label, "Headline intersects hero image frame")
  }
  if (result.lineCount > 4) {
    fail(vp.label, `Headline wraps to ${result.lineCount} lines`)
  }
  if (vp.w >= 1024 && result.lineCount > 3) {
    fail(vp.label, `Desktop headline has ${result.lineCount} lines (want ≤3)`)
  }

  console.log(`${vp.label} (${vp.w}px): lines=${result.lineCount} overlap=${result.spanOverlapsImgCol}`)
}

await browser.close()

if (failures.length) {
  console.error("\nHero layout validation failed:")
  for (const f of failures) console.error(`- [${f.label}] ${f.detail}`)
  process.exit(1)
}

console.log("\nHero layout validation passed.")
