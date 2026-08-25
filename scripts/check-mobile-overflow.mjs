import { chromium } from "@playwright/test"
import fs from "node:fs"

fs.mkdirSync("artifacts/redesign", { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })

const routes = [
  "/",
  "/services",
  "/services/landscaping",
  "/quote",
  "/about",
  "/contact",
  "/bundles",
  "/our-work",
  "/faq",
  "/service-areas",
  "/service-areas/derby",
]
const report = []

for (const route of routes) {
  await page.goto(`http://127.0.0.1:3010${route}`, { waitUntil: "domcontentloaded", timeout: 60000 })
  await page.waitForTimeout(500)
  const info = await page.evaluate(() => {
    const doc = document.documentElement
    const cut = []
    const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) =>
      (l.getAttribute("href") || "").split("/").pop(),
    )
    document.querySelectorAll("h1,h2,h3,p,li,a,button,label,span").forEach((el) => {
      if (el.closest(".marquee")) return
      const r = el.getBoundingClientRect()
      if (r.width < 10 || r.height < 10) return
      // Ignored if fully off-screen vertically (not in viewport)
      if (r.bottom < 0 || r.top > window.innerHeight) return
      if (r.right > window.innerWidth + 2 || r.left < -2) {
        cut.push({
          tag: el.tagName,
          cls: (el.className || "").toString().slice(0, 80),
          text: (el.innerText || "").slice(0, 60).replace(/\n/g, " "),
          right: Math.round(r.right),
          left: Math.round(r.left),
        })
      }
    })
    return {
      overflowX: doc.scrollWidth - doc.clientWidth,
      htmlOx: getComputedStyle(doc).overflowX,
      cssCount: cssLinks.length,
      cssLinks,
      h1Right: document.querySelector("h1")?.getBoundingClientRect().right ?? null,
      cut: cut.slice(0, 12),
    }
  })
  const slug = route === "/" ? "home" : route.replace(/\//g, "_")
  await page.screenshot({ path: `artifacts/redesign/fixed-m390${slug}.png`, fullPage: false })
  report.push({ route, ...info })
}

console.log(JSON.stringify(report, null, 2))
await browser.close()

const bad = report.filter((r) => r.overflowX > 1 || r.cut.length || r.cssCount < 1 || r.htmlOx !== "clip")
if (bad.length) {
  console.error("STILL_OVERFLOW", bad.length)
  process.exit(1)
}
console.log("MOBILE_OVERFLOW_OK")
