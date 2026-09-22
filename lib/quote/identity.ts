export function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] || "Guest"
  const lastName = parts.slice(1).join(" ") || "Lead"
  return { firstName, lastName }
}

export function normalizeE164(raw: string, defaultCountry = "+1"): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  if (raw.trim().startsWith("+") && digits.length >= 10) return `+${digits}`
  if (digits.length === 10) return `${defaultCountry}${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return `${defaultCountry}${digits.slice(-10)}`
}

export function maskUsPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

export function isValidMobile(raw: string): boolean {
  const d = raw.replace(/\D/g, "")
  return d.length === 10 || (d.length === 11 && d.startsWith("1"))
}
