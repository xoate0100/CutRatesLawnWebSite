# Prioritized Findings Register

**Audit date:** 2026-08-01  
Priority: **P0** blocks release; **P1** blocks core journey; **P2** before broad launch; **P3** hardening.

---

## F-001 — Vulnerable Next.js release (critical npm advisory)

1. **Classification:** Confirmed defect.
2. **Severity / priority:** Critical / P0.
3. **Affected:** Runtime dependency `next@14.2.16`.
4. **Reproduction:** `npm audit` from repo root.
5. **Expected:** Supported patched framework.
6. **Actual:** Package severity **critical**; advisories include DoS with Server Actions (`>=14.0.0 <14.2.21`) plus additional via chain; **11** vulns total (1 critical, 9 high, 1 moderate). High includes `sharp`, `lodash`, `glob`/`eslint-config-next`, `brace-expansion`, `minimatch`, `picomatch`, `postcss`.
7. **Evidence:** `npm audit` 2026-08-01; `package.json` pin.
8. **Root cause:** Scaffold version not maintained.
9. **Impact:** Availability / compliance risk on internet-facing deploy.
10. **Resolution:** Upgrade Next + `eslint-config-next` to patched 14.2.x minimum (prefer current supported line); re-run build, crawl, E2E.
11. **Related:** F-017.
12. **Regression:** Full route crawl + Edge E2E + build verify.

---

## F-002 — Contact form success without lead delivery

1. **Confirmed defect.** 2. **High / P1.** 3. `/contact`, prospect.  
4. Submit valid form; watch Network + Console.  
5. Server-validated durable lead + honest UI.  
6. Alert “Thank you…”; fields clear; **no** app XHR/fetch.  
7. `evidence/browser-audit.json` contact-form; `app/contact/page.tsx`.  
8. Prototype handler never connected.  
9. Lost leads, false assurance, PII in console.  
10. Add API/webhook + rate limit + durable UI; remove PII logs.  
11. F-007, F-016, F-018.  
12. Delivery E2E with provider double; validation; outage; duplicate; XSS.

---

## F-003 — Schedule continues without booking

1. **Confirmed.** 2. **High / P1.** 3. `/schedule`.  
4. Select service + date → Continue to Book.  
5. Booking step or confirmation.  
6. No navigation, no success text, no request.  
7. browser-audit schedule probe; `app/schedule/page.tsx`.  
8. Unfinished prototype.  
9. Dead conversion path.  
10. Integrate scheduler/FieldPortals; explicit states.  
11. F-018.  
12. Past date, double click, refresh recovery, provider outage.

---

## F-004 — Public mock dashboard

1. **Confirmed.** 2. **High / P1.** 3. `/dashboard`.  
4. Open anonymously; refresh.  
5. Auth gate or remove.  
6. HTTP 200 “Your Dashboard”; hardcoded 2023 jobs; refresh persists fiction.  
7. dashboard probes; `app/dashboard/page.tsx`.  
8. Demo page left public.  
9. Auth fiction; future leak risk if wired naively.  
10. Redirect to FieldPortals or 404; never expose without authz.  
11. F-005 account/invoice 404s.  
12. Anonymous access must not 200 with account chrome.

---

## F-005 — Eighteen internal links 404

1. **Confirmed.** 2. **High / P1.** 3. Sitewide CTAs.  
4. Crawl `evidence/browser-audit.json` `internalLinkResults`.  
5. Every visible link resolves.  
6. 18 paths 404 (legal, services, bundles, blog, careers apply, account).  
7. Evidence JSON 2026-08-01.  
8. Generated links without pages.  
9. Lost conversion, SEO, legal exposure.  
10. Implement, redirect, or remove each link.  
11. F-007, F-015.  
12. CI link crawl zero unexpected 4xx.

---

## F-006 — Newsletter inert

1. **Confirmed.** 2. **High / P1.** 3. Footer + `/blog`.  
4. Subscribe with email.  
5. Provider subscribe + feedback.  
6. GET reload to `/?`; no success.  
7. newsletter probe.  
8. Form without handler.  
9. Lost subscribers; privacy claim without consent record.  
10. Shared component + server subscribe.  
11. F-007.  
12. Valid/invalid/duplicate/provider timeout.

---

## F-007 — Privacy / terms / sitemap missing

1. **Confirmed.** 2. **High / P1.** 3. Footer legal.  
4. Open `/privacy`, `/terms`, `/sitemap`.  
5. Real policies + sitemap.  
6. 404.  
7. Link crawl.  
8. Footer shipped before pages.  
9. Compliance risk while collecting PII via contact UI.  
10. Publish attorney-reviewed policies; sitemap.xml.  
11. F-002.  
12. Footer links 200; policy content smoke.

