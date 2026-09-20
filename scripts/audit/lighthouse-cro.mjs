/**
 * Phase 6 Lighthouse mobile gate for CRO routes.
 * Requires a production-mode server (next start) on LH_BASE (default http://127.0.0.1:3010).
 *
 * Targets from the CRO plan: performance ≥ 90, accessibility ≥ 95, CLS < 0.1.
 */
import lighthouse from "lighthouse"
import * as chromeLauncher from "chrome-launcher"
import fs from "node:fs"
import path from "node:path"

const origin = (process.env.LH_BASE || "http://127.0.0.1:3010").replace(/\/$/, "")

const pages = [
  { path: "/", name: "home" },
  { path: "/quote", name: "quote" },
  { path: "/quote/mowing", name: "quote-mowing" },
  { path: "/lp/snow-removal", name: "lp-snow-removal" },
  { path: "/service-areas/derby/pest-control", name: "area-derby-pest" },
]

const outDir = path.join(process.cwd(), "artifacts", "audit", "cro-lh")
fs.mkdirSync(outDir, { recursive: true })

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const PERF_MIN = Number(process.env.LH_PERF_MIN || 90)
const A11Y_MIN = Number(process.env.LH_A11Y_MIN || 95)
const CLS_MAX = Number(process.env.LH_CLS_MAX || 0.1)

const summary = {}
let failed = false

for (const page of pages) {
  let chrome
  try {
    chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    })
    const result = await lighthouse(`${origin}${page.path}`, {
      port: chrome.port,
      output: "json",
      onlyCategories: ["performance", "accessibility"],
      formFactor: "mobile",
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2.5, disabled: false },
    })
    const report = result?.lhr
    if (!report) throw new Error("No LHR")
    const cls = report.audits?.["cumulative-layout-shift"]?.numericValue ?? 1
    const row = {
      url: `${origin}${page.path}`,
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
      cls: Number(cls.toFixed(3)),
    }
    summary[page.name] = row
    fs.writeFileSync(path.join(outDir, `lh-${page.name}.json`), JSON.stringify({
      fetchTime: report.fetchTime,
      categories: {
        performance: report.categories.performance?.score,
        accessibility: report.categories.accessibility?.score,
      },
      cls,
    }))
    const rowFail =
      row.performance < PERF_MIN || row.accessibility < A11Y_MIN || row.cls >= CLS_MAX
    if (rowFail) failed = true
    console.log(page.name, row, rowFail ? "FAIL" : "ok")
  } finally {
    try {
      await chrome?.kill()
    } catch (e) {
      console.warn("chrome kill cleanup warning:", e?.code || e?.message || e)
    }
  }
}

const gate = {
  summary,
  targets: { performance: PERF_MIN, accessibility: A11Y_MIN, clsMax: CLS_MAX },
  passed: !failed,
}
fs.writeFileSync(path.join(outDir, "lh-summary.json"), JSON.stringify(gate, null, 2))
console.log(JSON.stringify(gate, null, 2))
if (failed) process.exit(1)
