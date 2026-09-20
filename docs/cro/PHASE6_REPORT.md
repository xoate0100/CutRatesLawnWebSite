# Phase 6 — Validation
**Date:** 2026-09-20

## Completed
- Playwright: quote funnel, CRO measurement, termite field snapshot, continuity deep link
- `dataLayer` conversion on thank-you without UTM
- Experiment variant hashed onto events (`lib/analytics/experiment.ts`)
- Docs: MEASUREMENT_PLAN, EXPERIMENT_BACKLOG, EXECUTIVE_SUMMARY

## Deviations
- Full 3-viewport × every service Playwright + Lighthouse CI not run in this agent pass (time/env). Specs exist; Andy should run `pnpm run test:e2e` and Lighthouse locally.
- Vendor analytics conformance still requires attribution (intentional split).

## Merge
- **Do not merge to main** until Andy reviews HUMAN_REQUIRED and e2e (H-CRO-017).
