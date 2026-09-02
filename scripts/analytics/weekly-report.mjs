#!/usr/bin/env node
/**
 * Weekly GA4 marketing report for Chris — credential-gated, real Data API pull.
 *
 * Required env (report fails loudly if absent):
 *   GA4_PROPERTY_ID
 *   GA4_DATA_API_CREDENTIALS_JSON  (service account JSON string)
 *
 * Optional email delivery:
 *   WEEKLY_REPORT_EMAIL_TO, WEEKLY_REPORT_EMAIL_FROM
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */
import crypto from "node:crypto"
import fs from "node:fs"

const HUMAN_SETUP =
  "HUMAN SETUP: Set GA4_PROPERTY_ID and GA4_DATA_API_CREDENTIALS_JSON (service account JSON with Analytics Data API read access on the GA4 property) to enable the weekly report."

const propertyId = process.env.GA4_PROPERTY_ID?.trim()
const credsJson = process.env.GA4_DATA_API_CREDENTIALS_JSON?.trim()

if (!propertyId || !credsJson) {
  console.error(HUMAN_SETUP)
  process.exit(1)
}

let credentials
try {
  credentials = JSON.parse(credsJson)
} catch {
  console.error(`${HUMAN_SETUP} (GA4_DATA_API_CREDENTIALS_JSON is not valid JSON)`)
  process.exit(1)
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url")
  const claim = Buffer.from(
    JSON.stringify({
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url")
  const signInput = `${header}.${claim}`
  const sign = crypto.createSign("RSA-SHA256")
  sign.update(signInput)
  sign.end()
  const signature = sign.sign(credentials.private_key, "base64url")
  const jwt = `${signInput}.${signature}`

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })
  if (!tokenRes.ok) {
    throw new Error(`Token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`)
  }
  const tokenJson = await tokenRes.json()
  return tokenJson.access_token
}

async function runReport(accessToken) {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 7)
  const fmt = (d) => d.toISOString().slice(0, 10)

  const body = {
    dateRanges: [{ startDate: fmt(start), endDate: fmt(end) }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    orderBys: [{ desc: true, metric: { metricName: "eventCount" } }],
    limit: 25,
  }

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) {
    throw new Error(`GA4 Data API failed: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

function composeEmail(report, startLabel, endLabel) {
  const rows = (report.rows || [])
    .map((r) => {
      const name = r.dimensionValues?.[0]?.value ?? "?"
      const count = r.metricValues?.[0]?.value ?? "0"
      return `  ${name}: ${count}`
    })
    .join("\n")

  const lineItem = 449
  return {
    subject: `Cut Rates weekly analytics (${startLabel} – ${endLabel})`,
    text: `Chris,

Weekly marketing analytics summary for Cut Rates Lawn Care (${startLabel} to ${endLabel}).

Top events (GA4):
${rows || "  (no events in range)"}

This report justifies the $${lineItem}/mo tracking & reporting line item: attribution capture (UTM + gclid), GTM-driven GA4/Ads/Meta events, and this automated weekly pull.

— Cut Rates analytics.tracking weekly job`,
  }
}

async function maybeSendEmail(email) {
  const to = process.env.WEEKLY_REPORT_EMAIL_TO?.trim()
  const from = process.env.WEEKLY_REPORT_EMAIL_FROM?.trim()
  const host = process.env.SMTP_HOST?.trim()
  if (!to || !host) {
    console.log("Email not sent (WEEKLY_REPORT_EMAIL_TO / SMTP_HOST unset). Composed body:\n")
    console.log(email.text)
    return
  }

  // Minimal SMTP-free path: write artifact for GitHub Action mail step
  fs.mkdirSync("artifacts", { recursive: true })
  fs.writeFileSync(
    "artifacts/weekly-analytics-report.json",
    JSON.stringify({ to, from, ...email }, null, 2),
  )
  console.log("Report artifact written to artifacts/weekly-analytics-report.json")
}

async function main() {
  const end = new Date()
  const start = new Date(end)
  start.setDate(start.getDate() - 7)
  const token = await getAccessToken()
  const report = await runReport(token)
  const email = composeEmail(report, start.toISOString().slice(0, 10), end.toISOString().slice(0, 10))
  await maybeSendEmail(email)
  console.log("Weekly GA4 report completed.")
}

main().catch((err) => {
  console.error(String(err.message || err))
  process.exit(1)
})
