import { SectionHead } from "@/components/ui/section-head"
import {
  ContactFormBlock,
  CTASection,
  InfoList,
  InteriorHero,
  MapBand,
} from "@/components/blocks"
import { siteConfig } from "@/lib/site-config"

export const metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} — ${siteConfig.phone.display}, ${siteConfig.address.full}.`,
}

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <InteriorHero
        eyebrow="Contact"
        title="Say hello — or skip straight to a quote."
        description="Questions, partnerships, or property details — we respond fast. For pricing, the online quote is usually quickest."
        mediaSlot="contact.hero"
        ctaHref="/quote"
        ctaLabel="Get a quote"
      />

      <section className="mx-auto grid w-[min(1200px,92vw)] gap-10 py-[clamp(2.5rem,5vw,4.5rem)] lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHead
            eyebrow="Message"
            title="Send a note."
            description="We’ll follow up by phone or email — usually the same day."
          />
          <ContactFormBlock className="mt-8" />
        </div>
        <div>
          <SectionHead eyebrow="Details" title="Reach us directly." />
          <InfoList
            className="mt-8"
            items={[
              {
                label: "Phone",
                value: siteConfig.phone.display,
                href: `tel:${siteConfig.phone.e164}`,
              },
              {
                label: "Email",
                value: siteConfig.email,
                href: `mailto:${siteConfig.email}`,
              },
              {
                label: "Address",
                value: siteConfig.address.full,
              },
              {
                label: "Hours",
                value: "Mon–Fri 8am–5pm · Sat by appointment",
              },
            ]}
          />
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92vw)] pb-[clamp(2.5rem,5vw,4rem)]">
        <MapBand />
      </section>

      <CTASection title="Ready for a number? Get a quote." />
    </div>
  )
}
