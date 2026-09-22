# KPI definitions — weekly website report

| KPI | Definition | Source |
|-----|------------|--------|
| Website leads (complete) | Contacts created in-week with tag `website-lead` and without `lead-status:partial` | GHL |
| Website leads (partial) | Same with `lead-status:partial` | GHL |
| GA4 conversion_lead | Count of `conversion_lead` events in week | GA4 |
| Phone clicks | Count of `conversion_phone_click` (or `phone_click` if renamed in GTM) | GA4 |
| Contacts (north-star) | complete+partial GHL leads; falls back to GA4 conversion_lead if GHL API fails | GHL/GA4 |
| Sessions / users / engaged rate | Standard GA4 metrics | GA4 |
| Channel split | `sessionDefaultChannelGroup` sessions | GA4 |
| Top landings | `landingPagePlusQueryString` by sessions | GA4 |
| Quote funnel | `funnel_quote_start` → `funnel_quote_complete` | GA4 |
| GSC clicks/impressions/CTR/position | Search Analytics totals for property | GSC |
| Tracked queries | Configurable list in Script Properties / Config defaults | GSC |
| Cost per contact | `MONTHLY_FEE_USD × 12 / 52 ÷ contacts` when fee set; else omitted until Ads wired | Config |

Missing inputs print a Health line — never invent zeros as “success”.
