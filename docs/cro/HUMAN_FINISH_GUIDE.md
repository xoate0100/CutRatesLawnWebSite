# How to finish the human-only CRO work

**Audience:** Andy (owner). Not for another coding agent.  
**Branch:** `cro/phase-1-measurement` — **do not merge to `main` until the merge gate at the bottom is checked.**  
**Companion logs:** `docs/cro/HUMAN_REQUIRED.md` (IDs), `docs/cro/GHL_WORKFLOWS.md` (workflow spec), `docs/integrations/GOHIGHLEVEL.md` (PIT scopes).

This document is the playbook. The website code on this branch already takes quotes, fires conversions without requiring an ad click, and *attempts* to upsert Go High Level (GHL) contacts. **Production still cannot keep that promise** until you paste secrets, build GHL automations, and smoke-test a real lead. If you skip this and merge anyway, visitors will see a thank-you page while the CRM stays empty (or leads vanish when a serverless instance dies).

Estimated calendar time if you already have GHL access: **90–150 minutes** for the must-do path, plus legal/ops confirmations you can do the same afternoon.

---

## What already shipped (so you know what you are turning on)

The rebuild lives on `cro/phase-1-measurement`. After merge (later), a customer path looks like this:

1. They hit `/`, a service page, `/quote`, `/quote/[service]`, an ad landing page `/lp/[service]`, or an area page `/service-areas/[town]/[service]`.
2. The quote funnel posts `POST /api/lead` with source `quote` (contact form uses `contact`; newsletter uses `newsletter`).
3. The API upserts a GHL contact, applies tags, writes custom fields, and tries to create an opportunity in pipeline **New Leads**.
4. The browser lands on `/thank-you/[service]?rid=…&amt=…` and pushes `conversion_lead` into `dataLayer` even if there was no UTM or `gclid` (organic/direct now count).
5. If GHL is down, the lead is queued **only if Redis is configured**, and a Vercel Cron retries `/api/cron/lead-retry`.

Until the steps below are done, step 3 503s or no-ops, step 5 is an in-memory Map that **does not survive** Vercel instances, and nobody gets the SMS you promised on the quote page.

**Do not** put secrets in git, `NEXT_PUBLIC_*` (except the public Places/GTM keys), or chat logs.

---

## Suggested order (dependencies)

Do these in this order. Later steps assume earlier ones exist.

| Step | IDs | Why this order | Skip? |
|---|---|---|---|
| 0. Confirm Vercel project | — | Wrong project = you “set env” and production never sees it | No |
| 1. GHL token + location on Vercel | H-CRO-004, GHL-OPS-001 | Without this, `/api/lead` has no CRM | **Must before merge** |
| 2. Upstash Redis | H-CRO-002 | Serverless will drop queued/idempotent leads otherwise | **Must before merge** |
| 3. Cron secret + Vercel Cron | H-CRO-003 | Retries the Redis failure queue | **Must before merge** |
| 4. Custom fields + paste IDs | H-CRO-012, GHL-WF-003 | Tags still work without this; reps will not see gclid/area/details | Same day if possible |
| 5. Website-lead workflow (SMS) | H-CRO-005, GHL-WF-001 | This is the speed-to-lead promise | **Must before merge** |
| 6. Source branching | GHL-WF-002 | Stops sales SMS on newsletters | Same day |
| 7. Owner / pipeline stage IDs | H-CRO-006 | Opportunities may 4xx without a stage; contacts still save | Same day |
| 8. GTM container | H-CRO-016 | First-party `dataLayer` already fills; Ads/GA4 need GTM | Before paid spend |
| 9. Consent copy | H-CRO-001 | Banner is live with default **deny** ads/analytics | Before paid spend / legal comfort |
| 10. Ops confirmations | H-CRO-007–009, 014 | Defaults already shipped; you confirm or we trim later | This week |
| 11. Production smoke test | GHL-TEST-001 | Proves 1–7 | **Must before merge** |
| 12. Optional upgrades | H-CRO-010, 011, 013, 015 | Places, parcels, Ads offline, photo upload | After merge is fine |
| 13. You merge (or approve a PR) | H-CRO-017 | Agents must not merge | You only |

---

## Step 0 — Confirm the Vercel project

Production site is the Vercel project historically named **`v0-cut-rates-lawn-main-page`** (Cut Rates Lawn marketing site).

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → the Cut Rates lawn project (not a random preview app).
2. Settings → General: note **Project Name** and production domain.
3. Deployments: you should already see preview deploys for `cro/phase-1-measurement`. Preview is useful for the smoke test **after** you add env vars to **Preview + Production** (or Production only if you will only test live).

