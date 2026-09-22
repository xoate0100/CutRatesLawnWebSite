"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { trackConversionLead } from "@/lib/analytics/core"
import { AnalyticsPhoneLink } from "@/components/analytics/phone-link"
import { siteConfig } from "@/lib/site-config"
import { GHL_SERVICE_LABELS, getQuoteService, type QuoteServiceId } from "@/lib/quote/taxonomy"
import { pageWrap } from "@/lib/layout"

export function ThankYouClient({ service }: { service?: string }) {
  const sp = useSearchParams()
  const rid = sp.get("rid") || "unknown"
  const area = sp.get("area") || ""
  const amt = Number(sp.get("amt") || 0)
  const svc = (service || sp.get("service") || "") as QuoteServiceId | ""
  const label = svc && GHL_SERVICE_LABELS[svc] ? GHL_SERVICE_LABELS[svc] : "your request"
  const def = svc ? getQuoteService(svc) : undefined

  useEffect(() => {
    const key = `cro_conv_${rid}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, "1")
    trackConversionLead({
      transactionId: rid,
      conversionValue: Number.isFinite(amt) ? amt : 0,
      serviceId: svc || undefined,
      areaSlug: area || undefined,
    })
  }, [rid, amt, svc, area])

  return (
    <div className={`${pageWrap} py-[clamp(2.5rem,5vw,4.5rem)]`}>
      <h1 className="font-display text-[clamp(1.8rem,6vw,3rem)] font-extrabold">You’re on the list.</h1>
      <p className="mt-3 max-w-[46ch] text-sage">
        We got {label.toLowerCase()}. A local dispatcher will call or text to confirm details — usually within one
        business day during business hours. Keep your phone handy.
      </p>
      {def ? (
        <p className="mt-2 text-sm text-sage">
          Next: we confirm the property details
          {area ? ` in ${area}` : ""} and share a clear next step. This page is your receipt.
        </p>
      ) : null}
      {rid !== "unknown" ? <p className="mt-2 text-xs text-sage">Reference: {rid}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="lime">
          <AnalyticsPhoneLink href={`tel:${siteConfig.phone.e164}`} location="thank_you">
            Call {siteConfig.phone.display}
          </AnalyticsPhoneLink>
        </Button>
        <Button asChild variant="outline">
          <Link href="/referral">Refer a neighbor</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  )
}
