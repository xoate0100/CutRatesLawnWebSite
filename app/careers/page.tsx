import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import CTASection from "@/components/cta-section"

const jobOpenings = [
  {
    title: "Lawn Care Technician",
    description:
      "Join our team of skilled lawn care professionals. Experience with lawn maintenance equipment required.",
    type: "Full-time",
    location: "Valley Center, KS",
  },
  {
    title: "Customer Service Representative",
    description:
      "Help our clients schedule services and address their property care needs. Excellent communication skills required.",
    type: "Full-time",
    location: "Valley Center, KS",
  },
  {
    title: "Landscape Designer",
    description:
      "Design beautiful and functional outdoor spaces for our clients. Degree in Landscape Architecture preferred.",
    type: "Full-time",
    location: "Valley Center, KS",
  },
]

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=600&width=1920"
              alt="Cut Rates Lawn Care team at work"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl mb-8 max-w-3xl">
              Build a rewarding career with Cut Rates Lawn Care. We're always looking for talented individuals to help
              us deliver exceptional property care services.
            </p>
            <Link href="#openings">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                View Open Positions
              </Button>
            </Link>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Work With Cut Rates Lawn Care?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Growth Opportunities",
                  description:
                    "We believe in promoting from within and offer numerous opportunities for career advancement.",
                },
                {
                  title: "Competitive Benefits",
                  description:
                    "Enjoy a comprehensive benefits package, including health insurance, 401(k) with company match, and paid time off.",
                },
                {
                  title: "Work-Life Balance",
                  description: "We value our employees' well-being and strive to maintain a healthy work-life balance.",
                },
                {
                  title: "Ongoing Training",
                  description:
                    "Stay at the forefront of the industry with our continuous education and skill development programs.",
                },
                {
                  title: "Team Environment",
                  description:
                    "Join a supportive team that feels like family, where your contributions are valued and recognized.",
                },
                {
                  title: "Community Impact",
                  description:
                    "Be part of a company that actively gives back to the local community through various initiatives.",
                },
              ].map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Current Openings */}
        <section id="openings" className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Current Job Openings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobOpenings.map((job, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>
                      {job.type} | {job.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{job.description}</p>
                  </CardContent>
                  <CardFooter className="mt-auto pt-4">
                    <Link href="/careers/apply" className="w-full">
                      <Button className="w-full">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Employee Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">What Our Employees Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote:
                    "I've been with Cut Rates for over 5 years now, and I can honestly say it's the best job I've ever had. The team is like family, and there's always room to grow and learn new skills.",
                  name: "Mike Johnson",
                  role: "Senior Lawn Care Technician",
                },
                {
                  quote:
                    "Cut Rates truly values its employees. The training programs have helped me advance my career, and the work-life balance allows me to spend quality time with my family.",
                  name: "Sarah Thompson",
                  role: "Customer Service Manager",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="flex flex-col">
                  <CardContent className="pt-6">
                    <blockquote className="text-lg italic mb-4">"{testimonial.quote}"</blockquote>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection
          title="Ready to Grow Your Career with Us?"
          description="Join our team and be part of a company that values its employees and makes a difference in the community."
          primaryButtonText="View Open Positions"
          primaryButtonLink="#openings"
          secondaryButtonText="Learn More About Us"
          secondaryButtonLink="/about"
        />
      </main>
    </div>
  )
}

