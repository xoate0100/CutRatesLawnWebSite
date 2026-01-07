import { formatCurrency } from "@/lib/utils"

interface PriceDisplayProps {
  amount: number | string
  currency?: string
  priceUnit?: string
  className?: string
}

export function PriceDisplay({ amount, currency = "USD", priceUnit, className = "" }: PriceDisplayProps) {
  const formattedPrice = formatCurrency(amount, currency)

  return (
    <div className={`flex items-baseline ${className}`}>
      <span className="text-2xl font-bold">{formattedPrice}</span>
      {priceUnit && <span className="text-sm text-gray-500 ml-1">/{priceUnit}</span>}
    </div>
  )
}
