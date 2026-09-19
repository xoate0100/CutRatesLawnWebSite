# Conversion — Findings

**Mode:** discovery (read-only) | **Date:** 2026-09-01

## Summary

| Priority | Open |
|----------|------|
| P0 | 0 |
| P1 | 1 |
| P2 | 4 |
| P3 | 2 |

---

### F-CONV-001 — Production lead delivery not fully configured

| Field | Value |
|-------|-------|
| Priority | **P1** |
| Area | Funnel capture |
| Status | Open (blocked on `GHL-OPS-001`) |

**Evidence:** `app/api/lead/route.ts` returns 503 with `manualContactRequired: true` when GHL, webhook, and Resend are all unset. `OUTSTANDING_TASKS.yaml` lists `GHL-OPS-001`, `GHL-WF-001`, `GHL-TEST-001` as pending.

**Impact:** Quote and contact submissions may fail silently from the visitor's perspective after form completion in production.

---

### F-CONV-002 — Schedule funnel does not capture leads via API

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Funnel completeness |
| Status | Open |

**Evidence:** `app/schedule/page.tsx` builds `mailto:` links or redirects to `/contact?service=&preferredDate=` — no `POST /api/lead` integration.

**Impact:** High-intent scheduling visitors may abandon if mail client unavailable; no CRM record created.

---

### F-CONV-003 — Careers apply uses mailto only

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Funnel capture |
| Status | Open |

**Evidence:** `components/careers/apply-form.tsx` `submit()` sets `window.location.href = mailto:...`.

**Impact:** Mobile users without configured email lose the application; no GHL tag (`careers-applicant`) or staff notification.

---

### F-CONV-004 — Competing primary CTAs on key pages

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | CTA discipline |
| Status | Open |

**Evidence:** Global `SiteHeader` quote CTA + `StickyQuoteBar` + page-level `QuoteBand`/`CTASection` on home and service pages. Responsive audits flag sticky overlay covering content (`artifacts/audit/local-summary.json` TEXT-UNDER findings).

**Impact:** Visual competition and mobile occlusion may reduce completion rate.

---

### F-CONV-005 — Pricing page static plans may not match quote estimator

| Field | Value |
|-------|-------|
| Priority | **P2** |
| Area | Message match |
| Status | Open |

**Evidence:** `app/pricing/page.tsx` shows `$99/month` Basic and `$199/month` Premium. Quote funnel uses `lib/pricing/estimate.ts` per-visit logic with different service types.

**Impact:** Scent break between pricing page promises and quote estimate may erode trust.

---

### F-CONV-006 — Legacy fallback CTAs point to `/contact` not `/quote`

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | CTA consistency |
| Status | Open |

**Evidence:** `lib/fallback-data.ts` and `lib/static-data.ts` `ctaContent.secondaryButtonLink` use `/contact` while redesign blocks favor `/quote`.

**Impact:** Inconsistent primary action when CMS/fallback data paths are hit.

---

### F-CONV-007 — Rejected phrase lint not enforced in CI for all careers surfaces

| Field | Value |
|-------|-------|
| Priority | **P3** |
| Area | Copy governance |
| Status | Open |

**Evidence:** `tests/e2e/careers-tools.spec.ts` checks 3 phrases on `/careers` only. `docs/cut_rates_careers_copy_guidelines.yaml` defines 15+ reject phrases; `/careers/apply` not covered.

**Impact:** Apply page could drift from governance without detection.
