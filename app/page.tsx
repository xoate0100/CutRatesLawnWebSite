import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Calendar, Building2, Home, Briefcase, Star } from "lucide-react"
import ServiceCard from "@/components/service-card"
import BundleCard from "@/components/bundle-card"
import CTASection from "@/components/cta-section"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/card"

const reviews = [
  {
    id: 1,
    name: "John D.",
    rating: 5,
    comment:
      "Cut Rates has been maintaining my lawn for over a year now, and I couldn't be happier with their service. Always on time and thorough!",
    date: "2023-05-15",
  },
  {
    id: 2,
    name: "Sarah M.",
    rating: 4,
    comment:
      "Great service overall. The team is professional and my yard looks better than ever. Knocked off one star because scheduling can sometimes be a bit inflexible.",
    date: "2023-05-22",
  },
  {
    id: 3,
    name: "Mike R.",
    rating: 5,
    comment:
      "I've tried several lawn care services in the area, and Cut Rates is by far the best. Their attention to detail is impressive.",
    date: "2023-05-29",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=800&width=1920"
              alt="Beautiful lawn and landscaping"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Complete Exterior Property Solutions</h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl">
              Professional lawn care, power washing, pest control, and more for residential and commercial properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Schedule Service <Calendar className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
                Request Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Comprehensive Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From routine lawn maintenance to specialized exterior care, we provide everything your property needs to
                look its best year-round.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard
                title="Lawn Care"
                description="Regular mowing, fertilization, aeration, and seasonal cleanup to keep your lawn healthy and beautiful."
                icon="lawn"
                link="/services/lawn-care"
              />
              <ServiceCard
                title="Power Washing"
                description="Revitalize your home's exterior, driveway, deck, and more with our professional power washing services."
                icon="power-washing"
                link="/services/power-washing"
              />
              <ServiceCard
                title="Pest Control"
                description="Comprehensive pest management solutions to protect your property from unwanted visitors."
                icon="pest-control"
                link="/services/pest-control"
              />
              <ServiceCard
                title="Gutter Cleaning"
                description="Prevent water damage with regular gutter cleaning and maintenance services."
                icon="gutter"
                link="/services/gutter-cleaning"
              />
              <ServiceCard
                title="Hardscapes"
                description="Custom patios, walkways, retaining walls, and more to enhance your outdoor living space."
                icon="hardscape"
                link="/services/hardscapes"
              />
              <ServiceCard
                title="Snow Removal"
                description="Keep your property safe and accessible during winter with our reliable snow removal services."
                icon="snow"
                link="/services/snow-removal"
              />
            </div>

            <div className="mt-12 text-center">
              <Link href="/services">
                <Button variant="outline" className="gap-2">
                  View All Services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Client Segments */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col h-full">
                <div className="mb-6">
                  <Home className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Residential Services</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive solutions for homeowners looking to maintain beautiful, healthy outdoor spaces with
                  hassle-free scheduling and transparent pricing.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>One-click scheduling for busy homeowners</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Bundle services for significant cost savings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Flexible subscription options (monthly, seasonal)</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link href="/services/residential">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Residential Services</Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col h-full">
                <div className="mb-6">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Commercial Services</h3>
                <p className="text-gray-600 mb-6">
                  Tailored maintenance programs for property managers and business owners who need reliable, consistent
                  exterior property care.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Year-round contracts with bundled services</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Customizable plans based on property size</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Emergency services for urgent requests</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Link href="/services/commercial">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Commercial Services</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Bundles & Subscriptions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Service Bundles & Subscriptions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Save time and money with our convenient service bundles and subscription plans. Perfect for busy
                homeowners and property managers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BundleCard
                title="Total Home Exterior Care"
                price="249"
                period="month"
                description="Complete exterior maintenance package including lawn care, gutter cleaning, and seasonal treatments."
                features={[
                  "Bi-weekly lawn mowing",
                  "Quarterly gutter cleaning",
                  "Seasonal fertilization",
                  "Bi-annual power washing",
                  "Priority scheduling",
                ]}
                popular={true}
                link="/bundles/total-home"
              />
              <BundleCard
                title="Landscape Health & Maintenance"
                price="179"
                period="month"
                description="Keep your landscape looking its best with our comprehensive lawn and garden care package."
                features={[
                  "Weekly lawn mowing",
                  "Monthly fertilization",
                  "Weed control",
                  "Shrub trimming",
                  "Seasonal cleanup",
                ]}
                popular={false}
                link="/bundles/landscape"
              />
              <BundleCard
                title="Commercial Property Maintenance"
                price="Custom"
                period="quote"
                description="Tailored maintenance solutions for commercial properties of all sizes."
                features={[
                  "Customized service schedule",
                  "Multiple property management",
                  "Snow removal (seasonal)",
                  "Landscape maintenance",
                  "24/7 emergency services",
                ]}
                popular={false}
                link="/bundles/commercial"
              />
            </div>

            <div className="mt-12 text-center">
              <Link href="/bundles">
                <Button variant="outline" className="gap-2">
                  View All Bundles & Subscriptions <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <Card key={review.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <CardTitle>{review.name}</CardTitle>
                    <CardDescription>{new Date(review.date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>"{review.comment}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/our-work">
                <Button variant="outline">
                  View Our Work <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Homeowner"
              quote="Cut Rates has transformed our yard! Their subscription service is so convenient, and the team is always professional and thorough."
              rating={5}
              image="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              name="Michael Rodriguez"
              role="Property Manager"
              quote="Managing multiple properties is so much easier with Cut Rates. Their commercial bundle has saved us time and money while keeping our properties looking immaculate."
              rating={5}
              image="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard
              name="Jennifer Williams"
              role="HOA President"
              quote="Our community has never looked better since we started working with Cut Rates. Their attention to detail and responsive customer service make them a pleasure to work with."
              rating={4}
              image="/placeholder.svg?height=100&width=100"
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/testimonials">
              <Button variant="outline" className="gap-2">
                Read More Testimonials <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

        {/* Careers Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-green-50 rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="mb-6">
                    <Briefcase className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
                  <p className="text-lg text-gray-700 mb-6">
                    We're always looking for talented individuals to join our growing team. Explore career opportunities
                    with Cut Rates Lawn Care.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Competitive pay and benefits</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Career growth opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Training and certification programs</span>
                    </li>
                  </ul>
                  <Link href="/careers">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">View Open Positions</Button>
                  </Link>
                </div>
                <div className="relative h-64 md:h-full">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Cut Rates Lawn Care team members"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Cut Rates Lawn Care?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Certified Experts",
                  description: "Our team consists of certified lawn care professionals with years of experience.",
                },
                {
                  title: "Eco-Friendly Practices",
                  description:
                    "We use sustainable methods and products to keep your lawn healthy and environmentally friendly.",
                },
                {
                  title: "Customized Care Plans",
                  description: "We tailor our services to meet the unique needs of your lawn and landscape.",
                },
                {
                  title: "Cutting-Edge Equipment",
                  description:
                    "We invest in the latest lawn care technology to ensure efficient and effective service.",
                },
                {
                  title: "100% Satisfaction Guarantee",
                  description: "We stand behind our work with a 100% satisfaction guarantee on all our services.",
                },
                {
                  title: "Fully Insured",
                  description: "For your peace of mind, we are fully insured and bonded for all the services we offer.",
                },
              ].map((item, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Transform Your Property?"
          description="Schedule a service or request a custom quote today. Our team is ready to help you achieve the perfect outdoor space."
          primaryButtonText="Schedule Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Get a Quote"
          secondaryButtonLink="/quote"
        />
      </main>
    </div>
  )
}