Add every secret below to **Production**. Add the same keys to **Preview** if you want the preview URL to hit real GHL (recommended for the first smoke test; use a GHL test contact you will delete).

After each env change, **redeploy** Production (Deployments → … → Redeploy) so serverless picks up new env. Changing env does not hot-reload running lambdas.

---

## Step 1 — GHL Private Integration Token on Vercel (H-CRO-004 / GHL-OPS-001)

**Context:** Local Windows env and Cursor MCP may already have a PIT. Vercel production does **not** inherit your laptop. `lib/ghl.ts` reads `GHL_PRIVATE_INTEGRATION_TOKEN` and `GHL_LOCATION_ID` only from process env.

**If you already created a PIT** (Settings → Private Integrations in the **Cut Rates Lawn sub-account**, not the agency): reuse it. If not:

1. HighLevel → **sub-account** Cut Rates Lawn.
2. **Settings → Private Integrations → Create**.
3. Name: `Website leads + Cursor`.
4. Enable at least: Contacts View+Edit, Opportunities View+Edit, Conversations + Messages View+Edit, Locations View, Custom Fields View (Edit if the ensure-fields script should create — today the script **lists** and tells you what is missing; you create missing fields in the UI).
5. Copy the token once (`pit-…`).
6. Copy **Location ID** (Settings → Business Profile, or the sub-account URL).

**Vercel → Settings → Environment Variables** (Production + Preview):

```text
GHL_PRIVATE_INTEGRATION_TOKEN=pit-xxxxxxxx
GHL_LOCATION_ID=yourLocationId
GHL_PIPELINE_ID=F0DVnJbjW0nJMm8HlYpG
```

`GHL_PIPELINE_ID` defaults in code to the **New Leads** pipeline id from ops notes (`F0DVnJbjW0nJMm8HlYpG`). If your sub-account uses a different pipeline, paste the real id (GHL → Opportunities → pipeline settings / URL).

**Optional extras (same screen):**

```text
GHL_LEAD_TAGS=lawn-care,wichita
GHL_PIPELINE_STAGE_ID=          # Fresh Lead stage id — see Step 7
GHL_OWNER_SALES_ID=             # commercial / multi-property owner
GHL_OWNER_DEFAULT_ID=           # everyone else
```

**Verify:** After redeploy, submit a test quote on the preview URL. In GHL Contacts, search the test phone. You should see tags `website-lead` and `source:quote`. If the contact is missing, open Vercel → Deployment → Functions / Runtime Logs for `/api/lead` (401/403 = scopes or wrong location; 503 = token missing on that environment).

---

## Step 2 — Upstash Redis REST (H-CRO-002)

**Context:** Vercel serverless does not share memory. Without Redis:

- Duplicate submits are not idempotent across instances.
- Rate limits reset per lambda.
- Failed GHL deliveries are stored in a process `Map` and **disappear**.

