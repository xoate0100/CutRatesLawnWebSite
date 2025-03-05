import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import CTASection from "@/components/cta-section"

const bundles = [
  {
    title: "Total Home Exterior Care",
    price: 249,
    period: "month",
    description: "Complete exterior maintenance package including lawn care, gutter cleaning, and seasonal treatments.",
    features: [
      "Bi-weekly lawn mowing",
      "Quarterly gutter cleaning",
      "Seasonal fertilization",
      "Bi-annual power washing",
      "Priority scheduling",
    ],
    popular: true,
    link: "/bundles/total-home",
  },
  {
    title: "Landscape Health & Maintenance",
    price: 179,
    period: "month",
    description: "Keep your landscape looking its best with our comprehensive lawn and garden care package.",
    features: ["Weekly lawn mowing", "Monthly fertilization", "Weed control", "Shrub trimming", "Seasonal cleanup"],
    popular: false,
    link: "/bundles/landscape",
  },
  {
    title: "Commercial Property Maintenance",
    price: "Custom",
    period: "quote",
    description: "Tailored maintenance solutions for commercial properties of all sizes.",
    features: [
      "Customized service schedule",
      "Multiple property management",
      "Snow removal (seasonal)",
      "Landscape maintenance",
      "24/7 emergency services",
    ],
    popular: false,
    link: "/bundles/commercial",
  },
]

export default function BundlesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Service Bundles & Subscriptions</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Save time and money with our convenient service bundles and subscription plans. Perfect for busy
              homeowners and property managers.
            </p>
          </div>
        </section>

        {/* Bundles Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundles.map((bundle, index) => (
                <Card
                  key={index}
                  className={`flex flex-col relative ${bundle.popular ? "border-green-500 shadow-lg" : ""}`}
                >
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
                        {bundle.price === "Custom" ? "Custom" : `$${bundle.price}`}
                        {bundle.period !== "quote" && (
                          <span className="text-lg font-normal text-gray-500">/{bundle.period}</span>
                        )}
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
                  <CardFooter className="pt-4">
                    <Link href={bundle.link} className="w-full">
                      <Button
                        className={`w-full ${bundle.popular ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                        variant={bundle.popular ? "default" : "outline"}
                      >
                        {bundle.price === "Custom" ? "Get Custom Quote" : "Subscribe Now"}{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Our Bundles & Subscriptions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Save Money",
                  description:
                    "Bundle services together for significant cost savings compared to individual service bookings.",
                },
                {
                  title: "Convenience",
                  description:
                    "Set it and forget it. Regular services are scheduled automatically, saving you time and hassle.",
                },
                {
                  title: "Customization",
                  description:
                    "Tailor your bundle to your specific needs, ensuring you get exactly the services you require.",
                },
              ].map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              {[
                {
                  question: "Can I customize my bundle?",
                  answer:
                    "Yes, we offer customization options for all our bundles to ensure they meet your specific needs.",
                },
                {
                  question: "How often are services performed?",
                  answer:
                    "Service frequency varies depending on the bundle and your specific needs. Most bundles include weekly or bi-weekly services.",
                },
                {
                  question: "Can I change or cancel my subscription?",
                  answer:
                    "Yes, you can modify or cancel your subscription at any time. Please contact us for assistance.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Simplify Your Property Maintenance?"
          description="Choose a bundle that works for you and start enjoying hassle-free, professional care for your property."
          primaryButtonText="Get Started"
          primaryButtonLink="/schedule"
          secondaryButtonText="Contact Us"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

