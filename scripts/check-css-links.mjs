import { chromium } from "@playwright/test"

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto("http://127.0.0.1:3010/", { waitUntil: "domcontentloaded" })
const links = await page.evaluate(() =>
  [...document.querySelectorAll("link[rel=stylesheet], style")].map((el) => ({
    tag: el.tagName,
    href: el.getAttribute("href"),
    len: (el.textContent || "").length,
  })),
)
const html = await page.content()
const cssRefs = html.match(/_next\/static\/css\/[^"']+/g)
console.log(JSON.stringify({ links, cssRefs }, null, 2))
await browser.close()
