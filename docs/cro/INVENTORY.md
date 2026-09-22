# CRO live-surface inventory

**Mode:** discovery (read-only) · **Date:** 2026-09-20 · **Branch:** `cro/phase-0-recon`

Recon of what actually renders on conversion paths. Dead copies are listed here as *dead* and expanded in `DEAD_CODE.md`. Finding IDs live in `FINDINGS.md`.

## Funnel as shipped

```
app/layout.tsx
  ├─ GtmScript / GtmNoScript          (env-gated)
  ├─ AnalyticsProvider                page_view + sessionStorage UTM/gclid
  ├─ SiteHeader (blocks)              /quote + tel (tracked)
  ├─ StickyQuoteBar (blocks)          mobile chip → /quote (no call)
  ├─ LiveChat                         FAB bottom-right → contact help
  └─ SiteFooter (blocks)              tel (untracked) + service links

Homepage (app/page.tsx)
  ├─ Hero CTA                         → /quote
  ├─ ServiceGrid                      "Learn more" → /services/<slug>
  ├─ QuoteBand estimator              → /quote?size=&property=&frequency=  (no service)
  ├─ AreaChips                        → /service-areas/<slug>
  ├─ BundleCards                      → /quote?bundle=<id>
  └─ CTASection (blocks)              → /quote + tel

Service page (explicit app/services/<slug> or [slug] aliases)
  └─ ServiceDetailView
       InteriorHero + CTASection      → /quote?service=<id> + tel

Area page (app/service-areas/[slug]/page.tsx)
  └─ InteriorHero                     → /quote?area=<slug>
  └─ ServiceGrid                      SERVICES.slice(0, 7)

/quote (app/quote/page.tsx)
  └─ QuoteFunnel                      Details → Estimate|Contact → Done (client state)
       POST /api/lead                 → GHL upsert + tags (if env set)

/contact
  └─ ContactFormBlock                 POST /api/lead (source:contact)

/schedule
  └─ mailto: or /contact?service=&preferredDate=   (no /api/lead)

/pricing
  └─ static $99 / $199 cards          CTASection (legacy components/cta-section)

/bundles/[slug]
  └─ QuoteForm (components/quote-form.tsx)   fake success via lib/api-helpers
```

## 1. Chrome: which tree is live

| Surface | Live file | Wired from | Dead copies |
|---|---|---|---|
| Root layout | `app/layout.tsx` | Next App Router | — |
| Header | `components/blocks/site-header.tsx` | `app/layout.tsx` | `components/header.tsx`, `components/site-header.tsx`, `components/layout/header.tsx` |
| Mobile nav | inline in `blocks/site-header.tsx` | same | `components/mobile-nav.tsx` (only imported by dead `components/site-header.tsx`) |
| Footer | `components/blocks/site-footer.tsx` | `app/layout.tsx` | `components/footer.tsx`, `components/site-footer.tsx`, `components/layout/footer.tsx` |
| Sticky quote CTA | `components/blocks/sticky-quote-bar.tsx` | `app/layout.tsx` | none |
| Live chat FAB | `components/live-chat.tsx` | `app/layout.tsx` (dynamic, `ssr: false`) | none |
| Analytics boot | `components/analytics/analytics-provider.tsx` | `app/providers.tsx` | none |
| GTM tags | `components/analytics/gtm-script.tsx` | `app/layout.tsx` | none |
| CTA band (redesign) | `components/blocks/cta-section.tsx` | home, services, areas, quote-adjacent pages | `components/cta-section.tsx` still **live** on pricing / bundles / referral / community / certifications / case-studies / `services/all` |

## 2. Service routes: explicit vs `[slug]`

Next.js App Router prefers a **static segment** over a dynamic `[slug]` for the same URL.

| Pattern | File | Reachable? |
|---|---|---|
| Explicit | `app/services/<slug>/page.tsx` | **Yes — wins** for: `aeration`, `commercial`, `gutter-cleaning`, `hardscaping`, `holiday-lights`, `landscaping`, `lawn-care`, `pest-control`, `power-washing`, `residential`, `snow-removal` |
| Dynamic | `app/services/[slug]/page.tsx` | **Yes — aliases only.** `generateStaticParams()` repeats the same `SERVICES` ids (redundant with explicit files). Aliases from `SERVICE_SLUG_ALIASES` in `lib/marketing-content.ts` have no explicit file, so `[slug]` serves e.g. `/services/termites`, `/services/mowing`, `/services/snow`. |
| Index | `app/services/page.tsx` | Live ServiceGrid + CTA |
| Legacy list | `app/services/all/page.tsx` | Live, uses **legacy** `components/cta-section.tsx` |

Both explicit and `[slug]` render the same `ServiceDetailView`. Editing either page file without the other does not change the shared view; editing a dead header/form would.

## 3. Quote / contact forms: which post, which track

