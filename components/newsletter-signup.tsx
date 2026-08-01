"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/lib/site-config"

type Status = "idle" | "submitting" | "success" | "error"

export function NewsletterSignup({ variant = "footer" }: { variant?: "footer" | "blog" }) {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email.")
      return
    }
    if (!consent) {
      setError("Please confirm you want lawn-care emails from us.")
      return
    }
    setError(null)
    setStatus("submitting")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          source: variant,
          idempotencyKey: crypto.randomUUID(),
        }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setStatus("error")
        setError(data.error || "Subscription could not be completed.")
        return
      }
      setStatus("success")
      setEmail("")
      setConsent(false)
    } catch {
      setStatus("error")
      setError(`Network error. Email us at ${siteConfig.email} instead.`)
    }
  }

  if (status === "success") {
    return (
      <p role="status" className={variant === "footer" ? "text-sm text-green-300" : "text-sm text-green-800"}>
        You&apos;re subscribed. Check your inbox for a confirmation if the provider requires double opt-in.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <div className={`flex ${variant === "footer" ? "flex-col sm:flex-row gap-2" : "flex-col sm:flex-row gap-2"}`}>
        <Input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className={variant === "footer" ? "bg-gray-800 border-gray-700 text-white" : ""}
          aria-label="Email for newsletter"
        />
        <Button
          type="submit"
          disabled={status === "submitting"}
          className={variant === "footer" ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <label className={`flex items-start gap-2 text-xs ${variant === "footer" ? "text-gray-400" : "text-gray-600"}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I agree to receive occasional emails about services and tips. You can unsubscribe anytime. See our{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className={`text-xs ${variant === "footer" ? "text-amber-300" : "text-red-600"}`}>
          {error}
        </p>
      )}
    </form>
  )
}
