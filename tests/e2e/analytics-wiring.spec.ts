import { test, expect } from "@playwright/test"

type Dl = Record<string, unknown>

function dataLayerEvents(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const dl = (window as unknown as { dataLayer?: Dl[] }).dataLayer || []
    return dl.filter((e) => typeof e.event === "string") as Dl[]
  })
}

test.describe("analytics wiring (dataLayer)", () => {
  test("one navigation produces exactly one dataLayer page_view", async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as { dataLayer: unknown[] }).dataLayer = []
    })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: Dl[] }).dataLayer || []
      return dl.some((e) => e.event === "page_view")
    })
    await page.waitForTimeout(400)
    const events = await dataLayerEvents(page)
    const pageViews = events.filter((e) => e.event === "page_view")
    expect(pageViews.length, JSON.stringify(pageViews)).toBe(1)
  })

  test("thank-you conversion_lead includes lead_source=quote", async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as { dataLayer: unknown[] }).dataLayer = []
    })
    await page.goto("/thank-you/mowing?rid=wiring-quote-1&amt=45")
    await page.waitForFunction(() => {
      const dl = (window as unknown as { dataLayer?: Dl[] }).dataLayer || []
      return dl.some((e) => e.event === "conversion_lead")
    })
    const lead = (await dataLayerEvents(page)).find((e) => e.event === "conversion_lead")
    expect(lead?.lead_source).toBe("quote")
  })
})
