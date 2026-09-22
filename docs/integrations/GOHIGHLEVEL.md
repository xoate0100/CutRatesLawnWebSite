# Go High Level / LeadConnector — Cut Rates Lawn

**Purpose:** Connect Cursor (MCP) and the website lead API to HighLevel so form submissions create contacts and drive workflows.

**Last updated:** 2026-09-22

---

## Architecture

```
Website forms (contact / quote / newsletter)
        │
        ▼
   POST /api/lead  (or /api/newsletter)
        │
        ├─► GHL Contacts Upsert + tags   ← primary CRM path
        ├─► CONTACT_FORM_WEBHOOK_URL     ← optional (n8n, etc.)
        └─► Resend email notify          ← optional backup

Cursor agent
        │
        ▼
LeadConnector MCP  (https://services.leadconnectorhq.com/mcp/cursor/v2 + PIT)
        │
        └─► Create/inspect workflows, contacts, opportunities, calendars
```

**Workflow trigger convention (tags):**

| Tag | Meaning |
|-----|---------|
| `website-lead` | Any site lead (primary automation trigger) |
| `source:contact` | From contact form (`source` field) |
| `source:quote` | From **/quote** funnel (`QuoteFunnel` → `/api/lead`) |
| `service:lawn-mowing` (etc.) | Requested service (slugified from form label) |

**Quote funnel path:** `/quote` → Details → Estimate → Contact → `POST /api/lead` with `source: "quote"` plus estimate fields (amount, unit, lawn size, frequency, optional address). GHL contact message includes the planning estimate for staff.

Build HighLevel workflows that start on **Contact Tag Added → `website-lead`**, then branch on `source:quote` vs `source:contact`.

---

## Outstanding tasks (tracked)

Canonical backlog: [`6_ai_runtime_context/OUTSTANDING_TASKS.yaml`](../../6_ai_runtime_context/OUTSTANDING_TASKS.yaml)  
Active plan / pointer: `ghl-lead-workflows` in `ACTIVE_PLAN.yaml` + `ACTIVE_TASK_POINTER.yaml`

| ID | Task | Priority | Status |
|----|------|----------|--------|
| GHL-OPS-001 | Add `GHL_*` secrets to **Vercel** production | high | completed (env set; E2E is GHL-TEST-001) |
| GHL-WF-001 | Workflow on tag `website-lead` → Fresh Lead + notify + thank-you | high | blocked (no create-workflow API; human UI only — none exists by that name) |
| GHL-TEST-001 | E2E form → GHL smoke test (local + prod) | high | pending |
| GHL-WF-002 | Branch by `source:contact` / `quote` / `newsletter` | medium | pending |
| GHL-WF-003 | Service tags + custom fields visible to staff | medium | pending |
| GHL-DEC-001 | Accept/revise `DEC-GHL-LEADCONNECTOR` proposal | medium | pending |
| GHL-OPS-002 | Optional: grant Locations View on PIT | low | pending |

**Done already:** `lib/ghl.ts` upsert + tags + optional opportunity/custom fields. Cursor MCP uses `/mcp/cursor/v2` with a Private Integration Token (OAuth marketplace install does not return a token to Cursor). Vercel Production + Preview on `v0-cut-rates-lawn-main-page` has `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, `GHL_PIPELINE_ID`, `GHL_PIPELINE_STAGE_ID` (Fresh Lead), `GHL_CF_SERVICE_ID`, `GHL_CF_MESSAGE_ID`. Do **not** edit existing HighLevel automations, pipelines, tags, or custom fields.

When completing an item, update **both** `OUTSTANDING_TASKS.yaml` and `ACTIVE_PLAN.yaml` status fields.

## 1. Create a Private Integration Token (sub-account)

1. Open the **Cut Rates Lawn** HighLevel **sub-account** (not agency).
2. **Settings → Private Integrations → Create New Integration**.
3. Name it e.g. `Cursor MCP + Website Leads`.
4. Enable at least these scopes:

**Required for lead forms + MCP automation work**

- Contacts: View + Edit  
- Conversations: View + Edit  
- Conversation Messages: View + Edit  
- Opportunities: View + Edit  
- Calendars + Calendar Events: View + Edit  
- Locations: View  
- Custom Fields: View  
- Forms: View  

5. Create → **copy the PIT** (shown once).  
6. Copy the **Location ID** (Settings → Business Profile / API, or from the sub-account URL).

---

## 2. Cursor MCP (programmatic CRM / workflows)

Cursor cannot finish HighLevel’s `/mcp/cursor/v2` OAuth. That URL is a marketplace app: **Authenticate** opens the HighLevel app sales/install page. If the app is already installed, HighLevel never redirects back to Cursor (`http://localhost:8787/callback`), so MCP stays on **needsAuth**. `/mcp/openai/v2/` is also wrong from Cursor (`client_path_mismatch`).

