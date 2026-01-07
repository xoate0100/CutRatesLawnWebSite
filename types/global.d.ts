// Global type declarations

declare global {
  interface Window {
    formatDate: (dateString: string | null | undefined) => string
    getSafeImageUrl: (url: string | undefined | null, fallback?: string) => string
    safeText: (text: string | undefined | null) => string
    formatCurrency: (amount: number | string | null | undefined, currency?: string, locale?: string) => string
    __ENV__?: Record<string, string>
  }
}

// This export is needed to make this a module
export {}
