import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const commercialBundles = [
  {
    title: "Basic Commercial Maintenance",
    price: "Custom",
    period: "quote",
    description: "Essential maintenance for small commercial properties",
    features: [
      "Weekly mowing and edging",
      "Basic landscaping maintenance",
      "Seasonal clean-ups",
      "Snow removal (winter)",
    ],
  },
  {
    title: "Professional Property Care",
    price: "Custom",
    period: "quote",
    description: "Comprehensive care for medium-sized commercial properties",
    features: [
      "Weekly mowing, edging, and trimming",
      "Comprehensive landscaping maintenance",
      "Fertilization and weed control",
      "Irrigation system management",
      "Snow and ice management (winter)",
      "24/7 emergency services",
    ],
    popular: true,
  },
  {
    title: "Enterprise Landscape Management",
    price: "Custom",
    period: "quote",
    description: "All-inclusive management for large commercial properties",
    features: [
      "Customized mowing and maintenance schedule",
      "Full-service landscaping and hardscaping",
      "Comprehensive plant health care",
      "Water feature and irrigation management",
      "Year-round pest control",
      "Priority snow and ice management",
      "Dedicated account manager",
    ],
  },
]

export default function CommercialBundlesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Commercial Bundles</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Tailored maintenance solutions for businesses of all sizes. Keep your commercial property looking its best
              year-round.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {commercialBundles.map((bundle, index) => (
                <Card key={index} className={`flex flex-col ${bundle.popular ? "border-blue-500 shadow-lg" : ""}`}>
                  {bundle.popular && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
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
                        {bundle.price}
                        {bundle.period !== "quote" && (
                          <span className="text-lg font-normal text-gray-500">/{bundle.period}</span>
                        )}
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {bundle.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact" className="w-full">
                      <Button className={`w-full ${bundle.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}>
                        Get Custom Quote
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Elevate Your Commercial Property"
          description="Contact us today to discuss your commercial property needs and receive a customized maintenance plan."
          primaryButtonText="Request a Quote"
          primaryButtonLink="/contact"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/services/commercial"
        />
      </main>
    </div>
  )
}

