import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const pestControlServices = [
  {
    title: "General Pest Control",
    description: "Comprehensive treatment for common household pests including ants, roaches, and spiders.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Mosquito Control",
    description: "Reduce mosquito populations in your yard for a more enjoyable outdoor experience.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Termite Inspection and Treatment",
    description: "Protect your home from destructive termites with our thorough inspection and treatment services.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Rodent Control",
    description: "Effective solutions for mice and rat infestations, including prevention and exclusion.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function PestControlPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Pest Control Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Effective and safe pest management solutions to keep your home and property free from unwanted visitors.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Pest Control Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pestControlServices.map((service, index) => (
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
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Pest Control Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Environmentally responsible treatments",
                "Licensed and experienced technicians",
                "Customized pest management plans",
                "Year-round protection options",
                "Safe for families and pets",
                "Guaranteed results",
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
          title="Take Back Control of Your Property"
          description="Schedule your pest control service today and enjoy a pest-free environment."
          primaryButtonText="Schedule Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Get a Quote"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

