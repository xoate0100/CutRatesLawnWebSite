import FAQSection from "@/components/faq-section"
import CTASection from "@/components/cta-section"
import { getFAQCategories } from "@/lib/api"
import ErrorState from "@/components/error-state"

export default async function FAQPage() {
  try {
    const categories = await getFAQCategories()

    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <section className="bg-green-600 text-white py-20">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <p className="text-xl mb-8 max-w-3xl">
                Find answers to common questions about our services, scheduling, and policies.
              </p>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              {categories.map((category, index) => (
                <div key={index} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">{category.name}</h2>
                  <FAQSection category={category.slug} title="" />
                </div>
              ))}
            </div>
          </section>

          <CTASection
            title="Still Have Questions?"
            description="Our team is here to help. Contact us for personalized assistance."
            primaryButtonText="Contact Us"
            primaryButtonLink="/contact"
            secondaryButtonText="View Services"
            secondaryButtonLink="/services"
          />
        </main>
      </div>
    )
  } catch (error) {
    console.error("Error fetching FAQ categories:", error)
    return <ErrorState message="Failed to load FAQ content. Please try again later." />
  }
}
