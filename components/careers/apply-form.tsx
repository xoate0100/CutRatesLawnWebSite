"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CAREERS_ROLES } from "@/lib/careers/fact-registry"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const STEPS = ["About you", "Job & location", "Availability", "Finish"] as const

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `careers-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/)
  return {
    firstName: parts[0] || full.trim(),
    lastName: parts.slice(1).join(" ") || "—",
  }
}

export function CareersApplyForm({
  className,
  initialJobId,
}: {
  className?: string
  initialJobId?: string | null
}) {
  const initialRole =
    CAREERS_ROLES.find((r) => r.id === initialJobId) ?? CAREERS_ROLES[0]
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    zip: "",
    job: initialRole.title,
    availability: "",
    canReach: "",
    experience: "",
    language: "English",
    smsConsent: false,
    companyWebsite: "",
  })

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function canContinue() {
    if (step === 0) return form.name.trim().length > 1 && form.phone.trim().length >= 7
    if (step === 1) return form.zip.trim().length >= 5 && !!form.job
    if (step === 2) return !!form.availability && !!form.canReach
    return true
  }

  function mailtoHref() {
    const body = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `ZIP: ${form.zip}`,
      `Job: ${form.job}`,
      `Availability: ${form.availability}`,
      `Can reach report location/time: ${form.canReach}`,
      `Experience: ${form.experience || "(none noted)"}`,
      `Language: ${form.language}`,
      `SMS consent: ${form.smsConsent ? "yes" : "no"}`,
    ].join("%0A")
    return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      `Careers application — ${form.job}`,
    )}&body=${body}`
  }

  async function submit() {
    setSubmitting(true)
    setSubmitError(null)
    const { firstName, lastName } = splitName(form.name)
    const message = [
      `ZIP: ${form.zip}`,
      `Availability: ${form.availability}`,
      `Can reach report location/time: ${form.canReach}`,
      `Experience: ${form.experience || "(none noted)"}`,
      `Preferred language: ${form.language}`,
      `SMS consent (recruiting for this role): ${form.smsConsent ? "yes" : "no"}`,
    ].join("\n")

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email:
            form.email.trim() ||
            `careers.${form.phone.replace(/\D/g, "").slice(-10) || "unknown"}@applicants.cutrateslawn.com`,
          phone: form.phone,
          service: form.job,
          message,
          source: "careers",
          idempotencyKey: newIdempotencyKey(),
          companyWebsite: form.companyWebsite,
          address: form.zip,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        requestId?: string
        manualContactRequired?: boolean
      }
      if (!res.ok || data.ok === false) {
        setSubmitError(
          data.error ||
            "We could not submit your application online. Call us or email recruiting with the backup link below.",
        )
        return
      }
      setRequestId(data.requestId ?? null)
      setSubmitted(true)
    } catch {
      setSubmitError(
        "Network error. Call us or use the email backup link below.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={cn("rounded-brand border border-line bg-white p-6", className)}>
        <h3 className="font-display text-2xl font-bold text-ink">Application received</h3>
        <p className="mt-2 text-sage">
          What happens next: we review → text/call → interview → decision. We only promise response times Ops can
          meet — ask recruiting for the current timeline.
        </p>
        {requestId ? (
          <p className="mt-2 text-xs text-sage">Reference: {requestId}</p>
        ) : null}
        <Button asChild variant="lime" className="mt-4">
          <a href={`tel:${siteConfig.phone.e164}`}>Call {siteConfig.phone.display}</a>
        </Button>
      </div>
    )
  }

  return (
    <div className={cn("rounded-brand border border-line bg-white p-5 sm:p-6", className)} id="apply">
      <p className="text-xs font-bold uppercase tracking-wider text-green">Short application</p>
      <h3 className="font-display mt-1 text-2xl font-bold text-ink">
        Enough information to decide the next step.
      </h3>
      <p className="mt-2 text-sm text-sage">No account. No mandatory résumé for entry-level openings.</p>

      {/* Honeypot */}
      <input
        type="text"
        name="companyWebsite"
        value={form.companyWebsite}
        onChange={(e) => update("companyWebsite", e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <ol className="mt-4 flex flex-wrap gap-2" aria-label="Application progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold",
              i === step ? "bg-forest text-lime" : i < step ? "bg-lime/40 text-forest" : "bg-cream text-sage",
            )}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-4">
        {step === 0 && (
          <>
            <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} />
            <Field label="Mobile number" value={form.phone} onChange={(v) => update("phone", v)} type="tel" />
            <Field
              label="Email (optional)"
              value={form.email}
              onChange={(v) => update("email", v)}
              type="email"
            />
            <label className="block text-sm font-semibold">
              Preferred language
              <select
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
                value={form.language}
                onChange={(e) => update("language", e.target.value)}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>Either / both</option>
              </select>
            </label>
          </>
        )}
        {step === 1 && (
          <>
            <Field label="ZIP code" value={form.zip} onChange={(v) => update("zip", v)} />
            <label className="block text-sm font-semibold">
              Preferred job
              <select
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
                value={form.job}
                onChange={(e) => update("job", e.target.value)}
              >
                {CAREERS_ROLES.map((r) => (
                  <option key={r.id}>{r.title}</option>
                ))}
              </select>
            </label>
            <Field
              label="Relevant experience (optional)"
              value={form.experience}
              onChange={(v) => update("experience", v)}
            />
          </>
        )}
        {step === 2 && (
          <>
            <Field
              label="Availability (days/times you can work)"
              value={form.availability}
              onChange={(v) => update("availability", v)}
            />
            <label className="block text-sm font-semibold">
              Can you reliably reach the stated report location by start time?
              <select
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
                value={form.canReach}
                onChange={(e) => update("canReach", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="Yes">Yes</option>
                <option value="Need details first">Need location/time details first</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </label>
            <label className="flex items-start gap-2 text-sm text-ink">
              <input
                type="checkbox"
                className="mt-1"
                checked={form.smsConsent}
                onChange={(e) => update("smsConsent", e.target.checked)}
              />
              <span>
                Text me about this application (optional). Message/data rates may apply. Consent is for recruiting
                about this role — not unrelated marketing.
              </span>
            </label>
          </>
        )}
        {step === 3 && (
          <div className="rounded-lg bg-cream p-4 text-sm text-ink">
            <p>
              <strong>{form.name}</strong> · {form.phone} · {form.zip}
            </p>
            <p className="mt-1">
              {form.job} · {form.availability} · Reach yard: {form.canReach} · {form.language}
            </p>
            <p className="mt-3 text-sage">
              Submit sends your answers to recruiting. You can also call {siteConfig.phone.display}.
            </p>
          </div>
        )}
      </div>

      {submitError ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p>{submitError}</p>
          <a className="mt-2 inline-block font-semibold underline" href={mailtoHref()}>
            Email recruiting instead
          </a>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button type="button" variant="lime" disabled={!canContinue()} onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <>
            <Button type="button" variant="lime" disabled={submitting} onClick={submit}>
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
            <Button asChild type="button" variant="outline">
              <a href={mailtoHref()}>Email backup</a>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  const id = `careers-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  return (
    <div className="block text-sm font-semibold text-ink">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
      />
    </div>
  )
}
