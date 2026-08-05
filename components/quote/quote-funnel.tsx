"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { siteConfig } from "@/lib/site-config"
import {
  calculateEstimate,
  type EstimateResult,
  type Frequency,
  type PropertyType,
  type ServiceType,
} from "@/lib/pricing/estimate"

type Step = "details" | "estimate" | "contact" | "done"

const SERVICE_LABELS: Record<ServiceType, string> = {
  mowing: "Lawn Mowing",
  fertilization: "Fertilization",
  "weed-control": "Weed Control",
  "full-service": "Full Service Lawn Care",
}

/** Map marketing /services/[slug] query values onto estimator keys. */
function serviceFromQuery(raw: string | null): ServiceType | "" {
  if (!raw) return ""
  const key = raw.trim().toLowerCase()
  const map: Record<string, ServiceType> = {
    mowing: "mowing",
    "lawn-mowing": "mowing",
    "lawn-care": "mowing",
    fertilization: "fertilization",
    fertilizing: "fertilization",
    "weed-control": "weed-control",
    weeds: "weed-control",
    "full-service": "full-service",
    "full-service-lawn-care": "full-service",
  }
  return map[key] ?? ""
}

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `quote-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function QuoteFunnel() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>("details")
  const [propertyType, setPropertyType] = useState<PropertyType>("residential")
  const [serviceType, setServiceType] = useState<ServiceType | "">(() =>
    serviceFromQuery(searchParams.get("service")),
  )
  const [lawnSize, setLawnSize] = useState(2000)
  const [frequency, setFrequency] = useState<Frequency>("weekly")
  const [quote, setQuote] = useState<EstimateResult | null>(null)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    companyWebsite: "",
  })
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey)

  const stepIndex = useMemo(() => {
    if (step === "details") return 1
    if (step === "estimate") return 2
    if (step === "contact") return 3
    return 4
  }, [step])

  const calculateQuote = () => {
    const outcome = calculateEstimate({
      propertyType,
      serviceType: serviceType as ServiceType,
      lawnSizeSqFt: lawnSize,
      frequency,
    })
    if (!outcome.ok) {
      setDetailsError(outcome.error)
      setQuote(null)
      return
    }
    setDetailsError(null)
    setQuote(outcome.result)
    setStep("estimate")
  }

  const validateContact = () => {
    const errors: Record<string, string> = {}
    if (!contact.firstName.trim()) errors.firstName = "First name is required"
    if (!contact.lastName.trim()) errors.lastName = "Last name is required"
    if (!contact.email.trim()) errors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(contact.email)) errors.email = "Invalid email format"
    if (!contact.phone.trim()) errors.phone = "Phone helps us confirm your quote"
    return errors
  }

  const submitLead = async (e: FormEvent) => {
    e.preventDefault()
    if (!quote || !serviceType) return
    const errors = validateContact()
    if (Object.keys(errors).length > 0) {
      setContactErrors(errors)
      return
    }
    setContactErrors({})
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          service: SERVICE_LABELS[serviceType],
          message: contact.notes || `Quote funnel request for ${SERVICE_LABELS[serviceType]}.`,
          source: "quote",
          idempotencyKey,
          companyWebsite: contact.companyWebsite,
          estimateAmount: quote.amount,
          estimateUnit: quote.unit,
          lawnSizeSqFt: lawnSize,
          propertyType,
          frequency,
          address: contact.address || undefined,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        requestId?: string
      }
      setRequestId(data.requestId ?? null)
      if (!res.ok || !data.ok) {
        setSubmitError(
          data.error ||
            `We could not send your request automatically. Please call ${siteConfig.phone.display}.`,
        )
        setSubmitting(false)
        return
      }
      setStep("done")
      setIdempotencyKey(newIdempotencyKey())
    } catch {
      setSubmitError(`Network error. Please call ${siteConfig.phone.display}.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <nav aria-label="Quote progress" className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        {["Details", "Estimate", "Contact", "Done"].map((label, i) => {
          const n = i + 1
          const active = stepIndex === n
          const complete = stepIndex > n
          return (
            <span
              key={label}
              className={`rounded-full px-3 py-1 ${
                active ? "bg-primary text-primary-foreground" : complete ? "bg-primary/15 text-primary" : "bg-muted"
              }`}
            >
              {n}. {label}
            </span>
          )
        })}
      </nav>

      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your property</CardTitle>
            <CardDescription>
              Instant planning numbers first — then share your contact details so our team can confirm a real quote.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Property Type</Label>
              <RadioGroup value={propertyType} onValueChange={(v) => setPropertyType(v as PropertyType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="residential" id="residential" />
                  <Label htmlFor="residential">Residential</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="commercial" id="commercial" />
                  <Label htmlFor="commercial">Commercial</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
                <SelectTrigger id="service-type">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mowing">Lawn Mowing</SelectItem>
                  <SelectItem value="fertilization">Fertilization</SelectItem>
                  <SelectItem value="weed-control">Weed Control</SelectItem>
                  <SelectItem value="full-service">Full Service Lawn Care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lawn Size (sq ft)</Label>
              <Slider
                min={500}
                max={10000}
                step={100}
                value={[lawnSize]}
                onValueChange={(value) => setLawnSize(value[0])}
              />
              <div className="mt-2 text-center">{lawnSize} sq ft</div>
            </div>

            <div>
              <Label>Service Frequency</Label>
              <RadioGroup value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="biweekly" id="biweekly" />
                  <Label htmlFor="biweekly">Bi-weekly</Label>
                </div>
              </RadioGroup>
            </div>

            {detailsError && (
              <p role="alert" className="text-sm text-red-600">
                {detailsError}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={calculateQuote} className="w-full">
              Calculate Estimate
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "estimate" && quote && (
        <Card>
          <CardHeader>
            <CardTitle>Your planning estimate</CardTitle>
            <CardDescription>Not a binding price — we confirm after reviewing your property.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-3xl font-bold">{quote.displayAmount}</p>
            <ul className="space-y-1 text-center text-sm text-muted-foreground">
              {quote.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <p className="text-center text-sm text-muted-foreground">
              {SERVICE_LABELS[serviceType as ServiceType]} · {propertyType} · {lawnSize} sq ft · {frequency}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={() => setStep("details")}>
              Back
            </Button>
            <Button className="w-full" onClick={() => setStep("contact")}>
              Request a Confirmed Quote
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "contact" && quote && (
        <Card>
          <CardHeader>
            <CardTitle>Where should we send your quote?</CardTitle>
            <CardDescription>
              We’ll send your estimate and details to our team so they can confirm pricing and follow up.
            </CardDescription>
          </CardHeader>
          <form onSubmit={submitLead}>
            <CardContent className="space-y-4">
              <p className="rounded-md bg-muted px-3 py-2 text-sm">
                Estimate on file: <strong>{quote.displayAmount}</strong>
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={contact.firstName}
                    onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                    autoComplete="given-name"
                  />
                  {contactErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{contactErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={contact.lastName}
                    onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                    autoComplete="family-name"
                  />
                  {contactErrors.lastName && <p className="mt-1 text-sm text-red-600">{contactErrors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  autoComplete="email"
                />
                {contactErrors.email && <p className="mt-1 text-sm text-red-600">{contactErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  autoComplete="tel"
                />
                {contactErrors.phone && <p className="mt-1 text-sm text-red-600">{contactErrors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="address">Service address (optional)</Label>
                <Input
                  id="address"
                  name="address"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  autoComplete="street-address"
                  placeholder="Street, City, KS"
                />
              </div>
              <div>
                <Label htmlFor="notes">Anything else we should know?</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={contact.notes}
                  onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                  rows={3}
                />
              </div>
              {/* Honeypot */}
              <div className="hidden" aria-hidden>
                <Label htmlFor="companyWebsite">Company website</Label>
                <Input
                  id="companyWebsite"
                  name="companyWebsite"
                  tabIndex={-1}
                  autoComplete="off"
                  value={contact.companyWebsite}
                  onChange={(e) => setContact({ ...contact, companyWebsite: e.target.value })}
                />
              </div>
              {submitError && (
                <p role="alert" className="text-sm text-red-600">
                  {submitError}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep("estimate")}>
                Back
              </Button>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending…" : "Submit Quote Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "done" && (
        <Card>
          <CardHeader>
            <CardTitle>Request received</CardTitle>
            <CardDescription>
              Thanks — our team will follow up to confirm your quote. You can also call{" "}
              <a className="text-primary underline" href={`tel:${siteConfig.phone.e164}`}>
                {siteConfig.phone.display}
              </a>
              .
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {quote && <p>Planning estimate on file: {quote.displayAmount}</p>}
            {requestId && <p>Reference: {requestId}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/services">Browse services</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
