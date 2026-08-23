import * as React from "react"
import { cn } from "@/lib/utils"

export type PillProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "on-dark" | "on-lime"
}

export function Pill({ className, tone = "default", children, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.1em]",
        tone === "default" && "border-line bg-white/60 text-ink",
        tone === "on-dark" && "border-line-lt bg-white/6 text-white",
        tone === "on-lime" && "border-[rgba(11,58,30,0.25)] bg-[rgba(11,58,30,0.08)] text-forest-2",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
