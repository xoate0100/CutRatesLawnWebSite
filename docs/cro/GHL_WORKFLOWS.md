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

1. **Automations → Create workflow** (never open an existing workflow to edit).
2. Name: `Website Lead Nurture (cutrateslawn.com)` so it is obvious this is the new site path.
3. Trigger: **Contact Tag Added** → `website-lead` (this tag exists; do not create a second tag with a different spelling).
4. Filter: contact does **not** have tag `lead-status:partial`.
5. Skip opportunity create in the workflow if the site already posted one (avoid duplicate deals). Staff notify + TCPA thank-you are the workflow’s job.
6. Internal notice: email/SMS to dispatch with `{{contact.name}}`, `{{contact.phone}}`, service tag.
7. Customer SMS (TCPA): “Hi {{contact.first_name}}, Cut Rates got your {{service}} request. We’ll text or call shortly. Reply STOP to opt out.” HUMAN must approve copy.
8. Do **not** attach this workflow to `form submission lead`, Facebook, or chat-widget tags.

## GHL-WF-002 — Source branching

- `source:quote` → sales SMS + opportunity name “Quote — {service}”
- `source:contact` → slower email ack, same pipeline
- `source:newsletter` → **no** sales SMS
- `source:careers` → recruiting workflow only

Build as **new** branches or a **new** workflow. Do not edit the Facebook / chat / form-submission production flows.

## GHL-WF-003 — Custom fields

Do **not** run field-create scripts against production unless a named field is missing. Existing fields already in use:

- Service Requested → `GHL_CF_SERVICE_ID=f1Sn1OZOXVB5VwI2xHBB`
- Your Message → `GHL_CF_MESSAGE_ID=CkymWjT4aAlONIQPlyjc`

Optional extra IDs (only if the field already exists): `GHL_CF_AREA_ID`, `GHL_CF_GCLID_ID`, `GHL_CF_DETAILS_ID`, `GHL_CF_FIRST_TOUCH_ID`, `GHL_CF_LAST_TOUCH_ID`, `GHL_CF_URGENCY_ID`, `GHL_CF_SOURCE_SELF_ID`.

## MCP blocked steps

LeadConnector MCP cannot create workflows with the current PIT. Finish staff notify + thank-you in GHL → Automation as a **new** workflow only. Do not skip SMS because the API is awkward — that is the speed-to-lead promise on `/quote`.

**Full click-by-click playbook (Vercel env, Redis, Cron, smoke test, merge gate):** [`HUMAN_FINISH_GUIDE.md`](./HUMAN_FINISH_GUIDE.md).
