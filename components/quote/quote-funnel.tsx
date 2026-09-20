"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TurnstileField } from "@/components/forms/turnstile-field"
import { ServicePicker } from "@/components/quote/service-picker"
import { FieldRenderer } from "@/components/quote/field-renderer"
import { siteConfig } from "@/lib/site-config"
import {
  calculateEstimate,
  LAWN_SIZE_UI,
  type EstimateResult,
  type Frequency,
  type MowTier,
  type PropertyType,
  type ServiceType,
} from "@/lib/pricing/estimate"
import { useAnalytics } from "@/hooks/useAnalytics"
import { getAttributionPayload } from "@/lib/analytics/core"
import {
  mergeFunnelParams,
  parseFunnelSearch,
  readStoredFunnelParams,
  writeStoredFunnelParams,
} from "@/lib/funnel/params"
import {
  GHL_SERVICE_LABELS,
  getQuoteService,
  isEstimable,
  resolveQuoteService,
  type QuoteCategoryId,
  type QuoteServiceId,
} from "@/lib/quote/taxonomy"
import { SHARED_FIELDS, fieldsForService, IDENTITY_FIELDS, crmKeysForService } from "@/lib/quote/service-schema"
import { areaLabel, qualifyAddress } from "@/lib/quote/qualify-area"
import { isValidMobile, maskUsPhone, normalizeE164, splitName } from "@/lib/quote/identity"

