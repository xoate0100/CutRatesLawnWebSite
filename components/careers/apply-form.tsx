"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CAREERS_ROLES } from "@/lib/careers/fact-registry"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const STEPS = ["About you", "Job & location", "Availability", "Finish"] as const

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
  const [form, setForm] = useState({
    name: "",
    phone: "",
    zip: "",
    job: initialRole.title,
    availability: "",
    canReach: "",
    experience: "",
    language: "English",
    smsConsent: false,
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

  function submit() {
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
    const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      `Careers application — ${form.job}`,
    )}&body=${body}`
    window.location.href = mailto
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={cn("rounded-brand border border-line bg-white p-6", className)}>
        <h3 className="font-display text-2xl font-bold text-ink">Application started</h3>
        <p className="mt-2 text-sage">
          Your email draft should open so you can send it. What happens next: we review → text/call → interview →
          decision. We only promise response times Ops can meet — ask recruiting for the current timeline.
        </p>
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
              {form.job} · {form.availability} · Reach yard: {form.canReach}
            </p>
            <p className="mt-3 text-sage">
              Finish opens an email to recruiting with these answers. You can also call{" "}
              {siteConfig.phone.display}.
            </p>
          </div>
        )}
      </div>

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
          <Button type="button" variant="lime" onClick={submit}>
            Send application email
          </Button>
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
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
      />
    </label>
  )
}
