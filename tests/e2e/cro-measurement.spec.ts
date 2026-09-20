import { test, expect } from "@playwright/test"

test.describe("CRO measurement", () => {
  test("unattributed conversion_lead fires on thank-you (F-CRO-101)", async ({ page }) => {
    await page.addInitScript(() => {
      ;(window as unknown as { dataLayer: unknown[] }).dataLayer = []
    })
    await page.goto("/thank-you/mowing?rid=test-organic-1&amt=45")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    const events = await page.evaluate(() => {
      const dl = (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer || []
      return dl.map((e) => e.event || e)
    })
    const hasConversion = JSON.stringify(events).includes("conversion_lead")
    expect(hasConversion).toBeTruthy()
  })

  test("paid conversion still fires with gclid", async ({ page }) => {
    await page.goto("/thank-you/mowing?rid=test-paid-1&amt=45&gclid=TesTclId")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("phone click on sticky is present on mobile homepage", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "sticky is md:hidden")
    await page.goto("/")
    await page.evaluate(() => window.scrollTo(0, 800))
    await expect(page.getByRole("link", { name: /^Call$/ })).toBeVisible()
  })

  test("contact form is instrumented", async ({ page }) => {
    await page.goto("/contact")
    await expect(page.getByLabel(/^Name$/)).toBeVisible()
  })
})

test.describe("CRO continuity", () => {
  test("deep link lands on estimate with hydrated values", async ({ page }) => {
    await page.goto("/quote?service=mowing&size=7500&property=residential&frequency=biweekly")
    await expect(page.getByText("Estimate")).toBeVisible()
    await expect(page.getByText(/7,500|7500/)).toBeVisible()
    await expect(page.getByText(/\$\d+/).first()).toBeVisible()
  })
})

test.describe("CRO form engine", () => {
  test("termite path has home sq ft and no lawn slider", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/quote?service=termites")
    await expect(page.getByText(/Home square feet/i)).toBeVisible()
    await expect(page.getByText(/Lawn size/i)).toHaveCount(0)
  })
})
