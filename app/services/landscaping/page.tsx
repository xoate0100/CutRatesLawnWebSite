import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const landscapingServices = [
  {
    title: "Landscape Design",
    description: "Create a stunning outdoor space with our professional landscape design services.",
    image: "/placeholder.svg?height=200&width=300",
    benefits: [
      "Customized designs tailored to your preferences and property",
      "Enhance curb appeal and property value",
      "Create functional outdoor living spaces",
    ],
  },
  {
    title: "Hardscaping",
    description: "Add structure and functionality to your landscape with our hardscaping solutions.",
    image: "/placeholder.svg?height=200&width=300",
    benefits: [
      "Custom patios, walkways, and retaining walls",
      "Durable materials for long-lasting beauty",
      "Improve outdoor accessibility and usability",
    ],
  },
  {
    title: "Planting and Softscaping",
    description: "Bring life and color to your landscape with our expert planting services.",
    image: "/placeholder.svg?height=200&width=300",
    benefits: [
      "Selection of plants suited to your local climate",
      "Professional installation for optimal growth",
      "Create visual interest throughout the seasons",
    ],
  },
  {
    title: "Irrigation Systems",
    description: "Ensure your landscape stays healthy with our efficient irrigation solutions.",
    image: "/placeholder.svg?height=200&width=300",
    benefits: [
      "Water conservation through smart irrigation technology",
      "Customized watering schedules for different plant needs",
      "Reduce water bills and maintain a lush landscape",
    ],
  },
]

export default function LandscapingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Landscaping Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Transform your outdoor space into a beautiful, functional oasis with our professional landscaping
              services.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Landscaping Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {landscapingServices.map((service, index) => (
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
                    <CardDescription className="mb-4">{service.description}</CardDescription>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact" className="w-full">
                      <Button className="w-full">Get a Quote</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Our Landscaping Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                "Expert designers and skilled installers",
                "High-quality materials and plants",
                "Customized solutions for your unique property",
                "Sustainable and eco-friendly practices",
                "Comprehensive project management",
                "Ongoing maintenance services available",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Landscaping Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Consultation",
                  description: "We discuss your vision, needs, and budget to understand your project goals.",
                },
                {
                  title: "Design",
                  description:
                    "Our experts create a custom landscape design tailored to your property and preferences.",
                },
                {
                  title: "Installation",
                  description: "Our skilled team brings the design to life with precision and care.",
                },
                {
                  title: "Maintenance",
                  description: "We offer ongoing care to keep your landscape beautiful and thriving.",
                },
              ].map((step, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-green-600">{index + 1}</CardTitle>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Transform Your Outdoor Space?"
          description="Contact us today to schedule a consultation and start creating the landscape of your dreams."
          primaryButtonText="Get a Free Quote"
          primaryButtonLink="/contact"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

