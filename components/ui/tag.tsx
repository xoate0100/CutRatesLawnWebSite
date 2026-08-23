import * as React from "react"
import { cn } from "@/lib/utils"

export type TagProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "green" | "lime" | "forest"
}

export function Tag({ className, tone = "green", children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em]",
        tone === "green" && "bg-green text-white",
        tone === "lime" && "bg-lime text-forest-2",
        tone === "forest" && "bg-forest text-white",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
