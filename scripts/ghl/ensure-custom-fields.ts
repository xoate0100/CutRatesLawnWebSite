/**
 * HUMAN SETUP: run with GHL_PRIVATE_INTEGRATION_TOKEN + GHL_LOCATION_ID against sandbox first.
 * Prints custom field names/ids for .env mapping.
 */
const BASE = "https://services.leadconnectorhq.com"

async function main() {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN?.trim()
  const locationId = process.env.GHL_LOCATION_ID?.trim()
  if (!token || !locationId) {
    console.error(
      "HUMAN SETUP: Set GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID. This script cannot create fields without a PIT.",
    )
    process.exit(1)
  }
  const res = await fetch(`${BASE}/locations/${locationId}/customFields`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  })
  if (!res.ok) {
    console.error("customFields list failed", res.status, await res.text())
    console.error("HUMAN SETUP: If this is 401/403, add custom-fields scope on the Private Integration.")
    process.exit(1)
  }
  const json = (await res.json()) as { customFields?: Array<{ id: string; name: string }> }
  const fields = json.customFields || []
  console.log("Existing custom fields:")
  for (const f of fields) console.log(`  ${f.name} = ${f.id}`)
  const wanted = [
    "Service Requested",
    "Your Message",
    "Request ID",
    "Area",
    "gclid",
    "Landing page",
    "Urgency",
    "Heard about us",
    "Service details JSON",
    "First touch JSON",
    "Last touch JSON",
  ]
  const have = new Set(fields.map((f) => f.name.toLowerCase()))
  for (const name of wanted) {
    if (!have.has(name.toLowerCase())) {
      console.log(`MISSING (create in GHL UI): ${name}`)
    }
  }
}

main()
