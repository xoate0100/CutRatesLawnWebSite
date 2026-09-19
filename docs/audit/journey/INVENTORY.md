# Journey Audit — Inventory

**Domain:** `audit-journey`  
**Mode:** discovery (read-only)  
**Audited:** 2026-09-01

## Primary user journeys

### 1. Home → Quote (prospect)

| Step | Route / action | Component | Backend |
|------|----------------|-----------|---------|
| Land | `/` | Home blocks, hero CTAs | — |
| Navigate | `/quote` or sticky chip | `StickyQuoteBar`, header CTA | — |
| Funnel step 1 | Details | `QuoteFunnel` — property, service, size | `lib/pricing/estimate` |
| Step 2 | Estimate | Calculated range display | client-side |
| Step 3 | Contact | Name, email, phone | `POST /api/lead` |
| Step 4 | Done | Confirmation + requestId | GHL / webhook / Resend fallback |

Entry params: `?service=` from service pages maps via `serviceFromQuery()`.

### 2. Home → Contact

| Step | Route | Component | Backend |
|------|-------|-----------|---------|
| Land | `/contact` | `InteriorHero`, `ContactFormBlock` | — |
| Submit | Form | Validates name, email, message | `POST /api/lead` (`source: "contact"`) |
| Alt paths | Phone, email, map | `InfoList`, `MapBand` | `tel:`, `mailto:` |
| CTA escape | Bottom | `CTASection` → `/quote` | — |

### 3. Careers browse → Apply (applicant)

| Step | Route | Component | Backend |
|------|-------|-----------|---------|
| Discover | `/careers` | Hero, job cards, tools | — |
| Job card CTA | `/careers/apply?job={id}` | `OpenJobCards` | — |
| Inline apply | `#apply` on careers page | `CareersApplyForm` (4 steps) | **`mailto:` only** |
| Dedicated apply | `/careers/apply` | `CareersApplyClient` → same form | **`mailto:` only** |
| Fallback | SMS / phone | `siteConfig.phone` | native handlers |

**Gap:** No `/api/lead` or careers-specific API — applications depend on user email client.

### 4. Mobile paths

| Mechanism | File | Notes |
|-----------|------|-------|
| Mobile nav | `site-header.tsx` | Full NAV_LINKS including Careers |
| Sticky quote chip | `sticky-quote-bar.tsx` | Bottom-left; hidden on quote |
| Live chat help | `live-chat.tsx` | Bottom-right after scroll; links to quote/contact |
| Main bottom pad | `layout.tsx` | `pb-24` clears sticky chip |
| Quote page | — | Sticky bar + chat suppressed |

## Journey test scripts

| Script | Journeys exercised |
|--------|-------------------|
| `adversarial-responsive-journey.mjs` | Scroll + viewport matrix; home CTA focus path; quote funnel load |
| `adversarial-wave2.mjs` | Menu open, quote stepper width, sticky/chat collision, galaxy-fold home |
| `pre-release-browser-audit.mjs` | Includes `/careers` in route list |
| `ci-link-smoke.mjs` | `/careers/apply` HTTP 200 |

## Navigation graph (simplified)

```
/ ──┬── /quote ── [4-step funnel] ── /api/lead
    ├── /contact ── [form] ── /api/lead
    ├── /careers ──┬── #apply ── mailto:
    │              └── /careers/apply?job= ── mailto:
    └── /services/* ── ?service= ── /quote
```

## Integration touchpoints

| Journey | Integration | Config-dependent |
|---------|-------------|------------------|
| Quote submit | GHL, webhook, Resend | `app/api/lead/route.ts` |
| Contact submit | Same `/api/lead` | Same |
| Careers apply | User MUA via `mailto:` | No server capture |
| Newsletter | `/api/newsletter` | Separate path |
