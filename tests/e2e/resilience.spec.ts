import { test, expect } from "@playwright/test"

test.describe("Resilience — try to break the site", () => {
  test("rejects empty contact form submission", async ({ page }) => {
    await page.goto("/contact")
    await page.getByRole("button", { name: "Send Message" }).click()

    await expect(page.locator("form .text-red-500")).toHaveCount(4)
  })

  test("rejects invalid email on contact form", async ({ page }) => {
    await page.goto("/contact")
    await page.getByLabel("First Name").fill("Bad")
    await page.getByLabel("Last Name").fill("Email")
    await page.getByLabel("Email").fill("not-an-email")
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Other" }).click()
    await page.getByRole("button", { name: "Send Message" }).click()
    await expect(page.getByText("Invalid email format")).toBeVisible()
  })

  test("handles XSS-like input without rendering scripts", async ({ page }) => {
    await page.goto("/contact")
    const payload = '<script>alert("xss")</script>'
    await page.getByLabel("First Name").fill(payload)
    await page.getByLabel("Message").fill(payload)
    await expect(page.locator("script", { hasText: "xss" })).toHaveCount(0)
    await expect(page.getByLabel("First Name")).toHaveValue(payload)
  })

  test("quote calculator with zero lawn size shows zero-dollar estimate", async ({ page }) => {
    await page.goto("/quote")
    await page.getByRole("button", { name: "Calculate Quote" }).click()
    await expect(page.getByText("$0 per service")).toBeVisible()
  })

  test("returns friendly 404 for unknown routes", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-xyz")
    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { name: "404", level: 1 })).toBeVisible()
  })

  test("homepage hero CTA buttons navigate to schedule and quote", async ({ page }) => {
    await page.goto("/")
    const scheduleCta = page.getByRole("link", { name: /Schedule Service/i }).first()
    const quoteCta = page.getByRole("link", { name: /Request Quote/i }).first()
    await expect(scheduleCta).toBeVisible()
    await expect(quoteCta).toBeVisible()

    await scheduleCta.click()
    await expect(page).toHaveURL(/\/schedule/)

    await page.goto("/")
    await quoteCta.click()
    await expect(page).toHaveURL(/\/quote/)
  })

  test("survives rapid navigation across many routes", async ({ page }) => {
    const routes = [
      "/",
      "/services",
      "/services/lawn-care",
      "/bundles",
      "/pricing",
      "/quote",
      "/contact",
      "/faq",
      "/about",
      "/blog",
    ]

    for (const route of routes) {
      const response = await page.goto(route)
      expect(response?.status()).toBeLessThan(400)
      await expect(page.locator("header")).toBeVisible()
      await expect(page.locator("footer")).toBeVisible()
    }
  })

  test("mobile menu opens and navigates", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")

    await page.getByRole("button", { name: /Open main menu/i }).click()
    await page.getByRole("link", { name: "Contact Us", exact: true }).click()
    await expect(page).toHaveURL(/\/contact/)
  })

  test("portal route redirects to external customer portal", async ({ page }) => {
    await page.goto("/portal")
    await page.waitForURL(/fieldportals\.com|cutrateslawn/, { timeout: 15_000 })
    expect(page.url()).toMatch(/fieldportals|portal/)
  })

  test("footer dead links: privacy, terms, sitemap return 404", async ({ page }) => {
    await page.goto("/")
    for (const path of ["/privacy", "/terms", "/sitemap"]) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(404)
    }
  })

  test("live chat survives rapid open/close", async ({ page }) => {
    await page.goto("/")
    for (let i = 0; i < 5; i++) {
      const openChat = page.getByRole("button", { name: "Open live chat" })
      const closeChat = page.getByRole("button", { name: "Close chat" })
      if (await closeChat.isVisible()) {
        await closeChat.click()
      } else {
        await page.locator("button.fixed.bottom-4.right-4").click()
      }
      await page.waitForTimeout(100)
    }
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()
  })
})
