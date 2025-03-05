import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const residentialBundles = [
  {
    title: "Essential Lawn Care",
    price: 129,
    period: "month",
    description: "Basic lawn maintenance for smaller properties",
    features: ["Bi-weekly mowing", "Edging and trimming", "Seasonal fertilization (2x/year)", "Basic weed control"],
  },
  {
    title: "Premium Property Care",
    price: 249,
    period: "month",
    description: "Comprehensive care for your entire property",
    features: [
      "Weekly mowing",
      "Edging and trimming",
      "Seasonal fertilization (4x/year)",
      "Advanced weed control",
      "Shrub and tree trimming",
      "Leaf removal (fall)",
      "Annual aeration",
    ],
    popular: true,
  },
  {
    title: "Deluxe Landscape Package",
    price: 399,
    period: "month",
    description: "All-inclusive care for larger properties",
    features: [
      "Weekly mowing",
      "Edging and trimming",
      "Monthly fertilization",
      "Comprehensive weed management",
      "Shrub and tree care",
      "Seasonal color planting",
      "Irrigation system maintenance",
      "Pest control treatments",
    ],
  },
]

export default function ResidentialBundlesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Residential Bundles</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Simplify your lawn care with our comprehensive residential bundles. Choose the perfect package for your
              home.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residentialBundles.map((bundle, index) => (
                <Card key={index} className={`flex flex-col ${bundle.popular ? "border-green-500 shadow-lg" : ""}`}>
                  {bundle.popular && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{bundle.title}</CardTitle>
                    <CardDescription>{bundle.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <p className="text-3xl font-bold">
                        ${bundle.price}
                        <span className="text-lg font-normal text-gray-500">/{bundle.period}</span>
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {bundle.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact" className="w-full">
                      <Button
                        className={`w-full ${bundle.popular ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                      >
                        Choose Plan
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Get Started?"
          description="Choose your perfect residential bundle and enjoy a beautiful, well-maintained property year-round."
          primaryButtonText="Contact Us"
          primaryButtonLink="/contact"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

