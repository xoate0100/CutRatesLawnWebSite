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
    const schedule = page.getByRole("heading", { name: /What could a normal week look like/i })
    await schedule.scrollIntoViewIfNeeded()
    const wed = page.getByRole("tab", { name: "Wed" })
    await wed.scrollIntoViewIfNeeded()
    await wed.click()
    await expect(wed).toHaveAttribute("aria-selected", "true")
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

    const form = page.locator("#apply")
    await form.scrollIntoViewIfNeeded()
    await form.getByLabel(/^Full name$/i).fill("Test Candidate")
    await form.getByLabel(/^Mobile number$/i).fill("3165550100")
    await form.getByRole("button", { name: /^Continue$/i }).click()
    await expect(form.getByText(/2\.\s*Job/i)).toBeVisible()
  })

  test("apply form posts to /api/lead with careers source", async ({ page }) => {
    let leadBody: {
      source?: string
      phone?: string
      message?: string
    } | null = null
    await page.route("**/api/lead", async (route) => {
      leadBody = route.request().postDataJSON() as {
        source?: string
        phone?: string
        message?: string
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, requestId: "e2e-careers-1" }),
      })
    })

    await page.goto("/careers")
    const form = page.locator("#apply")
    await form.scrollIntoViewIfNeeded()
    await form.getByLabel(/^Full name$/i).fill("Test Candidate")
    await form.getByLabel(/^Mobile number$/i).fill("3165550100")
    await form.getByRole("button", { name: /^Continue$/i }).click()

    await form.getByLabel(/^ZIP code$/i).fill("67202")
    await form.getByRole("button", { name: /^Continue$/i }).click()

    await form.getByLabel(/Availability/i).fill("Weekdays 6am–3pm")
    await form.getByLabel(/Can you reliably reach/i).selectOption("Yes")
    await form.getByRole("button", { name: /^Continue$/i }).click()

    await form.getByRole("button", { name: /Submit application/i }).click()
    await expect(page.getByText(/Application received/i)).toBeVisible()
    await expect(page.getByText(/Reference: e2e-careers-1/i)).toBeVisible()

    expect(leadBody).toBeTruthy()
    expect(leadBody!.source).toBe("careers")
    expect(leadBody!.phone).toBe("3165550100")
    expect(String(leadBody!.message || "")).toMatch(/Availability/i)
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
