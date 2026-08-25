import type { ReactNode } from "react"
import { SectionHead } from "@/components/ui/section-head"
import { Button } from "@/components/ui/button"
import { Pill } from "@/components/ui/pill"
import { Tag } from "@/components/ui/tag"
import { Eyebrow } from "@/components/ui/eyebrow"
import { MediaFrame } from "@/components/media/media-frame"
import { VideoFrame } from "@/components/media/video-frame"
import { pageWrap } from "@/lib/layout"
import {
  AnnouncementMarquee,
  AreaChips,
  BeforeAfterSlider,
  BundleCards,
  CompareTable,
  ContactFormBlock,
  CTASection,
  FAQAccordion,
  Gallery,
  Hero,
  InfoList,
  InteriorHero,
  MapBand,
  ProcessSteps,
  QuoteBand,
  RibbonMarquee,
  ServiceGrid,
  SiteFooter,
  SiteHeader,
  StickyQuoteBar,
  TeamGrid,
  TestimonialMarquee,
} from "@/components/blocks"
import { siteConfig } from "@/lib/site-config"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Component gallery (dev)",
  robots: { index: false, follow: false },
}

function Block({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-b border-line py-12">
      <div className={`${pageWrap}`}>
        <p className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-sage">
          {title}
        </p>
        {children}
      </div>
    </section>
  )
}

export default function DevComponentsPage() {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }

  return (
    <div className="bg-paper pb-24">
      <div className="border-b border-line bg-cream py-10">
        <div className={`${pageWrap}`}>
          <Eyebrow>Dev only</Eyebrow>
          <h1 className="font-display mt-2 text-4xl font-extrabold">Component library QA</h1>
          <p className="mt-2 max-w-xl text-sage">
            Every redesign block rendered for visual and interaction checks. Hidden in production.
          </p>
        </div>
      </div>

      <Block title="Primitives">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="lime">Lime</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="dark">Dark</Button>
          <Button variant="default">Default</Button>
          <Pill>
            <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Pill
          </Pill>
          <Tag>Tag</Tag>
          <Eyebrow>Eyebrow</Eyebrow>
        </div>
        <SectionHead
          className="mt-8"
          eyebrow="Section head"
          title="One job per section."
          description="Eyebrow, title, and supporting sentence."
        />
      </Block>

      <Block title="MediaFrame / VideoFrame">
        <div className="grid gap-4 md:grid-cols-2">
          <MediaFrame slot="home.hero" treatments={["grain", "stripe", "ring"]} />
          <VideoFrame slot="home.hero" />
        </div>
      </Block>

      <Block title="AnnouncementMarquee">
        <AnnouncementMarquee />
      </Block>

      <Block title="SiteHeader">
        <div className="overflow-hidden rounded-brand border border-line">
          <SiteHeader />
        </div>
      </Block>

      <Block title="Hero">
        <Hero />
      </Block>

      <Block title="RibbonMarquee">
        <RibbonMarquee />
      </Block>

      <Block title="ServiceGrid">
        <SectionHead
          eyebrow="Popular services"
          title="The work your property actually needs."
        />
        <ServiceGrid />
      </Block>

      <Block title="QuoteBand">
        <QuoteBand />
      </Block>

      <Block title="BeforeAfterSlider">
        <BeforeAfterSlider />
      </Block>

      <Block title="TestimonialMarquee">
        <TestimonialMarquee />
      </Block>

      <Block title="AreaChips">
        <AreaChips />
      </Block>

      <Block title="BundleCards + CompareTable">
        <BundleCards />
        <CompareTable />
      </Block>

      <Block title="FAQAccordion">
        <FAQAccordion />
      </Block>

      <Block title="InteriorHero">
        <InteriorHero
          title="Landscaping that looks intentional."
          description="Flagship design and install from Wichita to KC."
          mediaSlot="services.landscaping"
        />
      </Block>

      <Block title="Gallery">
        <Gallery />
      </Block>

      <Block title="ProcessSteps">
        <ProcessSteps />
      </Block>

      <Block title="TeamGrid">
        <TeamGrid />
      </Block>

      <Block title="ContactFormBlock + InfoList + MapBand">
        <div className="grid gap-6 lg:grid-cols-2">
          <ContactFormBlock />
          <InfoList
            items={[
              { label: "Phone", value: siteConfig.phone.display, href: `tel:${siteConfig.phone.e164}` },
              { label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
              { label: "Address", value: siteConfig.address.full },
            ]}
          />
        </div>
        <div className="mt-6">
          <MapBand />
        </div>
      </Block>

      <Block title="CTASection">
        <CTASection />
      </Block>

      <Block title="SiteFooter">
        <SiteFooter />
      </Block>

      <Block title="StickyQuoteBar">
        <p className="mb-4 text-sm text-sage">
          Fixed to the bottom on mobile after scroll — preview chrome below.
        </p>
        <div className="relative h-24 overflow-hidden rounded-brand border border-dashed border-line bg-cream">
          <StickyQuoteBar threshold={0} className="!absolute !translate-y-0" />
        </div>
      </Block>
    </div>
  )
}
