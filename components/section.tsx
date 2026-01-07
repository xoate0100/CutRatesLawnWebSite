import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: "white" | "light" | "primary" | "dark"
  containerClassName?: string
  id?: string
}

export function Section({ children, className, background = "white", containerClassName, id }: SectionProps) {
  const backgroundClasses = {
    white: "bg-white",
    light: "bg-gray-50",
    primary: "bg-green-600 text-white",
    dark: "bg-gray-900 text-white",
  }

  return (
    <section id={id} className={cn("w-full py-16", backgroundClasses[background], className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>{children}</div>
    </section>
  )
}

export function SectionHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("text-center mb-12", className)}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {description && <p className="text-lg max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}
