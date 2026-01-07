/**
 * Formats a number as a currency string
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @param locale The locale to use for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number | string | null | undefined, currency = "USD", locale = "en-US"): string {
  // Handle null, undefined, or empty string
  if (amount === null || amount === undefined || amount === "") {
    return "$0.00"
  }

  // Convert string to number if needed
  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  // Handle NaN
  if (isNaN(numericAmount)) {
    return "$0.00"
  }

  try {
    // Use Intl.NumberFormat for proper currency formatting
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    // Fallback to basic formatting
    return `$${numericAmount.toFixed(2)}`
  }
}
