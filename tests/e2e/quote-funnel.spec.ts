import { test, expect } from "@playwright/test"

test.describe("Get a Quote funnel", () => {
  test("hero and nav quote CTAs land on /quote", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("link", { name: /free quote/i }).first()).toBeVisible()
    await page.goto("/quote")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("runs estimate then contact steps", async ({ page }) => {
    await page.goto("/quote?service=mowing")
    await expect(page.getByText("Property type")).toBeVisible()
    await page.getByLabel(/Service address/i).fill("100 Main St, Valley Center, KS")
    await page.getByRole("button", { name: "Calculate Estimate" }).click()
    await expect(page.getByText("3. Estimate")).toBeVisible()
    await expect(page.getByText(/\$\d+/).first()).toBeVisible()
    await page.getByRole("button", { name: "Continue with this estimate" }).click()
    await expect(page.getByRole("heading", { name: /How can we reach you/i })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Name" })).toBeVisible()
    await expect(page.getByRole("textbox", { name: "Mobile" })).toBeVisible()
  })

  test("submits quote lead to /api/lead with source quote", async ({ page }) => {
    await page.goto("/quote?service=mowing")
    await page.getByLabel(/Service address/i).fill("100 Main St, Valley Center, KS")
    await page.getByRole("button", { name: "Calculate Estimate" }).click()
    await page.getByRole("button", { name: "Continue with this estimate" }).click()
    await page.getByRole("textbox", { name: "Name" }).fill("Casey QuoteLead")
    await page.getByRole("textbox", { name: "Mobile" }).fill("(316) 555-0142")

    const leadResponse = page.waitForResponse(
      (res) => res.url().includes("/api/lead") && res.request().method() === "POST",
    )
    await page.getByRole("button", { name: "Submit Quote Request" }).click()
    const res = await leadResponse
    const body = res.request().postDataJSON() as {
      source?: string
      service?: string
      estimateAmount?: number
      lawnSizeSqFt?: number
    }
    expect(body.source).toBe("quote")
    expect(body.service).toMatch(/mowing/i)
    expect(typeof body.estimateAmount).toBe("number")
  })
})
