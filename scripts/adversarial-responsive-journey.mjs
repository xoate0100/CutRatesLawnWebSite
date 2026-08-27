/**
 * Adversarial + mutation battery for responsiveness, overlap, and prospect journey.
 * Run: AUDIT_BASE=https://... pnpm exec node scripts/adversarial-responsive-journey.mjs
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"

const BASE = process.env.AUDIT_BASE || "https://v0-cut-rates-lawn-main-page.vercel.app"
const OUT_DIR = "artifacts/audit/adversarial"
const OUT = `${OUT_DIR}/report.json`

fs.mkdirSync(OUT_DIR, { recursive: true })

const VIEWPORTS = [
  { name: "galaxy-fold", width: 280, height: 653, dpr: 3 },
  { name: "iphone-se", width: 375, height: 667, dpr: 2 },
  { name: "iphone-14", width: 390, height: 844, dpr: 3 },
  { name: "iphone-14-land", width: 844, height: 390, dpr: 3 },
  { name: "pixel-7", width: 412, height: 915, dpr: 2.625 },
  { name: "ipad-mini", width: 768, height: 1024, dpr: 2 },
  { name: "ipad-land", width: 1024, height: 768, dpr: 2 },
  { name: "laptop", width: 1280, height: 800, dpr: 1 },
  { name: "desktop", width: 1440, height: 900, dpr: 1 },
  { name: "ultrawide", width: 1920, height: 1080, dpr: 1 },
]

const JOURNEY_ROUTES = [
  "/",
  "/services",
  "/services/landscaping",
  "/bundles",
  "/quote",
  "/contact",
  "/our-work",
  "/faq",
  "/about",
  "/service-areas",
  "/service-areas/derby",
]

const findings = []
const matrix = []

function record(sev, id, title, detail, meta = {}) {
  findings.push({ severity: sev, id, title, detail, ...meta, at: new Date().toISOString() })
}

async function pageMetrics(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    const vw = window.innerWidth
    const vh = window.innerHeight

    const overflowX = doc.scrollWidth - doc.clientWidth
    const htmlOx = getComputedStyle(doc).overflowX
    const forest = getComputedStyle(doc).getPropertyValue("--forest").trim()

    const h1 = document.querySelector("h1")
    const h1r = h1?.getBoundingClientRect()
    const h1Clip =
      h1r && (h1r.right > vw + 2 || h1r.left < -2 || h1r.width > vw + 4)

    // Center-column coverage by fixed chrome (not sticky header at top)
    const samples = [
      [0.5, 0.45],
      [0.5, 0.62],
      [0.5, 0.78],
      [0.35, 0.7],
    ].map(([fx, fy]) => {
      const x = vw * fx
      const y = vh * fy
      const el = document.elementFromPoint(x, y)
      const sticky = el?.closest?.("[data-sticky-quote]")
      const fullBleed =
        el &&
        (getComputedStyle(el).position === "fixed" || getComputedStyle(el).position === "sticky") &&
        el.getBoundingClientRect().width > vw * 0.85 &&
        el.getBoundingClientRect().top > 80
      const chatBtn = el?.closest?.('button[aria-label="Open contact help"]')
      return {
        fx,
        fy,
        underSticky: !!sticky,
        underFullBleed: !!fullBleed,
        underChat: !!chatBtn,
        tag: el?.tagName || null,
      }
    })

    const sticky = document.querySelector("[data-sticky-quote]")
    const sr = sticky?.getBoundingClientRect()
    const stickyOff =
      sticky && sr && sr.width > 8 && (sr.top < -2 || sr.top > vh + 2) && getComputedStyle(sticky).opacity !== "0"

    // Non-marquee text past viewport (visible band only)
    const clipped = []
    for (const el of document.querySelectorAll("h1,h2,h3,p,a,button,label,li")) {
      if (el.closest(".marquee")) continue
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 8) continue
      if (r.bottom < 0 || r.top > vh) continue
      if (r.right > vw + 2 || r.left < -2) {
        clipped.push({
          text: (el.innerText || "").trim().slice(0, 50),
          left: Math.round(r.left),
          right: Math.round(r.right),
        })
        if (clipped.length >= 6) break
      }
    }

    // Interactive targets too small (mobile-relevant)
    const tiny = []
    if (vw < 768) {
      for (const el of document.querySelectorAll("a, button, [role='button']")) {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) continue
        if (r.width >= 8 && r.height >= 8 && (r.width < 36 || r.height < 36)) {
          tiny.push({
            text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 36),
            w: Math.round(r.width),
            h: Math.round(r.height),
          })
          if (tiny.length >= 8) break
        }
      }
    }

    // Overlapping pair: only stacked CTAs that share the same flex/grid parent
    let ctaGap = null
    const ctaRe = /free quote|see our work|get a quote|start below|quote →/i
    const candidates = [...document.querySelectorAll("a, button")].filter((a) =>
      ctaRe.test((a.textContent || "").replace(/\s+/g, " ")),
    )
    for (let i = 0; i < candidates.length - 1; i++) {
      const a = candidates[i]
      const b = candidates[i + 1]
      if (a.parentElement !== b.parentElement) continue
      const ar = a.getBoundingClientRect()
      const br = b.getBoundingClientRect()
      if (ar.width < 8 || br.width < 8) continue
      // stacked (not side-by-side)
      if (Math.abs(ar.left - br.left) > 48) continue
      if (br.top < ar.top) continue
      ctaGap = Math.round(br.top - ar.bottom)
      break
    }

    return {
      overflowX,
      htmlOx,
      forest: !!forest,
      h1Text: (h1?.innerText || "").replace(/\s+/g, " ").trim().slice(0, 80),
      h1Clip: !!h1Clip,
      h1Right: h1r ? Math.round(h1r.right) : null,
      samples,
      stickyOff: !!stickyOff,
      stickyRect: sr
        ? { top: Math.round(sr.top), w: Math.round(sr.width), opacity: getComputedStyle(sticky).opacity }
        : null,
      clipped,
      tinyCount: tiny.length,
      tiny: tiny.slice(0, 4),
      ctaGap,
      mainPad: getComputedStyle(document.querySelector("main") || doc).paddingBottom,
    }
  })
}

function scoreCell(m, vp) {
  const issues = []
  if (!m.forest) issues.push("css-missing")
  if (m.htmlOx !== "clip" && vp.width < 1024) issues.push("no-overflow-clip")
  if (m.overflowX > 2) issues.push("doc-overflow")
  if (m.h1Clip) issues.push("h1-clip")
  if (m.samples.some((s) => s.underSticky || s.underFullBleed)) issues.push("center-cover")
  if (m.stickyOff) issues.push("sticky-offscreen")
  if (m.clipped.length) issues.push("text-clip")
  if (m.ctaGap != null && m.ctaGap < 8) issues.push("cta-overlap")
  if (vp.width < 400 && m.tinyCount >= 6) issues.push("tiny-targets")
  return issues
}

const browser = await chromium.launch({ headless: true })

// ─── 1. Viewport matrix mutation ───
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.width < 768,
    hasTouch: vp.width < 1024,
  })
  const page = await context.newPage()

  for (const route of ["/", "/quote", "/services/landscaping", "/bundles"]) {
    const cell = { viewport: vp.name, w: vp.width, h: vp.height, route, issues: [], pass: true }
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 })
      await page.waitForTimeout(350)

      // Mutation: mid-page scroll (activates sticky chrome)
      if (route !== "/quote") {
        await page.evaluate(() => window.scrollTo(0, Math.min(720, document.body.scrollHeight * 0.35)))
        await page.waitForTimeout(350)
      }

      let m = await pageMetrics(page)
      let issues = scoreCell(m, vp)

      // Mutation: jump near footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - window.innerHeight - 40))
      await page.waitForTimeout(300)
      const mFoot = await pageMetrics(page)
      if (mFoot.samples.some((s) => s.underFullBleed)) issues.push("footer-cover")

      // Mutation: back to mid
      await page.evaluate(() => window.scrollTo(0, 500))
      await page.waitForTimeout(200)
      m = await pageMetrics(page)
      issues = [...new Set([...issues, ...scoreCell(m, vp)])]

      cell.issues = issues
      cell.metrics = {
        overflowX: m.overflowX,
        htmlOx: m.htmlOx,
        h1Clip: m.h1Clip,
        clipped: m.clipped.length,
        centerHits: m.samples.filter((s) => s.underSticky || s.underFullBleed).length,
        ctaGap: m.ctaGap,
        sticky: m.stickyRect,
      }
      cell.pass = issues.length === 0

      if (!cell.pass) {
        const sev = issues.some((i) => ["h1-clip", "center-cover", "doc-overflow", "css-missing"].includes(i))
          ? "critical"
          : "high"
        record(sev, `VP-${issues[0]}`, `${vp.name} ${route}: ${issues.join(",")}`, JSON.stringify(cell.metrics), {
          viewport: vp.name,
          route,
        })
        const slug = `${vp.name}${route.replace(/\//g, "_") || "_home"}`
        await page.screenshot({ path: `${OUT_DIR}/${slug}.png`, fullPage: false })
      }
    } catch (err) {
      cell.pass = false
      cell.issues = ["nav-fail"]
      record("critical", "NAV-FAIL", `${vp.name} ${route} failed`, String(err).slice(0, 200), {
        viewport: vp.name,
        route,
      })
    }
    matrix.push(cell)
  }
  await context.close()
}

// ─── 2. Journey adversarial (mobile) ───
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  const journey = { steps: [], ok: true }

  try {
    // Home engage
    await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 })
    const homeH1 = await page.locator("h1").first().innerText()
    journey.steps.push({ step: "home", h1: homeH1.slice(0, 60) })
    if (!/lawn|runaround/i.test(homeH1)) {
      record("critical", "JOURNEY-H1", "Home H1 missing brand promise", homeH1)
      journey.ok = false
    }

    // Open mobile menu — must not leave body unscrollable after close
    const menuBtn = page.getByRole("button", { name: /open menu|close menu/i })
    if (await menuBtn.count()) {
      await menuBtn.click()
      await page.waitForTimeout(250)
      const open = await page.locator("#mobile-nav").isVisible().catch(() => false)
      journey.steps.push({ step: "menu-open", open })
      if (open) {
        await page.getByRole("link", { name: /^Services$/i }).first().click()
        await page.waitForTimeout(500)
        journey.steps.push({ step: "nav-services", url: page.url() })
        if (!page.url().includes("/services")) {
          record("high", "JOURNEY-NAV", "Services menu link did not land on /services", page.url())
          journey.ok = false
        }
      }
    }

    // Service detail → quote CTA
    await page.goto(`${BASE}/services/landscaping`, { waitUntil: "domcontentloaded" })
    const quoteCta = page.getByRole("link", { name: /get a quote/i }).first()
    await quoteCta.click()
    await page.waitForTimeout(600)
    journey.steps.push({ step: "to-quote", url: page.url() })
    if (!page.url().includes("/quote")) {
      record("critical", "JOURNEY-CTA", "Landscaping CTA did not reach /quote", page.url())
      journey.ok = false
    }

    // Quote funnel mutations
    await page.goto(`${BASE}/quote`, { waitUntil: "networkidle" })
    await page.locator("#quote-funnel").scrollIntoViewIfNeeded()

    // Adversarial: calculate with defaults / empty
    const calc = page.getByRole("button", { name: /calculate estimate/i })
    if (await calc.count()) {
      await calc.click()
      await page.waitForTimeout(500)
      const bodyText = await page.locator("#quote-funnel").innerText()
      journey.steps.push({ step: "calc-default", snippet: bodyText.slice(0, 120) })
    }

    // Fill property size adversarially (huge / zero)
    const sizeInput = page.locator('input[type="number"], input[inputmode="numeric"]').first()
    if (await sizeInput.count()) {
      await sizeInput.fill("0")
      if (await calc.count()) await calc.click()
      await page.waitForTimeout(300)
      await sizeInput.fill("999999")
      if (await calc.count()) await calc.click()
      await page.waitForTimeout(300)
      await sizeInput.fill("8500")
      if (await calc.count()) await calc.click()
      await page.waitForTimeout(400)
      journey.steps.push({ step: "size-mutations", ok: true })
    }

    // Continue to contact if available
    const continueBtn = page.getByRole("button", { name: /continue|contact|next/i }).first()
    if (await continueBtn.count()) {
      await continueBtn.click()
      await page.waitForTimeout(400)
    }

    // XSS-ish in contact fields if present
    const first = page.getByLabel(/first name/i)
    if (await first.count()) {
      await first.fill('<script>alert(1)</script>')
      await page.getByLabel(/last name/i).fill("Probe")
      await page.getByLabel(/email/i).fill("not-email")
      const submit = page.getByRole("button", { name: /submit|send|request/i }).first()
      if (await submit.count()) {
        await submit.click()
        await page.waitForTimeout(400)
      }
      const injected = await page.locator("script", { hasText: "alert(1)" }).count()
      if (injected > 0) {
        record("critical", "XSS", "Script tag materialized from form input", "")
        journey.ok = false
      }
      journey.steps.push({ step: "xss-probe", injected })
    }

    // Chat must stay hidden on quote
    const chat = await page.locator('button[aria-label="Open contact help"]').count()
    if (chat > 0) {
      record("high", "QUOTE-CHAT", "Chat FAB visible on /quote (covers funnel)", "")
      journey.ok = false
    }

    // Stepper Done visible
    const done = page.locator('nav[aria-label="Quote progress"]').getByText(/Done/i)
    if (await done.count()) {
      const box = await done.boundingBox()
      if (box && box.x + box.width > 392) {
        record("high", "STEPPER-CLIP", "Done step clipped", JSON.stringify(box))
        journey.ok = false
      }
    }

    await page.screenshot({ path: `${OUT_DIR}/journey-quote.png` })
  } catch (err) {
    journey.ok = false
    record("critical", "JOURNEY-CRASH", "Journey threw", String(err).slice(0, 240))
  }

  // Rapid navigation thrash
  for (const route of JOURNEY_ROUTES) {
    const res = await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 })
    const status = res?.status() ?? 0
    if (status >= 400) {
      record("critical", "RAPID-4xx", `${route} returned ${status}`, "")
      journey.ok = false
    }
    const header = await page.locator("header").count()
    const footer = await page.locator("footer").count()
    if (!header || !footer) {
      record("high", "CHROME-MISSING", `${route} missing header/footer`, `h=${header} f=${footer}`)
      journey.ok = false
    }
  }
  journey.steps.push({ step: "rapid-nav", routes: JOURNEY_ROUTES.length })

  // Viewport resize mutation mid-session (orientation flip)
  await page.goto(`${BASE}/`)
  await page.setViewportSize({ width: 844, height: 390 })
  await page.waitForTimeout(400)
  const land = await pageMetrics(page)
  if (land.h1Clip || land.overflowX > 4) {
    record(
      "high",
      "ORIENTATION",
      "Landscape flip caused clip/overflow",
      JSON.stringify({ overflowX: land.overflowX, h1Clip: land.h1Clip }),
    )
    journey.ok = false
  }
  await page.screenshot({ path: `${OUT_DIR}/orientation-land.png` })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(300)

  // Keyboard: Tab through header CTAs without trap
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  const active = await page.evaluate(() => document.activeElement?.tagName)
  journey.steps.push({ step: "keyboard-tab", active })

  matrix.push({ viewport: "journey-mobile", route: "journey", pass: journey.ok, issues: journey.ok ? [] : ["journey"], journey })
  await context.close()
}

// ─── 3. Font zoom adversarial (CDP) ───
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  const client = await context.newCDPSession(page)
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
  await client.send("Page.setFontSizes", {
    fontSizes: { standard: 20, fixed: 16 },
  }).catch(() => null)
  // Fallback mutation: zoom via css
  await page.addStyleTag({ content: "html { font-size: 22px !important; }" })
  await page.waitForTimeout(300)
  const zoomed = await pageMetrics(page)
  if (zoomed.overflowX > 8 || zoomed.h1Clip) {
    record(
      "medium",
      "FONT-ZOOM",
      "Large font-size caused overflow/clip",
      JSON.stringify({ overflowX: zoomed.overflowX, h1Clip: zoomed.h1Clip }),
    )
    await page.screenshot({ path: `${OUT_DIR}/font-zoom.png` })
  }
  await context.close()
}

await browser.close()

const passCells = matrix.filter((c) => c.pass).length
const failCells = matrix.filter((c) => !c.pass).length
const bySev = { critical: 0, high: 0, medium: 0, low: 0 }
for (const f of findings) bySev[f.severity] = (bySev[f.severity] || 0) + 1

const report = {
  base: BASE,
  auditedAt: new Date().toISOString(),
  summary: {
    passCells,
    failCells,
    passRate: `${((passCells / Math.max(1, passCells + failCells)) * 100).toFixed(1)}%`,
    findings: findings.length,
    ...bySev,
  },
  findings,
  matrix,
}

fs.writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(
  JSON.stringify(
    {
      base: BASE,
      summary: report.summary,
      topFindings: findings.slice(0, 30).map((f) => ({
        severity: f.severity,
        id: f.id,
        title: f.title,
        detail: String(f.detail).slice(0, 140),
        viewport: f.viewport,
        route: f.route,
      })),
    },
    null,
    2,
  ),
)

if (bySev.critical > 0 || bySev.high > 0) process.exit(1)
console.log("ADVERSARIAL_OK")
