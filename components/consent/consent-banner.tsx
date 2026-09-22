"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getConsentMode, hasChosenConsent, writeConsent } from "@/lib/analytics/consent"

export function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const mode = getConsentMode()

  useEffect(() => {
    setOpen(!hasChosenConsent())
  }, [])

  if (!open) return null

  if (mode === "us_opt_out") {
    return (
      <div
        role="dialog"
        aria-label="Cookie and advertising notice"
        className="fixed inset-x-3 bottom-20 z-[90] rounded-brand border border-line bg-paper p-4 shadow-brand md:bottom-4 md:left-auto md:right-4 md:max-w-md"
      >
        <p className="text-sm font-bold text-ink">Cookies & ads</p>
        <p className="mt-1 text-sm text-sage">
          We use essential cookies for quotes, plus analytics and advertising cookies to measure and improve our US
          marketing. You can turn those off anytime.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="lime"
            size="sm"
            onClick={() => {
              writeConsent({ analytics: true, ads: true })
              setOpen(false)
            }}
          >
            Got it
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              writeConsent({ analytics: false, ads: false })
              setOpen(false)
            }}
          >
            Turn off ads & analytics
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie and advertising consent"
      className="fixed inset-x-3 bottom-20 z-[90] rounded-brand border border-line bg-paper p-4 shadow-brand md:bottom-4 md:left-auto md:right-4 md:max-w-md"
    >
      <p className="text-sm font-bold text-ink">Cookies & ads</p>
      <p className="mt-1 text-sm text-sage">
        We use essential cookies to take quotes. Analytics and advertising cookies stay off until you accept.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="lime"
          size="sm"
          onClick={() => {
            writeConsent({ analytics: true, ads: true })
            setOpen(false)
          }}
        >
          Accept all
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            writeConsent({ analytics: false, ads: false })
            setOpen(false)
          }}
        >
          Essential only
        </Button>
      </div>
    </div>
  )
}
