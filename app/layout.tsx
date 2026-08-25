import type React from "react"
import type { Metadata, Viewport } from "next"
import dynamic from "next/dynamic"
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google"
import "./globals.css"
import {
  AnnouncementMarquee,
  SiteFooter,
  SiteHeader,
  StickyQuoteBar,
} from "@/components/blocks"
import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/lib/site-config"
import { mediaSrc } from "@/lib/media"
import { Providers } from "./providers"

const LiveChat = dynamic(() => import("@/components/live-chat"), { ssr: false })

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
})

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFAF4" },
    { media: "(prefers-color-scheme: dark)", color: "#0B3A1E" },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Family-owned landscaping and lawn care from Wichita to Kansas City. Design, mowing, fertilization, aeration, holiday lights, and more — get a free quote in about two minutes.",
  keywords: [
    "landscaping",
    "lawn care",
    "Wichita",
    "Kansas City",
    "aeration",
    "holiday lights",
    "pest control",
    "hardscaping",
  ],
  authors: [{ name: "Cut Rates Lawn Care LLC" }],
  creator: "Cut Rates Lawn Care LLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: mediaSrc("og.default"), width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description:
      "Landscaping flagship care from Wichita to KC — free online quotes, no contracts.",
    creator: siteConfig.twitterHandle,
    images: [mediaSrc("og.default")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <Providers>
          <AnnouncementMarquee />
          <SiteHeader />
          <main className="relative z-0 pb-24 md:pb-0">{children}</main>
          <SiteFooter />
          <StickyQuoteBar />
          <LiveChat />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
