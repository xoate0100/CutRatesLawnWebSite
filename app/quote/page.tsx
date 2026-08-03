"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { siteConfig } from "@/lib/site-config"
import {
  calculateEstimate,
  type EstimateResult,
  type Frequency,
  type PropertyType,
  type ServiceType,
} from "@/lib/pricing/estimate"

export default function QuotePage() {
  const [propertyType, setPropertyType] = useState<PropertyType>("residential")
  const [serviceType, setServiceType] = useState<ServiceType | "">("")
  const [lawnSize, setLawnSize] = useState(2000)
  const [frequency, setFrequency] = useState<Frequency>("weekly")
  const [quote, setQuote] = useState<EstimateResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculateQuote = () => {
    const outcome = calculateEstimate({
      propertyType,
      serviceType: serviceType as ServiceType,
      lawnSizeSqFt: lawnSize,
      frequency,
    })
    if (!outcome.ok) {
      setError(outcome.error)
      setQuote(null)
      return
    }
    setError(null)
    setQuote(outcome.result)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get an Estimate</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Rough planning numbers only — final pricing is confirmed by our team after we understand your property.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Lawn Care Estimate Tool</CardTitle>
                <CardDescription>
                  Prefer a real quote?{" "}
                  <a className="text-primary underline" href={`tel:${siteConfig.phone.e164}`}>
                    Call {siteConfig.phone.display}
                  </a>{" "}
                  or{" "}
                  <Link href="/contact" className="text-primary underline">
                    contact us
                  </Link>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Property Type</Label>
                  <RadioGroup
                    value={propertyType}
                    onValueChange={(v) => setPropertyType(v as PropertyType)}
                  >
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
                  <Label>Service Type</Label>
                  <Select
                    value={serviceType}
                    onValueChange={(v) => setServiceType(v as ServiceType)}
                  >
                    <SelectTrigger>
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
                  <RadioGroup
                    value={frequency}
                    onValueChange={(v) => setFrequency(v as Frequency)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="biweekly" id="biweekly" />
                      <Label htmlFor="biweekly">Bi-weekly</Label>
                    </div>
                  </RadioGroup>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Frequency changes full-service monthly totals. Per-visit mowing rates stay the same.
                  </p>
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={calculateQuote} className="w-full">
                  Calculate Estimate
                </Button>
              </CardFooter>
            </Card>

            {quote !== null && (
              <Card className="max-w-2xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle>Planning Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">{quote.displayAmount} (estimate)</p>
                  <ul className="mt-4 space-y-1 text-center text-sm text-muted-foreground">
                    {quote.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/contact">Request a confirmed quote</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`tel:${siteConfig.phone.e164}`}>Call {siteConfig.phone.display}</a>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
