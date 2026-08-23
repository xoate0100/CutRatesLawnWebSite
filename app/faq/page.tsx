import { FAQAccordion, CTASection, InteriorHero } from "@/components/blocks"
import { FAQS } from "@/lib/marketing-content"
import { getFAQCategories } from "@/lib/api"
import FAQSection from "@/components/faq-section"

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Cut Rates Lawn Care services and scheduling.",
}

export default async function FAQPage() {
  let categories: { name: string; slug: string }[] = []
  try {
    const raw = await getFAQCategories()
    categories = Array.isArray(raw)
      ? (raw as { name: string; slug: string }[])
      : Array.isArray((raw as { data?: unknown })?.data)
        ? ((raw as { data: { name: string; slug: string }[] }).data)
        : []
  } catch {
    categories = []
  }

  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Help"
        title="Frequently asked questions."
        description="Straight answers about booking, contracts, service areas, and bundles."
        mediaSlot="services.hero"
      />

      <section className="mx-auto w-[min(900px,92vw)] py-[clamp(2.5rem,5vw,4.5rem)]">
        {categories.length === 0 ? (
          <FAQAccordion items={FAQS} />
        ) : (
          categories.map((category) => (
            <div key={category.slug} className="mb-12">
              <h2 className="font-display mb-6 text-2xl font-bold text-ink">{category.name}</h2>
              <FAQSection category={category.slug} title="" />
            </div>
          ))
        )}
      </section>

      <CTASection title="Still have a question? Get a quote." />
    </div>
  )
}
