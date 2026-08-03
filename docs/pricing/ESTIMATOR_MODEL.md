# Quote Estimator Pricing Model

**Purpose:** Map website `/quote` planning math to CFO / CRL authority sources.  
**Implementation:** `lib/pricing/estimate.ts`  
**Tests:** `npm run test:pricing`

## Authority sources

| Service | Source | Rule used on site |
|---------|--------|-------------------|
| Residential mowing | `Updated_Services_Pricing_Model.csv` | Green Standard **$45** / Complete **$65** / Premier **$85** per visit up to ¼ acre (~10,890 sq ft) |
| Commercial mowing | `CRL_ProposalGeneration` / `greenbriermc.md` | `max(1, sqFt × 0.00009)` person-hrs × **$30**/hr ÷ **0.2476** × **0.85** recurring |
| Fertilization | `CRL_Lights_Landing` KC-Fert | **$35**/mo ≤ 5,000 sq ft; +**$1.40**/mo per 100 sq ft above 5,000 |
| Margin / labor | `Financial_Operating_Structure_2026.md` | Loaded labor ~$30/hr; Price = costs / (1 − target GM) |

## Display units

- Mowing → **per visit** (bi-weekly does **not** discount the visit rate)
- Fertilization → **per month** (program)
- Weed control → **per treatment**
- Full service → **per month** (Complete mow visit rate × visits/mo + fert program)

## Not binding

Estimates are planning numbers only. Site conditions, access, and add-ons change final pricing.
