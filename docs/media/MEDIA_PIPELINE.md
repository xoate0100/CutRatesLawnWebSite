# Envato → GCS Media Pipeline

## Setup (once)

### Envato MCP (global Cursor)

1. Global config already includes:
   ```json
   "envato": { "url": "https://mcp.envato.com/mcp" }
   ```
   in `%USERPROFILE%\.cursor\mcp.json`.
2. Open **Cursor Settings → MCP**.
3. Find **envato** and click **Connect** / authenticate (OAuth).
4. Confirm Envato tools appear for the agent.
5. If auth breaks: Command Palette → **Cursor: Clear All MCP Tokens**, then reconnect.

No Envato tokens belong in this repository.

### Google Cloud CLI

Portable SDK (this machine):

`%LOCALAPPDATA%\google-cloud-sdk\google-cloud-sdk\bin\gcloud.cmd`

Add that `bin` directory to PATH, or set `GCLOUD_PATH` to the full `gcloud.cmd` path.

1. Authenticate (human — browser OAuth; do **not** commit keys):
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```
2. Optional: if using a service-account JSON (outside the repo):
   ```bash
   gcloud auth activate-service-account --key-file=%USERPROFILE%\.credentials\<sa>.json
   ```
3. Validate bucket access (read-only check):
   ```bash
   gcloud storage ls gs://site_photo_storage
   ```

**Auth status (this workstation):** `andy.daniels@cutrateslawn.com` (ADC updated via `--update-adc`).

**Bucket (locked):** `gs://site_photo_storage` (location: US)  
**Existing layout (discovered):**
- Root files: `cutrateshireslogo.png`, several stock lawn/driveway JPGs
- Prefix `images/` → `branding/`, `equipment/`, `hero/`, `partners/`, `results/`, `services/`, `team/`, `testimonials/`
- New pipeline uploads use: `cutrateslawn/{env}/{category}/{slot}/{assetId}/`

**Object prefix (new uploads):** `cutrateslawn/{env}/{category}/{slot}/{assetId}/`  
**Public URL:** `https://storage.googleapis.com/site_photo_storage/<object_key>`

Note: Prefer this interactive user login for media ops. Ads MCP SA keys are separate and may not work for this bucket.

## Operator workflow (per asset)

1. Ask the agent to search Envato MCP for the slot intent (e.g. home hero lawn).
2. Review the shortlist; pick one item.
3. Agent opens the Elements item URL in the browser.
4. You confirm license and download the file into `media/inbox/` (or Downloads — agent can move it).
5. Agent writes a sidecar `*.meta.json` next to the file with Envato metadata.
6. Run:
   ```bash
   npm run media:publish -- --slot home.hero --category hero --usage hero
   ```
7. Confirm `docs/media/MEDIA_REGISTRY.yaml` and `docs/media/SLOT_MAP.yaml` updated.
8. Run `npm run media:validate` and spot-check the page.
9. Commit registry/slot map/code only — never binary inbox/staging/processed files.

## Object key convention

`gs://site_photo_storage/cutrateslawn/{env}/{category}/{slot}/{assetId}/{variant}.{ext}`

Public URL:

`https://storage.googleapis.com/site_photo_storage/<object_key>`

## npm scripts

| Script | Purpose |
|--------|---------|
| `media:ingest` | Inbox → stage + register draft |
| `media:prepare` | Generate WebP variants |
| `media:upload` | Upload to `gs://site_photo_storage` |
| `media:register` | Upsert registry YAML |
| `media:sync-site` | Generate `lib/generated/media-map.json` |
| `media:publish` | Full ingest → prepare → upload → register → sync |
| `media:validate` | Registry integrity + optional URL checks |

## Verification checklist

- [ ] Envato MCP connected in Cursor Settings → MCP (OAuth).
- [x] `gcloud` installed (portable SDK under `%LOCALAPPDATA%\google-cloud-sdk\...`).
- [x] `gcloud auth login` + `gcloud storage ls gs://site_photo_storage` (human auth required).
- [x] Local dry-run: sample inbox image → `npm run media:publish -- --dry-run` → registry row + variants → `media:validate` green.
- [ ] First real upload + public object check (human review before mass placeholder replacement).
- [x] Site pilot slots `home.hero` / `header.logo` resolve via `lib/media.ts` (fallback until asset bound).
- [x] `npm run verify` after wiring.

