import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CTASection from "@/components/cta-section"

const certifications = [
  {
    name: "Certified Lawn Care Professional",
    organization: "National Association of Landscape Professionals",
    description: "Demonstrates expertise in lawn care techniques and best practices.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Certified Arborist",
    organization: "International Society of Arboriculture",
    description: "Specialized knowledge in tree care and maintenance.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Environmental Landscape Certification",
    organization: "Ecological Landscaping Association",
    description: "Focuses on sustainable and eco-friendly landscaping practices.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function CertificationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Certifications</h1>
            <p className="text-xl mb-8 max-w-3xl">
              At Cut Rates Lawn Care, we're committed to excellence. Our team's certifications ensure we bring the
              highest level of expertise to every job.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <Image
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.name}
                      width={100}
                      height={100}
                      className="mb-4"
                    />
                    <CardTitle>{cert.name}</CardTitle>
                    <CardDescription>{cert.organization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Experience Our Expertise"
          description="Let our certified professionals take care of your lawn and landscape needs."
          primaryButtonText="Schedule a Service"
          primaryButtonLink="/schedule"
          secondaryButtonText="Learn More"
          secondaryButtonLink="/about"
        />
      </main>
    </div>
  )
}

