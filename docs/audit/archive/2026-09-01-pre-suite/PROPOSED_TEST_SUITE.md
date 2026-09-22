# Proposed Automated E2E and Regression Suite

**Audit date:** 2026-08-01

## Release-blocking (CI on every PR)

| Suite | Assert |
|-------|--------|
| `verify` | Build + governance gates |
| Route HTTP 200 | All inventory routes in `SYSTEM_INVENTORY` |
| Internal link crawl | Zero unexpected 4xx from rendered `a[href^="/"]` |
| Contact | Invalid email blocked; valid submit **must** hit API test double (fail if only alert) |
| Schedule | Continue produces booking intent API or documented external redirect |
| Dashboard | Anonymous must **not** receive authenticated chrome (expect 401/302/404) |
| Legal | `/privacy`, `/terms` 200 |
| npm audit | Fail on critical; high allowlist reviewed |
| Prod smoke (post-build) | Known-missing path returns **404**, never 500 |

## Nightly / staging

| Suite | Assert |
|-------|--------|
| FieldPortals | Login, logout, session expiry, customer A cannot see B |
| Media | Bound hero/logo URLs 200 from `storage.googleapis.com` |
| Newsletter | Provider sandbox subscribe |
| Accessibility | axe on home/contact/quote/schedule |
| Visual | Hero not placeholder |
| Adversarial | XSS payload escaped; oversized message rejected server-side; duplicate idempotency |

## Existing assets to extend

- `tests/e2e/prospect-journey.spec.ts`
- `tests/e2e/resilience.spec.ts`
- `scripts/pre-release-browser-audit.mjs`
- `scripts/adversarial-audit-probes.mjs` (new)

Wire audit scripts into `package.json` as `audit:browser` / `audit:adversarial` and fail CI on broken link count > 0 once Phase 2 lands.
