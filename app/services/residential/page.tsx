import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const residentialServices = [
  {
    title: "Lawn Mowing",
    description: "Regular mowing to keep your lawn healthy and well-manicured.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Fertilization",
    description: "Customized fertilization programs to nourish your lawn throughout the year.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Weed Control",
    description: "Targeted treatments to eliminate weeds and prevent their return.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Pest Control",
    description: "Protect your property from harmful insects and pests.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Aeration and Overseeding",
    description: "Improve soil health and grass density for a lush lawn.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Seasonal Cleanup",
    description: "Spring and fall cleanups to prepare your property for the changing seasons.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function ResidentialServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Residential Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Comprehensive lawn care and exterior maintenance services for homeowners. Keep your property looking its
              best year-round.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Residential Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residentialServices.map((service, index) => (
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
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Residential Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Experienced and professional team",
                "Customized care plans for your property",
                "Eco-friendly practices and products",
                "Reliable, on-time service",
                "Comprehensive property care",
                "Satisfaction guaranteed",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Transform Your Property?"
          description="Schedule your residential service today and enjoy a beautiful, well-maintained home exterior."
          primaryButtonText="Schedule Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Get a Quote"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

