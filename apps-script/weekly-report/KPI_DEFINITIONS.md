# KPI definitions — weekly website report

Every number in the Monday email must map to a real query. Missing dimensions print a Health note and fall back to an unsplit total — never invent zeros as success.

| KPI | Exact source / filter | Notes |
|-----|----------------------|--------|
| Website contacts (north-star) | GHL `website-lead` in window (complete + partial); fallback GA4 `conversion_lead` if GHL errors | Used in subject line and value block |
| Quote leads | GA4 `conversion_lead` where `customEvent:lead_source == quote` | Requires dimension registration |
| Contact leads | GA4 `conversion_lead` where `customEvent:lead_source == contact` | Same |
| Newsletter signups | GA4 `newsletter_signup` | Labeled **not a lead** |
| Phone taps | GA4 `phone_click`, split by `customEvent:click_location` when available | |
| Quote starts | GA4 `form_start` where `customEvent:form_id == quote` | Not all `form_start` |
| Quote funnel steps | GA4 `funnel_step_view` by `customEvent:step_name` | Drop-off shown step-to-step |
| Quote completes | GA4 `conversion_lead` + `lead_source == quote` | Distinct from newsletter |
| GHL complete / partial | LeadConnector Search Contacts: tag `website-lead` + `dateAdded` `operator:range` value `{gte,lt}`; paginated | Undated contacts skipped |
| GHL estimate sum | Contact custom field if present in `lib/ghl.ts`; else `null` (not 0) | Opportunity monetaryValue is not a contact field |
| Sessions / users / engaged | GA4 standard metrics | |
| Channel split | `sessionDefaultChannelGroup` sessions | |
| Top landings | `landingPagePlusQueryString`, `orderBys` sessions desc, server `limit` | |
| GSC clicks / impressions / CTR | Search Analytics `dataState: all` | Includes recent non-final days |
| GSC avg position | Weighted: `sum(position * impressions) / sum(impressions)` | |
| Tracking cost / contact | `MONTHLY_FEE_USD * 12 / 52 / contacts` | Omitted if contacts = 0 |
| Value block | Real contacts + cost/contact + optional estimateSum + WoW / 4-week avg from Sheet | "Not yet measurable" if inputs missing |

## Health notes (expected early)

- Unregistered custom dimensions → unsplit totals + "run ensureGa4CustomDimensions()"
- GTM not publishing site events → leads/phone/funnel read 0 until `runAllWiring`
- First email week (2026-10-05..11) may have partial splits if dimensions/GTM went live mid-week
