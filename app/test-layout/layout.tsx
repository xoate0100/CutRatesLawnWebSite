import type React from "react"
import "../globals.css"
import { Inter } from "next/font/google"
import { SimplifiedErrorBoundary } from "@/components/simplified-error-boundary"

const inter = Inter({ subsets: ["latin"] })

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("Test layout rendering")

  return (
    <html lang="en">
      <body className={inter.className}>
        <SimplifiedErrorBoundary>
          <div className="flex flex-col min-h-screen">
            <div className="bg-red-100 p-2 text-center">
              <p>Test Layout - If you see this, the test layout is rendering</p>
            </div>
            <div className="flex-grow">{children}</div>
            <div className="bg-red-100 p-2 text-center">
              <p>Test Layout Footer - If you see this, the test layout is rendering</p>
            </div>
          </div>
        </SimplifiedErrorBoundary>
      </body>
    </html>
  )
}
