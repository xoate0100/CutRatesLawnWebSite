#!/usr/bin/env node
/**
 * CI link integrity: known inventory routes must 200; previously broken paths must not 404.
 */
import { chromium } from "@playwright/test"

const baseURL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000"

const mustWork = [
  "/",
  "/about",
  "/contact",
  "/quote",
  "/schedule",
  "/privacy",
  "/terms",
  "/sitemap",
  "/services/gutter-cleaning",
  "/services/hardscaping",
  "/services/snow-removal",
  "/careers/apply",
  "/bundles/residential",
]

const mustRedirectOrWork = [
  "/dashboard",
  "/account",
  "/services/hardscapes",
  "/bundles/total-home",
]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const failures = []

for (const path of mustWork) {
  const res = await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 })
  const status = res?.status() ?? 0
  if (status >= 400) failures.push(`${path} → ${status}`)
}

for (const path of mustRedirectOrWork) {
  const res = await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 })
  const status = res?.status() ?? 0
  const url = page.url()
  if (status >= 400) failures.push(`${path} → ${status}`)
  if (path === "/dashboard" && !url.includes("fieldportals") && !url.includes("/portal")) {
    // allow external redirect
    if (status === 200 && url.includes("/dashboard")) failures.push(`${path} still shows local dashboard`)
  }
}

// unknown route must be 404 not 5xx
{
  const res = await page.goto(`${baseURL}/this-route-does-not-exist-ci`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  })
  const status = res?.status() ?? 0
  if (status !== 404) failures.push(`unknown route → ${status} (expected 404)`)
}

await browser.close()

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2))
  process.exit(1)
}
console.log(JSON.stringify({ ok: true, checked: mustWork.length + mustRedirectOrWork.length + 1 }))
