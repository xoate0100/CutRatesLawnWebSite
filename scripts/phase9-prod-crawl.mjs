/**
 * Phase 9 production / preview crawl gate (390px).
 * Usage: AUDIT_BASE=https://cutrateslawn.com node scripts/phase9-prod-crawl.mjs
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"

const BASE = (process.env.AUDIT_BASE || "https://cutrateslawn.com").replace(/\/$/, "")
const OUT = "artifacts/audit/phase9-prod-crawl.json"
fs.mkdirSync("artifacts/audit", { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
})

const failures = []
const pages = []

function fail(id, detail) {
  failures.push({ id, detail })
}

async function sitemapPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`)
  if (!res.ok) {
    fail("SITEMAP", `status ${res.status}`)
    return ["/", "/quote", "/services", "/service-areas", "/privacy", "/terms"]
  }
  const xml = await res.text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  return locs
    .map((u) => {
      try {
        const p = new URL(u).pathname || "/"
        return p
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

const paths = await sitemapPaths()
console.log(`Crawling ${paths.length} paths on ${BASE}`)

for (const path of paths) {
  const url = `${BASE}${path}`
  const page = await context.newPage()
  const consoleErrors = []
  const cspHits = []
  const brokenImages = []
  let gtmRequest = false
  let status = 0

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text()
      consoleErrors.push(t)
      if (/content security policy|csp/i.test(t)) cspHits.push(t)
    }
  })
  page.on("response", (res) => {
    const u = res.url()
    if (/googletagmanager\.com\/gtm\.js/.test(u)) gtmRequest = true
    if (res.request().resourceType() === "image" && res.status() >= 400) {
      brokenImages.push({ url: u, status: res.status() })
    }
  })

  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 })
    status = resp?.status() || 0
    await page.waitForTimeout(1200)

    const meta = await page.evaluate(() => {
      const canon = document.querySelector('link[rel="canonical"]')?.getAttribute("href") || ""
      const html = document.documentElement.outerHTML
      let gtmConfigured = null
      try {
        const dl = window.dataLayer || []
        for (let i = dl.length - 1; i >= 0; i--) {
          const e = dl[i]
          if (e && typeof e === "object" && "gtm_configured" in e) {
            gtmConfigured = e.gtm_configured
            break
          }
        }
      } catch {
        /* ignore */
      }
      return {
        title: document.title,
        h1: document.querySelector("h1")?.textContent?.trim() || "",
        canonical: canon,
        localhost: /localhost|127\.0\.0\.1/i.test(html),
        gtmConfigured,
        turnstile: !!document.querySelector(".cf-turnstile, [data-turnstile], iframe[src*='challenges.cloudflare.com']"),
      }
    })

    if (status !== 200) fail("HTTP", `${path} → ${status}`)
    if (meta.localhost) fail("LOCALHOST", path)
    if (cspHits.length) fail("CSP", `${path}: ${cspHits[0]?.slice(0, 120)}`)
    if (brokenImages.length) fail("IMG", `${path}: ${brokenImages.length} broken`)
    // Indexable marketing pages should have canonical; skip thank-you/api-ish
    if (!/^\/thank-you/.test(path) && !meta.canonical) fail("CANONICAL", path)

    pages.push({
      path,
      status,
      gtmRequest,
      gtmConfigured: meta.gtmConfigured,
      canonical: meta.canonical,
      localhost: meta.localhost,
      consoleErrors: consoleErrors.length,
      cspHits: cspHits.length,
      brokenImages: brokenImages.length,
      turnstileWidget: meta.turnstile,
      h1: meta.h1?.slice(0, 80),
    })
  } catch (e) {
    fail("NAV", `${path}: ${e.message}`)
    pages.push({ path, error: String(e.message) })
  } finally {
    await page.close()
  }
}

// Spot-check home for GTM (must pass on at least home)
const home = pages.find((p) => p.path === "/" || p.path === "")
if (home) {
  if (home.gtmConfigured !== true) fail("GTM_FLAG", `gtm_configured=${home.gtmConfigured}`)
  if (!home.gtmRequest) fail("GTM_NET", "no googletagmanager.com/gtm.js on home")
}

const report = {
  base: BASE,
  crawledAt: new Date().toISOString(),
  pathCount: paths.length,
  ok: failures.length === 0,
  failures,
  pages,
}
fs.writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ ok: report.ok, failures, pathCount: paths.length, home }, null, 2))
await browser.close()
if (failures.length) {
  console.error("PHASE9_CRAWL_FAIL", failures.length)
  process.exit(1)
}
console.log("PHASE9_CRAWL_OK")
