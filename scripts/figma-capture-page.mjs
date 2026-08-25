/**
 * Capture local routes into Figma via generate_figma_design capture endpoint.
 * Usage: node scripts/figma-capture-page.mjs <captureId> <path>
 */
import { chromium } from "@playwright/test"

const captureId = process.argv[2]
const path = process.argv[3] || "/"
const base = process.env.FIGMA_CAPTURE_BASE || "http://127.0.0.1:3010"
const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit?bindVariables=true`

if (!captureId) {
  console.error("Usage: node scripts/figma-capture-page.mjs <captureId> <path>")
  process.exit(1)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.route("**/*", async (route) => {
  const response = await route.fetch()
  const headers = { ...response.headers() }
  delete headers["content-security-policy"]
  delete headers["content-security-policy-report-only"]
  await route.fulfill({ response, headers })
})
await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 60000 })
const scriptRes = await page.context().request.get(
  "https://mcp.figma.com/mcp/html-to-design/capture.js",
)
const scriptText = await scriptRes.text()
await page.evaluate((s) => {
  const el = document.createElement("script")
  el.textContent = s
  document.head.appendChild(el)
}, scriptText)
await page.waitForTimeout(800)
const result = await page.evaluate(
  async ({ captureId, endpoint }) => {
    // @ts-expect-error figma injected
    return await window.figma.captureForDesign({
      captureId,
      endpoint,
      selector: "body",
    })
  },
  { captureId, endpoint },
)
console.log(JSON.stringify({ path, captureId, result }, null, 2))
await browser.close()
