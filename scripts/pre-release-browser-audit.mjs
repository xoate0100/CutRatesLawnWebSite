#!/usr/bin/env node
import { chromium } from "@playwright/test"
import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const baseURL = process.env.AUDIT_BASE_URL ?? "http://localhost:3001"
const outputPath = resolve(root, "docs/audit/evidence/browser-audit.json")

const expectedRoutes = [
  "/",
  "/about",
  "/blog",
  "/bundles",
  "/bundles/all",
  "/bundles/commercial",
  "/bundles/residential",
  "/bundles/seasonal",
  "/careers",
  "/case-studies",
  "/certifications",
  "/community",
  "/contact",
  "/dashboard",
  "/faq",
  "/our-work",
  "/pricing",
  "/quote",
  "/referral",
  "/schedule",
  "/service-areas",
  "/services",
  "/services/all",
  "/services/commercial",
  "/services/landscaping",
  "/services/lawn-care",
  "/services/pest-control",
  "/services/power-washing",
  "/services/residential",
]

const browser = await chromium.launch({ channel: "msedge", headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const routeResults = []
const discoveredInternalLinks = new Set()

for (const route of expectedRoutes) {
  const page = await context.newPage()
  const consoleErrors = []
  const failedRequests = []

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text())
  })
  page.on("requestfailed", (request) => {
    failedRequests.push({
      url: request.url(),
      error: request.failure()?.errorText ?? "unknown",
    })
  })

  let status = null
  let navigationError = null
  try {
    const response = await page.goto(`${baseURL}${route}`, {
      waitUntil: "networkidle",
      timeout: 45_000,
    })
    status = response?.status() ?? null
  } catch (error) {
    navigationError = error instanceof Error ? error.message : String(error)
  }

  const finalURL = page.url()
  const title = await page.title().catch(() => "")
  const h1 = await page.locator("h1").first().textContent().catch(() => null)
  const placeholderImages = await page
    .locator('img[src*="placeholder"]')
    .count()
    .catch(() => 0)
  const forms = await page.locator("form").count().catch(() => 0)
  const links = await page.locator('a[href^="/"]').evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("href")).filter(Boolean),
  ).catch(() => [])

  for (const link of links) discoveredInternalLinks.add(link)

  routeResults.push({
    route,
    status,
    finalURL,
    title,
    h1: h1?.trim() ?? null,
    placeholderImages,
    forms,
    consoleErrors,
    failedRequests,
    navigationError,
  })
  await page.close()
}

const internalLinkResults = []
for (const path of [...discoveredInternalLinks].sort()) {
  const page = await context.newPage()
  let status = null
  let error = null
  try {
    const response = await page.goto(`${baseURL}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    })
    status = response?.status() ?? null
  } catch (caught) {
    error = caught instanceof Error ? caught.message : String(caught)
  }
  internalLinkResults.push({ path, status, finalURL: page.url(), error })
  await page.close()
}

async function probe(name, run) {
  const page = await context.newPage()
  const requests = []
  page.on("request", (request) => {
    if (["xhr", "fetch", "document"].includes(request.resourceType())) {
      requests.push({
        method: request.method(),
        resourceType: request.resourceType(),
        url: request.url(),
      })
    }
  })
  try {
    const details = await run(page)
    return { name, ok: true, details, requests }
  } catch (error) {
    return {
      name,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      requests,
    }
  } finally {
    await page.close()
  }
}

const workflowProbes = []

workflowProbes.push(await probe("contact-form", async (page) => {
  await page.goto(`${baseURL}/contact`, { waitUntil: "networkidle" })
  await page.getByLabel("First Name").fill("Audit")
  await page.getByLabel("Last Name").fill("Prospect")
  await page.getByLabel("Email").fill("audit@example.com")
  await page.getByLabel("Phone").fill("(316) 555-0100")
  await page.getByRole("combobox").click()
  await page.getByRole("option", { name: "Lawn Care" }).click()
  await page.getByLabel("Message").fill("Pre-release audit")
  let dialogText = null
  page.once("dialog", async (dialog) => {
    dialogText = dialog.message()
    await dialog.accept()
  })
  await page.getByRole("button", { name: "Send Message" }).click()
  await page.waitForTimeout(500)
  return {
    dialogText,
    firstNameAfterSubmit: await page.getByLabel("First Name").inputValue(),
    hasSuccessRegion: await page.locator('[role="status"], [data-success]').count(),
  }
}))

workflowProbes.push(await probe("newsletter", async (page) => {
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" })
  await page.getByPlaceholder("Your email").fill("newsletter-audit@example.com")
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.getByRole("button", { name: "Subscribe", exact: true }).click(),
  ])
  return {
    finalURL: page.url(),
    hasSuccessText: await page.getByText(/subscribed|thank you|success/i).count(),
  }
}))

workflowProbes.push(await probe("site-search", async (page) => {
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" })
  await page.getByRole("searchbox").fill("lawn care")
  await page.getByRole("button", { name: "Search" }).click()
  await page.waitForTimeout(500)
  return {
    finalURL: page.url(),
    resultTextCount: await page.getByText(/search results/i).count(),
    queryValue: await page.getByRole("searchbox").inputValue(),
  }
}))

workflowProbes.push(await probe("schedule", async (page) => {
  await page.goto(`${baseURL}/schedule`, { waitUntil: "networkidle" })
  await page.getByRole("combobox").click()
  await page.getByRole("option", { name: "Lawn Care" }).click()
  await page.getByRole("gridcell").filter({ hasNot: page.locator("[disabled]") }).first().click()
  await page.getByRole("button", { name: /Continue to Book/i }).click()
  await page.waitForTimeout(500)
  return {
    finalURL: page.url(),
    successTextCount: await page.getByText(/booked|confirmed|next step|thank you/i).count(),
  }
}))

workflowProbes.push(await probe("quote-default", async (page) => {
  await page.goto(`${baseURL}/quote`, { waitUntil: "networkidle" })
  await page.getByRole("button", { name: "Calculate Quote" }).click()
  return {
    quoteText: await page.getByText(/\$\d+ per service/).textContent(),
  }
}))

workflowProbes.push(await probe("dashboard-direct-access", async (page) => {
  const response = await page.goto(`${baseURL}/dashboard`, { waitUntil: "networkidle" })
  return {
    status: response?.status() ?? null,
    finalURL: page.url(),
    heading: await page.locator("h1").first().textContent(),
  }
}))

const mobilePage = await context.newPage()
await mobilePage.setViewportSize({ width: 390, height: 844 })
await mobilePage.goto(`${baseURL}/`, { waitUntil: "networkidle" })
const mobileResult = {
  menuButtonVisible: await mobilePage.getByRole("button", { name: "Open main menu" }).isVisible(),
  horizontalOverflow: await mobilePage.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  ),
}
await mobilePage.close()

const evidence = {
  generatedAt: new Date().toISOString(),
  baseURL,
  browser: "Microsoft Edge",
  expectedRouteCount: expectedRoutes.length,
  routeResults,
  internalLinkResults,
  workflowProbes,
  mobileResult,
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`)
await browser.close()

const brokenRoutes = routeResults.filter((result) => result.status === null || result.status >= 400)
const brokenLinks = internalLinkResults.filter((result) => result.status === null || result.status >= 400)
console.log(JSON.stringify({
  outputPath,
  routesChecked: routeResults.length,
  brokenRoutes: brokenRoutes.length,
  internalLinksChecked: internalLinkResults.length,
  brokenLinks: brokenLinks.length,
  probes: workflowProbes.map(({ name, ok }) => ({ name, ok })),
  mobileResult,
}, null, 2))
