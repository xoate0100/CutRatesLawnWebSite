# GHL workflows — manual build (HUMAN SETUP)

Code already upserts a contact and tags `website-lead`, `source:*`, `service:*`, `area:*`, `lead-status:*`. Automations are **not** created by this repo. Build them in GHL UI (or MCP when scopes allow).

## GHL-WF-001 — Website lead nurture

1. Trigger: **Contact Tag Added** → `website-lead`.
2. Filter: tag is not `lead-status:partial` (partials get a quieter path).
3. Action: create/move opportunity in pipeline **New Leads** / stage **Fresh Lead** (pipeline id `F0DVnJbjW0nJMm8HlYpG` unless you change `GHL_PIPELINE_ID`). Site code also POSTs `/opportunities/` when the token allows.
4. Internal notice: email/SMS to dispatch with `{{contact.name}}`, `{{contact.phone}}`, service tag.
5. Customer SMS (TCPA): “Hi {{contact.first_name}}, Cut Rates got your {{service}} request. We’ll text or call shortly. Reply STOP to opt out.” HUMAN must approve copy.

## GHL-WF-002 — Source branching

- `source:quote` → sales SMS + opportunity name “Quote — {service}”
- `source:contact` → slower email ack, same pipeline
- `source:newsletter` → **no** sales SMS
- `source:careers` → recruiting workflow only

## GHL-WF-003 — Custom fields

Run `npx tsx scripts/ghl/ensure-custom-fields.ts` after PIT is in env. Paste printed IDs into Vercel:

`GHL_CF_SERVICE_ID`, `GHL_CF_MESSAGE_ID`, `GHL_CF_AREA_ID`, `GHL_CF_GCLID_ID`, `GHL_CF_DETAILS_ID`, `GHL_CF_FIRST_TOUCH_ID`, `GHL_CF_LAST_TOUCH_ID`, `GHL_CF_URGENCY_ID`, `GHL_CF_SOURCE_SELF_ID`.

## MCP blocked steps

If LeadConnector MCP cannot create workflows, finish the five steps above in GHL → Automation. Do not skip SMS because the API is awkward — that is the speed-to-lead promise on `/quote`.

**Full click-by-click playbook (Vercel env, Redis, Cron, smoke test, merge gate):** [`HUMAN_FINISH_GUIDE.md`](./HUMAN_FINISH_GUIDE.md).
