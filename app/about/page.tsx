import Image from "next/image"
import { HeroPlane } from "@/components/atmosphere/hero-plane"
import { SectionShell } from "@/components/atmosphere/section-shell"
import { mediaAlt, mediaSrc } from "@/lib/media"

const team = [
  {
    slot: "team.owner",
    name: "John Smith",
    role: "Owner & Founder",
    bio: "With over 15 years of experience in lawn care, John founded Cut Rates Lawn Care with a vision to provide exceptional service at competitive rates.",
  },
  {
    slot: "team.manager",
    name: "Sarah Johnson",
    role: "Operations Manager",
    bio: "Sarah oversees all day-to-day operations, ensuring that every job is completed to our high standards of quality and customer satisfaction.",
  },
  {
    slot: "team.crew",
    name: "Mike Thompson",
    role: "Lead Technician",
    bio: "Mike brings technical expertise and attention to detail to every project, specializing in lawn treatments and specialized care techniques.",
  },
] as const

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroPlane
        slot="about.hero"
        altFallback="Cut Rates Lawn Care team"
        heightClass="h-[400px] md:h-[500px] lg:h-[560px]"
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl atm-enter">Our Team</h1>
          <p className="mx-auto max-w-2xl text-xl text-white/90 atm-enter atm-enter-delay-1">
            Dedicated professionals committed to making your lawn the best it can be
          </p>
        </div>
      </HeroPlane>

      <SectionShell tone="canvas" motif className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-3xl font-bold">About Cut Rates Lawn Care</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Founded in 2015, Cut Rates Lawn Care has been providing exceptional lawn care services to homeowners and
              businesses in Wichita and surrounding areas. Our team of experienced professionals is dedicated to
              delivering high-quality results that exceed our customers&apos; expectations.
            </p>
            <p className="mb-6 text-lg text-muted-foreground">
              We take pride in our work and are committed to using the best equipment and techniques to ensure your lawn
              looks its best year-round. From regular maintenance to specialized treatments, we have the expertise to
              handle all your lawn care needs.
            </p>
            <p className="text-lg text-muted-foreground">
              Our mission is simple: to provide reliable, professional lawn care services at competitive rates, while
              building lasting relationships with our customers based on trust and satisfaction.
            </p>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="wash" seam className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Meet Our Team</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <article key={member.slot} className="overflow-hidden rounded-lg bg-card atm-elev-1 atm-hover-lift">
                <div className="relative h-80">
                  <Image
                    src={mediaSrc(member.slot)}
                    alt={mediaAlt(member.slot, member.name)}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{member.name}</h3>
                  <p className="mb-4 font-medium text-primary">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>
    </main>
  )
}
