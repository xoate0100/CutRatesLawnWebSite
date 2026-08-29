import { chromium } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

const outDir = path.join(process.cwd(), "docs/redesign/screenshots/homepage-preview")
fs.mkdirSync(outDir, { recursive: true })

const targets = [
  ["d7d7wkfp", "https://d7d7wkfp.cutrateslawn.com/"],
  ["preview", "https://new.cutrateslawn.com/"],
]

const viewports = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]

const browser = await chromium.launch()
for (const [name, url] of targets) {
  for (const [vpName, viewport] of viewports) {
    const page = await browser.newPage({ viewport })
    await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 })
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(outDir, `${name}-${vpName}.png`),
      fullPage: false,
    })
    await page.close()
  }
}
await browser.close()
console.log("saved to", outDir)
