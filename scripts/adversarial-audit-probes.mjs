#!/usr/bin/env node
/**
 * Supplemental adversarial / edge probes for pre-release audit (non-destructive).
 */
import { chromium } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const baseURL = process.env.AUDIT_BASE_URL ?? 'http://localhost:3001'
const out = resolve(root, 'docs/audit/evidence/adversarial-probes.json')

const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext()
const results = []

async function run(name, fn) {
  const page = await context.newPage()
  const network = []
  page.on('request', (r) => {
    if (['xhr', 'fetch'].includes(r.resourceType())) {
      network.push({ method: r.method(), url: r.url() })
    }
  })
  try {
    const details = await fn(page)
    results.push({ name, ok: true, details, network })
  } catch (e) {
    results.push({ name, ok: false, error: String(e), network })
  } finally {
    await page.close()
  }
}

await run('contact-xss-payload', async (page) => {
  await page.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' })
  const payload = `<script>window.__xss=1</script>`
  await page.getByLabel('First Name').fill(payload)
  await page.getByLabel('Last Name').fill('Audit')
  await page.getByLabel('Email').fill('xss@example.com')
  await page.getByLabel('Phone').fill('3165550100')
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Lawn Care' }).click()
  await page.getByLabel('Message').fill(payload)
  let dialog = null
  page.once('dialog', async (d) => {
    dialog = d.message()
    await d.accept()
  })
  await page.getByRole('button', { name: 'Send Message' }).click()
  await page.waitForTimeout(300)
  return {
    dialog,
    xssFlag: await page.evaluate(() => window.__xss === 1),
    firstNameStillPresent: await page.getByLabel('First Name').inputValue(),
  }
})

await run('contact-invalid-email', async (page) => {
  await page.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' })
  await page.getByLabel('First Name').fill('A')
  await page.getByLabel('Last Name').fill('B')
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByLabel('Phone').fill('x')
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Lawn Care' }).click()
  await page.getByLabel('Message').fill('test')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await page.waitForTimeout(200)
  return {
    emailValidity: await page.getByLabel('Email').evaluate((el) => el.validity.valid),
    stillOnContact: page.url().includes('/contact'),
  }
})

await run('contact-duplicate-submit', async (page) => {
  await page.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' })
  await page.getByLabel('First Name').fill('Dup')
  await page.getByLabel('Last Name').fill('Submit')
  await page.getByLabel('Email').fill('dup@example.com')
  await page.getByLabel('Phone').fill('3165550199')
  await page.getByRole('combobox').click()
  await page.getByRole('option', { name: 'Lawn Care' }).click()
  await page.getByLabel('Message').fill('double click')
  let dialogs = 0
  page.on('dialog', async (d) => {
    dialogs++
    await d.accept()
  })
  const btn = page.getByRole('button', { name: 'Send Message' })
  await Promise.all([btn.click(), btn.click()])
  await page.waitForTimeout(500)
  return { dialogs }
})

await run('quote-empty-defaults', async (page) => {
  await page.goto(`${baseURL}/quote`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Calculate Quote' }).click()
  const text = await page.getByText(/\$\d+/).first().textContent()
  return { quoteText: text }
})

await run('referral-copy-button', async (page) => {
  await page.goto(`${baseURL}/referral`, { waitUntil: 'networkidle' })
  const copy = page.getByRole('button', { name: /copy/i })
  const count = await copy.count()
  if (count) await copy.first().click()
  await page.waitForTimeout(200)
  return { copyButtons: count, clipboardHint: await page.getByText(/copied/i).count() }
})

await run('api-guess-404', async (page) => {
  const paths = ['/api', '/api/contact', '/api/auth/session', '/api/leads', '/.env', '/admin']
  const statuses = {}
  for (const p of paths) {
    const res = await page.goto(`${baseURL}${p}`, { waitUntil: 'domcontentloaded' })
    statuses[p] = res?.status() ?? null
  }
  return { statuses }
})

await run('dashboard-refresh-persistence', async (page) => {
  await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' })
  const h1 = await page.locator('h1').first().textContent()
  await page.reload({ waitUntil: 'networkidle' })
  const h1b = await page.locator('h1').first().textContent()
  return { before: h1?.trim(), after: h1b?.trim(), stillPublic: page.url().includes('/dashboard') }
})

await run('back-forward-contact-quote', async (page) => {
  await page.goto(`${baseURL}/contact`, { waitUntil: 'networkidle' })
  await page.goto(`${baseURL}/quote`, { waitUntil: 'networkidle' })
  await page.goBack({ waitUntil: 'domcontentloaded' })
  const back = page.url()
  await page.goForward({ waitUntil: 'domcontentloaded' })
  const fwd = page.url()
  return { back, fwd }
})

await run('portal-redirect', async (page) => {
  const res = await page.goto(`${baseURL}/portal`, { waitUntil: 'domcontentloaded', timeout: 20000 }).catch((e) => e)
  return {
    finalURL: page.url(),
    status: res?.status?.() ?? null,
    isExternal: page.url().includes('fieldportals.com'),
  }
})

await run('placeholder-svg-status', async (page) => {
  const res = await page.goto(`${baseURL}/placeholder.svg?height=40&width=180`, {
    waitUntil: 'domcontentloaded',
  })
  return { status: res?.status() ?? null, contentType: res?.headers()?.['content-type'] ?? null }
})

mkdirSync(dirname(out), { recursive: true })
writeFileSync(
  out,
  JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, results }, null, 2) + '\n',
)
await browser.close()
console.log(JSON.stringify({ out, count: results.length, failed: results.filter((r) => !r.ok).map((r) => r.name) }, null, 2))
