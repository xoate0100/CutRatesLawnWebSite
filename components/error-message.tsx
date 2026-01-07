import { AlertTriangle, XCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  title?: string
  message: string
  type?: "error" | "warning" | "info"
  className?: string
}

export function ErrorMessage({ title, message, type = "error", className }: ErrorMessageProps) {
  const icons = {
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  }

  const styles = {
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  }

  return (
    <div className={cn("rounded-md border p-4", styles[type], className)}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm mt-1">{message}</div>
        </div>
      </div>
    </div>
  )
}
