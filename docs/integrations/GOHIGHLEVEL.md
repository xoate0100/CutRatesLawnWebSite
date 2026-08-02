# Go High Level / LeadConnector — Cut Rates Lawn

**Purpose:** Connect Cursor (MCP) and the website lead API to HighLevel so form submissions create contacts and drive workflows.

**Last updated:** 2026-08-01

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
LeadConnector MCP  (https://services.leadconnectorhq.com/mcp/)
        │
        └─► Create/inspect workflows, contacts, opportunities, calendars
```

**Workflow trigger convention (tags):**

| Tag | Meaning |
|-----|---------|
| `website-lead` | Any site lead (primary automation trigger) |
| `source:contact` | From contact form (`source` field) |
| `source:quote` | From quote flow |
| `service:lawn-care` | Requested service (slugified) |

Build HighLevel workflows that start on **Contact Tag Added → `website-lead`**.

---

## Outstanding tasks (tracked)

Canonical backlog: [`6_ai_runtime_context/OUTSTANDING_TASKS.yaml`](../../6_ai_runtime_context/OUTSTANDING_TASKS.yaml)  
Active plan / pointer: `ghl-lead-workflows` in `ACTIVE_PLAN.yaml` + `ACTIVE_TASK_POINTER.yaml`

| ID | Task | Priority | Status |
|----|------|----------|--------|
| GHL-OPS-001 | Add `GHL_*` secrets to **Vercel** production | high | pending |
| GHL-WF-001 | Workflow on tag `website-lead` → Fresh Lead + notify + thank-you | high | pending |
| GHL-TEST-001 | E2E form → GHL smoke test (local + prod) | high | pending |
| GHL-WF-002 | Branch by `source:contact` / `quote` / `newsletter` | medium | pending |
| GHL-WF-003 | Service tags + custom fields visible to staff | medium | pending |
| GHL-DEC-001 | Accept/revise `DEC-GHL-LEADCONNECTOR` proposal | medium | pending |
| GHL-OPS-002 | Optional: grant Locations View on PIT | low | pending |

**Done already:** PIT + location in local/Windows env; Cursor MCP `leadconnector` auth; `lib/ghl.ts` upsert + tags; contacts/pipelines API verified.

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

Official endpoint for Cursor today (generic HTTP MCP):

`https://services.leadconnectorhq.com/mcp/`

Added to your global Cursor config (`%USERPROFILE%\.cursor\mcp.json`) as `leadconnector`.

Set **Windows User environment variables** (and the same keys in `.env` / Vercel):

```text
GHL_PRIVATE_INTEGRATION_TOKEN=pit-xxxxxxxx
GHL_LOCATION_ID=yourLocationId
```

Cursor’s MCP config (`%USERPROFILE%\.cursor\mcp.json`) must include the **literal** Bearer token and locationId in `leadconnector.headers` (Cursor does not reliably expand `${env:...}` for remote MCP headers). After rotating a PIT, update both the User env vars and that MCP entry, then reload MCP / restart Cursor.

**Verify:** Ask Cursor: “Using LeadConnector, list my pipelines” — you should see the **New Leads** pipeline.

> Dedicated `/mcp/cursor/v2` is on HighLevel’s roadmap. Until then use `/mcp/` (narrower toolset than Claude’s `/mcp/anthropic/v2`, but works in Cursor).

---

## 3. Website env (Vercel + local)

In `.env` / Vercel project env:

```bash
GHL_PRIVATE_INTEGRATION_TOKEN=pit-xxxxxxxx
GHL_LOCATION_ID=yourLocationId
# Optional comma-separated extra tags on every lead
# GHL_LEAD_TAGS=lawn-care,wichita
# Optional custom field IDs (Locations → Custom Fields)
# GHL_CF_SERVICE_ID=
# GHL_CF_MESSAGE_ID=
# GHL_CF_REQUEST_ID=
```

`/api/lead` treats GHL as a valid delivery channel (alongside webhook / Resend). At least one of GHL, `CONTACT_FORM_WEBHOOK_URL`, or `RESEND_API_KEY` must be set for success responses.

---

## 4. First automation to create (via MCP or UI)

**Name:** Website Lead → SMS/Email nurture  

**Trigger:** Contact Tag Added → `website-lead`  

**Steps (example):**

1. Wait 1 minute  
2. Send SMS: “Thanks for contacting Cut Rates Lawn — we’ll follow up shortly.”  
3. Create Opportunity in your sales pipeline (stage: New Lead)  
4. Internal notification to staff  

Ask Cursor after MCP is connected:

> Using LeadConnector, create (or outline) a workflow that fires when tag `website-lead` is added: notify our team, add an opportunity, and send a thank-you SMS.

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
