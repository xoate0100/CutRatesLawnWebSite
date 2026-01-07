import type React from "react"
import { Providers } from "./providers"
import { Header } from "@/components/layout/header"
import "./globals.css"

export const metadata = {
  title: "Cut Rates Lawn Care",
  description: "Professional lawn care services in Wichita, KS",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
