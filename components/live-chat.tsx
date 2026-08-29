"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"
import { PREVIEW_SECTION, QUOTE_SOON_MESSAGE, scrollToSection } from "@/lib/preview-nav"
import { siteConfig } from "@/lib/site-config"

/** Honest offline help — not a live agent simulation. */
export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    // Keep FAB off first-paint hero CTAs on short phones (overlap at ≤667px height).
    const update = () => setRevealed(window.scrollY > 420)
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update, { passive: true })
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

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
                <button
                  type="button"
                  className="text-green-700 underline"
                  onClick={() => {
                    setIsOpen(false)
                    toast.message(QUOTE_SOON_MESSAGE)
                    scrollToSection(PREVIEW_SECTION.quote)
                  }}
                >
                  Get a Quote
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="text-green-700 underline"
                  onClick={() => {
                    setIsOpen(false)
                    scrollToSection(PREVIEW_SECTION.contact)
                  }}
                >
                  Contact form
                </button>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="button"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                setIsOpen(false)
                toast.message(QUOTE_SOON_MESSAGE)
                scrollToSection(PREVIEW_SECTION.quote)
              }}
            >
              Get a Quote
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsOpen(false)
                scrollToSection(PREVIEW_SECTION.contact)
              }}
            >
              Go to contact
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
