import { test, expect } from "@playwright/test"

test.describe("Prospect user journey", () => {
  test("discovers services and browses key pages", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /Complete Exterior Property Solutions/i })).toBeVisible()

    await page.getByRole("button", { name: /^Services/i }).click()
    await page.locator('header a[href="/services/all"]').click()
    await expect(page).toHaveURL(/\/services\/all/)

    await page.locator('main a[href="/services/lawn-care"]').click()
    await expect(page).toHaveURL(/\/services\/lawn-care/)

    await page.getByRole("button", { name: /Bundles & Subscriptions/i }).click()
    await page.locator('header a[href="/bundles/all"]').click()
    await expect(page).toHaveURL(/\/bundles\/all/)

    await page.goto("/faq")
    await expect(page).toHaveURL(/\/faq/)
    await expect(page.getByRole("heading", { name: /Frequently Asked Questions|FAQ/i, level: 1 })).toBeVisible()
  })

  test("gets an instant quote estimate", async ({ page }) => {
    await page.goto("/quote")
    await expect(page.getByRole("heading", { name: /Get an Instant Quote/i })).toBeVisible()

    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Mowing" }).click()

    const slider = page.locator('[role="slider"]')
    await slider.focus()
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")
    await page.keyboard.press("ArrowRight")

    await page.getByRole("button", { name: "Calculate Quote" }).click()
    await expect(page.getByText(/\$\d+ per service/)).toBeVisible()
    const quoteText = await page.getByText(/\$\d+ per service/).textContent()
    const amount = Number(quoteText?.match(/\$(\d+)/)?.[1] ?? 0)
    expect(amount).toBeGreaterThan(0)
  })

  test("submits contact form as a valid prospect", async ({ page }) => {
    page.on("dialog", (dialog) => dialog.accept())

    await page.goto("/contact")
    await expect(page.getByRole("heading", { name: "Contact Us", level: 1 })).toBeVisible()

    await page.getByLabel("First Name").fill("Alex")
    await page.getByLabel("Last Name").fill("Prospect")
    await page.getByLabel("Email").fill("alex.prospect@cutrateslawn.com")
    await page.getByLabel("Phone").fill("(316) 555-0199")
    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Care" }).click()
    await page.getByLabel("Message").fill("Interested in weekly mowing for my home.")

    await page.getByRole("button", { name: "Send Message" }).click()

    await expect(page.getByLabel("First Name")).toHaveValue("")
    await expect(page.getByLabel("Email")).toHaveValue("")
  })

  test("schedules a service date", async ({ page }) => {
    await page.goto("/schedule")
    await expect(page.getByRole("heading", { name: /Schedule a Service/i })).toBeVisible()

    await page.getByRole("combobox").click()
    await page.getByRole("option", { name: "Lawn Care" }).click()

    await page.getByRole("gridcell").filter({ hasNot: page.locator("[disabled]") }).first().click()

    await page.getByRole("button", { name: /Continue to Book/i }).click()
    await expect(page.getByRole("heading", { name: /Schedule a Service/i })).toBeVisible()
  })

  test("uses live chat widget", async ({ page }) => {
    await page.goto("/")
    const chatToggle = page.getByRole("button").filter({ has: page.locator("svg") }).last()
    await page.locator("button.fixed.bottom-4.right-4").click()
    await expect(page.getByText("Live Chat")).toBeVisible()
    await page.getByPlaceholder("Type your message...").fill("Hello, I need a quote.")
    await page.getByRole("button", { name: "Send" }).click()
    await expect(page.getByText(/Thanks for your message/i)).toBeVisible()
  })

  test("customer portal link is present in header", async ({ page }) => {
    await page.goto("/")
    const portalLink = page.getByRole("link", { name: /Customer Portal/i }).first()
    await expect(portalLink).toBeVisible()
    await expect(portalLink).toHaveAttribute("href", /fieldportals|portal/)
  })
})
