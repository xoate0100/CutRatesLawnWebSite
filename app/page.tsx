import Link from "next/link"
import Image from "next/image"
import { HeroPlane } from "@/components/atmosphere/hero-plane"
import { SectionShell } from "@/components/atmosphere/section-shell"
import { AtmReveal } from "@/components/atmosphere/atm-reveal"
import { mediaAlt, mediaSrc } from "@/lib/media"

const services = [
  {
    slot: "services.mowing",
    title: "Lawn Mowing",
    body: "Professional mowing services to keep your lawn looking its best year-round.",
    href: "/services/lawn-care",
  },
  {
    slot: "services.fertilization",
    title: "Fertilization",
    body: "Custom fertilization programs to promote healthy growth and vibrant color.",
    href: "/services/lawn-care",
  },
  {
    slot: "services.weed-control",
    title: "Weed Control",
    body: "Effective weed control treatments to keep your lawn weed-free.",
    href: "/services/lawn-care",
  },
] as const

const testimonials = [
  {
    slot: "testimonials.1",
    name: "Michael R.",
    quote:
      "Cut Rates Lawn Care has been maintaining my lawn for over 2 years now. Their service is always on time and my lawn has never looked better!",
  },
  {
    slot: "testimonials.2",
    name: "Jennifer L.",
    quote:
      "I've tried several lawn care companies in Wichita, and Cut Rates is by far the best. Their attention to detail and customer service is outstanding.",
  },
  {
    slot: "testimonials.3",
    name: "David W.",
    quote:
      "The team at Cut Rates transformed my neglected lawn into the envy of the neighborhood. Their prices are fair and the results speak for themselves.",
  },
] as const

export default function Home() {
  return (
    <main>
      <HeroPlane slot="home.hero" altFallback="Beautiful lawn maintained by Cut Rates Lawn Care" priority>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl atm-enter">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/85">
              Cut Rates Lawn Care
            </p>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Professional Lawn Care in Wichita, KS
            </h1>
            <p className="mb-8 text-xl text-white/90 atm-enter atm-enter-delay-1">
              Quality lawn maintenance services at competitive rates
            </p>
            <div className="flex flex-col gap-4 sm:flex-row atm-enter atm-enter-delay-2">
              <Link
                href="/contact"
                className="rounded-lg bg-primary px-6 py-3 text-center font-bold text-primary-foreground transition-colors hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/services"
                className="rounded-lg bg-white px-6 py-3 text-center font-bold text-primary transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </HeroPlane>

      <SectionShell tone="muted" seam seamFade texture className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            <p className="font-semibold text-muted-foreground">As Featured On:</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {(
                [
                  ["partners.kwch", "KWCH 12 News Logo"],
                  ["partners.google", "Google Reviews"],
                  ["partners.yelp", "Yelp"],
                ] as const
              ).map(([slot, alt]) => (
                <Image
                  key={slot}
                  src={mediaSrc(slot)}
                  alt={mediaAlt(slot, alt)}
                  width={120}
                  height={40}
                  className="h-8 w-auto md:h-10"
                />
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        tone="canvas-alt"
        motif
        motifCoverage="full"
        motifIntensity="medium"
        texture
        seam
        seamFade
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <AtmReveal>
            <h2 className="mb-12 text-center text-3xl font-bold">Our Services</h2>
          </AtmReveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <AtmReveal key={service.slot} delay={(i + 1) as 1 | 2 | 3}>
                <article className="overflow-hidden rounded-lg bg-card atm-elev-1 atm-hover-lift">
                  <div className="relative h-60">
                    <Image
                      src={mediaSrc(service.slot)}
                      alt={mediaAlt(service.slot, service.title)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="atm-photo-tint" aria-hidden />
                    <div className="atm-photo-scrim" aria-hidden />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{service.title}</h3>
                    <p className="mb-4 text-muted-foreground">{service.body}</p>
                    <Link
                      href={service.href}
                      className="font-medium text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      Learn More →
                    </Link>
                  </div>
                </article>
              </AtmReveal>
            ))}
          </div>
          <AtmReveal className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-block rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              View All Services
            </Link>
          </AtmReveal>
        </div>
      </SectionShell>

      <SectionShell
        tone="deep-band"
        motif
        motifCoverage="full"
        motifVariant="ribs"
        motifIntensity="soft"
        texture
        seam
        seamFade
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <AtmReveal>
            <h2 className="mb-12 text-center text-3xl font-bold">What Our Customers Say</h2>
          </AtmReveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <AtmReveal key={t.slot} delay={(Math.min(i + 1, 3)) as 1 | 2 | 3}>
                <blockquote className="rounded-lg bg-card p-6 atm-elev-1 atm-hover-lift">
                  <div className="mb-4 flex items-center">
                    <div className="relative mr-4 h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={mediaSrc(t.slot)}
                        alt={mediaAlt(t.slot, t.name)}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <cite className="not-italic font-bold">{t.name}</cite>
                      <div className="text-amber-500" aria-label="5 out of 5 stars">
                        ★★★★★
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
              </AtmReveal>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="cta" seamFade className="py-16">
        <div className="container mx-auto px-4 text-center">
          <AtmReveal>
            <h2 className="mb-6 text-3xl font-bold">Ready for a Beautiful Lawn?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/90">
              Contact us today for a free quote and let us help you achieve the lawn you&apos;ve always wanted.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-primary transition-colors hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Started
            </Link>
          </AtmReveal>
        </div>
      </SectionShell>
    </main>
  )
}
