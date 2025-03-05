import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CTASection from "@/components/cta-section"

const serviceAreas = [
  {
    city: "Valley Center",
    zipCodes: ["67147"],
    services: ["Residential", "Commercial", "Lawn Care", "Landscaping", "Pest Control"],
  },
  {
    city: "Wichita",
    zipCodes: ["67201", "67202", "67203", "67204", "67205"],
    services: ["Residential", "Commercial", "Lawn Care", "Landscaping"],
  },
  {
    city: "Newton",
    zipCodes: ["67114"],
    services: ["Residential", "Lawn Care", "Pest Control"],
  },
  // Add more service areas as needed
]

export default function ServiceAreasPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Service Areas</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Cut Rates Lawn Care proudly serves the following areas in Kansas. Check if your location is covered by our
              expert services.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceAreas.map((area, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{area.city}</CardTitle>
                    <CardDescription>Zip Codes: {area.zipCodes.join(", ")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">Services Offered:</h3>
                    <ul className="list-disc list-inside">
                      {area.services.map((service, serviceIndex) => (
                        <li key={serviceIndex}>{service}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Check Availability</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Don't see your area listed?</h2>
            <p className="text-xl text-center mb-8">
              We're constantly expanding our service areas. Contact us to check if we can accommodate your location.
            </p>
            <div className="flex justify-center">
              <Button size="lg">Contact Us</Button>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Get Started?"
          description="Schedule your service today or contact us for more information about our service areas."
          primaryButtonText="Schedule Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Contact Us"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

