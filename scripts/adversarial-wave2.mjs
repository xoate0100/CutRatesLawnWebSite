/**
 * Deep adversarial wave 2 — menu overlays, chat panel, funnel path, collisions.
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"

const BASE = process.env.AUDIT_BASE || "https://v0-cut-rates-lawn-main-page.vercel.app"
const OUT = "artifacts/audit/adversarial/wave2.json"
fs.mkdirSync("artifacts/audit/adversarial", { recursive: true })

const findings = []
const fail = (sev, id, title, detail) => findings.push({ severity: sev, id, title, detail })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
})
const page = await context.newPage()

// 1. Mobile menu: open, check overlay covers content intentionally, close, restore scroll
await page.goto(`${BASE}/`, { waitUntil: "networkidle" })
const menu = page.getByRole("button", { name: /open menu/i })
await menu.click()
await page.waitForTimeout(300)
const menuOpen = await page.evaluate(() => {
  const nav = document.getElementById("mobile-nav")
  const r = nav?.getBoundingClientRect()
  return {
    visible: !!nav && getComputedStyle(nav).display !== "none",
    height: r ? Math.round(r.height) : 0,
    links: nav ? nav.querySelectorAll("a").length : 0,
  }
})
if (!menuOpen.visible || menuOpen.links < 4) {
  fail("critical", "MENU-OPEN", "Mobile nav failed to open with links", JSON.stringify(menuOpen))
}
await page.screenshot({ path: "artifacts/audit/adversarial/w2-menu-open.png" })

// Escape / toggle close
await page.getByRole("button", { name: /close menu/i }).click()
await page.waitForTimeout(250)
const menuClosed = await page.locator("#mobile-nav").isVisible().catch(() => false)
if (menuClosed) fail("high", "MENU-CLOSE", "Mobile nav still visible after close", "")

// 2. Chat panel — only after scroll (must not cover hero CTAs on first paint)
await page.evaluate(() => window.scrollTo(0, 500))
await page.waitForTimeout(300)
const chatBtn = page.getByRole("button", { name: /open contact help/i })
if (!(await chatBtn.count())) {
  fail("high", "CHAT-REVEAL", "Chat FAB did not appear after scroll past hero", "")
} else {
  await chatBtn.click()
  await page.waitForTimeout(300)
  const chat = await page.evaluate(() => {
    const card = [...document.querySelectorAll("*")].find((el) =>
      /talk with us/i.test(el.textContent || "") && el.querySelector("a"),
    )
    // Prefer the fixed card
    const fixed = [...document.querySelectorAll("div")].find((el) => {
      const cs = getComputedStyle(el)
      return cs.position === "fixed" && /talk with us/i.test(el.textContent || "")
    })
    const el = fixed || card
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      vw: window.innerWidth,
      vh: window.innerHeight,
    }
  })
  if (!chat) fail("high", "CHAT-OPEN", "Chat panel did not open", "")
  else {
    if (chat.left < -2 || chat.right > chat.vw + 2)
      fail("critical", "CHAT-OVERFLOW", "Chat panel overflows viewport", JSON.stringify(chat))
    if (chat.width > chat.vw - 8)
      fail("high", "CHAT-WIDTH", "Chat panel too wide for mobile", JSON.stringify(chat))
  }
  await page.screenshot({ path: "artifacts/audit/adversarial/w2-chat-open.png" })
  await page.getByRole("button", { name: /^close$/i }).click().catch(() => {})
}

// 3. Sticky chip vs chat — must not overlap each other when both visible
await page.goto(`${BASE}/`)
await page.evaluate(() => window.scrollTo(0, 800))
await page.waitForTimeout(400)
const collision = await page.evaluate(() => {
  const sticky = document.querySelector("[data-sticky-quote]")
  const chat = document.querySelector('button[aria-label="Open contact help"]')
  if (!sticky || !chat) return { ok: true, reason: "missing" }
  const a = sticky.getBoundingClientRect()
  const b = chat.getBoundingClientRect()
  const overlap = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
  return {
    ok: !overlap,
    sticky: { l: a.left, r: a.right, t: a.top, op: getComputedStyle(sticky).opacity },
    chat: { l: b.left, r: b.right, t: b.top },
  }
})
if (!collision.ok) fail("critical", "CHIP-CHAT-HIT", "Sticky quote chip overlaps chat FAB", JSON.stringify(collision))
await page.screenshot({ path: "artifacts/audit/adversarial/w2-chip-chat.png" })

// 4. Full quote journey — engage to estimate
await page.goto(`${BASE}/quote`, { waitUntil: "networkidle" })
await page.locator("#quote-funnel").scrollIntoViewIfNeeded()

// Prefer residential / fill size
const radios = page.locator('[role="radio"]')
if (await radios.count()) await radios.first().click().catch(() => {})

const numberInputs = page.locator('#quote-funnel input[type="number"]')
if (await numberInputs.count()) {
  await numberInputs.first().fill("7200")
}

// Select services if checkboxes
const checks = page.locator('#quote-funnel input[type="checkbox"]')
const n = await checks.count()
for (let i = 0; i < Math.min(n, 2); i++) {
  await checks.nth(i).check().catch(() => {})
}

await page.getByRole("button", { name: /calculate estimate/i }).click()
await page.waitForTimeout(600)
const afterCalc = await page.locator("#quote-funnel").innerText()
if (!/\$|estimate|error|enter|size|property/i.test(afterCalc)) {
  fail("high", "QUOTE-CALC", "Calculate produced no recognizable estimate/error UI", afterCalc.slice(0, 200))
}

// Try advance
const next = page.getByRole("button", { name: /continue|next|contact|request/i })
if (await next.count()) {
  await next.first().click()
  await page.waitForTimeout(500)
}

// Progress nav must remain fully in viewport
const stepper = await page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Quote progress"]')
  if (!nav) return null
  const r = nav.getBoundingClientRect()
  const spans = [...nav.querySelectorAll("span")].map((s) => {
    const b = s.getBoundingClientRect()
    return { t: s.textContent, right: Math.round(b.right) }
  })
  return {
    left: Math.round(r.left),
    right: Math.round(r.right),
    vw: window.innerWidth,
    spans,
  }
})
if (stepper && stepper.right > stepper.vw + 2) {
  fail("high", "STEPPER", "Quote progress overflows", JSON.stringify(stepper))
}
await page.screenshot({ path: "artifacts/audit/adversarial/w2-quote-funnel.png" })

// 5. Fold width 280 — hero + header survive
await page.setViewportSize({ width: 280, height: 653 })
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
await page.waitForTimeout(400)
const fold = await page.evaluate(() => {
  const h1 = document.querySelector("h1")
  const r = h1.getBoundingClientRect()
  return {
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    h1Right: Math.round(r.right),
    h1Left: Math.round(r.left),
    text: h1.innerText.replace(/\s+/g, " ").slice(0, 80),
  }
})
if (fold.overflowX > 4 || fold.h1Right > 282) {
  fail("critical", "FOLD-280", "280px fold clips/overflows hero", JSON.stringify(fold))
}
await page.screenshot({ path: "artifacts/audit/adversarial/w2-fold-280.png" })

// 6. Double-submit / rapid CTA spam should not break DOM
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${BASE}/`)
const cta = page.getByRole("link", { name: /get my free quote/i }).first()
await Promise.all([cta.click(), cta.click().catch(() => {})]).catch(() => {})
await page.waitForTimeout(800)
if (!page.url().includes("/quote")) {
  // single navigation is fine; ensure we didn't hard-crash
  const body = await page.locator("body").count()
  if (!body) fail("critical", "CTA-SPAM", "DOM lost after rapid CTA clicks", page.url())
}

// 7. Broken image / media slots — no layout blowout
await page.goto(`${BASE}/services/landscaping`)
const mediaBlow = await page.evaluate(() => {
  const imgs = [...document.images]
  return imgs
    .filter((img) => img.naturalWidth === 0 && img.complete)
    .slice(0, 5)
    .map((img) => ({ src: img.src.slice(-40), w: img.width, h: img.height }))
})
// Broken images alone aren't critical if alt/placeholder holds layout; flag huge empty boxes
for (const img of mediaBlow) {
  if (img.h > 400) fail("medium", "BROKEN-IMG", "Broken image reserves tall empty space", JSON.stringify(img))
}

// 8. Focus order: first tabs should hit skip-able interactive chrome
await page.goto(`${BASE}/`)
const focusPath = []
for (let i = 0; i < 8; i++) {
  await page.keyboard.press("Tab")
  focusPath.push(
    await page.evaluate(() => {
      const el = document.activeElement
      return {
        tag: el?.tagName,
        name: (el?.getAttribute("aria-label") || el?.innerText || "").trim().slice(0, 40),
      }
    }),
  )
}
if (!focusPath.some((f) => f.tag === "A" || f.tag === "BUTTON")) {
  fail("high", "FOCUS", "Tab focus never reached a link/button in 8 tabs", JSON.stringify(focusPath))
}

await browser.close()

const bySev = { critical: 0, high: 0, medium: 0, low: 0 }
for (const f of findings) bySev[f.severity]++

const report = {
  base: BASE,
  auditedAt: new Date().toISOString(),
  summary: { findings: findings.length, ...bySev, ok: findings.filter((f) => f.severity === "critical" || f.severity === "high").length === 0 },
  findings,
  focusPath,
  collision,
  fold,
  stepper,
  menuOpen,
}
fs.writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
if (!report.summary.ok) process.exit(1)
console.log("WAVE2_OK")
