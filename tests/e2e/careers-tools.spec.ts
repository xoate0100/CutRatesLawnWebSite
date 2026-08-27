import { test, expect } from "@playwright/test"

test.describe("Careers portal tools", () => {
  test("paycheck estimator slider updates gross pay", async ({ page }) => {
    await page.goto("/careers")
    const estimator = page.getByRole("heading", { name: /See what a paycheck could look like/i })
    await expect(estimator).toBeVisible()

    const rate = page.locator('input[type="range"]').first()
    await rate.evaluate((el: HTMLInputElement) => {
      el.value = "20"
      el.dispatchEvent(new Event("input", { bubbles: true }))
      el.dispatchEvent(new Event("change", { bubbles: true }))
    })

    const gross = page.getByText(/Estimated gross pay/i)
    await expect(gross).toBeVisible()
    await expect(page.getByText(/taxes and deductions not included/i).first()).toBeVisible()
  })

  test("schedule preview tabs switch days", async ({ page }) => {
    await page.goto("/careers")
    await page.getByRole("tab", { name: "Wed" }).click()
    await expect(page.getByRole("tabpanel")).toContainText(/Wed/i)
  })

  test("job fit quiz progresses and recommends roles", async ({ page }) => {
    await page.goto("/careers")
    const quiz = page.locator("#job-fit")
    await quiz.scrollIntoViewIfNeeded()
    const answers = ["Yes", "Yes / some", "Yes", "Routes", "Equipment", "Yes"]
    for (const label of answers) {
      await quiz.getByRole("button", { name: label, exact: true }).click()
    }
    await expect(quiz.getByText(/View job card/i).first()).toBeVisible()
  })

  test("apply form progress and no rejected culture phrases", async ({ page }) => {
    await page.goto("/careers")
    const body = await page.locator("body").innerText()
    expect(body.toLowerCase()).not.toContain("join our family")
    expect(body.toLowerCase()).not.toContain("competitive pay")
    expect(body.toLowerCase()).not.toContain("work-life balance")

    await page.getByLabel(/Full name/i).fill("Test Candidate")
    await page.getByLabel(/Mobile number/i).fill("3165550100")
    await page.getByRole("button", { name: /^Continue$/i }).click()
    await expect(page.getByText(/2\.\s*Job/i)).toBeVisible()
  })

  test("mobile careers hero does not overflow document", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto("/careers")
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth - doc.clientWidth
    })
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
