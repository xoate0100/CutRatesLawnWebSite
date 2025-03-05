import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CTASection from "@/components/cta-section"

const communityInitiatives = [
  {
    title: "Annual Park Clean-Up",
    description:
      "We organize an annual clean-up event at local parks, bringing the community together to maintain our shared spaces.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Green Education Program",
    description:
      "Our team visits local schools to educate students about sustainable landscaping and the importance of environmental stewardship.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    title: "Community Garden Support",
    description:
      "We provide resources and expertise to help establish and maintain community gardens throughout Valley Center.",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Engagement</h1>
            <p className="text-xl mb-8 max-w-3xl">
              At Cut Rates Lawn Care, we're more than just a service provider. We're an active part of the Valley Center
              community, committed to making a positive impact.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {communityInitiatives.map((initiative, index) => (
                <Card key={index} className="flex flex-col">
                  <Image
                    src={initiative.image || "/placeholder.svg"}
                    alt={initiative.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle>{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{initiative.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Join Us in Making a Difference"
          description="Learn how you can participate in our community initiatives or suggest new ways we can give back."
          primaryButtonText="Get Involved"
          primaryButtonLink="/contact"
          secondaryButtonText="Our Services"
          secondaryButtonLink="/services"
        />
      </main>
    </div>
  )
}

