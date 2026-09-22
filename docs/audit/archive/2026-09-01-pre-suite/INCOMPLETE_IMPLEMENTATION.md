# Incomplete or Disconnected Implementation

**Audit date:** 2026-08-01

## Keyword scan

| Pattern | App/components/lib/scripts |
|---------|----------------------------|
| TODO / FIXME / HACK | **0** |
| mock / stub | `components/search.tsx` (explicit mock search) |
| temporary | **0** meaningful |
| placeholder.svg refs | **~83+** code/map occurrences; **123** rendered in crawl |

Incomplete work is expressed as **silent client stubs**, not TODO comments.

## Client stubs (no backend)

| Location | Behavior |
|----------|----------|
| `app/contact/page.tsx` | console + alert |
| `app/schedule/page.tsx` | console only |
| `app/quote/page.tsx` | local formula → `$0` |
| `components/live-chat.tsx` | canned agent |
| `components/search.tsx` | hardcoded results |
| `components/footer.tsx` newsletter | no onSubmit |
| `app/blog/page.tsx` newsletter | no onSubmit |
| `app/referral/page.tsx` | Copy without handler; fake URL |
| `app/dashboard/page.tsx` | Hardcoded services; comment admits API/DB missing |

## Missing routes linked from UI

Listed in `SYSTEM_INVENTORY.md` / F-005 (18 paths).

## Missing layers

- No `middleware.ts`
- No `app/api`
- No ORM/DB client
- No auth SDK
- No analytics runtime
- No webhook env consumption
- Loading/empty/error states for async server work: **N/A** (no async server mutations) — forms fake-succeed instead

## Disconnected systems

| System | Disconnected how |
|--------|------------------|
| FieldPortals | Link/redirect only; no SSO/session bridge |
| GCS media | Bucket populated; Next slots still placeholders |
| Envato MCP | Ops-only; not a runtime dependency |
| GA / Resend / contact webhook | Documented in `.env.example` only |

## Duplicated / contradictory UX

- Customer account: FieldPortals vs public `/dashboard`
- Hardscapes vs hardscaping links
- Duplicate About Us nav entries
- Footer privacy promise without `/privacy` page

## Feature flags

`0_phase0_bootstrap/feature_flags.yml` governs **agent write paths**, not product feature toggles. No product flag masks incomplete contact/schedule — they ship enabled as mocks.
