import { test, expect } from "@playwright/test"

const GONE = [
  "/debug",
  "/api-test",
  "/api-simple-test",
  "/google-reviews-test",
  "/image-test",
  "/static-test",
  "/test-layout",
  "/test-page",
  "/api/google-reviews-debug",
  "/api/test",
  "/api/simple",
  "/api/html",
  "/api/mock-homepage",
  "/api-debug",
]

test.describe("Debug routes are gone", () => {
  for (const path of GONE) {
    test(`${path} returns 404`, async ({ request }) => {
      const res = await request.get(path)
      expect(res.status()).toBe(404)
    })
  }
})
