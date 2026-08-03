# Human-required tasks

Agent completed everything that can run without your credentials, licenses, or GHL UI access. Complete the items below to finish production.

---

## 1. Atmosphere / media (high)

| ID | Task | Why you | Done when |
|----|------|---------|-----------|
| H-ATM-01 | Review live home/header/about/services look after deploy | Brand taste + CLS/contrast | You approve look or list tweaks |
| H-ATM-02 | Pick Envato assets from [`ENVATO_PROPOSALS.md`](../media/ENVATO_PROPOSALS.md) | Elements license is human-only | One preferred URL per priority slot |
| H-ATM-03 | License + download picks into `media/inbox/` with `*.meta.json` | Same | Files present in inbox |
| H-ATM-04 | Re-auth gcloud then finish upload | ~~Tokens expired~~ **Resolved 2026-08-02** with `andy.daniels@cutrateslawn.com` | Upload + sync done |
| H-ATM-05 | Confirm partner logos (KWCH / Google / Yelp) are licensed for web use | Legal | Keep, replace, or remove partner row |
| H-ATM-06 | Confirm team names/photos on About are real or replace with placeholders | Accuracy / privacy | Real bios/photos or generic copy |
| H-ATM-07 | Re-download incomplete files (quarantined `*.crdownload`) + extract empty-state ZIPs to PNG/SVG in inbox | Downloads unfinished / zip not ingestible | Files ready for second ingest |
| H-ATM-08 | Commit `docs/media/*` + `lib/generated/media-map.json` and push (redeploy) after upload | Site reads baked `media-map.json` | Production shows new photos |
| H-ATM-09 | **Upload + bind remaining null slots** — most page slots now reuse first-batch GCS library; still need real portfolio / specialty photos (see below) | Real photos for gaps stock lawn set cannot fill | Listed remaining nulls bound or explicitly deferred |

### H-ATM-09 — Remaining nulls (after 2026-08-02 dedupe)

**Do not re-download the first Envato lawn batch** — it is already on GCS. See [`INBOX_COVERAGE.md`](../media/INBOX_COVERAGE.md).

Still need **new** photos for:
- Real **before** portfolio shots: `ourwork.*.before` (and `ourwork.hardscape.2.after`)
- Power washing: `services.power-washing`, `page.powerwashing.*`, `page.services-all.powerwashing`
- Team: `team.owner` / `manager` / `crew`
- Certifications: `page.certifications.*`
- Avatars: `page.blog.post.avatar`, `page.bundles-slug.avatar`
- Misc commercial: `page.commercial.4–6`, `page.pest.3`, `page.landscaping.4`
- Optional: `empty.state`

Duplicates from the second inbox drop are in `media/archive/already_in_registry/` (safe to delete).

---

## 2. Go High Level (high)

| ID | Task | Why you | Done when |
|----|------|---------|-----------|
| H-GHL-01 | Add Vercel env on project `v0-cut-rates-lawn-main-page`: `GHL_PRIVATE_INTEGRATION_TOKEN`, `GHL_LOCATION_ID`, optional `GHL_CF_SERVICE_ID`, `GHL_CF_MESSAGE_ID` | Secrets | Prod contact creates tagged contact |
| H-GHL-02 | Build workflow: Contact Tag Added → `website-lead` → opportunity New Leads / Fresh Lead + staff notify + thank-you | GHL UI | Workflow active |
| H-GHL-03 | Source branching for `source:contact` / `source:quote` / `source:newsletter` | GHL UI | Paths distinct |
| H-GHL-04 | Accept or revise `proposals/DEC-GHL-LEADCONNECTOR.yaml` | Governance | Decision recorded |
| H-GHL-05 | Optional: grant Locations View on Private Integration | GHL admin | `GET /locations/{id}` works |
| H-GHL-06 | Production E2E smoke (submit form → see contact + workflow) then archive test contact | Prod data | Checklist in GOHIGHLEVEL.md passed |

---

## 3. Deploy / ops (medium)

| ID | Task | Why you | Done when |
|----|------|---------|-----------|
| H-OPS-01 | Commit + push these atmosphere/media changes (ask agent if you want a commit) | You control git release | PR or main updated |
| H-OPS-02 | Confirm Vercel production deploy Ready on `d7d7wkfp.cutrateslawn.com` | Deploy console | Domain shows new hero/scrim |
| H-OPS-03 | Optional social URLs: `NEXT_PUBLIC_SOCIAL_FACEBOOK_URL`, `NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL` | Brand | Footer icons appear |
| H-OPS-04 | Optional Maps embed: `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` | Maps key/policy | Contact map correct |

---

## 4. Content accuracy (medium)

| ID | Task | Why you | Done when |
|----|------|---------|-----------|
| H-CNT-01 | Verify phone, address, hours in `lib/site-config.ts` | Business truth | ~~Defaults updated 2026-08-01~~ — also set same values on Vercel if env vars override |
| H-CNT-02 | Replace placeholder team names if fictitious | Trust | Real names or remove section |

---

## 5. Explicitly out of agent hands

- Envato payment / license acceptance
- Writing secrets into Vercel or sharing PIT outside local mcp.json
- Editing `5_reference_architectures/DECISION_REGISTRY.yaml` directly
- Force-push / production DNS changes without review

---

## Agent already finished (no action needed for these)

- Atmosphere SYSTEM + token CSS + components (hero, section, motif, empty state)
- Home / about / services media cutover to `mediaSrc`
- Header / footer / loading / 404 brand polish
- SLOT_MAP + media-map expanded (legacy GCS bindings)
- Envato shortlists written
- Tier 3 form token hygiene (contact muted strip, quote primary tokens)
- **2026-08-02:** Inbox coverage audit; metas written; **15 photos ingested + WebP prepared**; SLOT_MAP rebound to new asset IDs — **upload waiting on `gcloud auth login`**
  - Details: [`docs/media/INBOX_COVERAGE.md`](../media/INBOX_COVERAGE.md)

See also: `6_ai_runtime_context/OUTSTANDING_TASKS.yaml`
