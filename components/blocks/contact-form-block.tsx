"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

const initial: FormState = { name: "", email: "", phone: "", message: "" }

export type ContactFormBlockProps = {
  className?: string
}

export function ContactFormBlock({ className }: ContactFormBlockProps) {
  const [values, setValues] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "form", string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!values.name.trim()) next.name = "Name is required"
    if (!values.email.trim()) next.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = "Invalid email format"
    if (!values.message.trim()) next.message = "Message is required"
    else if (values.message.length < 10) next.message = "Message must be at least 10 characters"
    return next
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const nameParts = values.name.trim().split(/\s+/)
      const firstName = nameParts[0] || values.name
      const lastName = nameParts.slice(1).join(" ") || "—"
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: values.email,
          phone: values.phone || undefined,
          service: "General inquiry",
          message: values.message,
          source: "contact",
          idempotencyKey: crypto.randomUUID(),
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || data.ok === false) {
        setErrors({ form: data.error || "Something went wrong. Please try again." })
        return
      }
      setSuccess(true)
      setValues(initial)
    } catch {
      setErrors({ form: "Network error. Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className={cn("rounded-brand border border-green/30 bg-cream p-6", className)}>
        <h3 className="font-display text-xl font-bold text-forest">Thank you!</h3>
        <p className="mt-2 text-sage">We&apos;ll get back to you as soon as possible.</p>
        <Button type="button" variant="dark" className="mt-4" onClick={() => setSuccess(false)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-4 rounded-brand border border-line bg-white p-6", className)}
      noValidate
    >
      {(
        [
          ["name", "Name", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone (optional)", "tel"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key}>
          <label htmlFor={`contact-${key}`} className="block text-sm font-bold text-ink">
            {label}
          </label>
          <input
            id={`contact-${key}`}
            type={type}
            value={values[key]}
            onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-ink outline-none focus-visible:ring-2 focus-visible:ring-lime"
          />
          {errors[key] ? <p className="mt-1 text-sm text-red-600">{errors[key]}</p> : null}
        </div>
      ))}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-bold text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-ink outline-none focus-visible:ring-2 focus-visible:ring-lime"
        />
        {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
      </div>
      {errors.form ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.form}
        </div>
      ) : null}
      <Button type="submit" variant="lime" className="w-full" disabled={submitting}>
        {submitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  )
}
