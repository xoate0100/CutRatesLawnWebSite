"use client"

import type React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { ArrowRight } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { format } from "date-fns"

const services = [
  { id: "lawn-care", name: "Lawn Care" },
  { id: "pest-control", name: "Pest Control" },
  { id: "landscaping", name: "Landscaping" },
  { id: "snow-removal", name: "Snow Removal" },
  { id: "power-washing", name: "Power Washing" },
]

export default function SchedulePage() {
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const contactHref = useMemo(() => {
    const params = new URLSearchParams()
    if (selectedService) params.set("service", selectedService)
    if (selectedDate) params.set("preferredDate", format(selectedDate, "yyyy-MM-dd"))
    const q = params.toString()
    return q ? `/contact?${q}` : "/contact"
  }, [selectedService, selectedDate])

  const mailtoHref = useMemo(() => {
    const serviceLabel = services.find((s) => s.id === selectedService)?.name || selectedService
    const dateLabel = selectedDate ? format(selectedDate, "PPP") : "(date not selected)"
    const subject = encodeURIComponent(`Schedule request: ${serviceLabel || "service"}`)
    const body = encodeURIComponent(
      `Hi ${siteConfig.name},\n\nI'd like to schedule:\nService: ${serviceLabel || "—"}\nPreferred date: ${dateLabel}\n\nThanks.`,
    )
    return `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
  }, [selectedService, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedDate) {
      setError("Please select both a service and a preferred date.")
      return
    }
    setError(null)
    // Truthful handoff: no silent booking — continue to contact with context, or email.
    window.location.assign(contactHref)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Schedule a Service</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Choose a service and preferred date, then continue to contact us. Online calendar booking is confirmed by
              our team — we do not pretend a slot is reserved until we reply.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Request a Booking</CardTitle>
                <CardDescription>
                  Or call{" "}
                  <a className="text-green-700 underline" href={`tel:${siteConfig.phone.e164}`}>
                    {siteConfig.phone.display}
                  </a>{" "}
                  / use the{" "}
                  <a className="text-green-700 underline" href={siteConfig.customerPortalUrl} target="_blank" rel="noreferrer">
                    customer portal
                  </a>
                  .
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      Select a Service
                    </label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="rounded-md border"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Continue to Contact <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" className="w-full" asChild>
                    <a href={mailtoHref}>Email this request instead</a>
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Prefer an existing account?{" "}
                    <Link href="/portal" className="text-green-700 underline">
                      Open customer portal
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
