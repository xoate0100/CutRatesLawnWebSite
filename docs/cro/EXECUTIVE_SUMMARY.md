# Executive summary — lead journey rebuild

**What was broken:** The site dropped conversions unless someone arrived with an ad click ID, forgot what the homepage estimator already knew, asked every customer the same 36-option lawn form, and never created a CRM opportunity. You could not honestly say which ads or towns produced customers.

**What changed (in code, this branch):**
- Every quote now fires a conversion, tagged paid/organic/direct/referral.
- Homepage numbers carry into `/quote`. Service pages and ads can land on a matching form.
- Pest, snow, lights, and commercial ask the questions those jobs actually need.
- Thank-you pages exist for Ads. Failed deliveries queue when Redis is configured.
- GHL can receive area, click ids, and an opportunity — once secrets and workflows are in place.

**What still needs a human (do not skip):**
1. Paste GHL and Upstash keys into Vercel (`docs/cro/HUMAN_REQUIRED.md`).
2. Build the GHL SMS workflow from `docs/cro/GHL_WORKFLOWS.md`.
3. Legal glance at the consent banner.
4. Confirm we actually serve every town × service combo we generated.
5. Do not merge to production until 1–2 are done, or quotes 202/503 again.

**Watch weekly:** thank-you conversions by `traffic_type` and service; speed-to-first-text in GHL; queued leads in Redis; Google Ads URL conversions on `/thank-you`.
