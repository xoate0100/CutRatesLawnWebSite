# Executive summary — lead journey rebuild

**What was broken:** The site dropped conversions unless someone arrived with an ad click ID, forgot what the homepage estimator already knew, asked every customer the same 36-option lawn form, and never created a CRM opportunity. You could not honestly say which ads or towns produced customers.

**What changed (in code, this branch):**
- Every quote now fires a conversion, tagged paid/organic/direct/referral.
- Homepage numbers carry into `/quote`. Service pages and ads can land on a matching form.
- Pest, snow, lights, and commercial ask the questions those jobs actually need.
- Thank-you pages exist for Ads. Failed deliveries queue when Redis is configured.
- GHL can receive area, click ids, and an opportunity — once secrets and workflows are in place.

**What still needs a human (do not skip):**  
Follow **[HUMAN_FINISH_GUIDE.md](./HUMAN_FINISH_GUIDE.md)** — Vercel secrets, Redis, Cron, GHL SMS workflow, smoke test, then you merge. Do not merge until GHL + Redis + the website-lead SMS are live, or quotes 202/503 again.

**Watch weekly:** thank-you conversions by `traffic_type` and service; speed-to-first-text in GHL; queued leads in Redis; Google Ads URL conversions on `/thank-you`.
