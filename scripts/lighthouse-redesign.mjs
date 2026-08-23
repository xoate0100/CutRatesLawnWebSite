/**
 * Best-effort Lighthouse runner — ignores Windows chrome-launcher EPERM on tmp cleanup.
 */
import lighthouse from "lighthouse"
import * as chromeLauncher from "chrome-launcher"
import fs from "node:fs"
import path from "node:path"

const pages = [
  { url: process.env.LH_BASE || "http://127.0.0.1:3010/", name: "home" },
  {
    url: (process.env.LH_BASE || "http://127.0.0.1:3010") + "/services/landscaping",
    name: "landscaping",
  },
]

const outDir = path.join(process.cwd(), "artifacts", "redesign")
fs.mkdirSync(outDir, { recursive: true })

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

const summary = {}

for (const page of pages) {
  let chrome
  try {
    chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
    })
    const result = await lighthouse(page.url, {
      port: chrome.port,
      output: "json",
      onlyCategories: ["performance", "accessibility"],
      formFactor: "mobile",
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    })
    const report = result?.lhr
    if (!report) throw new Error("No LHR")
    const out = path.join(outDir, `lh-${page.name}.json`)
    fs.writeFileSync(out, JSON.stringify(report, null, 2))
    summary[page.name] = {
      performance: Math.round((report.categories.performance?.score || 0) * 100),
      accessibility: Math.round((report.categories.accessibility?.score || 0) * 100),
    }
    console.log(page.name, summary[page.name])
  } finally {
    try {
      await chrome?.kill()
    } catch (e) {
      console.warn("chrome kill cleanup warning:", e?.code || e?.message || e)
    }
  }
}

fs.writeFileSync(path.join(outDir, "lh-summary.json"), JSON.stringify(summary, null, 2))
const ok =
  summary.home?.accessibility >= 90 &&
  summary.landscaping?.accessibility >= 90
console.log(JSON.stringify({ summary, gateHint: { a11yOk: ok, perfTarget: 90 } }))
