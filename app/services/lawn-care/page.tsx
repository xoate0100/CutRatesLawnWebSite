import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"
import StructuredData from "@/components/structured-data"

export default function LawnCarePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData
        type="Service"
        data={{
          name: "Lawn Care Services",
          description: "Professional lawn care services including mowing, fertilization, and weed control.",
          provider: {
            "@type": "LocalBusiness",
            name: "Cut Rates Lawn Care",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Lawn Avenue",
              addressLocality: "Valley Center",
              addressRegion: "KS",
              postalCode: "67147",
              addressCountry: "US",
            },
          },
          areaServed: "Valley Center, KS",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Lawn Care Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Regular mowing and edging",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Fertilization and weed control",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Aeration and overseeding",
                },
              },
            ],
          },
        }}
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=600&width=1920"
              alt="Lush green lawn"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Lawn Care Services</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Keep your lawn lush, green, and healthy with our comprehensive lawn care services. From regular mowing to
              specialized treatments, we've got you covered.
            </p>
            <Link href="/schedule">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Schedule Lawn Care
              </Button>
            </Link>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Lawn Care Services Include:</h2>
                <ul className="space-y-4">
                  {[
                    "Regular mowing and edging",
                    "Fertilization and weed control",
                    "Aeration and overseeding",
                    "Pest management",
                    "Soil testing and pH balancing",
                    "Seasonal clean-up",
                  ].map((service, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[400px]">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Lawn care professional at work"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Cut Rates for Your Lawn Care?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Experienced Professionals",
                  description: "Our team of skilled lawn care experts brings years of experience to every job.",
                },
                {
                  title: "Customized Care Plans",
                  description: "We tailor our services to meet the unique needs of your lawn and landscape.",
                },
                {
                  title: "Eco-Friendly Practices",
                  description:
                    "We use sustainable methods and products to keep your lawn healthy and environmentally friendly.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Lawn Care Pricing</h2>
            <p className="text-center mb-8 max-w-3xl mx-auto">
              We offer competitive pricing for our lawn care services. Get in touch for a custom quote based on your
              lawn's size and specific needs.
            </p>
            <div className="flex justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Get a Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready for a Healthier, More Beautiful Lawn?"
          description="Schedule your lawn care service today and see the difference professional care can make."
          primaryButtonText="Schedule Lawn Care"
          primaryButtonLink="/schedule"
          secondaryButtonText="Learn About Our Bundles"
          secondaryButtonLink="/bundles"
        />
      </main>
    </div>
  )
}