---

## F-008 — Quote calculator returns $0

1. **Confirmed.** 2. **High / P1.** 3. `/quote`.  
4. Calculate with defaults.  
5. Credible estimate or “request call”.  
6. `$0 per service`.  
7. quote probes.  
8. Incomplete formula / empty defaults.  
9. Undermines trust.  
10. Fix pricing model or replace with lead form.  
11. F-002.  
12. Known fixtures → expected ranges.

---

## F-009 — Pervasive placeholder imagery

1. **Confirmed.** 2. **High / P2.** 3. Most pages; media slots.  
4. Count `img[src*=placeholder]` on crawl.  
5. Brand/GCS assets.  
6. **123** placeholders; `home.hero` / `header.logo` unbound in media-map.  
7. browser-audit; `lib/generated/media-map.json`.  
8. Scaffold + unfinished media binding.  
9. Unprofessional; GCS inventory unused on site.  
10. Publish via media pipeline; bind SLOT_MAP.  
11. Media pipeline docs.  
12. Hero/logo not placeholder in prod smoke.

---

## F-010 — Site search is mock-only

1. **Confirmed.** 2. **Medium / P2.** 3. Header search.  
4. Search “lawn care”.  
5. Real index or remove.  
6. No navigation; mock results only (`components/search.tsx`).  
7. site-search probe.  
8. Prototype.  
9. Dead-end UX.  
10. Wire search or hide control.  
11. —  
12. Query → expected destinations.

---

## F-011 — Live chat is fake agent

1. **Confirmed.** 2. **Medium / P2.** 3. Chat widget.  
4. Open chat; send message.  
5. Real agent/ticket or honest offline form.  
6. Local canned reply (`components/live-chat.tsx`).  
7. Source + prior live observation.  
8. Prototype.  
9. False expectation of support.  
10. Integrate provider or remove.  
11. F-002.  
12. Message creates ticket ID.

---

## F-012 — Referral copy control inert

1. **Confirmed.** 2. **Medium / P2.** 3. `/referral`.  
4. Click Copy.  
5. Clipboard + feedback.  
6. No “copied” UI; button lacks working handler.  
7. adversarial referral-copy.  
8. Incomplete UI.  
9. Broken growth loop.  
10. Implement clipboard + toast; real referral codes.  
11. —  
12. Clipboard contains expected URL.

---

## F-013 — Social links are `#`

1. **Confirmed.** 2. **Low / P3.** 3. Footer.  
4. Click Facebook/Twitter/Instagram/LinkedIn.  
5. Real profiles or hide.  
6. Same-page `#` anchors.  
7. a11y snapshot.  
8. Placeholder hrefs.  
9. Dead ends.  
10. Real URLs or remove.  
11. —  
12. External href smoke.

---

## F-014 — No application API / persistence layer

1. **Confirmed.** 2. **High / P1** (architectural). 3. Entire conversion surface.  
4. Inspect repo + API guesses.  
5. Server actions/API for leads at minimum.  
6. Zero `app/api`; forms client-only.  
7. Inventory + adversarial api-guess.  
8. Marketing scaffold scope.  
9. Cannot complete J2–J5 honestly.  
10. Introduce minimal lead API or external form endpoint.  
11. F-002–F-006.  
12. Contract tests for lead API.

---

## F-015 — Hardscape path naming inconsistency

1. **Confirmed.** 2. **Medium / P2.** 3. Services CTAs.  
4. Compare `/services/hardscapes` vs `/services/hardscaping` — both 404.  
5. One canonical route.  
6. Both linked variants missing.  
7. Link crawl.  
8. Inconsistent generated labels.  
9. SEO/duplicate intent.  
10. Pick canonical + redirects.  
11. F-005.  
12. Canonical 200; alias 301.

---

## F-016 — Contact logs PII to browser console

1. **Confirmed.** 2. **Medium / P2.** 3. `/contact`.  
4. Submit; open DevTools console.  
5. No PII in logs.  
6. `console.log("Form submitted:", formData)`.  
7. Source.  
8. Debug leftover.  
9. Shared-device / support-leak risk.  
10. Remove; server-side structured logs only.  
11. F-002.  
12. Console assert no email/phone after submit.

---

## F-017 — Additional high-severity transitive vulns

1. **Confirmed.** 2. **Medium / P2.** 3. Tooling/runtime deps.  
4. `npm audit`.  
5. No high/critical without waiver.  
6. High: sharp, lodash, glob chain, brace-expansion, minimatch, picomatch, postcss; moderate babel runtime.  
7. npm audit 2026-08-01.  
8. Transitive drift.  
9. Supply-chain / DoS surface varies.  
10. `npm audit fix` where safe; pin upgrades.  
11. F-001.  
12. CI audit gate with allowlist.

