import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CTASection } from "@/components/blocks"
import { calculateEstimate } from "@/lib/pricing/estimate"

const startingMow = calculateEstimate({
  propertyType: "residential",
  serviceType: "mowing",
  lawnSizeSqFt: 5000,
  frequency: "weekly",
  mowTier: "standard",
})
const startingFull = calculateEstimate({
  propertyType: "residential",
  serviceType: "full-service",
  lawnSizeSqFt: 5000,
  frequency: "weekly",
  mowTier: "complete",
})

const plans = [
  {
    name: "Lawn mowing (planning)",
    price: startingMow.ok ? startingMow.result.displayAmount : "from $45 per visit",
    description: "Published residential Green Standard through ¼ acre — estimator, not a contract.",
    features: ["Mowing & trimming", "Month-to-month", "Final price after property review"],
    href: "/quote?service=mowing",
  },
  {
    name: "Full-service lawn (planning)",
    price: startingFull.ok ? startingFull.result.displayAmount : "Custom",
    description: "Complete mowing plus fertility program using the same CFO model as /quote.",
    features: ["Weekly or bi-weekly mowing", "Fertility program", "Confirm on site"],
    href: "/quote?service=full-service",
    popular: true,
  },
  {
    name: "Commercial & specialty",
    price: "Custom quote",
    description: "Pest, snow, lights, hardscape, and multi-property — quoted after we see the site.",
    features: ["No fake monthly packages", "Route-based commercial", "COI available"],
    href: "/quote?service=commercial",
  },
]

export default function PricingPage() {
  return (
    <div className="bg-paper">
      <section className="bg-forest text-white py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold">Planning prices — not bait-and-switch plans</h1>
          <p className="mt-4 text-white/80">
            Numbers below come from the same estimator as the quote funnel (`lib/pricing/estimate.ts`). They are
            planning figures through ¼ acre. Your property gets a confirmed quote.
          </p>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-green shadow-lg" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-display text-3xl font-bold">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant="lime">
                  <Link href={plan.href}>Get this quote</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      <CTASection title="Want the number for your yard?" ctaHref="/quote" ctaLabel="Open the estimator" />
    </div>
  )
}
