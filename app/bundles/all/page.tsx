import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import CTASection from "@/components/cta-section"

const bundleCategories = [
  {
    title: "Residential Bundles",
    description: "Comprehensive care packages for homeowners",
    link: "/bundles/residential",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Commercial Bundles",
    description: "Tailored solutions for businesses and properties",
    link: "/bundles/commercial",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Seasonal Bundles",
    description: "Specialized care for every season",
    link: "/bundles/seasonal",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function AllBundlesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">All Service Bundles</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Explore our range of service bundles designed to meet all your property care needs. From residential to
              commercial, we have the perfect solution for you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundleCategories.map((category, index) => (
                <Card key={index} className="flex flex-col">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">{/* Add more content here if needed */}</CardContent>
                  <CardFooter>
                    <Link href={category.link} className="w-full">
                      <Button className="w-full">
                        View Bundles <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Service Bundles?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Cost-Effective",
                  description: "Save money by bundling multiple services together.",
                },
                {
                  title: "Customizable",
                  description: "Tailor our bundles to fit your specific needs and property requirements.",
                },
                {
                  title: "Convenient",
                  description: "Simplify your property care with our all-in-one service packages.",
                },
                {
                  title: "Professional Care",
                  description: "Benefit from our expert team's comprehensive knowledge and skills.",
                },
                {
                  title: "Year-Round Solutions",
                  description: "Ensure your property looks its best throughout all seasons.",
                },
                {
                  title: "Flexible Options",
                  description: "Choose from residential, commercial, or seasonal bundles to suit your situation.",
                },
              ].map((benefit, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Find Your Perfect Service Bundle"
          description="Contact us today to discuss which bundle is right for you or to create a custom package tailored to your needs."
          primaryButtonText="Contact Us"
          primaryButtonLink="/contact"
          secondaryButtonText="View All Services"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

