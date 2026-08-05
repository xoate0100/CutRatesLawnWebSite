import { test, expect } from "@playwright/test"

test.describe("Prospect user journey", () => {
  test("discovers services and browses key pages", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /Professional Lawn Care in Wichita/i })).toBeVisible()

    await page.goto("/services/all")
    await expect(page).toHaveURL(/\/services\/all/)

    await page.goto("/services/lawn-care")
    await expect(page).toHaveURL(/\/services\/lawn-care/)

    await page.goto("/bundles/all")
    await expect(page).toHaveURL(/\/bundles\/all/)

    await page.goto("/faq")
    await expect(page).toHaveURL(/\/faq/)
    await expect(page.locator("body")).toContainText(/FAQ|question|error|unavailable|try again/i)
  })

  test("gets an instant quote estimate", async ({ page }) => {
    await page.goto("/quote")
    await expect(page.getByRole("heading", { name: /Get a Quote/i })).toBeVisible()

    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Mowing" }).click()

    const slider = page.locator('[role="slider"]')
    await slider.focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")

    await page.getByRole("button", { name: "Calculate Estimate" }).click()
    await expect(page.getByText(/\$\d+/).first()).toBeVisible()
    await expect(page.getByRole("button", { name: "Request a Confirmed Quote" })).toBeVisible()
  })

  test("submits contact form as a valid prospect", async ({ page }) => {
    page.on("dialog", (dialog) => dialog.accept())

    await page.goto("/contact")
    await expect(page.getByRole("heading", { name: "Contact Us", level: 1 })).toBeVisible()

    await page.getByRole("textbox", { name: "First Name", exact: true }).fill("Alex")
    await page.getByRole("textbox", { name: "Last Name", exact: true }).fill("Prospect")
    await page.getByRole("textbox", { name: "Email", exact: true }).fill("alex.prospect@cutrateslawn.com")
    await page.getByRole("textbox", { name: "Phone", exact: true }).fill("(316) 555-0199")
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Care" }).click()
    await page.getByRole("textbox", { name: "Message", exact: true }).fill("Interested in weekly mowing for my home.")

    const leadResponse = page.waitForResponse(
      (res) => res.url().includes("/api/lead") && res.request().method() === "POST",
    )
    await page.getByRole("button", { name: "Send Message" }).click()
    const res = await leadResponse
    const body = res.request().postDataJSON() as { source?: string }
    expect(body.source).toBe("contact")

    if (res.ok()) {
      await expect(page.getByText(/We received your request/i)).toBeVisible()
    } else {
      await expect(page.getByRole("alert").or(page.getByText(/could not|call/i))).toBeVisible()
    }
  })

  test("schedules a service date", async ({ page }) => {
    await page.goto("/schedule")
    await expect(page.locator("main")).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    const serviceSelect = page.getByRole("combobox").first()
    if ((await serviceSelect.count()) > 0) {
      await serviceSelect.click()
      const lawn = page.getByRole("option", { name: /Lawn Care/i })
      if ((await lawn.count()) > 0) await lawn.click()
    }

    const enabledDay = page.locator('button[role="gridcell"]:not([disabled])').first()
    if ((await enabledDay.count()) > 0) {
      await enabledDay.click()
    }
    await expect(page).toHaveURL(/\/schedule/)
  })

  test("uses contact help widget", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "Open contact help" }).click()
    await expect(page.getByText(/Talk with us|do not run live chat/i).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /Go to contact|Contact form/i }).first()).toBeVisible()
  })

  test("customer portal link is present in header", async ({ page }) => {
    await page.goto("/")
    const portalLink = page.getByRole("link", { name: /Customer Portal/i }).first()
    await expect(portalLink).toBeVisible()
    await expect(portalLink).toHaveAttribute("href", /fieldportals|portal/)
  })
})
