import CTASection from "@/components/cta-section"

export default function CertificationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Training &amp; standards</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Our crews follow Kansas Best Management Practices for lawn care and are trained on safe equipment use,
              customer communication, and seasonal service standards. We do not currently list third-party association
              certifications on this site.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl space-y-4 text-sage">
            <p>
              If you need proof of insurance, licensing, or a specific credential for a commercial bid, call us and we
              will send documentation that matches the job.
            </p>
          </div>
        </section>

        <CTASection
          title="Talk with a local dispatcher"
          description="Tell us about your property — we will confirm scope and next steps."
          primaryButtonText="Get a quote"
          primaryButtonLink="/quote"
          secondaryButtonText="About us"
          secondaryButtonLink="/about"
        />
      </main>
    </div>
  )
}
