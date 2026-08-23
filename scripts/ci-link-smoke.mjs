#!/usr/bin/env node
/**
 * CI link integrity without Playwright browsers — fetch-based.
 */
const baseURL = (process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "")

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
  "/services/aeration",
  "/services/holiday-lights",
  "/service-areas/derby",
  "/careers/apply",
  "/bundles/residential",
]

const mustRedirectOrWork = ["/dashboard", "/account", "/services/hardscapes", "/bundles/total-home"]

const failures = []

async function check(path, { expect404 = false } = {}) {
  const res = await fetch(`${baseURL}${path}`, { redirect: "follow" })
  const status = res.status
  if (expect404) {
    if (status !== 404) failures.push(`${path} → ${status} (expected 404)`)
    return
  }
  if (status >= 400) failures.push(`${path} → ${status}`)
}

for (const path of mustWork) await check(path)
for (const path of mustRedirectOrWork) await check(path)
await check("/this-route-does-not-exist-ci", { expect404: true })

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2))
  process.exit(1)
}
console.log(JSON.stringify({ ok: true, checked: mustWork.length + mustRedirectOrWork.length + 1 }))
