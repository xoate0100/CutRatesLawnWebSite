import { test, expect } from "@playwright/test"

test.describe("Get a Quote funnel", () => {
  test("hero and nav quote CTAs land on /quote", async ({ page }) => {
    await page.goto("/")

    const heroQuote = page.locator('a[href="/quote"]').filter({ hasText: /quote/i }).first()
    await expect(heroQuote).toBeVisible()
    await expect(heroQuote).toHaveAttribute("href", "/quote")
    await expect(page.locator('header a[href="/quote"]').first()).toHaveAttribute("href", "/quote")

    await page.goto("/quote")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("runs estimate then contact steps", async ({ page }) => {
    await page.goto("/quote")
    await expect(page.getByText("1. Details")).toBeVisible()

    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Mowing" }).click()

    const slider = page.locator('[role="slider"]')
    await slider.focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")

    await page.getByRole("button", { name: "Calculate Estimate" }).click()
    await expect(page.getByText("2. Estimate")).toBeVisible()
    await expect(page.getByText(/\$\d+/).first()).toBeVisible()
    await expect(page.getByText(/per visit|per month|per treatment/i).first()).toBeVisible()

    await page.getByRole("button", { name: "Request a Confirmed Quote" }).click()
    await expect(page.getByRole("heading", { name: /Where should we send your quote/i })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "First Name", exact: true })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Phone", exact: true })).toBeVisible()
  })

  test("submits quote lead to /api/lead with source quote", async ({ page }) => {
    await page.goto("/quote")

    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Mowing" }).click()
    await page.getByRole("button", { name: "Calculate Estimate" }).click()
    await page.getByRole("button", { name: "Request a Confirmed Quote" }).click()

    await page.getByRole("textbox", { name: "First Name", exact: true }).fill("Casey")
    await page.getByRole("textbox", { name: "Last Name", exact: true }).fill("QuoteLead")
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("casey.quote@cutrateslawn.com")
    await page.getByRole("textbox", { name: "Phone", exact: true }).fill("(316) 555-0142")
    await page.getByRole("textbox", { name: "Service address (optional)" }).fill("100 Test St, Valley Center, KS")

    const leadResponse = page.waitForResponse(
      (res) => res.url().includes("/api/lead") && res.request().method() === "POST",
    )
    await page.getByRole("button", { name: "Submit Quote Request" }).click()
    const res = await leadResponse
    const body = res.request().postDataJSON() as {
      source?: string
      service?: string
      estimateAmount?: number
    }
    expect(body.source).toBe("quote")
    expect(body.service).toMatch(/mowing/i)
    expect(typeof body.estimateAmount).toBe("number")

    // Success if GHL/webhook configured; otherwise API may 503 with honest error
    if (res.ok()) {
      await expect(page.getByRole("heading", { name: /Request received/i })).toBeVisible()
    } else {
      await expect(page.getByRole("alert").first()).toBeVisible()
    }
  })
})
