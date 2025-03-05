import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import CTASection from "@/components/cta-section"

const caseStudies = [
  {
    title: "Residential Lawn Transformation",
    description: "How we turned a neglected yard into a lush, green oasis",
    image: "/placeholder.svg?height=200&width=300",
    link: "/case-studies/residential-transformation",
  },
  {
    title: "Commercial Property Maintenance",
    description: "Year-round care for a large office complex",
    image: "/placeholder.svg?height=200&width=300",
    link: "/case-studies/commercial-maintenance",
  },
  {
    title: "Sustainable Landscaping Project",
    description: "Implementing eco-friendly practices for a community park",
    image: "/placeholder.svg?height=200&width=300",
    link: "/case-studies/sustainable-landscaping",
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Case Studies</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Explore our success stories and see how we've helped transform properties across Valley Center and beyond.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <Card key={index} className="flex flex-col">
                  <Image
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle>{study.title}</CardTitle>
                    <CardDescription>{study.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Link href={study.link} className="w-full">
                      <Button className="w-full">Read Case Study</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to Transform Your Property?"
          description="Let us bring our expertise to your outdoor space. Contact us today for a consultation."
          primaryButtonText="Get a Quote"
          primaryButtonLink="/quote"
          secondaryButtonText="Our Services"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

