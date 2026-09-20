/**
 * Dry-run Google Ads offline conversion CSV from seed data (or GHL if configured).
 * HUMAN SETUP: set GOOGLE_ADS_CUSTOMER_ID + GOOGLE_ADS_CONVERSION_ACTION; CRO_OFFLINE_EXPORT_LIVE=1 to call GHL.
 */
import fs from "node:fs"

const seed = [
  {
    gclid: "EAIa_seed_test",
    conversion_name: process.env.GOOGLE_ADS_CONVERSION_ACTION || "Lead won",
    conversion_time: new Date().toISOString(),
    conversion_value: 199,
    currency: "USD",
  },
]

function csv(rows: typeof seed) {
  const header = "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency"
  const body = rows
    .map((r) => [r.gclid, r.conversion_name, r.conversion_time, r.conversion_value, r.currency].join(","))
    .join("\n")
  return `${header}\n${body}\n`
}

async function fromGhl(): Promise<typeof seed> {
  if (process.env.CRO_OFFLINE_EXPORT_LIVE !== "1") return seed
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN?.trim()
  if (!token) {
    console.warn("HUMAN SETUP: GHL token missing — using seed rows")
    return seed
  }
  console.warn("HUMAN SETUP: Wire GHL won-opportunity fetch here once pipeline search scope is granted. Using seed.")
  return seed
}

async function main() {
  const rows = await fromGhl()
  const out = csv(rows)
  const dest = process.argv[2] || "artifacts/offline-conversions.csv"
  fs.mkdirSync("artifacts", { recursive: true })
  fs.writeFileSync(dest, out)
  console.log(`Wrote ${rows.length} rows to ${dest} (dry-run unless CRO_OFFLINE_EXPORT_LIVE=1)`)
}

main()
