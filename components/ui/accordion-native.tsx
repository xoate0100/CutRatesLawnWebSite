"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (value: string) => void
  type: "single" | "multiple"
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined)

function useAccordion() {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error("Accordion components must be used within an AccordionProvider")
  }
  return context
}

export interface AccordionProps {
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: React.ReactNode
  className?: string
}

export function Accordion({
  type = "single",
  collapsible = false,
  defaultValue,
  value,
  onValueChange,
  children,
  className,
  ...props
}: AccordionProps) {
  const initialValue =
    value !== undefined ? value : defaultValue !== undefined ? defaultValue : type === "single" ? "" : []

  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(initialValue) ? initialValue : initialValue ? [initialValue] : [],
  )

  React.useEffect(() => {
    if (value !== undefined) {
      setOpenItems(Array.isArray(value) ? value : value ? [value] : [])
    }
  }, [value])

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      if (value !== undefined) {
        if (type === "single") {
          onValueChange?.(openItems[0] === itemValue && collapsible ? "" : itemValue)
        } else {
          const newValue = openItems.includes(itemValue)
            ? openItems.filter((v) => v !== itemValue)
            : [...openItems, itemValue]
          onValueChange?.(newValue)
        }
        return
      }

      setOpenItems((current) => {
        if (type === "single") {
          return current[0] === itemValue && collapsible ? [] : [itemValue]
        }

        return current.includes(itemValue) ? current.filter((v) => v !== itemValue) : [...current, itemValue]
      })
    },
    [type, collapsible, openItems, value, onValueChange],
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function AccordionItem({ value, children, className, ...props }: AccordionItemProps) {
  return (
    <div className={cn("border-b", className)} {...props}>
      {children}
    </div>
  )
}

export interface AccordionTriggerProps {
  children: React.ReactNode
  className?: string
}

export function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion()
  const itemRef = React.useRef<HTMLButtonElement>(null)
  const itemValue = itemRef.current?.parentElement?.getAttribute("data-value") || ""
  const isOpen = openItems.includes(itemValue)

  return (
    <button
      ref={itemRef}
      type="button"
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      onClick={() => toggleItem(itemValue)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
}

export interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  const { openItems } = useAccordion()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const itemValue = contentRef.current?.parentElement?.getAttribute("data-value") || ""
  const isOpen = openItems.includes(itemValue)

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "animate-accordion-down" : "animate-accordion-up",
        className,
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
}