That is finding **F-CRO-504 / F-CRO-505**. The code already talks Redis REST (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` in `lib/lead/store.ts`). Unset → loud `HUMAN SETUP` warning in logs.

1. Create a free/paid database at [Upstash](https://console.upstash.com/) (region close to Vercel, e.g. `us-east-1`).
2. Copy **REST URL** and **REST TOKEN** (the `default` token is fine).
3. Vercel env:

```text
UPSTASH_REDIS_REST_URL=https://….upstash.io
UPSTASH_REDIS_REST_TOKEN=…
```

4. Redeploy.

**Verify:** Vercel logs for a quote submit should **not** print the in-process Maps warning. In Upstash console you will start seeing keys after traffic (idempotency / queue). You do not need to interpret key names day one.

---

## Step 3 — Cron secret + Vercel Cron (H-CRO-003)

**Context:** `/api/cron/lead-retry` drains the Redis failure queue and re-POSTs `/api/lead`. It refuses to run without `CRON_SECRET`. Vercel Cron calls **GET**; the route now accepts GET and POST with `Authorization: Bearer <CRON_SECRET>`.

1. Generate a long random string (password manager).
2. Vercel env:

```text
CRON_SECRET=paste-the-long-string
```

3. Add the cron. Two equivalent options — pick one.

**Option A (dashboard, no repo change):** Vercel project → **Settings → Cron Jobs** (or the Cron UI for the project) → path `/api/cron/lead-retry`, schedule every 10 minutes (`*/10 * * * *`). Vercel attaches `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is set.

**Option B (durable, needs your review of deploy config):** add to `vercel.json` (this file is currently framework/build only; changing it is a deploy-config change — do it yourself or ask for a follow-up commit):

```json
{
  "crons": [
    {
      "path": "/api/cron/lead-retry",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**Verify:** After Production has both Redis and `CRON_SECRET`, open:

`https://<prod-domain>/api/cron/lead-retry`

Without the header you should get **401**. From a local terminal (PowerShell):

```powershell
curl.exe -sS -D - -H "Authorization: Bearer YOUR_CRON_SECRET" https://<prod-domain>/api/cron/lead-retry
```

Expect JSON like `{ "ok": true, "retried": 0, "failed": 0 }`. **501** means `CRON_SECRET` is missing on that deployment.

---

## Step 4 — Custom fields the site can write (H-CRO-012 / GHL-WF-003)

**Context:** Tags (`service:lawn-mowing`, `area:derby`) already go on the contact. Reps also need **visible fields**: service, message, area, gclid, landing page, urgency, “heard about us”, JSON blobs for first/last touch. The site writes them only if you paste field IDs into Vercel.

Two fields may already exist in this location (from older docs):

- `GHL_CF_SERVICE_ID=f1Sn1OZOXVB5VwI2xHBB` (confirm in GHL before trusting)
- `GHL_CF_MESSAGE_ID=CkymWjT4aAlONIQPlyjc`

**Create missing fields** in GHL → Settings → Custom Fields (contact-level, text/textarea):

| Field name to create | Vercel env var |
|---|---|
| Service Requested | `GHL_CF_SERVICE_ID` |
| Your Message | `GHL_CF_MESSAGE_ID` |
| Request ID | `GHL_CF_REQUEST_ID` |
| Area | `GHL_CF_AREA_ID` |
| gclid | `GHL_CF_GCLID_ID` |
| Landing page | `GHL_CF_LANDING_ID` |
| Urgency | `GHL_CF_URGENCY_ID` |
| Heard about us | `GHL_CF_SOURCE_SELF_ID` |
| Service details JSON | `GHL_CF_DETAILS_ID` |
| First touch JSON | `GHL_CF_FIRST_TOUCH_ID` |
| Last touch JSON | `GHL_CF_LAST_TOUCH_ID` |

Then, from a machine that has the PIT in `.env` (repo root, never commit it):

```powershell
cd C:\Users\Andy\source\repos\CutRatesLawnWebSite
npx tsx scripts/ghl/ensure-custom-fields.ts
```

The script **lists** existing names/ids and prints `MISSING (create in GHL UI): …`. Paste each id into Vercel. Redeploy.

**Verify:** New test quote → contact in GHL shows Area, gclid (if you used `?gclid=test123` on `/quote`), message, request id.

---

## Step 5 — Website lead nurture workflow (H-CRO-005 / GHL-WF-001)

**Context:** The site only **tags** `website-lead`. HighLevel will not text anyone until a workflow exists. This is the customer-facing promise (“we’ll text or call shortly”). TCPA: you must approve SMS copy.

In GHL → **Automation → Workflows → Create from scratch**.

**Name:** `Website Lead → Fresh Lead + SMS`

1. **Trigger:** Contact Tag Added → tag `website-lead`.
2. **Filter / if-else:** If contact has tag `lead-status:partial` → **do not** send the sales SMS. Optional: wait 30 minutes, if still partial, one softer “still want a quote?” SMS. Partials are people who started the form; treating them like a booked job will annoy them.
3. **Create/move opportunity:** Pipeline **New Leads**, stage **Fresh Lead** (site code also POSTs `/opportunities/` when the token allows; the workflow is the safety net).
4. **Internal notice:** Email or SMS **you / dispatch** with contact name, phone, and service (from tag or custom field).
5. **Customer SMS** (edit until you are happy, then enable):

> Hi {{contact.first_name}}, Cut Rates got your request. We’ll text or call shortly. Reply STOP to opt out.

Swap in `{{contact.name}}` if first name is often empty (phone-primary quotes may only have a first token).

6. Publish / make live.

Do **not** skip SMS because the API is awkward. Quote pages tell people you will text.

---

## Step 6 — Source branching (GHL-WF-002)

Same workflow, inner If/Else on tags (or separate workflows):

| Tag | What should happen |
|---|---|
| `source:quote` | Fast sales SMS + opportunity name like `Quote — {service}` |
| `source:contact` | Same pipeline, slower/email ack is OK |
| `source:newsletter` | **No sales SMS.** Add to newsletter list / nurture only |
| `source:careers` | Recruiting workflow only — not sales |

If you only build one workflow this week, at least **exclude** `source:newsletter` and `source:careers` from the sales SMS.

---

## Step 7 — Pipeline stage + owners (H-CRO-006)

**Context:** Opportunity create can 4xx if GHL wants a stage id you have not set. The **contact still saves**. You will think “CRM works” and the pipeline board stays empty.

1. GHL → Opportunities → New Leads → open **Fresh Lead** (or inspect the stage in the URL / API). Copy the stage id into `GHL_PIPELINE_STAGE_ID`.
2. Settings → Team: copy user ids for:
   - default setter / CSR → `GHL_OWNER_DEFAULT_ID`
   - commercial closer → `GHL_OWNER_SALES_ID`  
   Code assigns commercial / multi-property to the sales owner; everyone else to default. If unset, **no owner** is sent.

Redeploy after pasting.

---

## Step 8 — GTM / Consent Mode (H-CRO-016)

**Context:** `NEXT_PUBLIC_GTM_CONTAINER_ID` unset means the GTM snippet is a no-op. First-party `window.dataLayer` **still** gets `page_view`, `conversion_lead`, `phone_click`, etc. Google Ads and GA4 will not see them until GTM is on the site **and** tags are configured.

1. Create or reuse GTM container.
2. Vercel:

```text
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
```

3. In GTM:
   - Consent Mode: default denied for `ad_storage` / `analytics_storage` (matches the banner). Banner “Accept all” should flip those to granted (you wire that in GTM from the consent event the banner writes — `lib/analytics/consent.ts`).
   - Trigger **Google Ads conversion** and **GA4** on `conversion_lead` (custom event), not only on a thank-you pageview. Thank-you URL is still a valid Ads “destination” backup: `/thank-you` and `/thank-you/mowing` etc. (`/lp/` and `/thank-you` are `noindex` in `robots.ts`).
4. Redeploy (this var is public/build-time).

**Verify:** Preview URL → DevTools → Console: `dataLayer`. Submit a quote (or open `/thank-you/mowing?rid=test&amt=45`). You must see `event: "conversion_lead"` with `traffic_type` and `conversion_gated_on_attribution: false`. Then GTM Preview to confirm tags fire.

---

## Step 9 — Consent banner legal (H-CRO-001)

**What is live today** (`components/consent/consent-banner.tsx`):

- Default: **deny** ads + analytics storage; first-party `dataLayer` still allowed.
- Buttons: **Accept all** / **Essential only**.
- Copy: “We use essential cookies to take quotes. Analytics and advertising cookies stay off until you accept.”

You (or counsel) should confirm this is enough for Kansas + any paid traffic. If you want different copy, say so in a follow-up — do not silently “accept all” by default; that was an explicit product choice.

---

## Step 10 — Ops confirmations (defaults already in code)

These are not blockers for merge **if you accept the defaults**. They *are* blockers for honest advertising.

### H-CRO-007 — Which `/lp/*` to spend on first

Code generated **all 11** marketing service ids (`landscaping`, `lawn-care`, `aeration`, `pest-control`, `holiday-lights`, `snow-removal`, `hardscaping`, `commercial`, `power-washing`, `gutter-cleaning`, `residential`). Seasonal order is separate (`lib/season.ts`). You can start ads on any of them; tell whoever runs Ads which three get budget this month.

### H-CRO-008 — Landscaping budget bands

Shipped: Under $2k / $2–5k / $5–15k / $15k+ / Not sure. Timelines: ASAP / this month / this season / planning. If reps hate a band, say which labels to change.

### H-CRO-009 — Area × service we actually deliver

Static pages exist for **every** combo of:

**Towns:** Wichita, Valley Center, Andover, Derby, Maize, Kansas City, Leavenworth  

**Services (11 marketing pages):** landscaping, lawn care, aeration, pest, holiday lights, snow, hardscaping, commercial, power washing, gutter cleaning, residential  

If you **cannot** serve e.g. Leavenworth pest or Kansas City snow, tell me which combos to remove or noindex. Leaving a URL up that we cannot fulfill is a lead-quality bug.

### H-CRO-014 — Pricing page

`/pricing` is the estimator “starting at” from `lib/pricing/estimate.ts`, **not** the old $99/$199 plan cards. Confirm with whoever owns rates. **Do not ask an agent to edit the formula** without CFO sign-off.

---

## Step 11 — End-to-end smoke test (GHL-TEST-001)

Do this on **Preview or Production after env + workflow**, not only locally.

1. Open `/quote?service=mowing` (or `/quote/mowing`).
2. Complete estimate → contact. Use **your cell**, first name `AndyTest`, a unique last name like `CroSmoke920`.
3. Confirm thank-you URL (`/thank-you/…`).
4. Within a minute: SMS from the workflow (if published) **and** GHL contact with:
   - tags `website-lead`, `source:quote`, a `service:*` tag
   - **not** `lead-status:partial`
   - opportunity on New Leads / Fresh Lead (if stage id + workflow are set)
5. Repeat a **partial**: start the form, enter phone, abandon before submit. Contact may exist with `lead-status:partial` and must **not** get the full sales SMS.
6. Repeat **newsletter** on `/blog` if you care: tag `source:newsletter`, no sales SMS.
7. **Delete or archive** the test contacts so they do not sit in Fresh Lead.

Local-only test (`pnpm dev`) proves the form, not Vercel env.

---

## Step 12 — Optional (after merge is fine)

| ID | What | Why optional |
|---|---|---|
| H-CRO-010 | `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Address is already free-text. Places is nicer UX. Restrict the key to your domains. |
| H-CRO-011 | Parcel / lot-size API | Intentionally **not** faked. Slider stays confirmation until you buy a provider. |
| H-CRO-013 | `GOOGLE_ADS_CUSTOMER_ID` + `GOOGLE_ADS_CONVERSION_ACTION` | Offline conversion CSV: `npx tsx scripts/analytics/export-offline-conversions.ts`. Dry-run until `CRO_OFFLINE_EXPORT_LIVE=1` and GHL has won jobs with gclids. Do this after you have real closed-won, not before. |
| H-CRO-015 | Photo upload on landscaping quotes | Honest copy today: “Text photos after we reply.” Media pipeline is already human-licensed. |

---

## Step 13 — Merge gate (H-CRO-017)

`human_review_required_for_merge: true`. An agent must not merge this branch.

Merge **`cro/phase-1-measurement` → `main`** only when:

- [ ] GHL PIT + location are on **Production** Vercel and a test contact appeared (Step 1 + 11)
- [ ] Upstash REST URL + token on Production (Step 2)
- [ ] `CRON_SECRET` + Cron hitting `/api/cron/lead-retry` (Step 3)
- [ ] Workflow on tag `website-lead` sends **your** phone a test SMS (Step 5)
- [ ] Newsletter/careers will not get the sales SMS (Step 6)
- [ ] You have glanced at consent copy (Step 9)
- [ ] You accept area×service URLs or have listed combos to remove (Step 10)
- [ ] You have run or accepted Playwright/Lighthouse notes in `docs/cro/PHASE6_REPORT.md`

Until then, use the Preview deployment for internal demos.

---

## What you should see in GHL on a good quote

Tags (examples): `website-lead`, `source:quote`, `service:lawn-mowing` (slug/label from taxonomy — **do not rename `GHL_SERVICE_LABELS` without a CRM migration**), maybe `area:derby`, `lead-status:complete` (or omit complete; partials use `lead-status:partial`).

Commercial or urgent jobs also get routing tags like `route:sales`, `priority:urgent`, `sla:same-day`, `unqualified:out-of-area`.

Fake emails like `…@leads.cutrateslawn.com` may still be sent when the form is phone-primary. That is intentional so GHL has an email slot; **phone is the real identity**. Do not build “email the lead a PDF” automations that only hit that mailbox.

---

## If something fails

| Symptom | Likely cause |
|---|---|
| Thank-you shows, no GHL contact | PIT/location missing on that Vercel env; or `/api/lead` 503 — check logs |
| Contact yes, no SMS | Workflow off, wrong tag, or filtered as partial |
| Contact yes, no opportunity | `GHL_PIPELINE_STAGE_ID` / pipeline id mismatch; workflow not creating opp |
| Duplicate contacts | Redis unset (idempotency is per-instance) or GHL matching on the fake email |
| 202 queued forever | Redis + cron missing |
| Ads “no conversions” | GTM unset, or Ads still waiting for UTM-only rules — runtime no longer drops organic |
| Preview works, Production does not | Env added to Preview only; redeploy Production |

When you finish a row in `HUMAN_REQUIRED.md`, mark it done there (or tell me and I will). Same for `GHL-OPS-001` / `GHL-WF-001` in `6_ai_runtime_context/OUTSTANDING_TASKS.yaml` — those stay **pending** until you actually click through GHL/Vercel.
