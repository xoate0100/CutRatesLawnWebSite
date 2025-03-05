import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const commercialServices = [
  {
    title: "Commercial Landscaping",
    description:
      "Comprehensive landscape maintenance for businesses, including mowing, pruning, and seasonal plantings.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Snow and Ice Management",
    description: "Keep your property safe and accessible during winter with our reliable snow removal services.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Parking Lot Maintenance",
    description: "Sweeping, striping, and maintenance to keep your parking areas clean and well-marked.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Commercial Pest Control",
    description: "Protect your business from pests with our comprehensive commercial pest management solutions.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Irrigation System Management",
    description: "Installation, maintenance, and repair of commercial irrigation systems for efficient water usage.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Green Space Design",
    description: "Create inviting outdoor spaces for your employees and customers with our landscape design services.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function CommercialServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Commercial Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Professional property maintenance solutions for businesses. Enhance your property's appearance and safety
              year-round.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Commercial Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {commercialServices.map((service, index) => (
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
                    <Link href="/contact" className="w-full">
                      <Button className="w-full">Request a Quote</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Commercial Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Experienced in managing large-scale properties",
                "Customized maintenance plans",
                "State-of-the-art equipment and techniques",
                "24/7 emergency services available",
                "Fully licensed and insured",
                "Commitment to sustainability",
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
          title="Elevate Your Property's Appearance"
          description="Contact us today to discuss your commercial property maintenance needs and receive a customized quote."
          primaryButtonText="Request a Quote"
          primaryButtonLink="/contact"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/about"
        />
      </main>
    </div>
  )
}

