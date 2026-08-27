"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/** UI language control — Spanish journey content is not verified for launch. */
export function CareersLangToggle({ className }: { className?: string }) {
  const [lang, setLang] = useState<"en" | "es">("en")

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/25 bg-white/10 p-0.5 text-xs font-bold",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={cn(
          "rounded-full px-3 py-1.5",
          lang === "en" ? "bg-lime text-forest" : "text-white/80 hover:text-white",
        )}
        aria-pressed={lang === "en"}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={cn(
          "rounded-full px-3 py-1.5",
          lang === "es" ? "bg-lime text-forest" : "text-white/80 hover:text-white",
        )}
        aria-pressed={lang === "es"}
        onClick={() => setLang("es")}
        title="Spanish page copy is in progress — application supports Spanish preference"
      >
        ES
      </button>
      {lang === "es" ? (
        <span className="sr-only">
          Spanish interface coming soon. You can still choose Spanish as preferred language on the application.
        </span>
      ) : null}
    </div>
  )
}
