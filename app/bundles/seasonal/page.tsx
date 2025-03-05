import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const seasonalBundles = [
  {
    title: "Spring Revival Package",
    price: 599,
    description: "Prepare your property for the growing season",
    features: [
      "Comprehensive spring cleanup",
      "Lawn aeration and overseeding",
      "Fertilization and pre-emergent weed control",
      "Mulch application",
      "Sprinkler system activation and check",
    ],
  },
  {
    title: "Summer Maintenance Bundle",
    price: 799,
    description: "Keep your property lush and healthy during peak growing season",
    features: [
      "Weekly mowing and edging",
      "Bi-weekly fertilization and weed control",
      "Shrub and hedge trimming",
      "Pest control treatments",
      "Irrigation system monitoring and adjustments",
    ],
    popular: true,
  },
  {
    title: "Fall Prep Package",
    price: 699,
    description: "Prepare your landscape for the winter months",
    features: [
      "Fall cleanup and leaf removal",
      "Final mowing and edging",
      "Winterizing fertilization",
      "Aeration and overseeding",
      "Sprinkler system winterization",
    ],
  },
  {
    title: "Winter Protection Plan",
    price: 499,
    description: "Protect your property during the harsh winter months",
    features: [
      "Snow removal for driveway and walkways",
      "Ice management",
      "Winter pruning for trees and shrubs",
      "Anti-desiccant application for evergreens",
      "Winter equipment maintenance",
    ],
  },
]

export default function SeasonalBundlesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-orange-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Seasonal Bundles</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Tailored care for your property throughout the year. Our seasonal bundles ensure your landscape looks its
              best in every season.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {seasonalBundles.map((bundle, index) => (
                <Card key={index} className={`flex flex-col ${bundle.popular ? "border-orange-500 shadow-lg" : ""}`}>
                  {bundle.popular && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
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
                        <span className="text-lg font-normal text-gray-500">/season</span>
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {bundle.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/contact" className="w-full">
                      <Button
                        className={`w-full ${bundle.popular ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}`}
                      >
                        Choose Bundle
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Prepare Your Property for Every Season"
          description="Choose the seasonal bundles that fit your needs and ensure your property looks great year-round."
          primaryButtonText="Contact Us"
          primaryButtonLink="/contact"
          secondaryButtonText="View All Services"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

