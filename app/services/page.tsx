import Link from "next/link"
import Image from "next/image"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mediaAlt, mediaSrc } from "@/lib/media"

export default function ServicesPage() {
  return (
    <div className="atm-canvas">
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">Professional Lawn Care Services</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          From routine mowing to complete property transformations, we deliver exceptional results for every lawn size
          and need.
        </p>
      </div>

      {/* Service Categories */}
      <div className="grid gap-12">
        {/* Lawn Mowing Services */}
        <section>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Lawn Mowing Services</h2>
              <p className="text-lg mb-6">
                Professional mowing services tailored to your property size with options for every need - from basic
                cuts to premium detailed service with custom patterns.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Available for all property sizes (under ¼ acre to 3+ acres)</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Options for detailed edging and trimming</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Premium service with custom patterns available</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Weekly, bi-weekly, and one-time service options</span>
                </li>
              </ul>
              <Button asChild>
                <Link href="/quote">
                  Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden atm-elev-1">
              <Image
                src={mediaSrc("services.mowing")}
                alt={mediaAlt("services.mowing", "Professional lawn mowing service")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Lawn Care Treatments */}
        <section>
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Lawn Care Treatments</h2>
              <p className="text-lg mb-6">
                Comprehensive treatment programs to keep your lawn healthy, green, and weed-free throughout the growing
                season.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Fertilization programs (4, 6, or 8+ treatments per year)</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Targeted weed control treatments</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Core aeration and overseeding</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Soil testing and amendments</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Eco-friendly organic options available</span>
                </li>
              </ul>
              <Button asChild>
                <Link href="/services/lawn-care">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden atm-elev-1">
              <Image
                src={mediaSrc("services.fertilization")}
                alt={mediaAlt("services.fertilization", "Lawn fertilization and treatments")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Irrigation Services */}
        <section>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Irrigation Services</h2>
              <p className="text-lg mb-6">
                Complete irrigation solutions from system design and installation to seasonal maintenance and smart
                controller upgrades.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>System design and installation for all property sizes</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Spring activation and fall winterization</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Repairs and system upgrades</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Smart controller installation with mobile app control</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Water conservation solutions</span>
                </li>
              </ul>
              <Button asChild>
                <Link href="/quote">
                  Request Service <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden atm-elev-1">
              <Image
                src={mediaSrc("services.cleanup")}
                alt={mediaAlt("services.cleanup", "Irrigation system installation and maintenance")}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Service Packages */}
        <section className="bg-muted rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Popular Service Packages</h2>
          <p className="text-lg text-center max-w-3xl mx-auto mb-10">
            Save with our bundled service packages designed to provide comprehensive care for your property throughout
            the year.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle>Green Standard</CardTitle>
                <CardDescription>Essential care for a healthy lawn</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Regular mowing service</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>4 seasonal fertilizer treatments</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Basic weed control</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Spring cleanup</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/quote">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 border-primary shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Complete Care</CardTitle>
                <CardDescription>Comprehensive property maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Weekly mowing with detailed edging</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>6 fertilizer & weed control treatments</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Core aeration & overseeding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Spring & fall cleanup</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Shrub & hedge trimming</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/quote">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle>Premier Service</CardTitle>
                <CardDescription>The ultimate in property care</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Premium mowing with custom patterns</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>8+ comprehensive lawn treatments</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Deep-core aeration & premium overseeding</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Complete seasonal property maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Priority scheduling & VIP service</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/quote">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Additional Services */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-center">Additional Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Landscape Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Custom landscape design and installation services to enhance your property's beauty and value.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/services/landscaping">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pest Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Comprehensive pest management solutions for your lawn, garden, and home perimeter.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/services/pest-control">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Snow Removal</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Reliable snow plowing and ice management services for residential and commercial properties.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/quote">Get a Quote</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commercial Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Specialized maintenance programs for HOAs, retail centers, and commercial properties.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/services/commercial">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground rounded-xl p-8 mt-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Property?</h2>
            <p className="text-lg mb-6">
              Our team of lawn care professionals is ready to help you achieve the perfect lawn. Contact us today for a
              free consultation and quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link href="/quote">Get a Free Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/10">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  )
}
