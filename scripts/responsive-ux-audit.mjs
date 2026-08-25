/**
 * Authoritative responsive UI/UX audit for Cut Rates Lawn Care.
 * Detects: document overflow, text clipped by viewport, text covered by
 * fixed/sticky overlays, insufficient touch targets, CSS not loading.
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"

const BASE = process.env.AUDIT_BASE || "http://127.0.0.1:3010"
const OUT = process.env.AUDIT_OUT || "artifacts/audit/responsive-audit.json"

const VIEWPORTS = [
  { name: "iphone-se", width: 375, height: 667, dpr: 2 },
  { name: "iphone-14", width: 390, height: 844, dpr: 3 },
  { name: "pixel-7", width: 412, height: 915, dpr: 2.625 },
  { name: "tablet", width: 768, height: 1024, dpr: 2 },
  { name: "laptop", width: 1280, height: 800, dpr: 1 },
  { name: "desktop", width: 1440, height: 900, dpr: 1 },
]

const ROUTES = [
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

fs.mkdirSync("artifacts/audit", { recursive: true })

const browser = await chromium.launch({ headless: true })
const report = {
  base: BASE,
  auditedAt: new Date().toISOString(),
  summary: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    passCells: 0,
    failCells: 0,
  },
  findings: [],
  matrix: [],
}

function pushFinding(f) {
  report.findings.push(f)
  if (f.severity in report.summary) report.summary[f.severity] += 1
}

function rectsOverlap(a, b, pad = 0) {
  return !(
    a.right - pad <= b.left + pad ||
    a.left + pad >= b.right - pad ||
    a.bottom - pad <= b.top + pad ||
    a.top + pad >= b.bottom - pad
  )
}

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
  })
  const page = await context.newPage()

  for (const route of ROUTES) {
    const cell = {
      viewport: vp.name,
      w: vp.width,
      route,
      overflowX: 0,
      cssOk: false,
      cssCount: 0,
      htmlOx: null,
      clipped: [],
      covered: [],
      tinyTargets: [],
      stickyCover: [],
      severity: "pass",
    }

    try {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 })
      await page.waitForTimeout(500)

      // Scroll a bit so sticky quote bar can appear (except quote)
      if (route !== "/quote") {
        await page.evaluate(() => window.scrollTo(0, 520))
        await page.waitForTimeout(300)
      }

      const data = await page.evaluate(() => {
        const doc = document.documentElement
        const vw = window.innerWidth
        const vh = window.innerHeight

        const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) =>
          (l.getAttribute("href") || "").split("/").pop(),
        )
        const htmlOx = getComputedStyle(doc).overflowX
        const bodyBg = getComputedStyle(document.body).backgroundColor
        const hasForestVar = getComputedStyle(document.documentElement).getPropertyValue("--forest").trim()

        // Fixed/sticky overlays that can cover content
        const overlays = [...document.querySelectorAll("header, [class*='fixed'], [class*='sticky'], button, a")]
          .map((el) => {
            const cs = getComputedStyle(el)
            if (cs.position !== "fixed" && cs.position !== "sticky") return null
            const r = el.getBoundingClientRect()
            if (r.width < 8 || r.height < 8) return null
            const op = Number(cs.opacity)
            if (op < 0.05 || cs.visibility === "hidden" || cs.display === "none") return null
            // Ignore fully off-screen sticky bars translated away
            if (r.bottom < 0 || r.top > vh) return null
            return {
              tag: el.tagName,
              cls: (el.className || "").toString().slice(0, 90),
              z: cs.zIndex,
              pos: cs.position,
              left: r.left,
              right: r.right,
              top: r.top,
              bottom: r.bottom,
              width: r.width,
              height: r.height,
            }
          })
          .filter(Boolean)

        // Dedupe overlays by rough position
        const uniqOverlays = []
        for (const o of overlays) {
          if (
            uniqOverlays.some(
              (u) =>
                Math.abs(u.left - o.left) < 2 &&
                Math.abs(u.top - o.top) < 2 &&
                Math.abs(u.width - o.width) < 2,
            )
          )
            continue
          uniqOverlays.push(o)
        }

        const textEls = [...document.querySelectorAll("h1,h2,h3,p,li,label,button,a,span")]
        const clipped = []
        const covered = []

        for (const el of textEls) {
          if (el.closest(".marquee")) continue
          const r = el.getBoundingClientRect()
          if (r.width < 8 || r.height < 8) continue
          // only consider in/near viewport
          if (r.bottom < 0 || r.top > vh) continue
          const text = (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 70)
          if (!text) continue

          // Horizontal clip vs viewport
          if (r.right > vw + 2 || r.left < -2) {
            clipped.push({
              tag: el.tagName,
              text,
              left: Math.round(r.left),
              right: Math.round(r.right),
              reason: "viewport-edge",
            })
          }

          // Covered by opaque-ish fixed overlays (sample center of text)
          const cx = Math.min(Math.max(r.left + r.width / 2, 1), vw - 1)
          const cy = Math.min(Math.max(r.top + r.height / 2, 1), vh - 1)
          const topEl = document.elementFromPoint(cx, cy)
          if (
            topEl &&
            topEl !== el &&
            !el.contains(topEl) &&
            !topEl.contains(el)
          ) {
            const topFixed = topEl.closest("header, [class*='fixed'], [class*='sticky']")
            // Also: elementFromPoint landed on something that isn't our text lineage
            const isOverlay =
              topFixed ||
              getComputedStyle(topEl).position === "fixed" ||
              getComputedStyle(topEl).position === "sticky"
            if (isOverlay) {
              // Ensure geometric overlap with an overlay rect
              const ov = uniqOverlays.find((o) => {
                return !(
                  r.right <= o.left ||
                  r.left >= o.right ||
                  r.bottom <= o.top ||
                  r.top >= o.bottom
                )
              })
              if (ov) {
                covered.push({
                  tag: el.tagName,
                  text,
                  by: `${ov.tag}.${ov.cls.slice(0, 40)}`,
                  z: ov.z,
                  sample: { x: Math.round(cx), y: Math.round(cy) },
                })
              }
            }
          }
        }

        // Touch targets
        const tinyTargets = []
        for (const el of document.querySelectorAll("a, button, [role='button']")) {
          const r = el.getBoundingClientRect()
          if (r.width < 2 || r.height < 2) continue
          if (r.bottom < 0 || r.top > vh) continue
          if (r.width < 44 || r.height < 44) {
            tinyTargets.push({
              tag: el.tagName,
              text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40),
              w: Math.round(r.width),
              h: Math.round(r.height),
            })
          }
        }

        // Hero/stacking: decorative absolute layers vs text opacity
        const h1 = document.querySelector("h1")
        let h1Stack = null
        if (h1) {
          const r = h1.getBoundingClientRect()
          const cx = r.left + r.width / 2
          const cy = r.top + Math.min(r.height / 2, 40)
          const top = document.elementFromPoint(cx, cy)
          h1Stack = {
            text: (h1.innerText || "").slice(0, 60),
            topTag: top?.tagName || null,
            topCls: (top?.className || "").toString().slice(0, 60),
            isSelf: !!(top && (top === h1 || h1.contains(top) || top.contains(h1))),
            color: getComputedStyle(h1).color,
            z: getComputedStyle(h1).zIndex,
          }
        }

        return {
          overflowX: doc.scrollWidth - doc.clientWidth,
          cssLinks,
          htmlOx,
          bodyBg,
          hasForestVar,
          clipped: clipped.slice(0, 10),
          covered: covered.slice(0, 12),
          tinyTargets: tinyTargets.slice(0, 8),
          overlays: uniqOverlays.slice(0, 8),
          h1Stack,
          stickyBottomPad: getComputedStyle(document.querySelector("main") || document.body).paddingBottom,
        }
      })

      cell.overflowX = data.overflowX
      cell.cssCount = data.cssLinks.length
      cell.htmlOx = data.htmlOx
      cell.cssOk = data.cssLinks.length >= 1 && !!data.hasForestVar && data.htmlOx === "clip"
      cell.clipped = data.clipped
      cell.covered = data.covered
      cell.tinyTargets = data.tinyTargets
      cell.h1Stack = data.h1Stack
      cell.overlays = data.overlays
      cell.stickyBottomPad = data.stickyBottomPad
      cell.bodyBg = data.bodyBg

      const issues = []
      if (!cell.cssOk) {
        issues.push("css-not-applied")
        cell.severity = "critical"
        pushFinding({
          severity: "critical",
          viewport: vp.name,
          route,
          id: "CSS-MISSING",
          title: "Brand/Tailwind CSS not applied on document",
          detail: `cssLinks=${cell.cssCount}, --forest=${!!data.hasForestVar}, overflowX(html)=${data.htmlOx}`,
        })
      }
      if (cell.overflowX > 1) {
        issues.push("doc-overflow")
        if (cell.severity === "pass") cell.severity = "high"
        pushFinding({
          severity: "high",
          viewport: vp.name,
          route,
          id: "OVERFLOW-X",
          title: `Document horizontal overflow ${cell.overflowX}px`,
          detail: "Page scrollWidth exceeds viewport — classic mobile edge cutoff.",
        })
      }
      if (cell.covered.length) {
        issues.push("text-under-overlay")
        if (cell.severity === "pass" || cell.severity === "low") cell.severity = "critical"
        pushFinding({
          severity: "critical",
          viewport: vp.name,
          route,
          id: "TEXT-UNDER",
          title: `${cell.covered.length} text node(s) sampled under fixed/sticky overlays`,
          detail: cell.covered
            .slice(0, 4)
            .map((c) => `"${c.text}" ← ${c.by}`)
            .join(" | "),
        })
      }
      if (cell.clipped.length) {
        issues.push("text-clipped")
        if (cell.severity === "pass") cell.severity = "high"
        pushFinding({
          severity: "high",
          viewport: vp.name,
          route,
          id: "TEXT-CLIP",
          title: `${cell.clipped.length} non-marquee text node(s) extend past viewport`,
          detail: cell.clipped
            .slice(0, 3)
            .map((c) => `"${c.text}" [${c.left}→${c.right}]`)
            .join(" | "),
        })
      }
      if (data.h1Stack && !data.h1Stack.isSelf && vp.width < 768) {
        issues.push("h1-obscured")
        if (cell.severity === "pass") cell.severity = "high"
        pushFinding({
          severity: "high",
          viewport: vp.name,
          route,
          id: "H1-STACK",
          title: "H1 sample point not hit-testing to itself (layer under another element)",
          detail: `top=${data.h1Stack.topTag}.${data.h1Stack.topCls}`,
        })
      }
      // Main padding for sticky bar
      const pad = parseFloat(data.stickyBottomPad || "0")
      if (vp.width < 768 && route !== "/quote" && pad < 48) {
        issues.push("sticky-collision-risk")
        if (cell.severity === "pass") cell.severity = "medium"
        pushFinding({
          severity: "medium",
          viewport: vp.name,
          route,
          id: "STICKY-PAD",
          title: "main bottom padding may be insufficient vs sticky quote bar",
          detail: `padding-bottom=${data.stickyBottomPad}`,
        })
      }
      // Tiny targets only on mobile, exclude decorative
      const realTiny = cell.tinyTargets.filter((t) => t.w > 0 && t.h > 0 && t.w < 40 && t.h < 40)
      if (vp.width < 768 && realTiny.length >= 4) {
        issues.push("touch-targets")
        if (cell.severity === "pass") cell.severity = "medium"
        pushFinding({
          severity: "medium",
          viewport: vp.name,
          route,
          id: "TOUCH",
          title: `${realTiny.length}+ interactive controls under 40×40px`,
          detail: realTiny
            .slice(0, 3)
            .map((t) => `${t.tag} ${t.w}×${t.h} "${t.text}"`)
            .join(" | "),
        })
      }

      cell.issues = issues
      if (cell.severity === "pass") report.summary.passCells++
      else report.summary.failCells++

      // Screenshots for worst mobile home
      if (vp.name === "iphone-14" && (route === "/" || route === "/quote" || route === "/services/landscaping")) {
        const slug = route === "/" ? "home" : route.replace(/\//g, "_")
        await page.screenshot({
          path: `artifacts/audit/${vp.name}${slug}.png`,
          fullPage: false,
        })
      }
    } catch (err) {
      cell.severity = "critical"
      cell.error = String(err)
      report.summary.failCells++
      pushFinding({
        severity: "critical",
        viewport: vp.name,
        route,
        id: "NAV-FAIL",
        title: "Route failed to load during audit",
        detail: String(err).slice(0, 200),
      })
    }

    report.matrix.push(cell)
  }

  await context.close()
}

await browser.close()

// Deduplicate findings by id+route+severity (collapse viewports)
const byKey = new Map()
for (const f of report.findings) {
  const key = `${f.id}|${f.route}|${f.title}`
  if (!byKey.has(key)) byKey.set(key, { ...f, viewports: [f.viewport] })
  else byKey.get(key).viewports.push(f.viewport)
}
report.findingsDeduped = [...byKey.values()].sort((a, b) => {
  const order = { critical: 0, high: 1, medium: 2, low: 3 }
  return (order[a.severity] ?? 9) - (order[b.severity] ?? 9)
})

fs.writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(
  JSON.stringify(
    {
      base: BASE,
      out: OUT,
      summary: report.summary,
      top: report.findingsDeduped.slice(0, 25).map((f) => ({
        severity: f.severity,
        id: f.id,
        route: f.route,
        title: f.title,
        viewports: f.viewports,
        detail: f.detail?.slice(0, 160),
      })),
    },
    null,
    2,
  ),
)
