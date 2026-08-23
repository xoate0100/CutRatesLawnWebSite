"use client"

import { useId, useState } from "react"
import { FAQS, type FaqItem } from "@/lib/marketing-content"
import { cn } from "@/lib/utils"

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className="border-b border-line last:border-0">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-lg font-bold text-ink"
          onClick={() => setOpen((v) => !v)}
        >
          {item.question}
          <span
            aria-hidden
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-lg transition-transform",
              open && "rotate-45 bg-cream",
            )}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="pb-4 text-sage"
      >
        <p>{item.answer}</p>
      </div>
    </div>
  )
}

export type FAQAccordionProps = {
  items?: FaqItem[]
  className?: string
}

export function FAQAccordion({ items = FAQS, className }: FAQAccordionProps) {
  return (
    <div className={cn("mt-6 rounded-brand border border-line bg-white px-5", className)}>
      {items.map((item) => (
        <FaqRow key={item.question} item={item} />
      ))}
    </div>
  )
}
