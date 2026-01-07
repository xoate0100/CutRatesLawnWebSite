import { ReviewsList } from "@/components/reviews/reviews-list"
import { TestimonialsList } from "@/components/testimonials-list"
import { Suspense } from "react"
import { Shield, Clock, Users, Award, ThumbsUp } from "lucide-react"

export const metadata = {
  title: "Customer Reviews & Testimonials | Cut Rates Lawn Care",
  description:
    "See what our satisfied customers in Wichita say about our lawn care services. Real reviews from real customers about our quality lawn maintenance.",
}

export default function TestimonialsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">What Our Customers Say</h1>
        <p className="text-xl text-gray-600 mb-6">
          Don't just take our word for it. See what our satisfied customers have to say about our lawn care services.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">100+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">Top-Rated in Wichita</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium">4.8/5 Average Rating</span>
          </div>
        </div>
      </div>

      {/* Google Reviews Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://storage.googleapis.com/site_photo_storage/images/partners/google-reviews.png"
              alt="Google Reviews"
              className="h-8"
            />
            <h2 className="text-2xl font-bold">Google Reviews</h2>
            <div className="ml-auto flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Updated daily</span>
            </div>
          </div>

          <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading reviews...</div>}>
            <ReviewsList
              source="google"
              initialLimit={8}
              showViewMore={true}
              businessUrl="https://maps.app.goo.gl/hzNhwvqRi3TMVGTE8"
            />
          </Suspense>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Customer Success Stories</h2>
          <div className="mb-6">
            <p className="text-gray-700">
              Here are some detailed stories from our long-term customers who have experienced the transformation we
              bring to their lawns over time. These testimonials highlight specific services and results.
            </p>
          </div>
          <TestimonialsList />
        </div>
      </section>

      {/* Before & After Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">See The Difference</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                <img
                  src="https://storage.googleapis.com/site_photo_storage/images/results/before-after-1.jpg"
                  alt="Before and after lawn transformation"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Neglected Lawn Transformation</h3>
              <p className="text-gray-700">
                "Cut Rates completely transformed our overgrown, patchy lawn into a lush green carpet that's the envy of
                the neighborhood. The before and after is incredible!"
              </p>
              <p className="text-sm text-gray-500 mt-2">— Michael R., East Wichita</p>
            </div>
            <div>
              <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                <img
                  src="https://storage.googleapis.com/site_photo_storage/images/results/before-after-2.jpg"
                  alt="Before and after garden bed transformation"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Complete Yard Makeover</h3>
              <p className="text-gray-700">
                "We were embarrassed by our yard before Cut Rates stepped in. Now we're proud to host backyard
                gatherings and our property value has increased!"
              </p>
              <p className="text-sm text-gray-500 mt-2">— Jennifer T., West Wichita</p>
            </div>
          </div>
        </div>
      </section>

      {/* Review CTA Section */}
      <section className="bg-green-50 p-8 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We value your feedback! If you've enjoyed our services, please consider leaving a review. Your reviews help
            us improve and help other homeowners in Wichita find reliable lawn care.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://maps.app.goo.gl/hzNhwvqRi3TMVGTE8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src="https://storage.googleapis.com/site_photo_storage/images/partners/google-reviews.png"
              alt="Google Reviews"
              className="h-6"
            />
            <span className="font-medium">Review on Google</span>
          </a>

          <a
            href="#"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src="https://storage.googleapis.com/site_photo_storage/images/partners/yelp-logo.png"
              alt="Yelp"
              className="h-6"
            />
            <span className="font-medium">Review on Yelp</span>
          </a>

          <a
            href="/contact"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="font-medium">Send Us Feedback</span>
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">How do you ensure consistent quality?</h3>
              <p className="text-gray-700">
                We maintain strict quality standards through regular training, equipment maintenance, and quality
                checks. Our team follows detailed service checklists for every property to ensure nothing is missed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What if I'm not satisfied with the service?</h3>
              <p className="text-gray-700">
                Your satisfaction is guaranteed! If you're not completely happy with our work, we'll return to fix any
                issues at no additional cost. Just let us know within 48 hours of service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How long does it take to see results?</h3>
              <p className="text-gray-700">
                You'll notice an immediate improvement after the first service. For treatments like fertilization and
                weed control, visible results typically appear within 1-2 weeks, with full transformation over a season.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
