import { test, expect } from "@playwright/test"

const ROUTES = [
  "/",
  "/services",
  "/services/landscaping",
  "/service-areas/wichita",
  "/service-areas/kansas-city/lawn-care",
  "/quote",
  "/about",
  "/contact",
  "/bundles",
  "/our-work",
]

test.describe("SSR HTML is not empty", () => {
  for (const path of ROUTES) {
    test(`${path} has H1 and main copy without localhost`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.ok()).toBeTruthy()
      const html = await res.text()
      const h1s = html.match(/<h1[\s>]/gi) || []
      expect(h1s.length).toBeGreaterThanOrEqual(1)
      expect(html.toLowerCase()).not.toContain("localhost")
      const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html
      const text = main.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      expect(text.length).toBeGreaterThan(500)
    })
  }
})
