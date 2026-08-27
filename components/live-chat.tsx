"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

/** Honest offline help — not a live agent simulation. */
export default function LiveChat() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const hideOnQuote = pathname === "/quote" || pathname?.startsWith("/quote/")

  useEffect(() => {
    if (hideOnQuote) return
    // Keep FAB off first-paint hero CTAs on short phones (overlap at ≤667px height).
    const update = () => setRevealed(window.scrollY > 420)
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [hideOnQuote])

  if (hideOnQuote) return null
  if (!revealed && !isOpen) return null

  return (
    <>
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full p-4"
          onClick={() => setIsOpen(true)}
          aria-label="Open contact help"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 z-50 w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Talk with us</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>We do not run live chat agents on this site yet. Reach us directly:</p>
            <ul className="space-y-2">
              <li>
                <a className="text-green-700 underline" href={`tel:${siteConfig.phone.e164}`}>
                  {siteConfig.phone.display}
                </a>
              </li>
              <li>
                <a className="text-green-700 underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <Link className="text-green-700 underline" href="/quote" onClick={() => setIsOpen(false)}>
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link className="text-green-700 underline" href="/contact" onClick={() => setIsOpen(false)}>
                  Contact form
                </Link>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/quote" onClick={() => setIsOpen(false)}>
                Get a Quote
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Go to contact
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
