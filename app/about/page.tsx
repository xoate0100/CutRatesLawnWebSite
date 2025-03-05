import Image from "next/image"
import { CheckCircle } from "lucide-react"
import CTASection from "@/components/cta-section"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=600&width=1920"
              alt="Cut Rates Lawn Care team"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Cut Rates Lawn Care</h1>
            <p className="text-xl mb-8 max-w-3xl">
              For over 30 years, we've been providing top-quality exterior property services to homeowners and
              businesses in Valley Center, KS and surrounding areas.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="mb-4">
                  Founded in 1990 by the Johnson family, Cut Rates Lawn Care began as a small, local operation with a
                  single truck and a passion for beautiful lawns. Over the years, we've grown into a full-service
                  exterior property maintenance company, but our commitment to quality and customer satisfaction remains
                  unchanged.
                </p>
                <p>
                  Today, we're proud to be a trusted name in Valley Center and beyond, serving both residential and
                  commercial clients with a wide range of services designed to keep properties looking their best
                  year-round.
                </p>
              </div>
              <div className="relative h-[400px]">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Cut Rates Lawn Care founders"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality",
                  description:
                    "We never compromise on the quality of our work, using the best materials and techniques to ensure lasting results.",
                },
                {
                  title: "Integrity",
                  description:
                    "Honesty and transparency are at the heart of everything we do, from pricing to service delivery.",
                },
                {
                  title: "Community",
                  description:
                    "We're proud to be part of the Valley Center community and are committed to giving back through various local initiatives.",
                },
              ].map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "John Johnson",
                  role: "Founder & CEO",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Sarah Johnson",
                  role: "Operations Manager",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Mike Smith",
                  role: "Head of Customer Relations",
                  image: "/placeholder.svg?height=300&width=300",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Involvement */}
        <section className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Community Involvement</h2>
            <p className="text-center mb-12 max-w-3xl mx-auto">
              At Cut Rates Lawn Care, we believe in giving back to the community that has supported us for over three
              decades. Here are some of the local initiatives we're proud to be a part of:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                'Annual "Green Valley" park clean-up event',
                "Sponsorship of local youth sports teams",
                "Free lawn care services for elderly residents",
                "Educational workshops on sustainable landscaping",
                "Partnerships with local environmental organizations",
                "Holiday decoration assistance for community spaces",
              ].map((initiative, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>{initiative}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Experience the Cut Rates Difference?"
          description="Join the thousands of satisfied customers who trust us with their property care needs."
          primaryButtonText="Get a Quote"
          primaryButtonLink="/contact"
          secondaryButtonText="View Our Services"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