| File | Live? | Used by | Posts to | Tracks |
|---|---|---|---|---|
| `components/quote/quote-funnel.tsx` | **Live** | `app/quote/page.tsx` | `POST /api/lead` (`source:quote`) | `funnel_step_view`, `conversion_lead` (gated — F-CRO-101) |
| `components/quote-form.tsx` | **Live (legacy)** | `app/bundles/[slug]/page.tsx` | `submitQuoteRequest` in `lib/api-helpers.ts` — **simulated success, no CRM** | none |
| `components/forms/quote-form.tsx` | Dead | no importers | `lib/api` simulated quote | none |
| `components/blocks/contact-form-block.tsx` | **Live** | `app/contact/page.tsx`, `app/dev/components/page.tsx` | `POST /api/lead` (`source:contact`) | **none** |
| `components/forms/contact-form.tsx` | Alias | no importers found | re-exports `ContactFormBlock` | n/a |
| `components/contact-form.tsx` | Dead | no importers | own toast/zod form, not `/api/lead` | none |
| `components/newsletter-signup.tsx` | **Live** | `app/blog/page.tsx` (and dead `components/footer.tsx`) | `POST /api/newsletter` | none |
| `components/newsletter-form.tsx` | Dead | no importers | unknown | none |
| `components/careers/apply-form.tsx` | Live (out of CRO scope) | careers apply | `POST /api/lead` (`source:careers`) + mailto backup | none |
| `app/schedule/page.tsx` | Live | `/schedule` | **no API** — `mailto:` or `/contact?...` | none |

## 4. Conversion surfaces (CTA, phone, funnel)

| Surface | File | Destination | Analytics |
|---|---|---|---|
| Header quote (desktop/mobile) | `blocks/site-header.tsx` | `/quote` | none on the button |
| Header phone desktop | same | `tel:` | `phone_click` `header_desktop` |
| Header phone mobile menu | same | `tel:` | `phone_click` `header_mobile` |
| Sticky chip | `blocks/sticky-quote-bar.tsx` | `/quote` | none; **no tel**; `md:hidden`; hidden on `/quote` |
| Live chat FAB | `live-chat.tsx` | opens contact card | none; `z-50` bottom-right vs sticky `z-40` bottom-left |
| Home hero quote | `blocks/hero.tsx` | `/quote` | none |
| Home QuoteBand | `blocks/quote-band.tsx` | `/quote?size=&property=&frequency=` | none |
| Service card | `blocks/service-grid.tsx` | `/services/<slug>` only | none |
| Feature card CTA copy | same | landscaping href | hardcoded “Explore landscaping” |
| Service hero + footer CTA | `service-detail-view.tsx` | `/quote?service=<id>` | `service_view` via `ServiceViewTracker` |
| Interior hero / CTA tel | `interior-hero.tsx`, `cta-section.tsx` | `tel:` | **untracked** |
| Footer tel | `blocks/site-footer.tsx` | `tel:` | **untracked** |
| Area hero | `app/service-areas/[slug]/page.tsx` | `/quote?area=<slug>` | `area_view` |
| Bundles marketing | `lib/marketing-content.ts` `BUNDLES` | `/quote?bundle=<id>` | funnel ignores `bundle` |
| Quote funnel submit | `quote-funnel.tsx` | `/api/lead` | `conversion_lead` after HTTP 200, then dropped if no UTM/gclid |
| Contact submit | `contact-form-block.tsx` | `/api/lead` | none |
| `AnalyticsPhoneLink` | `components/analytics/phone-link.tsx` | `tel:` | **component unused** |

## 5. Lead API + CRM

| Piece | File | Behavior |
|---|---|---|
| Lead ingest | `app/api/lead/route.ts` | Zod `leadSchema`; honeypot; Turnstile optional; in-memory `seenKeys` + `ipHits`; 503 + `manualContactRequired` if GHL/webhook/Resend all unset |
| Schema fields | same | name, email, phone, service, message, source, idempotencyKey, honeypot, turnstile, estimate/lawn/property/frequency/address. **No UTM, gclid, landing, referrer, area, session, device** |
| CRM | `lib/ghl.ts` | `contacts/upsert` then `POST /contacts/{id}/tags`. Tags: `website-lead`, `source:<slug>`, `service:<slug>`, plus `GHL_LEAD_TAGS`. Optional `GHL_CF_*` custom fields. **No opportunity create** |
| Newsletter | `app/api/newsletter/route.ts` | email + consent; separate in-memory `seen` Map; GHL if configured |
| Estimator math | `lib/pricing/estimate.ts` | CFO authority — **do not change rates**. Used by QuoteBand + QuoteFunnel. QuoteForm on bundles does not use it |

## 6. Query params the funnel actually reads

`quote-funnel.tsx` hydrates **only** `?service=` via `serviceFromQuery()`.

| Param | Sent by | Consumed? |
|---|---|---|
| `service` | service pages, offerings | **Yes** |
| `size` | QuoteBand | No |
| `property` | QuoteBand | No |
| `frequency` | QuoteBand | No |
| `area` | area pages | No |
| `bundle` | BundleCards | No |

## 7. Service picker size

`SERVICE_LABELS` = 4 estimate keys (`mowing`, `fertilization`, `weed-control`, `full-service`) + 32 consult keys = **36** ungrouped `SelectItem`s (Part A said 35; residential + extra consult keys are present).
