import Link from "next/link"
import { IMAGES } from "@/lib/image-constants"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px]">
        <img
          src={IMAGES.HERO_HOME || "/placeholder.svg"}
          alt="Beautiful lawn maintained by Cut Rates Lawn Care"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Professional Lawn Care in Wichita, KS
              </h1>
              <p className="text-xl text-white mb-8">Quality lawn maintenance services at competitive rates</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Get a Free Quote
                </Link>
                <Link
                  href="/services"
                  className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured On Section */}
      <section className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <p className="font-semibold text-gray-700">As Featured On:</p>
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <img src={IMAGES.PARTNER_KWCH || "/placeholder.svg"} alt="KWCH 12 News Logo" className="h-8 md:h-10" />
              <img src={IMAGES.PARTNER_GOOGLE || "/placeholder.svg"} alt="Google Reviews" className="h-8 md:h-10" />
              <img src={IMAGES.PARTNER_YELP || "/placeholder.svg"} alt="Yelp" className="h-8 md:h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-60">
                <img
                  src={IMAGES.SERVICE_MOWING || "/placeholder.svg"}
                  alt="Lawn Mowing Service"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Lawn Mowing</h3>
                <p className="text-gray-600 mb-4">
                  Professional mowing services to keep your lawn looking its best year-round.
                </p>
                <Link href="/services/lawn-mowing" className="text-green-600 font-medium hover:text-green-700">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-60">
                <img
                  src={IMAGES.SERVICE_FERTILIZATION || "/placeholder.svg"}
                  alt="Lawn Fertilization Service"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Fertilization</h3>
                <p className="text-gray-600 mb-4">
                  Custom fertilization programs to promote healthy growth and vibrant color.
                </p>
                <Link href="/services/fertilization" className="text-green-600 font-medium hover:text-green-700">
                  Learn More →
                </Link>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-60">
                <img
                  src={IMAGES.SERVICE_WEED_CONTROL || "/placeholder.svg"}
                  alt="Weed Control Service"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Weed Control</h3>
                <p className="text-gray-600 mb-4">Effective weed control treatments to keep your lawn weed-free.</p>
                <Link href="/services/weed-control" className="text-green-600 font-medium hover:text-green-700">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={IMAGES.TESTIMONIAL_1 || "/placeholder.svg"}
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Michael R.</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Cut Rates Lawn Care has been maintaining my lawn for over 2 years now. Their service is always on time
                and my lawn has never looked better!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={IMAGES.TESTIMONIAL_2 || "/placeholder.svg"}
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">Jennifer L.</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I've tried several lawn care companies in Wichita, and Cut Rates is by far the best. Their attention to
                detail and customer service is outstanding."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={IMAGES.TESTIMONIAL_3 || "/placeholder.svg"}
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">David W.</h3>
                  <div className="flex text-yellow-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The team at Cut Rates transformed my neglected lawn into the envy of the neighborhood. Their prices are
                fair and the results speak for themselves."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready for a Beautiful Lawn?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Contact us today for a free quote and let us help you achieve the lawn you've always wanted.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  )
}