type Step = "service" | "details" | "estimate" | "contact"

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `quote-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function consultExpectation(id: QuoteServiceId): { title: string; body: string; starting?: string } {
  const map: Partial<Record<QuoteServiceId, { title: string; body: string; starting?: string }>> = {
    termites: {
      title: "On-site termite plan",
      body: "We look at the foundation and activity, then confirm a treatment plan — usually within one business day.",
    },
    landscaping: {
      title: "Design / build walkthrough",
      body: "A crew lead will confirm scope from your photos and budget band. Typical start: Essentials landscaping from published bundle pricing.",
      starting: "from $129/mo packages or a custom project quote",
    },
    "snow-removal": {
      title: "Route check before the next freeze",
      body: "We confirm driveway/lot size and trigger depth, then put you on the route. Per-push or seasonal.",
    },
    "holiday-lights": {
      title: "Roofline measure",
      body: "We’ll confirm linear footage, stories, and whether we supply lights. Install windows fill up in fall.",
    },
  }
  return (
    map[id] || {
      title: "We’ll confirm the job on the property",
      body: "This isn’t a lawn-size calculator. Share a few details and we text a real plan — usually the same day.",
    }
  )
}

export function QuoteFunnel() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const analytics = useAnalytics()
  const engaged = useRef<Set<string>>(new Set())
  const lastField = useRef("")
  const started = useRef(false)
  const submitted = useRef(false)

  const initial = useMemo(() => {
    const pathSvc = pathname?.match(/\/(?:quote|lp)\/([^/?]+)/)?.[1] || ""
    const url = parseFunnelSearch(searchParams.toString())
    const stored = readStoredFunnelParams()
    return mergeFunnelParams(stored, url, { service: pathSvc })
  }, [searchParams, pathname])

  const resolved = resolveQuoteService(initial.service || initial.subservice)
  const [category, setCategory] = useState<QuoteCategoryId | "">(
    () => getQuoteService(resolved)?.category ?? "",
  )
  const [serviceId, setServiceId] = useState<QuoteServiceId | "">(resolved)
  const [step, setStep] = useState<Step>(() => {
    if (resolved && isEstimable(resolved) && initial.size && initial.property && initial.frequency) return "estimate"
    if (resolved) return "details"
    return "service"
  })
  const [values, setValues] = useState<Record<string, string>>(() => ({
    propertyType: initial.property || "residential",
    lawnSizeSqFt: initial.size || String(LAWN_SIZE_UI.defaultValue),
    frequency: initial.frequency || "weekly",
    mowTier: initial.tier || "standard",
    address: "",
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [quote, setQuote] = useState<EstimateResult | null>(null)
  const [areaSlug, setAreaSlug] = useState(initial.area)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [partialSent, setPartialSent] = useState(false)

  const def = serviceId ? getQuoteService(serviceId) : undefined
  const serviceFields = serviceId ? fieldsForService(serviceId) : []
  const estimable = serviceId ? isEstimable(serviceId) : false

  const steps = useMemo(() => {
    const list: { id: Step; label: string }[] = [{ id: "service", label: "Service" }]
    list.push({ id: "details", label: "Property" })
    if (estimable) list.push({ id: "estimate", label: "Estimate" })
    list.push({ id: "contact", label: "Your details" })
    return list
  }, [estimable])

  const stepIndex = Math.max(1, steps.findIndex((s) => s.id === step) + 1)

  useEffect(() => {
    writeStoredFunnelParams({
      service: serviceId,
      area: areaSlug,
      size: values.lawnSizeSqFt,
      property: values.propertyType,
      frequency: values.frequency,
      tier: values.mowTier,
    })
  }, [serviceId, areaSlug, values.lawnSizeSqFt, values.propertyType, values.frequency, values.mowTier])

  useEffect(() => {
    analytics.onFunnelStep("quote", step, stepIndex)
    analytics.onFormStepComplete("quote", step, stepIndex)
  }, [step, stepIndex, analytics])

  useEffect(() => {
    if (step === "estimate" && estimable && serviceId && !quote) {
      computeEstimate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onHide = () => {
      if (submitted.current) return
      if (!started.current) return
      analytics.onFormAbandon("quote", step, lastField.current)
    }
    document.addEventListener("visibilitychange", onHide)
    window.addEventListener("pagehide", onHide)
    return () => {
      document.removeEventListener("visibilitychange", onHide)
      window.removeEventListener("pagehide", onHide)
    }
  }, [analytics, step])

  function engage(name: string) {
    lastField.current = name
    if (!started.current) {
      started.current = true
      analytics.onFormStart("quote")
    }
    if (!engaged.current.has(name)) {
      engaged.current.add(name)
      analytics.onFormFieldEngage("quote", name)
    }
  }

  function setVal(key: string, v: string) {
    engage(key)
    if (key === "phone") v = maskUsPhone(v)
    setValues((prev) => ({ ...prev, [key]: v }))
    if (key === "address") {
      const q = qualifyAddress(v, areaSlug)
      if (q.matchedSlug) setAreaSlug(q.matchedSlug)
    }
  }

  function computeEstimate(): EstimateResult | null {
    if (!serviceId || !isEstimable(serviceId)) return null
    const outcome = calculateEstimate({
      propertyType: (values.propertyType as PropertyType) || "residential",
      serviceType: serviceId as ServiceType,
      lawnSizeSqFt: Number(values.lawnSizeSqFt) || LAWN_SIZE_UI.defaultValue,
      frequency: (values.frequency as Frequency) || "weekly",
      mowTier: (values.mowTier as MowTier) || "standard",
    })
    if (!outcome.ok) {
      setErrors({ lawnSizeSqFt: outcome.error })
      analytics.onFormError("quote", "lawnSizeSqFt", "estimate")
      return null
    }
    setQuote(outcome.result)
    setErrors({})
    return outcome.result
  }

  function validateFields(keys: string[]): Record<string, string> {
    const next: Record<string, string> = {}
    const all = [...SHARED_FIELDS.filter((f) => f.key === "address"), ...serviceFields]
    for (const f of all) {
      if (!keys.includes(f.key) && f.key !== "address") continue
      if (f.required && !String(values[f.key] || "").trim()) {
        next[f.key] = "Required"
        analytics.onFormError("quote", f.key, "required")
      }
    }
    if (keys.includes("address") && !String(values.address || "").trim()) {
      next.address = "Service address helps us route the crew"
      analytics.onFormError("quote", "address", "required")
    }
    return next
  }

  function goFromDetails() {
    const keys = ["address", ...serviceFields.filter((f) => f.required).map((f) => f.key)]
    const next = validateFields(keys)
    if (Object.keys(next).length) {
      setErrors(next)
      document.getElementById("quote-error-summary")?.focus()
      return
    }
    setErrors({})
    if (estimable) {
      const r = computeEstimate()
      if (r) setStep("estimate")
    } else {
      setQuote(null)
      setStep("contact")
    }
  }

  async function postLead(status: "complete" | "partial") {
    if (!serviceId) return { ok: false as const, error: "Pick a service" }
    const { firstName, lastName } = splitName(values.name || "")
    const phone = normalizeE164(values.phone || "")
    const attr = getAttributionPayload()
    const allowed = crmKeysForService(serviceId)
    const serviceDetails: Record<string, string> = {}
    for (const [k, v] of Object.entries(values)) {
      if (!v) continue
      if (allowed.has(k) || k === "urgency" || k === "heardAboutUs" || k === "address") {
        serviceDetails[k] = v
      }
    }
    const qualified = qualifyAddress(values.address || "", areaSlug)
    const body: Record<string, unknown> = {
      firstName: firstName || "Guest",
      lastName,
      email: values.email?.trim() || `quote.${phone.replace(/\D/g, "").slice(-10) || "unknown"}@leads.cutrateslawn.com`,
      phone,
      service: GHL_SERVICE_LABELS[serviceId],
      message: values.notes || `Quote request for ${GHL_SERVICE_LABELS[serviceId]}.`,
      source: "quote",
      idempotencyKey,
      companyWebsite: values.companyWebsite || "",
      turnstileToken: turnstileToken || undefined,
      address: values.address,
      areaSlug: qualified.matchedSlug || areaSlug || undefined,
      serviceId,
      leadStatus: status,
      qualifiedArea: qualified.qualified,
      pagePath: attr.pagePath,
      sessionId: attr.sessionId,
      deviceType: attr.deviceType,
      firstTouch: attr.firstTouch,
      lastTouch: attr.lastTouch,
      serviceDetails,
      urgency: values.urgency,
      heardAboutUs: values.heardAboutUs,
    }
    if (estimable && quote) {
      body.estimateAmount = quote.amount
      body.estimateUnit = quote.unit
      body.lawnSizeSqFt = Number(values.lawnSizeSqFt)
      body.propertyType = values.propertyType
      body.frequency = values.frequency
    }
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = (await res.json()) as { ok?: boolean; error?: string; requestId?: string; queued?: boolean }
    return { ok: res.ok && data.ok !== false, error: data.error, requestId: data.requestId, status: res.status }
  }

  async function maybePartial() {
    if (partialSent) return
    if (!isValidMobile(values.phone || "") || !(values.name || "").trim()) return
    setPartialSent(true)
    analytics.onPartialFormFill("quote", step)
    try {
      await postLead("partial")
    } catch {
      setPartialSent(false)
    }
  }

  async function submitLead(e: FormEvent) {
    e.preventDefault()
    if (!serviceId) return
    const next: Record<string, string> = {}
    if (!(values.name || "").trim()) next.name = "Name is required"
    if (!isValidMobile(values.phone || "")) next.phone = "Mobile number is required"
    if (Object.keys(next).length) {
      setErrors(next)
      document.getElementById("quote-error-summary")?.focus()
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await postLead("complete")
      if (!result.ok) {
        setSubmitError(result.error || `We could not send this automatically. Call ${siteConfig.phone.display}.`)
        return
      }
      submitted.current = true
      setIdempotencyKey(newIdempotencyKey())
      router.push(
        `/thank-you/${serviceId}?rid=${encodeURIComponent(result.requestId || "")}&area=${encodeURIComponent(areaSlug)}&amt=${quote?.amount ?? 0}`,
      )
    } catch {
      setSubmitError(`Network error. Please call ${siteConfig.phone.display}.`)
    } finally {
      setSubmitting(false)
    }
  }

  const errorList = Object.entries(errors)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav aria-label="Quote progress" className="flex flex-wrap items-center justify-center gap-1.5 text-xs sm:text-sm">
        {steps.map((s, i) => {
          const n = i + 1
          const active = step === s.id
          const complete = steps.findIndex((x) => x.id === step) > i
          return (
            <span
              key={s.id}
              className={`rounded-full px-2.5 py-1 ${active ? "bg-primary text-primary-foreground" : complete ? "bg-primary/15 text-primary" : "bg-muted"}`}
            >
              {n}. {s.label}
            </span>
          )
        })}
      </nav>

      {areaSlug ? (
        <p className="text-center text-sm font-semibold text-sage">Serving {areaLabel(areaSlug)}, KS</p>
      ) : null}

      {errorList.length ? (
        <div
          id="quote-error-summary"
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          Please fix: {errorList.map(([k, v]) => `${k} (${v})`).join("; ")}
        </div>
      ) : null}

      {step === "service" && (
        <Card>
          <CardHeader>
            <CardTitle>What do you need?</CardTitle>
            <CardDescription>Pick a category, then the specific job. Takes a few taps.</CardDescription>
          </CardHeader>
          <CardContent>
            <ServicePicker
              category={category}
              onCategory={(id) => {
                engage("category")
                setCategory(id)
              }}
              onService={(svc) => {
                engage("service")
                setServiceId(svc.id)
                setCategory(svc.category)
                setStep("details")
              }}
            />
          </CardContent>
        </Card>
      )}

      {step === "details" && def && (
        <Card>
          <CardHeader>
            <CardTitle>{def.label}</CardTitle>
            <CardDescription>
              {estimable
                ? "Lawn care gets an instant planning number from our published rates."
                : consultExpectation(def.id).body}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {SHARED_FIELDS.filter((f) => f.key === "address").map((f) => (
              <FieldRenderer
                key={f.key}
                field={f}
                value={values[f.key] || ""}
                error={errors[f.key]}
                onChange={(v) => setVal(f.key, v)}
                onEngage={() => engage(f.key)}
              />
            ))}
            {serviceFields.map((f) => (
              <FieldRenderer
                key={f.key}
                field={f}
                value={values[f.key] || (f.key === "lawnSizeSqFt" ? String(LAWN_SIZE_UI.defaultValue) : "")}
                error={errors[f.key]}
                onChange={(v) => setVal(f.key, v)}
                onEngage={() => engage(f.key)}
              />
            ))}
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button type="button" variant="outline" className="w-full" onClick={() => setStep("service")}>
              Back
            </Button>
            <Button className="w-full" onClick={goFromDetails}>
              {estimable ? "Calculate Estimate" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "estimate" && quote && def && (
        <Card>
          <CardHeader>
            <CardTitle>Planning estimate</CardTitle>
            <CardDescription>Not a final invoice — we confirm after we see the property.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold">{quote.displayAmount}</p>
            <p className="mt-2 text-sm text-sage">
              {GHL_SERVICE_LABELS[def.id]} · {values.propertyType} · {Number(values.lawnSizeSqFt).toLocaleString()} sq ft ·{" "}
              {values.frequency}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-sage">
              {quote.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="outline" className="w-full" onClick={() => setStep("details")}>
              Back
            </Button>
            <Button className="w-full" onClick={() => setStep("contact")}>
              Request a Confirmed Quote
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "contact" && def && (
        <Card>
          <CardHeader>
            <CardTitle>Where should we text you?</CardTitle>
            <CardDescription>Name + mobile is enough. Email is optional.</CardDescription>
          </CardHeader>
          <form onSubmit={submitLead}>
            <CardContent className="space-y-4">
              {!estimable ? (
                <div className="rounded-md bg-muted px-3 py-2 text-sm">
                  <strong>{consultExpectation(def.id).title}.</strong> {consultExpectation(def.id).body}
                  {consultExpectation(def.id).starting ? (
                    <span className="block mt-1">Starting at: {consultExpectation(def.id).starting}</span>
                  ) : null}
                </div>
              ) : quote ? (
                <p className="rounded-md bg-muted px-3 py-2 text-sm">
                  Estimate on file: <strong>{quote.displayAmount}</strong>
                </p>
              ) : null}
              {IDENTITY_FIELDS.map((f) => (
                <FieldRenderer
                  key={f.key}
                  field={f}
                  value={values[f.key] || ""}
                  error={errors[f.key]}
                  onChange={(v) => {
                    setVal(f.key, v)
                    if (f.key === "phone" || f.key === "name") void maybePartial()
                  }}
                  onEngage={() => engage(f.key)}
                />
              ))}
              {SHARED_FIELDS.filter((f) => f.key !== "address").map((f) => (
                <FieldRenderer
                  key={f.key}
                  field={f}
                  value={values[f.key] || ""}
                  onChange={(v) => setVal(f.key, v)}
                  onEngage={() => engage(f.key)}
                />
              ))}
              <div className="hidden" aria-hidden>
                <input
                  name="companyWebsite"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.companyWebsite || ""}
                  onChange={(e) => setVal("companyWebsite", e.target.value)}
                />
              </div>
              {submitError ? (
                <p role="alert" className="text-sm text-red-600">
                  {submitError}
                </p>
              ) : null}
              <TurnstileField onToken={setTurnstileToken} />
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep(estimable ? "estimate" : "details")}
              >
                Back
              </Button>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending…" : "Submit Quote Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
