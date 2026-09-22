"use client"

import type { HTMLAttributes } from "react"
import type { QuoteField } from "@/lib/quote/service-schema"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

export function FieldRenderer({
  field,
  value,
  error,
  onChange,
  onEngage,
}: {
  field: QuoteField
  value: string
  error?: string
  onChange: (v: string) => void
  onEngage: () => void
}) {
  const id = `qf-${field.key}`

  if (field.type === "slider") {
    const num = Number(value) || field.min || 500
    return (
      <div>
        <Label htmlFor={id}>
          {field.label} — {num.toLocaleString()} sq ft
        </Label>
        <Slider
          id={id}
          min={field.min ?? 500}
          max={field.max ?? 15000}
          step={field.step ?? 250}
          value={[num]}
          onValueChange={(v) => {
            onEngage()
            onChange(String(v[0]))
          }}
        />
        {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
      </div>
    )
  }

  if (field.type === "radio" || field.type === "chips") {
    return (
      <fieldset>
        <legend className="mb-2 text-sm font-bold">{field.label}</legend>
        <div className="flex flex-wrap gap-2">
          {(field.options || []).map((opt) => {
            const active = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onEngage()
                  onChange(opt.value)
                }}
                className={cn(
                  "min-h-[44px] rounded-full border px-3 py-2 text-sm font-semibold",
                  active ? "border-forest bg-lime text-forest-2" : "border-line bg-white",
                )}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        {field.help ? <p className="mt-1 text-xs text-sage">{field.help}</p> : null}
        {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
      </fieldset>
    )
  }

  if (field.type === "multiselect") {
    const selected = new Set(value ? value.split("|") : [])
    return (
      <fieldset>
        <legend className="mb-2 text-sm font-bold">{field.label}</legend>
        <div className="flex flex-wrap gap-2">
          {(field.options || []).map((opt) => {
            const active = selected.has(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onEngage()
                  const next = new Set(selected)
                  if (active) next.delete(opt.value)
                  else next.add(opt.value)
                  onChange(Array.from(next).join("|"))
                }}
                className={cn(
                  "min-h-[44px] rounded-full border px-3 py-2 text-sm font-semibold",
                  active ? "border-forest bg-lime text-forest-2" : "border-line bg-white",
                )}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
      </fieldset>
    )
  }

  if (field.type === "textarea") {
    return (
      <div>
        <Label htmlFor={id}>{field.label}</Label>
        <Textarea
          id={id}
          name={field.key}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onEngage}
          rows={3}
        />
        {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
      </div>
    )
  }

  return (
    <div>
      <Label htmlFor={id}>{field.label}</Label>
      <Input
        id={id}
        name={field.key}
        type={field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "number" ? "text" : "text"}
        inputMode={field.inputMode as HTMLAttributes<HTMLInputElement>["inputMode"]}
        autoComplete={field.autoComplete}
        enterKeyHint={field.enterKeyHint as HTMLAttributes<HTMLInputElement>["enterKeyHint"]}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onEngage}
        onBlur={() => {
          /* parent validates */
        }}
      />
      {field.help ? <p className="mt-1 text-xs text-sage">{field.help}</p> : null}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  )
}
