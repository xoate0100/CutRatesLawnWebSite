# Quote form schema

Add a service by editing **data**, not the React tree.

1. `lib/quote/taxonomy.ts` — add `QUOTE_SERVICES` row (`id` must match a `GHL_SERVICE_LABELS` key).
2. `lib/quote/service-schema.ts` — assign `QuoteField[]` for that id. Every CRM-bound field has `sendToCrm: true`.
3. `fieldsForService` + `crmKeysForService` automatically omit lawn defaults for consult jobs (F-CRO-302).
4. Run `pnpm run test:analytics` so taxonomy still covers `SERVICES` slugs.

Field types: `text | tel | email | number | select | radio | chips | slider | textarea | multiselect`.

Identity (name + mobile required, email optional) lives in `IDENTITY_FIELDS`. Address, urgency, and self-reported source are `SHARED_FIELDS`.
