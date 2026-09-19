"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
        },
      ) => string
      reset: (widgetId?: string) => void
    }
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

type Props = {
  onToken: (token: string | null) => void
  className?: string
}

/**
 * Renders Cloudflare Turnstile when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * When unset, renders nothing and leaves spam protection optional (server allows).
 */
export function TurnstileField({ onToken, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    if (!SITE_KEY) {
      onToken(null)
      return
    }

    const scriptId = "cf-turnstile-script"
    function mount() {
      if (!ref.current || !window.turnstile || !SITE_KEY) return
      if (widgetId.current) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      })
      setReady(true)
    }

    if (document.getElementById(scriptId)) {
      mount()
      return
    }

    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.onload = mount
    document.head.appendChild(script)
  }, [onToken])

  if (!SITE_KEY) return null

  return (
    <div className={className}>
      <div ref={ref} />
      {!ready ? <p className="text-xs text-sage">Loading spam check…</p> : null}
    </div>
  )
}
