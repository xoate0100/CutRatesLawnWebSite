"use client"

import { QUOTE_CATEGORIES, servicesInCategory, type QuoteCategoryId, type QuoteServiceDef } from "@/lib/quote/taxonomy"
import { cn } from "@/lib/utils"

export function ServicePicker({
  category,
  onCategory,
  onService,
}: {
  category: QuoteCategoryId | ""
  onCategory: (id: QuoteCategoryId) => void
  onService: (svc: QuoteServiceDef) => void
}) {
  const subs = category ? servicesInCategory(category) : []

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {QUOTE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onCategory(c.id)}
            className={cn(
              "flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-brand border px-2 py-3 text-center text-sm font-bold",
              category === c.id ? "border-forest bg-lime/40 text-forest-2" : "border-line bg-white text-ink hover:border-green",
            )}
            aria-pressed={category === c.id}
          >
            <span aria-hidden className="text-lg">
              {c.icon}
            </span>
            {c.label}
          </button>
        ))}
      </div>
      {subs.length ? (
        <div>
          <p className="mb-2 text-sm font-bold text-ink">What kind of job?</p>
          <div className="flex flex-wrap gap-2">
            {subs.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onService(s)}
                className="min-h-[44px] rounded-full border border-line bg-cream px-4 py-2 text-sm font-semibold hover:border-green"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