Use `/mcp/cursor/v2` with a **Private Integration Token** in headers (verified 2026-09-20: OAuth marketplace install does not return a token to Cursor; PIT on this URL exposes the full v2 catalog):

`https://services.leadconnectorhq.com/mcp/cursor/v2`

Config (no secrets in git — env interpolation):

- This repo: `.cursor/mcp.json`
- This machine: `%USERPROFILE%\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "leadconnector": {
      "url": "https://services.leadconnectorhq.com/mcp/cursor/v2",
      "headers": {
        "Authorization": "Bearer ${env:GHL_PRIVATE_INTEGRATION_TOKEN}",
        "locationId": "${env:GHL_LOCATION_ID}"
      }
    }
  }
}
```

Local website + MCP: put the same keys in `.env.local` (gitignored). Cursor remote MCP does **not** load `.env.local`; this machine’s `%USERPROFILE%\.cursor\mcp.json` must include the Bearer token and `locationId` in `headers` (Cursor does not reliably expand `${env:...}` for remote MCP). Also set **Windows User** environment variables so a restarted Cursor / new terminals see them:

```text
GHL_PRIVATE_INTEGRATION_TOKEN=pit-xxxxxxxx
GHL_LOCATION_ID=yourLocationId
```

Create the PIT in the **Cut Rates Lawn sub-account** (Settings → Private Integrations) if you do not already have one. Copy Location ID from Settings → Business Profile (or the sub-account URL).

Do not paste the token into chat. After restart, ask: “Using LeadConnector, list my pipelines” — you should see **New Leads**.

The website lead API (`lib/ghl.ts`) uses the same PIT + location ID (see §3).

---

## 3. Website env (Vercel + local)

In `.env` / Vercel project env:

```bash
GHL_PRIVATE_INTEGRATION_TOKEN=pit-xxxxxxxx
GHL_LOCATION_ID=yourLocationId
GHL_PIPELINE_ID=F0DVnJbjW0nJMm8HlYpG
GHL_PIPELINE_STAGE_ID=c57de217-6496-4355-b2ef-a1c9e2983ed8
# Existing custom fields (do not create duplicates)
GHL_CF_SERVICE_ID=f1Sn1OZOXVB5VwI2xHBB
GHL_CF_MESSAGE_ID=CkymWjT4aAlONIQPlyjc
# Optional comma-separated extra tags on every lead
# GHL_LEAD_TAGS=lawn-care,wichita
```

**Vercel (2026-09-22):** those keys are set on Production + Preview for `v0-cut-rates-lawn-main-page`. Unrelated env was left alone. A production redeploy is required after env changes (redeploy of current `main` started 2026-09-22). Preview project `cutrates-homepage-preview` was not changed.

`/api/lead` treats GHL as a valid delivery channel (alongside webhook / Resend). At least one of GHL, `CONTACT_FORM_WEBHOOK_URL`, or `RESEND_API_KEY` must be set for success responses.

---

## 4. First automation to create (NEW workflow only — GHL UI)

**Do not change existing production automations.** Facebook/chat/form-submission flows, pipelines, stages, tags, and custom fields stay as they are. HighLevel has **no create-workflow API**. `get-workflow` can list names/status only (verified 2026-09-22 after PIT scope update).

Site-side nurture is already live after Vercel env: tagged contact, existing Service Requested / Your Message fields, opportunity on **New Leads / Fresh Lead**.

**Confirmed 2026-09-22:** no existing workflow is named for `website-lead`. Create a **new** automation in GHL UI (do not open or edit any current one, including the draft `Form Submission -> Confirmation`):

**Name:** `Website Lead Nurture (cutrateslawn.com)`

**Trigger:** Contact Tag Added → `website-lead`

**Steps (example):**

1. Filter out `lead-status:partial`
2. Staff notify (email/SMS) with name, phone, service
3. TCPA thank-you SMS (human-approved copy)
4. Do **not** add `form submission lead` / `fb lead` / `chat widget lead` tags
5. Skip a second opportunity create if the site already posted one

Click-by-click: [`docs/cro/GHL_WORKFLOWS.md`](../cro/GHL_WORKFLOWS.md).

---

## 5. Security

- Never commit PIT tokens.  
- Never put GHL secrets in `NEXT_PUBLIC_*`.  
- Rotate the PIT if it leaks.  
- Prefer least-privilege scopes; add write scopes only when the agent must mutate CRM data.

---

## References

- [LeadConnector MCP docs](https://marketplace.gohighlevel.com/docs/other/mcp/)  
- [HighLevel MCP help article](https://help.gohighlevel.com/support/solutions/articles/155000005741-how-to-setup-and-use-the-highlevel-mcp-server)  
- Code: `lib/ghl.ts`, `app/api/lead/route.ts`
