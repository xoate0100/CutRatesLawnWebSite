import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, Droplets, Bug, Home, Shovel, Snowflake, ArrowRight } from "lucide-react"
import CTASection from "@/components/cta-section"

const services = [
  {
    icon: Scissors,
    title: "Lawn Care",
    description: "Comprehensive lawn maintenance including mowing, edging, and fertilization.",
    link: "/services/lawn-care",
  },
  {
    icon: Droplets,
    title: "Power Washing",
    description: "High-pressure cleaning for driveways, decks, and exterior surfaces.",
    link: "/services/power-washing",
  },
  {
    icon: Bug,
    title: "Pest Control",
    description: "Effective pest management solutions for your home and garden.",
    link: "/services/pest-control",
  },
  {
    icon: Home,
    title: "Gutter Cleaning",
    description: "Thorough cleaning and maintenance of gutters and downspouts.",
    link: "/services/gutter-cleaning",
  },
  {
    icon: Shovel,
    title: "Hardscaping",
    description: "Custom design and installation of patios, walkways, and retaining walls.",
    link: "/services/hardscaping",
  },
  {
    icon: Snowflake,
    title: "Snow Removal",
    description: "Reliable snow plowing and ice management services.",
    link: "/services/snow-removal",
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              From routine lawn maintenance to specialized exterior care, we provide everything your property needs to
              look its best year-round.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <service.icon className="h-10 w-10 text-green-600 mb-4" />
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto pt-4">
                    <Link href={service.link} className="w-full">
                      <Button variant="outline" className="w-full justify-between">
                        Learn More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Residential and Commercial Services */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Tailored Solutions for Every Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Residential Services</CardTitle>
                  <CardDescription>Comprehensive care for homeowners</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    We offer a wide range of services to keep your home's exterior looking its best, from lawn care to
                    pest control.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/services/residential" className="w-full">
                    <Button className="w-full">Explore Residential Services</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Commercial Services</CardTitle>
                  <CardDescription>Professional maintenance for businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    We provide tailored solutions for commercial properties, ensuring your business always makes a great
                    first impression.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/services/commercial" className="w-full">
                    <Button className="w-full">Explore Commercial Services</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Get Started?"
          description="Schedule your service today or contact us for a custom quote tailored to your needs."
          primaryButtonText="Schedule Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Contact Us"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

