import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

const pricingPlans = [
  {
    name: "Basic Lawn Care",
    price: 99,
    period: "month",
    description: "Essential lawn maintenance for homeowners",
    features: ["Bi-weekly mowing", "Edging and trimming", "Debris removal", "Seasonal fertilization (2x/year)"],
    popular: false,
  },
  {
    name: "Premium Property Care",
    price: 199,
    period: "month",
    description: "Comprehensive care for your entire property",
    features: [
      "Weekly mowing",
      "Edging and trimming",
      "Debris removal",
      "Seasonal fertilization (4x/year)",
      "Weed control",
      "Pest control (bi-monthly)",
      "Aeration and overseeding (1x/year)",
    ],
    popular: true,
  },
  {
    name: "Commercial Maintenance",
    price: "Custom",
    period: "quote",
    description: "Tailored solutions for businesses and properties",
    features: [
      "Customized mowing schedule",
      "Landscape maintenance",
      "Snow removal (seasonal)",
      "Pest control",
      "Irrigation system management",
      "24/7 support",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparent Pricing</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Choose the plan that fits your needs. All plans include our satisfaction guarantee.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`flex flex-col ${plan.popular ? "border-green-500 shadow-lg" : ""}`}>
                  <CardHeader>
                    {plan.popular && (
                      <div className="px-3 py-1 text-sm text-white bg-green-500 rounded-full w-fit mb-4">
                        Most Popular
                      </div>
                    )}
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                      </span>
                      {plan.period !== "quote" && <span className="text-gray-500">/{plan.period}</span>}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href="/schedule" className="w-full">
                      <Button className={`w-full ${plan.popular ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}>
                        {plan.price === "Custom" ? "Get Quote" : "Choose Plan"}
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
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "Can I customize my plan?",
                  answer:
                    "We understand that every property is unique. Contact us for a custom quote tailored to your specific needs.",
                },
                {
                  question: "Is there a contract or commitment?",
                  answer:
                    "Our residential services are provided on a month-to-month basis with no long-term contract required. Commercial services may have different terms.",
                },
                {
                  question: "What forms of payment do you accept?",
                  answer:
                    "We accept all major credit cards, checks, and ACH transfers. You can set up automatic payments for added convenience.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Get Started?"
          description="Choose your plan and schedule your first service today. Enjoy a greener, healthier property without the hassle."
          primaryButtonText="Schedule Now"
          primaryButtonLink="/schedule"
          secondaryButtonText="Contact Us"
          secondaryButtonLink="/contact"
        />
      </main>
    </div>
  )
}

