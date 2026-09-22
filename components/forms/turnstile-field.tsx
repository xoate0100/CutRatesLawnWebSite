"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

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

export type TurnstileFieldHandle = {
  reset: () => void
}

/**
 * Renders Cloudflare Turnstile when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * When unset, renders nothing and leaves spam protection optional (server allows).
 */
export const TurnstileField = forwardRef<TurnstileFieldHandle, Props>(function TurnstileField(
  { onToken, className },
  ref,
) {
  const elRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const widgetId = useRef<string | null>(null)

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current)
        onToken(null)
      }
    },
  }))

  useEffect(() => {
    if (!SITE_KEY) {
      onToken(null)
      return
    }

    const scriptId = "cf-turnstile-script"
    function mount() {
      if (!elRef.current || !window.turnstile || !SITE_KEY) return
      if (widgetId.current) return
      widgetId.current = window.turnstile.render(elRef.current, {
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
      <div ref={elRef} />
      {!ready ? <p className="text-xs text-sage">Loading spam check…</p> : null}
    </div>
  )
})
