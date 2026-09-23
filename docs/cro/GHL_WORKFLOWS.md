# GHL workflows — manual build (HUMAN SETUP)

Code already upserts a contact and tags `website-lead`, `source:*`, `service:*`, `area:*`, `lead-status:*`. Automations are **not** created by this repo. Build them in GHL UI (or MCP when scopes allow).

## Do not disrupt production

Cut Rates Lawn already has live HighLevel automations, pipelines, tags, and custom fields. Agents and operators **must not**:

- Edit, pause, rename, or delete any existing workflow/campaign
- Change pipeline/stage names, order, or settings on **New Leads** (id `F0DVnJbjW0nJMm8HlYpG`)
- Create duplicate custom fields (use existing **Service Requested** / **Your Message**)
- Add production tags such as `form submission lead`, `fb lead`, or `chat widget lead` from the website (those already drive live automations)
- Enroll website contacts into any existing workflow via API (`add-contact-to-workflow`)

HighLevel **cannot create** workflows via API (no create-workflow operation). `get-workflow` is read-only list (name/status only). Do not guess at trigger internals.

### Existing workflows (read 2026-09-22 — do not open to edit)

**Published (live production — never touch):**

- Wichita - FB AD Lead Submission - Christmas Lights
- Wichita- Christmas Lights Appointment Booked
- ESTIMATE – Jason Calendar – New Booking
- FB AD Lead Submission - Sod
- Kansas City - FB AD Lead Submission - Sod
- Kansas City - Sod Appointment Booked
- Landscape Reno Appointment Booked
- Pest/fert Appointment Booked
- Sod Appointment Booked
- Kansas City - Aeration Services Appointment Booked
- Kansas City - FB AD Lead Submission - Aeration Services
- Wichita - Aeration Services Appointment Booked
- Wichita - FB AD Lead Submission - Aeration Services

**Draft (also do not edit, including Form Submission / Chat Widget templates):**

- 10 Days Passed -> Marketing Form Reminder For Client
- Chat Widget Lead In -> Confirmation
- FB AD Lead Submission - Landscape Reno
- FB AD Lead Submission - Pest/fert
- FB Message Received -> Confirmation
- Form Submission -> Confirmation
- IG Message Received -> Confirmation
- Missed Call Text Back
- DR Activation Workflow
- Customer Replied: Help, Start, Info -> Handle Optin
- Invalid number -> Enable SMS DND
- SMS Hard Opt Out -> Update Date - DND
- Discount Form Filled In -> Notify Lead & Contractor
- Negative Feedback Received
- Refer a Friend + Return Customer + Review request -> 1 Year Followup
- Review Link Updated -> Ask For Reviews
- Review Request Sent -> 1 Month Review Followup
- Trigger Link Clicked -> Remove From Review Followup

No existing workflow is named for tag `website-lead`. A **new** workflow named `Website Lead Nurture (cutrateslawn.com)` is therefore additive.

## Site-side nurture (already live; no GHL automation edits)

`lib/ghl.ts` + `/api/lead` already:

1. Upsert the contact
2. Tag `website-lead` + `source:*` + `service:*`
3. Write existing custom fields **Service Requested** (`GHL_CF_SERVICE_ID`) and **Your Message** (`GHL_CF_MESSAGE_ID`)
4. Create an opportunity on **New Leads** / **Fresh Lead** when `GHL_PIPELINE_ID` + `GHL_PIPELINE_STAGE_ID` are set

That is additive CRM data. It does not modify existing automations.

## GHL-WF-001 — Website lead nurture (NEW workflow only)

Create this **only** after a human confirms in GHL → Automations that **no existing workflow** already triggers on tag `website-lead`. If one exists, stop — do not add a second SMS/notify path.

### Click-by-click build

1. HighLevel → **Cut Rates Lawn** sub-account → **Automations → Workflows → Create workflow**.
2. Name exactly: `Website Lead Nurture (cutrateslawn.com)`.
3. **Trigger:** Contact Tag → **Tag Added** → select existing tag `website-lead` (do not create a misspelled duplicate).
4. **Immediately add Filter / If-Else:**
   - Branch A (Continue): Contact does **not** have tag `lead-status:partial`.
   - Branch B (Stop / End): has `lead-status:partial` → **no SMS, no staff notify** (partials are abandoned-form captures only).
5. Inside Branch A, add a second If-Else on tags (source branching — see WF-002). Default path below is for `source:quote` and `source:contact`.
6. **Do not** add “Create Opportunity” if Vercel already sets `GHL_PIPELINE_ID` / stage (site creates Fresh Lead). Duplicate deals confuse dispatch.
7. Actions in order (quote/contact path):
   1. Internal SMS to dispatch (below)
   2. Internal email to dispatch (below)
   3. Wait 1 minute (optional; reduces double-fire on rapid tag writes)
   4. Client SMS (TCPA) — only if contact has a mobile and is not SMS DND
   5. Client email — only if contact has email
8. Save → **Publish**. Leave all existing workflows untouched.
9. Do **not** attach this workflow to `form submission lead`, Facebook, or chat-widget tags.

### Internal SMS (to office / dispatch)

