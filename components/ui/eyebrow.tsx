import * as React from "react"
import { cn } from "@/lib/utils"

export type EyebrowProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "green" | "lime" | "sage" | "white"
}

export function Eyebrow({ className, tone = "green", children, ...props }: EyebrowProps) {
  return (
    <span
      className={cn(
        "font-body text-[0.72rem] font-bold uppercase tracking-[0.18em]",
        tone === "green" && "text-green",
        tone === "lime" && "text-lime",
        tone === "sage" && "text-sage",
        tone === "white" && "text-white/80",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
