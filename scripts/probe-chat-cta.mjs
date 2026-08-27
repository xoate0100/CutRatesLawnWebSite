import { chromium } from "@playwright/test"

const browser = await chromium.launch({ headless: true })
let failed = false

for (const vp of [
  { w: 280, h: 653 },
  { w: 390, h: 844 },
  { w: 375, h: 667 },
]) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: 2,
  })
  await page.goto("http://127.0.0.1:3010/", { waitUntil: "networkidle" })

  const top = await page.evaluate(() => {
    const cta = [...document.querySelectorAll("a")].find((a) =>
      /get my free quote/i.test(a.textContent || ""),
    )
    const work = [...document.querySelectorAll("a")].find((a) =>
      /see our work/i.test(a.textContent || ""),
    )
    const chat = document.querySelector('button[aria-label="Open contact help"]')
    const hit = (a, b) => {
      if (!a || !b) return { overlap: false }
      const A = a.getBoundingClientRect()
      const B = b.getBoundingClientRect()
      return {
        overlap: !(A.right < B.left || A.left > B.right || A.bottom < B.top || A.top > B.bottom),
      }
    }
    return {
      chatPresent: !!chat,
      ctaChat: hit(cta, chat),
      workChat: hit(work, chat),
    }
  })

  console.log(`TOP ${vp.w}x${vp.h}`, JSON.stringify(top))
  if (top.chatPresent) {
    console.error("CHAT_ON_FIRST_PAINT", vp)
    failed = true
  }
  if (top.ctaChat.overlap || top.workChat.overlap) {
    console.error("OVERLAP_TOP", vp)
    failed = true
  }

  await page.evaluate(() => window.scrollTo(0, 500))
  await page.waitForTimeout(300)
  const scrolled = await page.evaluate(() => !!document.querySelector('button[aria-label="Open contact help"]'))
  console.log(`SCROLLED ${vp.w}x${vp.h} chat=${scrolled}`)
  if (!scrolled) {
    console.error("CHAT_MISSING_AFTER_SCROLL", vp)
    failed = true
  }

  await page.close()
}

await browser.close()
if (failed) process.exit(1)
console.log("CHAT_CTA_OK")