**To:** your dispatch user or a shared staff mobile (Settings → Phone → or workflow “Send SMS” → custom number).  
**When:** immediately on Branch A.

```text
NEW WEB LEAD — cutrateslawn.com
{{contact.first_name}} {{contact.last_name}}
{{contact.phone}}
{{contact.email}}
Service: {{contact.tags}}
Msg: {{contact.your_message}}
Call/text within 5 min.
```

Merge fields (live fieldKeys):

- Service Requested → `{{contact.service_requested}}` (picklist aligned to site `GHL_SERVICE_LABELS` + phone extras; updated 2026-09-23)
- Your Message → `{{contact.your_message}}`

Prefer the UI custom-field picker if a template still shows blank.

### Internal email (to office)

**To:** `info@cutrateslawn.com` (and/or Jason/Chris — set in the Email action).  
**Subject:**

```text
[Website] New lead — {{contact.first_name}} {{contact.last_name}} — {{contact.phone}}
```

**Body (HTML or plain):**

```text
New website lead from cutrateslawn.com

Name: {{contact.first_name}} {{contact.last_name}}
Phone: {{contact.phone}}
Email: {{contact.email}}
Tags: {{contact.tags}}

Service Requested: {{contact.service_requested}}
Message:
{{contact.your_message}}

Open in GHL and call/text within 5 minutes.
Do not reply-all to the customer from this thread — use Conversations.
```

### Client SMS (TCPA — customer-facing)

**Only** if the contact opted in via the site form (quote/contact already collect consent on-site). Include STOP language.

```text
Hi {{contact.first_name}}, this is Cut Rates Lawn Care — we got your request and will text or call shortly. Reply STOP to opt out.
```

Alternate (service-aware; use only if Service Requested merge works):

```text
Hi {{contact.first_name}}, Cut Rates got your {{contact.service_requested}} request. We’ll text or call shortly. Reply STOP to opt out.
```

### Client email (customer-facing)

**From:** Cut Rates Lawn Care / verified sending domain in GHL.  
**Subject:**

```text
We got your request — Cut Rates Lawn Care
```

**Body:**

```text
Hi {{contact.first_name}},

Thanks for reaching out to Cut Rates Lawn Care. We received your request and a teammate will follow up by phone or text shortly (usually within a few hours during business hours).

If you need us sooner, call (316) 925-5050.

— Cut Rates Lawn Care
Wichita & surrounding areas
https://cutrateslawn.com

You’re receiving this because you submitted a form on our website. Reply STOP by text if you also got a text and want to opt out of SMS.
```

### Smoke test (after publish)

1. Create a **test contact** in GHL (your mobile + email).
2. Manually add tag `website-lead` (and `source:quote`, `service:lawn-mowing` if testing filters).
3. Confirm: internal SMS + email, then client SMS + email.
4. Remove tag / delete test contact when done.
5. Do **not** use a real customer for the first publish test.

## GHL-WF-002 — Source branching

Build as **If-Else inside the NEW workflow only**. Do not edit Facebook / chat / form-submission production flows.

| Tag present | Staff notify | Client SMS | Client email | Notes |
|-------------|--------------|------------|--------------|-------|
| `source:quote` | Yes (urgent) | Yes | Yes | Primary path; copy above |
| `source:contact` | Yes | Yes | Yes | Same copy; subject may say “Contact form” |
| `source:newsletter` | Optional internal email only | **No** | Soft welcome only (below) | Never sales SMS |
| `source:careers` | Recruiting inbox only | **No** | Careers ack only | Do not put on New Leads sales SMS |

**Newsletter client email (no SMS):**

```text
Subject: You’re on the Cut Rates list

Hi {{contact.first_name}},

Thanks for subscribing. We’ll send seasonal lawn tips and offers for the Wichita area. No sales call from this signup.

— Cut Rates Lawn Care
```

**Careers internal email only:**

```text
Subject: [Careers] Application — {{contact.first_name}} {{contact.last_name}}
Body: New careers/apply submission. Phone {{contact.phone}} Email {{contact.email}}. Review in GHL; do not run sales nurture.
```

## GHL-WF-003 — Custom fields

Do **not** run field-create scripts against production unless a named field is missing. Existing fields already in use:

- Service Requested → `GHL_CF_SERVICE_ID=f1Sn1OZOXVB5VwI2xHBB`
- Your Message → `GHL_CF_MESSAGE_ID=CkymWjT4aAlONIQPlyjc`

Optional extra IDs (only if the field already exists): `GHL_CF_AREA_ID`, `GHL_CF_GCLID_ID`, `GHL_CF_DETAILS_ID`, `GHL_CF_FIRST_TOUCH_ID`, `GHL_CF_LAST_TOUCH_ID`, `GHL_CF_URGENCY_ID`, `GHL_CF_SOURCE_SELF_ID`.

## MCP blocked steps

LeadConnector MCP cannot create workflows with the current PIT. Finish staff notify + thank-you in GHL → Automation as a **new** workflow only. Do not skip SMS because the API is awkward — that is the speed-to-lead promise on `/quote`.

**Full click-by-click playbook (Vercel env, Redis, Cron, smoke test, merge gate):** [`HUMAN_FINISH_GUIDE.md`](./HUMAN_FINISH_GUIDE.md).
