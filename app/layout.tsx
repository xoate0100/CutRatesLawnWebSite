import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import LiveChat from "@/components/live-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Cut Rates Lawn Care",
    template: "%s | Cut Rates Lawn Care",
  },
  description:
    "Professional lawn care, power washing, pest control, and more for residential and commercial properties.",
  keywords: ["lawn care", "landscaping", "pest control", "power washing", "property maintenance"],
  authors: [{ name: "Cut Rates Lawn Care LLC" }],
  creator: "Cut Rates Lawn Care LLC",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.cutratelawn.com/",
    siteName: "Cut Rates Lawn Care",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cut Rates Lawn Care",
    description: "Professional lawn care and property maintenance services",
    creator: "@cutratelawn",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <LiveChat />
      </body>
    </html>
  )
}



import './globals.css'