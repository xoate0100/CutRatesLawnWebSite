import { Suspense } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getServiceBySlug } from "@/lib/api-helpers"
import { ServiceTestimonials } from "@/components/service-testimonials"
import { QuoteForm } from "@/components/quote-form"
import { companyInfo } from "@/lib/static-data"
import { Phone, Calendar, CheckCircle, Star, Clock, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ServicePageProps {
  params: {
    slug: string
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = params

  try {
    const response = await getServiceBySlug(slug)

    if (!response.data || response.data.length === 0) {
      return notFound()
    }

    const service = response.data[0]
    const { attributes } = service
    const { title, description, content, price, priceUnit, coverImage } = attributes

    // Get the cover image URL or use a placeholder
    const imageUrl =
      coverImage?.data?.attributes?.url || `/placeholder.svg?height=600&width=1200&text=${encodeURIComponent(title)}`

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{description}</p>

          {/* Trust badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white border-green-500 text-green-700 px-3 py-1">
              <Star className="h-3.5 w-3.5 mr-1 fill-yellow-400 text-yellow-400" />
              <span>5-Star Service</span>
            </Badge>
            <Badge variant="outline" className="bg-white border-blue-500 text-blue-700 px-3 py-1">
              <Shield className="h-3.5 w-3.5 mr-1 text-blue-500" />
              <span>Licensed & Insured</span>
            </Badge>
            <Badge variant="outline" className="bg-white border-amber-500 text-amber-700 px-3 py-1">
              <Award className="h-3.5 w-3.5 mr-1 text-amber-500" />
              <span>Satisfaction Guaranteed</span>
            </Badge>
          </div>
        </div>

        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" priority />

              {/* Featured on badge */}
              <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-md">
                <p className="text-sm font-medium flex items-center">
                  <Image
                    src="/placeholder.svg?height=20&width=60&text=KWCH"
                    alt="KWCH News"
                    width={60}
                    height={20}
                    className="mr-2"
                  />
                  As Seen On KWCH
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">About This Service</h2>
              <div className="prose max-w-none">
                {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> : <p>{description}</p>}
              </div>

              {/* Before/After comparison */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">See The Difference</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-center mb-2 font-medium text-gray-600">Before</p>
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src="/placeholder.svg?height=300&width=400&text=Before"
                        alt="Before service"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-center mb-2 font-medium text-green-600">After</p>
                    <div className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src="/placeholder.svg?height=300&width=400&text=After"
                        alt="After service"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* What to expect timeline */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">What to Expect</h3>
                <ol className="relative border-l border-gray-200 ml-3">
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      <span className="text-green-600 font-bold">1</span>
                    </span>
                    <h4 className="font-semibold text-lg">Initial Assessment</h4>
                    <p className="text-gray-600">
                      We'll evaluate your lawn's specific needs and create a customized plan.
                    </p>
                  </li>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      <span className="text-green-600 font-bold">2</span>
                    </span>
                    <h4 className="font-semibold text-lg">Professional Service</h4>
                    <p className="text-gray-600">
                      Our trained technicians will perform the service using professional equipment.
                    </p>
                  </li>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      <span className="text-green-600 font-bold">3</span>
                    </span>
                    <h4 className="font-semibold text-lg">Follow-Up Care</h4>
                    <p className="text-gray-600">
                      We'll provide recommendations for ongoing maintenance to maximize results.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      <span className="text-green-600 font-bold">4</span>
                    </span>
                    <h4 className="font-semibold text-lg">Satisfaction Check</h4>
                    <p className="text-gray-600">
                      We'll follow up to ensure you're completely satisfied with the results.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Service Details</h2>
                <Badge className="bg-amber-100 text-amber-800">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  Limited availability
                </Badge>
              </div>

              {price && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Pricing</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold">
                      ${price !== undefined && price !== null ? price.toFixed(2) : "Call for pricing"}
                    </span>
                    {priceUnit && <span className="ml-1 text-muted-foreground">/{priceUnit}</span>}
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg" asChild>
                  <Link href={`/quote?service=${slug}`}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Request a Quote
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50 py-3 text-lg"
                  asChild
                >
                  <a href={`tel:${companyInfo.phone.replace(/[^0-9]/g, "")}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    Call for Pricing: {companyInfo.phone}
                  </a>
                </Button>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Why Choose Us</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span>Professional and reliable service</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span>Experienced and trained staff</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span>High-quality equipment and materials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span>Satisfaction guaranteed</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                    <span>Competitive pricing</span>
                  </li>
                </ul>
              </div>

              {/* Customer testimonial highlight */}
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="italic text-gray-600 mb-2">
                  "Cut Rates Lawn has transformed our yard completely. Their {title} service exceeded our expectations!"
                </p>
                <p className="text-sm font-medium">- Sarah J., Valley Center</p>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<div>Loading testimonials...</div>}>
          <ServiceTestimonials serviceSlug={slug} className="mb-12" />
        </Suspense>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-2">How often should I get this service?</h3>
              <p className="text-gray-600">
                The frequency depends on your lawn's specific needs and the season. During our initial assessment, we'll
                recommend an optimal schedule for your property.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-2">How long does the service take?</h3>
              <p className="text-gray-600">
                Service time varies based on your property size and condition. Most services are completed within 1-2
                hours for an average-sized lawn.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-2">Do I need to be home during the service?</h3>
              <p className="text-gray-600">
                No, as long as we have access to your yard, we can complete the service while you're away. We'll leave a
                service summary at your door.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-2">Is this service safe for pets and children?</h3>
              <p className="text-gray-600">
                Yes, we use pet and family-friendly products. We recommend keeping pets and children off treated areas
                until dry, typically 1-2 hours after application.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg border">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Request a Quote</h2>
            <QuoteForm defaultServiceType={slug} serviceOptions={[{ value: slug, label: title }]} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading service:", error)
    return notFound()
  }
}
