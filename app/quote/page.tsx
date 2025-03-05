"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export default function QuotePage() {
  const [propertyType, setPropertyType] = useState("residential")
  const [serviceType, setServiceType] = useState("")
  const [lawnSize, setLawnSize] = useState(0)
  const [frequency, setFrequency] = useState("weekly")
  const [quote, setQuote] = useState(null)

  const calculateQuote = () => {
    // This is a simplified calculation. In a real-world scenario,
    // this would be much more complex and likely involve a backend API call.
    const basePrice = propertyType === "residential" ? 50 : 100
    const sizeMultiplier = lawnSize / 1000
    const frequencyMultiplier = frequency === "weekly" ? 1 : 0.6
    let total = basePrice * sizeMultiplier * frequencyMultiplier

    // Add service-specific costs
    switch (serviceType) {
      case "mowing":
        total *= 1
        break
      case "fertilization":
        total *= 1.2
        break
      case "weed-control":
        total *= 1.1
        break
      case "full-service":
        total *= 1.5
        break
    }

    setQuote(Math.round(total))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get an Instant Quote</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Answer a few quick questions about your property and needs to receive an instant estimate for our
              services.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Lawn Care Quote Calculator</CardTitle>
                <CardDescription>Provide details about your property for an instant estimate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Property Type</Label>
                  <RadioGroup defaultValue="residential" onValueChange={setPropertyType}>
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
                  <Select onValueChange={setServiceType}>
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
                  <RadioGroup defaultValue="weekly" onValueChange={setFrequency}>
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
              </CardContent>
              <CardFooter>
                <Button onClick={calculateQuote} className="w-full">
                  Calculate Quote
                </Button>
              </CardFooter>
            </Card>

            {quote !== null && (
              <Card className="max-w-2xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle>Your Estimated Quote</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-center">${quote} per service</p>
                  <p className="text-center mt-4">
                    This is an estimate based on the information provided. For a more accurate quote, please contact us
                    directly.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button>Schedule a Consultation</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

