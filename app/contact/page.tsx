"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

type Status = "idle" | "submitting" | "success" | "error"

function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    companyWebsite: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey)

  const mapsEmbedSrc =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    `https://www.google.com/maps?q=${siteConfig.address.mapsQuery}&output=embed`

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = "Invalid email format"
    if (!formData.service) errors.service = "Please select a service"
    return errors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})
    setStatus("submitting")
    setErrorMessage(null)

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          source: "contact",
          idempotencyKey,
          companyWebsite: formData.companyWebsite,
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        requestId?: string
        manualContactRequired?: boolean
      }
      setRequestId(data.requestId ?? null)

      if (!res.ok || !data.ok) {
        setStatus("error")
        setErrorMessage(
          data.error ||
            "We could not deliver your message automatically. Please call or email us using the contacts above.",
        )
        return
      }

      setStatus("success")
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        companyWebsite: "",
      })
      setIdempotencyKey(newIdempotencyKey())
    } catch {
      setStatus("error")
      setErrorMessage(
        `Network error. Please call ${siteConfig.phone.display} or email ${siteConfig.email}.`,
      )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Have questions or ready to schedule a service? Call, email, or send a message — we only confirm receipt
              when delivery succeeds.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Phone,
                  title: "Phone",
                  content: siteConfig.phone.display,
                  link: `tel:${siteConfig.phone.e164}`,
                },
                {
                  icon: Mail,
                  title: "Email",
                  content: siteConfig.email,
                  link: `mailto:${siteConfig.email}`,
                },
                {
                  icon: MapPin,
                  title: "Address",
                  content: siteConfig.address.full,
                  link: `https://maps.google.com/?q=${siteConfig.address.mapsQuery}`,
                },
                {
                  icon: Clock,
                  title: "Business Hours",
                  content: "Mon-Fri: 8am-6pm\nSat: 9am-3pm\nSun: Closed",
                },
              ].map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <item.icon className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.link ? (
                      <a href={item.link} className="text-green-600 hover:underline">
                        {item.content}
                      </a>
                    ) : (
                      <p className="whitespace-pre-line">{item.content}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>
                  Prefer to talk now?{" "}
                  <a className="text-green-700 underline" href={`tel:${siteConfig.phone.e164}`}>
                    {siteConfig.phone.display}
                  </a>{" "}
                  or{" "}
                  <a className="text-green-700 underline" href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </a>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent>
                {status === "success" ? (
                  <div role="status" className="rounded-md border border-green-200 bg-green-50 p-4 text-green-900">
                    <p className="font-medium">Message delivered.</p>
                    <p className="text-sm mt-1">
                      We received your request{requestId ? ` (ref ${requestId.slice(0, 8)})` : ""}. Our team will follow
                      up.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    {/* Honeypot */}
                    <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="companyWebsite">Company website</label>
                      <input
                        id="companyWebsite"
                        name="companyWebsite"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.companyWebsite}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                        />
                        {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="johndoe@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Interested In
                      </label>
                      <Select
                        name="service"
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lawn-care">Lawn Care</SelectItem>
                          <SelectItem value="landscaping">Landscaping</SelectItem>
                          <SelectItem value="pest-control">Pest Control</SelectItem>
                          <SelectItem value="snow-removal">Snow Removal</SelectItem>
                          <SelectItem value="power-washing">Power Washing</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.service && <p className="text-red-500 text-sm mt-1">{formErrors.service}</p>}
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="How can we help you?"
                        rows={4}
                      />
                    </div>
                    {status === "error" && errorMessage && (
                      <div role="alert" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-950 text-sm">
                        <p>{errorMessage}</p>
                        <p className="mt-2">
                          Call{" "}
                          <a className="underline font-medium" href={`tel:${siteConfig.phone.e164}`}>
                            {siteConfig.phone.display}
                          </a>{" "}
                          or email{" "}
                          <a className="underline font-medium" href={`mailto:${siteConfig.email}`}>
                            {siteConfig.email}
                          </a>
                          .
                        </p>
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={status === "submitting"}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {status === "submitting" ? "Sending…" : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
            {/* TODO(F-025): Prefer NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL from an owned, referrer-restricted Maps key. */}
            <div className="aspect-video w-full overflow-hidden rounded-md border">
              <iframe
                title="Map to Cut Rates Lawn Care"
                src={mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 360 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
