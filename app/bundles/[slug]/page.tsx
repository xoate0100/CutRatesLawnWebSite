import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getBundleBySlug } from "@/lib/api-helpers"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuoteForm } from "@/components/quote-form"
import { ServicesList } from "@/components/services-list"
import { companyInfo } from "@/lib/static-data"
import { mediaAlt, mediaSrc } from "@/lib/media"
import { Phone, Calendar, CheckCircle, Star, Clock, Shield, Award, Percent } from "lucide-react"

interface BundleDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BundleDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = params
    const response = await getBundleBySlug(slug)
    const bundle = response.data?.[0]

    if (!bundle) {
      return {
        title: "Bundle Not Found | Cut Rates Lawn Care",
        description: "The requested bundle could not be found.",
      }
    }

    const { title, shortDescription } = bundle.attributes

    return {
      title: `${title} | Cut Rates Lawn Care`,
      description: shortDescription || `Learn more about our ${title} bundle and request a quote.`,
    }
  } catch (error) {
    console.error("Error generating bundle metadata:", error)
    return {
      title: "Bundle | Cut Rates Lawn Care",
      description: "Learn more about our service bundles and request a quote.",
    }
  }
}

export default async function BundleDetailPage({ params }: BundleDetailPageProps) {
  const { slug } = params

  try {
    const response = await getBundleBySlug(slug)
    const bundle = response.data?.[0]

    if (!bundle) {
      notFound()
    }

    const { title, description, content, price, priceUnit, coverImage, services } = bundle.attributes

    const imageUrl =
      coverImage?.data?.attributes?.url || mediaSrc("page.bundles-slug.hero")
    const serviceIds = services?.data?.map((service: any) => service.id) || []

    // Calculate savings compared to individual services
    const individualServicesTotal =
      services?.data?.reduce((total: number, service: any) => {
        return total + (service.attributes.price || 0)
      }, 0) || 0

    const savings = individualServicesTotal > price ? individualServicesTotal - price : 0
    const savingsPercentage = individualServicesTotal > 0 ? Math.round((savings / individualServicesTotal) * 100) : 0

    return (
      <main className="container py-12">
        <div className="mb-6">
          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mb-4">
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
            {savingsPercentage > 0 && (
              <Badge className="bg-red-100 text-red-700 px-3 py-1">
                <Percent className="h-3.5 w-3.5 mr-1 text-red-700" />
                <span>Save {savingsPercentage}%</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>

            {description && <p className="text-xl text-muted-foreground mb-6">{description}</p>}

            <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-lg">
              <Image src={imageUrl || mediaSrc("page.bundles-slug.hero")} alt={title} fill className="object-cover" priority />

              {/* Featured on badge */}
              <div className="absolute top-4 left-4 bg-white/90 rounded-lg px-3 py-2 shadow-md">
                <p className="text-sm font-medium flex items-center">
                  <Image
                    src={mediaSrc("partners.kwch")}
                    alt={mediaAlt("partners.kwch", "KWCH News")}
                    width={60}
                    height={20}
                    className="mr-2"
                  />
                  As Seen On KWCH
                </p>
              </div>

              {savingsPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-600 text-white rounded-full px-4 py-2 shadow-md">
                  <p className="text-sm font-bold">Save {savingsPercentage}%</p>
                </div>
              )}
            </div>

            {content && (
              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            )}

            {price && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
                <h2 className="text-2xl font-bold mb-2">Package Pricing</h2>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-green-600">
                    ${price !== undefined && price !== null ? price.toFixed(2) : "Call for pricing"}
                  </span>
                  {priceUnit && <span className="ml-2 text-muted-foreground">/{priceUnit}</span>}
                </div>

                {savingsPercentage > 0 && (
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-500 line-through mr-2">
                      ${individualServicesTotal.toFixed(2)} if purchased separately
                    </span>
                    <Badge className="bg-red-100 text-red-700">Save ${savings.toFixed(2)}</Badge>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg" asChild>
                    <Link href="#quote-form">
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
                      Call Us: {companyInfo.phone}
                    </a>
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600 mr-1" />
                  <span className="text-sm text-amber-700 font-medium">Limited time offer - Book now!</span>
                </div>
              </div>
            )}

            {services?.data?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Included Services</h2>
                <ServicesList serviceIds={serviceIds} className="mb-6" />
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Why Choose This Package</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Comprehensive lawn care solution</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Save money compared to individual services</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Consistent, reliable service schedule</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Professional results without the hassle</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
                  <span>Customizable to your specific needs</span>
                </li>
              </ul>
            </div>

            {/* Customer testimonial */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="italic text-gray-600 mb-4 text-lg">
                "The {title} has transformed my yard. My neighbors keep asking who does my lawn! Excellent service and
                great value."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                  <Image src={mediaSrc("page.bundles-slug.avatar")} alt="Customer" width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium">Jennifer D.</p>
                  <p className="text-sm text-gray-500">Valley Center</p>
                </div>
              </div>
            </div>
          </div>

          <div id="quote-form">
            <div className="sticky top-24 bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Request a Quote</h2>
                <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  Response in 2 hours
                </Badge>
              </div>
              <QuoteForm defaultServiceType={slug} />
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error loading bundle:", error)
    return (
      <main className="container py-12">
        <h1 className="text-4xl font-bold mb-8">Bundle Details</h1>
        <div className="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200 mb-8">
          <h2 className="text-xl font-bold mb-2">Error Loading Bundle</h2>
          <p>We're sorry, but we couldn't load the requested bundle information. Please try again later.</p>
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/bundles">View All Bundles</Link>
          </Button>
        </div>
      </main>
    )
  }
}
