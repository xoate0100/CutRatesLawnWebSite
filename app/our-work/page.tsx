import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CTASection from "@/components/cta-section"

const projectCategories = [
  {
    name: "Lawn Transformations",
    projects: [
      {
        before: "/placeholder.svg?height=300&width=400",
        after: "/placeholder.svg?height=300&width=400",
        description: "Revitalized a neglected lawn with our comprehensive care package",
      },
      {
        before: "/placeholder.svg?height=300&width=400",
        after: "/placeholder.svg?height=300&width=400",
        description: "Drought-resistant landscaping for a water-efficient yard",
      },
    ],
  },
  {
    name: "Hardscaping Projects",
    projects: [
      {
        before: "/placeholder.svg?height=300&width=400",
        after: "/placeholder.svg?height=300&width=400",
        description: "Custom patio installation with built-in fire pit",
      },
      {
        before: "/placeholder.svg?height=300&width=400",
        after: "/placeholder.svg?height=300&width=400",
        description: "Elegant walkway and retaining wall project",
      },
    ],
  },
  {
    name: "Commercial Landscaping",
    projects: [
      {
        before: "/placeholder.svg?height=300&width=400",
        after: "/placeholder.svg?height=300&width=400",
        description: "Complete overhaul of office park grounds",
      },
      {
        before: "/placeholder.svg?height=300&width=400",
        after: "/placeholder.svg?height=300&width=400",
        description: "Low-maintenance, high-impact landscaping for a shopping center",
      },
    ],
  },
]

export default function OurWorkPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <section className="bg-green-600 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Work</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Explore our portfolio of successful projects and transformations. See the Cut Rates Lawn Care difference
              for yourself.
            </p>
          </div>
        </section>

        {projectCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.projects.map((project, projectIndex) => (
                  <Card key={projectIndex} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>Before & After</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative h-48">
                          <Image
                            src={project.before || "/placeholder.svg"}
                            alt="Before"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm">
                            Before
                          </div>
                        </div>
                        <div className="relative h-48">
                          <Image src={project.after || "/placeholder.svg"} alt="After" fill className="object-cover" />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm">
                            After
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}

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

