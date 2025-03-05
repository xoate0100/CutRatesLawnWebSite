import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const powerWashingServices = [
  {
    title: "House Exterior Washing",
    description: "Revitalize your home's exterior, removing dirt, grime, and mildew.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Driveway and Sidewalk Cleaning",
    description: "Restore the appearance of your concrete surfaces, removing stains and buildup.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Deck and Fence Washing",
    description: "Bring new life to your wooden structures, preparing them for staining or sealing.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Roof Cleaning",
    description: "Safely remove algae, moss, and stains from your roof, extending its lifespan.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function PowerWashingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Power Washing Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Professional power washing solutions to restore and maintain the beauty of your property's exterior
              surfaces.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Power Washing Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {powerWashingServices.map((service, index) => (
                <Card key={index} className="flex flex-col">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link href="/schedule" className="w-full">
                      <Button className="w-full">Schedule Service</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Power Washing Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "State-of-the-art equipment for efficient cleaning",
                "Eco-friendly cleaning solutions",
                "Experienced and trained technicians",
                "Customized pressure settings for different surfaces",
                "Comprehensive service for all exterior areas",
                "Satisfaction guaranteed",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Refresh Your Property's Exterior?"
          description="Schedule your power washing service today and see the dramatic difference it can make."
          primaryButtonText="Schedule Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Get a Quote"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

