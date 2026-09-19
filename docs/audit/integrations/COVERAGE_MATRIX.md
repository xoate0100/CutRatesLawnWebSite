# Integrations Audit — Coverage Matrix

**Mode:** discovery | **Date:** 2026-09-01

| Area | Ran? | Method | Result |
|------|------|--------|--------|
| GHL auth / token presence (local contract) | Yes | examine `.env.example`, `lib/ghl.ts` | Server-only vars documented; prod Vercel set **unconfirmed** |
| GHL upsert + tag flow | Yes | examine `lib/ghl.ts`, `/api/lead` | Implemented; workflows **not built** in GHL |
| GHL Vercel production env | Yes | examine `OUTSTANDING_TASKS.yaml`, `GOHIGHLEVEL.md` | **GHL-OPS-001 pending** |
| FieldPortals link/redirect | Yes | examine `app/portal/page.tsx`, e2e refs | Redirect confirmed in prior audits |
| FieldPortals authz (login, IDOR, MFA) | No | interview / vendor test accounts | **Unvalidated** — out of repo scope |
| Vercel deploy integration | Yes | examine `vercel.json` | Framework nextjs; npm install override |
| GA4 / analytics | Yes | grep codebase | **Not wired** |
| Consent before analytics | N/A | — | No analytics to gate |
| Turnstile spam gate | Yes | examine `/api/lead` | Optional bypass when secret unset |
| Resend / webhook fallbacks | Yes | examine lead routes | Multi-channel with OR success semantics |
| Google Places reviews | Yes | examine `/api/google-reviews` | Server proxy; env required |
| Strapi CMS | Yes | examine `lib/api*.ts`, health routes | Legacy; not primary content path |
| Legacy `/api/contact` | Yes | examine route | Stub only |
| Third-party browser scripts | Yes | examine `app/layout.tsx`, live-chat | No GA/GTM; fonts via next/font |
| Webhook signature verification | Yes | examine webhook fetch calls | **No HMAC/signature** on outbound webhooks |
| Rate limits / idempotency | Yes | examine `/api/lead` | In-memory maps (serverless caveat) |
| Partial-failure handling | Yes | examine `deliverLead` | Returns 503 if **all** channels fail; partial success OK |
| LeadConnector MCP (operator) | Yes | examine docs | Documented; not runtime |

**Coverage:** 14/16 areas examined in-repo; 2 require dashboard/vendor access (Vercel env values, FieldPortals authz).
