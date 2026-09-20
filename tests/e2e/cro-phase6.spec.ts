import { test, expect } from "@playwright/test"

const PHASE6_ROUTES = [
  "/",
  "/quote",
  "/quote/mowing",
  "/lp/snow-removal",
  "/service-areas/derby/pest-control",
  "/pricing",
  "/contact",
] as const

function collectPageErrors(page: import("@playwright/test").Page) {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text())
  })
  page.on("pageerror", (err) => errors.push(err.message))
  return errors
}

function materialErrors(errors: string[]) {
  return errors.filter((text) => {
    const t = text.toLowerCase()
    return (
      !t.includes("favicon") &&
      !t.includes("failed to load resource") &&
      !t.includes("net::err") &&
      !t.includes("hydration") &&
      !t.includes("download the react devtools")
    )
  })
}

test.describe("Phase 6 viewport routes", () => {
  for (const route of PHASE6_ROUTES) {
    test(`renders ${route} without material console.error`, async ({ page }) => {
      const errors = collectPageErrors(page)
      const res = await page.goto(route, { waitUntil: "domcontentloaded" })
      expect(res, `GET ${route}`).toBeTruthy()
      expect(res!.ok() || res!.status() === 304).toBeTruthy()
      await expect(page.locator("body")).toBeVisible()
      expect(materialErrors(errors), errors.join("\n")).toEqual([])
    })
  }

  test("landing page uses stripped chrome (no full nav)", async ({ page }) => {
    await page.goto("/lp/mowing")
    await expect(page.locator('[data-lp-layout="true"]')).toBeVisible()
    await expect(page.getByText("Cut Rates").first()).toBeVisible()
    await expect(page.getByRole("link", { name: /^services$/i })).toHaveCount(0)
    await expect(page.getByRole("link", { name: /^bundles$/i })).toHaveCount(0)
  })

  test("conversion_lead dataLayer contract fields on thank-you", async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as { dataLayer: unknown[] }).dataLayer = []
    })
    await page.goto("/thank-you/mowing?rid=p6-organic&amt=45")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await page.waitForFunction(
      () => {
        const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer || []
        return dl.some((e) => e.event === "conversion_lead")
      },
      { timeout: 8000 },
    )
    const payload = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer || []
      return dl.find((e) => e.event === "conversion_lead") || null
    })
    expect(payload).toBeTruthy()
    for (const field of ["event", "page_path", "timestamp", "traffic_type", "session_id"] as const) {
      expect(payload![field], field).toBeTruthy()
    }
    expect(payload!.conversion_gated_on_attribution).toBe(false)
  })

  test("quote deep link still hydrates at this viewport", async ({ page }) => {
    await page.goto("/quote?service=mowing&size=7500&property=residential&frequency=biweekly")
    await expect(page.getByText("3. Estimate")).toBeVisible()
    await expect(page.getByText(/\$\d+/).first()).toBeVisible()
  })
})
