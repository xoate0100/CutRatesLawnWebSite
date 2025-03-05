import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Clock, DollarSign, Zap, Shield } from "lucide-react"
import CTASection from "@/components/cta-section"

const allServices = [
  {
    category: "Lawn Care",
    services: [
      {
        title: "Regular Mowing",
        description: "Keep your lawn looking neat and healthy with our professional mowing service.",
        painPoint: "No more spending your weekends pushing a lawnmower.",
        icon: Clock,
      },
      {
        title: "Fertilization",
        description: "Nourish your lawn with our expertly balanced fertilization treatments.",
        painPoint: "Say goodbye to patchy, unhealthy grass.",
        icon: Zap,
      },
      {
        title: "Weed Control",
        description: "Eliminate pesky weeds and prevent their return with our targeted treatments.",
        painPoint: "Enjoy a weed-free lawn without the backbreaking work.",
        icon: Shield,
      },
    ],
    image: "/placeholder.svg?height=300&width=400",
    link: "/services/lawn-care",
  },
  {
    category: "Landscaping",
    services: [
      {
        title: "Landscape Design",
        description: "Transform your outdoor space with our professional landscape design services.",
        painPoint: "Create the yard of your dreams without the guesswork.",
        icon: Zap,
      },
      {
        title: "Hardscaping",
        description: "Enhance your property with custom patios, walkways, and retaining walls.",
        painPoint: "Add value to your property with durable, beautiful hardscape features.",
        icon: Shield,
      },
      {
        title: "Tree and Shrub Care",
        description: "Keep your trees and shrubs healthy and vibrant with our expert care.",
        painPoint: "Protect your landscape investment with proper maintenance.",
        icon: Clock,
      },
    ],
    image: "/placeholder.svg?height=300&width=400",
    link: "/services/landscaping",
  },
  {
    category: "Pest Control",
    services: [
      {
        title: "General Pest Control",
        description: "Comprehensive treatment for common household pests.",
        painPoint: "Eliminate pest worries and protect your home.",
        icon: Shield,
      },
      {
        title: "Mosquito Control",
        description: "Enjoy your outdoor spaces without pesky mosquitoes.",
        painPoint: "Reclaim your yard from biting insects.",
        icon: Zap,
      },
      {
        title: "Termite Protection",
        description: "Safeguard your home from destructive termites.",
        painPoint: "Prevent costly damage with proactive termite control.",
        icon: Clock,
      },
    ],
    image: "/placeholder.svg?height=300&width=400",
    link: "/services/pest-control",
  },
  {
    category: "Power Washing",
    services: [
      {
        title: "House Exterior Washing",
        description: "Revitalize your home's exterior, removing dirt and grime.",
        painPoint: "Instantly improve your home's curb appeal.",
        icon: Zap,
      },
      {
        title: "Driveway and Sidewalk Cleaning",
        description: "Restore the appearance of your concrete surfaces.",
        painPoint: "Eliminate slippery mold and mildew for a safer property.",
        icon: Shield,
      },
      {
        title: "Deck and Fence Washing",
        description: "Bring new life to your wooden structures.",
        painPoint: "Extend the life of your outdoor wood features.",
        icon: Clock,
      },
    ],
    image: "/placeholder.svg?height=300&width=400",
    link: "/services/power-washing",
  },
]

export default function AllServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Complete Service Offerings</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Discover our full range of professional property care services designed to save you time, increase your
              property value, and give you peace of mind.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {allServices.map((category, index) => (
              <div key={index} className="mb-16">
                <h2 className="text-3xl font-bold mb-8">{category.category}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {category.services.map((service, serviceIndex) => (
                        <Card key={serviceIndex} className="flex flex-col h-full">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">{service.title}</CardTitle>
                              <service.icon className="h-6 w-6 text-green-600" />
                            </div>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <CardDescription>{service.description}</CardDescription>
                          </CardContent>
                          <CardFooter>
                            <p className="text-sm text-green-600 font-semibold">
                              <CheckCircle className="h-4 w-4 inline mr-2" />
                              {service.painPoint}
                            </p>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <Card className="h-full flex flex-col">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.category}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <CardContent className="flex-grow flex flex-col justify-center">
                        <h3 className="text-xl font-semibold mb-4">Why Choose Our {category.category} Services?</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Professional, experienced team</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Customized solutions for your property</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <span>Eco-friendly products and practices</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Link href={category.link} className="w-full">
                          <Button className="w-full">
                            Learn More About {category.category} <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Cut Rates Lawn Care?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Save Time",
                  description: "Reclaim your weekends and free time by letting us handle your property care needs.",
                },
                {
                  icon: DollarSign,
                  title: "Increase Property Value",
                  description: "Well-maintained properties command higher resale values and attract quality tenants.",
                },
                {
                  icon: Zap,
                  title: "Expert Solutions",
                  description:
                    "Benefit from our years of experience and access to professional-grade equipment and products.",
                },
                {
                  icon: Shield,
                  title: "Peace of Mind",
                  description: "Rest easy knowing your property is in capable hands, fully insured and guaranteed.",
                },
              ].map((benefit, index) => (
                <Card key={index} className="flex flex-col items-center text-center p-6">
                  <benefit.icon className="h-12 w-12 text-green-600 mb-4" />
                  <CardTitle className="mb-2">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Transform Your Property?"
          description="Whether you need a single service or comprehensive property care, we're here to help. Get started today!"
          primaryButtonText="Schedule a Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Get a Custom Quote"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

