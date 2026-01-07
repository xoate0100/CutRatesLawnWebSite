import { getServiceAreas } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CTASection from "@/components/cta-section"
import ErrorState from "@/components/error-state"
import LoadingState from "@/components/loading-state"
import { Suspense } from "react"
import Link from "next/link"

export default async function ServiceAreasPage() {
  try {
    const serviceAreas = await getServiceAreas()

    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <section className="bg-green-600 text-white py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Service Areas</h1>
              <p className="text-xl mb-8 max-w-3xl">
                Cut Rates Lawn Care proudly serves the following areas in Kansas. Check if your location is covered by
                our expert services.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <Suspense fallback={<LoadingState />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serviceAreas.map((area) => (
                    <Card key={area.id}>
                      <CardHeader>
                        <CardTitle>{area.attributes.city}</CardTitle>
                        <CardDescription>Zip Codes: {area.attributes.zipCodes.join(", ")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold mb-2">Services Offered:</h3>
                        <ul className="list-disc list-inside">
                          {area.attributes.services.map((service, serviceIndex) => (
                            <li key={serviceIndex}>{service}</li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href="/contact" className="w-full">
                          <Button className="w-full">Check Availability</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </Suspense>
            </div>
          </section>

          <section className="bg-gray-100 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">Don't see your area listed?</h2>
              <p className="text-xl text-center mb-8">
                We're constantly expanding our service areas. Contact us to check if we can accommodate your location.
              </p>
              <div className="flex justify-center">
                <Link href="/contact">
                  <Button size="lg">Contact Us</Button>
                </Link>
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
  } catch (error) {
    console.error("Error fetching service areas:", error)
    return <ErrorState message="Failed to load service areas. Please try again later." />
  }
}
