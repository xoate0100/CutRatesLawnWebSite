import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap max-sm:whitespace-normal max-sm:text-center",
  {
    variants: {
      variant: {
        default: "rounded-md bg-green text-primary-foreground hover:bg-green-soft",
        destructive: "rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "rounded-md border border-green text-green bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "rounded-full border-2 border-current bg-transparent font-bold opacity-90 hover:opacity-100",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
        lime: "rounded-full bg-lime text-forest-2 font-bold shadow-md max-sm:shadow-md sm:shadow-[0_10px_0_-2px_var(--lime-2),0_22px_34px_-14px_rgba(169,226,46,0.6)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-md sm:active:shadow-[0_4px_0_-2px_var(--lime-2)]",
        dark: "rounded-full bg-forest text-white font-bold hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
