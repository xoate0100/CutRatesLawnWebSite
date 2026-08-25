import * as React from "react"
import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/ui/eyebrow"

export type SectionHeadProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  align?: "left" | "center"
  tone?: "default" | "on-dark"
}

export function SectionHead({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  tone = "default",
}: SectionHeadProps) {
  return (
    <div
      className={cn(
        "min-w-0 max-w-[60ch]",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone === "on-dark" ? "lime" : "green"}>{eyebrow}</Eyebrow>
      ) : null}
      <h2
        className={cn(
          "font-display mt-2 text-[clamp(1.75rem,6vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em]",
          tone === "on-dark" ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-2 max-w-[52ch] text-[1.05rem]",
            tone === "on-dark" ? "text-white/70" : "text-sage",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
