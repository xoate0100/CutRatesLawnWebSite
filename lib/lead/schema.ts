import { z } from "zod"

const touchSchema = z
  .object({
    utm_source: z.string().max(80).optional(),
    utm_medium: z.string().max(80).optional(),
    utm_campaign: z.string().max(120).optional(),
    utm_term: z.string().max(120).optional(),
    utm_content: z.string().max(120).optional(),
    gclid: z.string().max(120).optional(),
    gbraid: z.string().max(120).optional(),
    wbraid: z.string().max(120).optional(),
    fbclid: z.string().max(120).optional(),
    msclkid: z.string().max(120).optional(),
    landing_page: z.string().max(300).optional(),
    referrer: z.string().max(300).optional(),
    first_seen_at: z.string().max(40).optional(),
  })
  .optional()

export const leadSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().max(100).optional().default(""),
    email: z.string().trim().max(254).optional().default(""),
    phone: z.string().trim().max(40).optional().default(""),
    service: z.string().trim().min(1).max(80),
    message: z.string().trim().max(5000).optional().default(""),
    source: z.string().trim().max(80).optional().default("contact"),
    idempotencyKey: z.string().min(8).max(80),
    companyWebsite: z.string().max(200).optional().default(""),
    turnstileToken: z.string().optional(),
    estimateAmount: z.number().nonnegative().optional(),
    estimateUnit: z.string().trim().max(40).optional(),
    lawnSizeSqFt: z.number().int().positive().optional(),
    propertyType: z.string().trim().max(40).optional(),
    frequency: z.string().trim().max(40).optional(),
    address: z.string().trim().max(200).optional(),
    firstTouch: touchSchema,
    lastTouch: touchSchema,
    sessionId: z.string().max(80).optional(),
    deviceType: z.string().max(20).optional(),
    pagePath: z.string().max(200).optional(),
    areaSlug: z.string().max(40).optional(),
    serviceId: z.string().max(80).optional(),
    subServiceId: z.string().max(80).optional(),
    leadStatus: z.enum(["complete", "partial"]).optional().default("complete"),
    serviceDetails: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
    qualifiedArea: z.boolean().optional(),
    urgency: z.string().max(40).optional(),
    heardAboutUs: z.string().max(40).optional(),
  })
  .refine((d) => Boolean(d.phone?.trim() || d.email?.trim()), {
    message: "Phone or email is required",
    path: ["phone"],
  })

export type LeadBody = z.infer<typeof leadSchema>
