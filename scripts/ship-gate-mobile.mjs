/**
 * Ship gate: remaining responsive defects must be clear before deploy.
 * Focuses on user-visible failures (not expected sticky-header scroll-under).
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"

const BASE = process.env.AUDIT_BASE || "http://127.0.0.1:3010"
const OUT = "artifacts/audit/ship-gate.json"

fs.mkdirSync("artifacts/audit", { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})

const failures = []

function fail(id, detail) {
  failures.push({ id, detail })
}

// —— Home first paint ——
await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 })
await page.waitForTimeout(400)

const homeTop = await page.evaluate(() => {
  const h1 = document.querySelector("h1")
  const r = h1?.getBoundingClientRect()
  const htmlOx = getComputedStyle(document.documentElement).overflowX
  const forest = getComputedStyle(document.documentElement).getPropertyValue("--forest").trim()
  const nowrap = h1
    ? [...h1.querySelectorAll("*")].some((el) => getComputedStyle(el).whiteSpace === "nowrap")
    : false
  return {
    h1Text: (h1?.innerText || "").replace(/\s+/g, " ").trim(),
    h1Right: r ? Math.round(r.right) : null,
    h1Left: r ? Math.round(r.left) : null,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    htmlOx,
    forest,
    nowrapOnMobile: nowrap,
    cssLinks: document.querySelectorAll('link[rel="stylesheet"]').length,
  }
})

if (!homeTop.forest) fail("CSS", "Brand --forest token missing")
if (homeTop.htmlOx !== "clip") fail("OVERFLOW-CLIP", `html overflow-x=${homeTop.htmlOx}`)
if (homeTop.overflowX > 1) fail("DOC-OVERFLOW", `overflowX=${homeTop.overflowX}`)
if (homeTop.h1Right != null && homeTop.h1Right > 390 + 2)
  fail("H1-CLIP", `h1 right=${homeTop.h1Right}`)
if (homeTop.nowrapOnMobile) fail("H1-NOWRAP", "Hero still has whitespace-nowrap on mobile")
if (!/lawn/i.test(homeTop.h1Text) || !/runaround/i.test(homeTop.h1Text))
  fail("H1-TEXT", `Unexpected h1: ${homeTop.h1Text}`)

await page.screenshot({ path: "artifacts/audit/ship-home.png" })

// —— Scrolled: sticky chip must not cover center reading column ——
await page.evaluate(() => window.scrollTo(0, 700))
await page.waitForTimeout(400)

const scrolled = await page.evaluate(() => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Sample center column points
  const samples = [
    [vw * 0.5, vh * 0.55],
    [vw * 0.5, vh * 0.7],
    [vw * 0.5, vh * 0.85],
  ].map(([x, y]) => {
    const el = document.elementFromPoint(x, y)
    const bar = el?.closest?.("[data-sticky-quote]")
    const fullBleed =
      el &&
      getComputedStyle(el).position === "fixed" &&
      el.getBoundingClientRect().width > vw * 0.85
    return {
      x: Math.round(x),
      y: Math.round(y),
      tag: el?.tagName,
      cls: (el?.className || "").toString().slice(0, 60),
      underStickyQuote: !!bar,
      underFullBleedFixed: !!fullBleed,
    }
  })

  const sticky = document.querySelector("[data-sticky-quote]")
  const sr = sticky?.getBoundingClientRect()
  const chat = document.querySelector('button[aria-label="Open contact help"]')
  const cr = chat?.getBoundingClientRect()

  return {
    samples,
    sticky: sticky
      ? {
          left: Math.round(sr.left),
          right: Math.round(sr.right),
          width: Math.round(sr.width),
          top: Math.round(sr.top),
        }
      : null,
    chat: chat
      ? { left: Math.round(cr.left), right: Math.round(cr.right), top: Math.round(cr.top) }
      : null,
  }
})

if (scrolled.samples.some((s) => s.underStickyQuote || s.underFullBleedFixed)) {
  fail(
    "STICKY-COVER",
    `Center column covered: ${JSON.stringify(scrolled.samples.filter((s) => s.underStickyQuote || s.underFullBleedFixed))}`,
  )
}
if (scrolled.sticky && scrolled.sticky.width > 320) {
  fail("STICKY-WIDTH", `Sticky chrome too wide (${scrolled.sticky.width}px) — must be compact chip`)
}
if (scrolled.sticky && (scrolled.sticky.top < 0 || scrolled.sticky.top > 844)) {
  fail(
    "STICKY-OFFSCREEN",
    `Sticky chip not pinned to viewport (top=${scrolled.sticky.top}) — fixed positioning broken`,
  )
}
if (scrolled.chat && (scrolled.chat.top < 0 || scrolled.chat.top > 844)) {
  fail("CHAT-OFFSCREEN", `Chat FAB not pinned to viewport (top=${scrolled.chat.top})`)
}

await page.screenshot({ path: "artifacts/audit/ship-home-scrolled.png" })

// —— Quote: no chat FAB, stepper fully visible ——
await page.goto(`${BASE}/quote`, { waitUntil: "networkidle", timeout: 60000 })
await page.waitForTimeout(400)
await page.evaluate(() => {
  document.getElementById("quote-funnel")?.scrollIntoView({ block: "start" })
})
await page.waitForTimeout(300)

const quote = await page.evaluate(() => {
  const chat = document.querySelector('button[aria-label="Open contact help"]')
  const sticky = document.querySelector("[data-sticky-quote]")
  const nav = document.querySelector('nav[aria-label="Quote progress"]')
  const spans = nav
    ? [...nav.querySelectorAll("span")].map((s) => {
        const r = s.getBoundingClientRect()
        return { text: s.textContent, right: Math.round(r.right), left: Math.round(r.left) }
      })
    : []
  const done = spans.find((s) => /Done/i.test(s.text || ""))
  return {
    chatPresent: !!chat,
    stickyPresent: !!sticky,
    doneRight: done?.right ?? null,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }
})

if (quote.chatPresent) fail("QUOTE-CHAT", "Live chat must be hidden on /quote")
if (quote.stickyPresent) fail("QUOTE-STICKY", "Sticky quote chip must be hidden on /quote")
if (quote.doneRight != null && quote.doneRight > 390 + 2)
  fail("QUOTE-STEPPER", `Done step clipped at ${quote.doneRight}`)
if (quote.overflowX > 1) fail("QUOTE-OVERFLOW", `overflowX=${quote.overflowX}`)

await page.screenshot({ path: "artifacts/audit/ship-quote.png" })

// —— Hero CTA spacing: secondary not intersecting primary ——
await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" })
const ctaGap = await page.evaluate(() => {
  const links = [...document.querySelectorAll("a")].filter((a) =>
    /free quote|see our work/i.test(a.textContent || ""),
  )
  if (links.length < 2) return { ok: false, reason: "ctas-missing" }
  const a = links[0].getBoundingClientRect()
  const b = links[1].getBoundingClientRect()
  const gap = b.top - a.bottom
  return { ok: gap >= 12, gap: Math.round(gap), aBottom: Math.round(a.bottom), bTop: Math.round(b.top) }
})
if (!ctaGap.ok) fail("CTA-GAP", `Hero CTA vertical gap ${ctaGap.gap}px (need ≥12)`)

await browser.close()

const report = { base: BASE, ok: failures.length === 0, failures, homeTop, scrolled, quote, ctaGap }
fs.writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
if (failures.length) {
  console.error("SHIP_GATE_FAIL", failures.length)
  process.exit(1)
}
console.log("SHIP_GATE_OK")