---

## F-018 — FieldPortals authorization unvalidated

1. **Unvalidated risk** (redirect confirmed). 2. **High / P1** for release claiming customer accounts. 3. External portal.  
4. Requires test accounts (not performed).  
5. Role isolation, session expiry, recovery proven.  
6. Only landing redirect proven.  
7. portal-redirect probe.  
8. Out of band system.  
9. Real customer data risk unknown.  
10. Vendor security review + negative tests.  
11. F-004.  
12. Portal E2E with two customers.

---

## F-019 — Production unknown routes (revalidated)

1. **Prior defect (2026-07-21):** missing routes under dirty/corrupt `.next` could 500.  
2. **Revalidation 2026-08-01:** After clean `next build` + `next start -p 3002`, `/privacy`, `/terms`, `/account`, and `/this-route-does-not-exist-audit` returned **HTTP 404** (not 500). `/dashboard` still **200** (F-004).  
3. **Severity / priority now:** Medium / P2 (ops hygiene) — prior P1 500 issue **not reproduced** on clean build.  
4. **Residual risk:** Concurrent `next build` while `next dev` holds `.next` caused widespread prerender `TypeError: e[o] is not a function` in this audit session — treat as confirmed build-hygiene defect.  
5. **Resolution:** Always clean-build for release artifacts; never share `.next` between concurrent dev and build; keep CI on fresh checkout.  
6. **Regression:** Prod smoke — known-missing → 404 only; fail if 5xx.
7. **Related:** F-005.

---

## F-020 — Media pipeline present but site still on placeholders

1. **Confirmed.** 2. **Medium / P2.** 3. Media + home/header.  
4. Inspect media-map; homepage images.  
5. Bound GCS URLs for pilot slots.  
6. Slots `asset_id: null`; fallbacks placeholder. Bucket already has `images/hero` etc unused by Next slots.  
7. `lib/generated/media-map.json`; gcloud ls prior session.  
8. Pipeline shipped; binding not done.  
9. Dual asset systems; wasted ops.  
10. Bind or import existing GCS objects into registry/SLOT_MAP.  
11. F-009.  
12. Hero src host `storage.googleapis.com`.

---

## F-021 — Homepage CTAs to missing service routes

1. **Confirmed.** 2. **High / P1.** 3. `/` gutter/hardscapes/snow + bundles.  
4. Click Learn More / Subscribe Now.  
5. Working pages.  
6. Links to 404 destinations (live a11y tree).  
7. Chrome snapshot + link crawl.  
8. Same as F-005, homepage-critical.  
9. Primary funnel breakage.  
10. Fix or retarget CTAs first.  
11. F-005.  
12. Homepage link subset must 200.

---

## F-022 — Duplicate “About Us” in primary nav

1. **Confirmed.** 2. **Low / P3.** 3. Header.  
4. Inspect nav.  
5. Single clear About entry.  
6. Dropdown + sibling link both “About Us”.  
7. Chrome snapshot.  
8. Nav composition bug.  
9. Clutter/confusion.  
10. Deduplicate.  
11. —  
12. Nav label uniqueness snapshot.

---

## F-023 — Careers apply dead end

1. **Confirmed.** 2. **Medium / P2.** 3. `/careers` → `/careers/apply`.  
4. Apply CTA.  
5. Application form or mailto.  
6. 404.  
7. Link crawl.  
8. Missing page.  
9. Lost applicants.  
10. Implement apply or mailto.  
11. F-005.  
12. Apply path 200.

---

## F-024 — Business claims without evidence trail

1. **Suspected / content risk.** 2. **Medium / P2.** 3. Home “100% Satisfaction Guarantee”, certifications, fake reviews.  
4. Read marketing copy.  
5. Substantiated claims.  
6. Hardcoded testimonials dated 2023; certification pages placeholder-heavy.  
7. `app/page.tsx` reviews; certifications page.  
8. Scaffold content.  
9. Legal/marketing risk.  
10. Owner review; replace with approved copy/assets.  
11. F-009.  
12. Content checklist gate.

---

## F-025 — Google Maps embed uses opaque place IDs / third-party key traffic

1. **Suspected / ops.** 2. **Low / P3.** 3. `/contact` map.  
4. Network on contact.  
5. Owned Maps key with referrer lock, accurate place.  
6. Embed loads; Maps requests include a Google key query param (Maps platform).  
7. browser-audit network snippets.  
8. Stock embed.  
9. Key abuse if unrestricted; wrong pin risk.  
10. Create project key + restrict; verify coordinates.  
11. —  
12. Map smoke + key restriction checklist.
