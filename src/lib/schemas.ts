// Shared zod schemas — single source of truth for the API routes and forms.
import { z } from "zod";

const phone = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[\d\s\-+()]{7,20}$/, "Please enter a valid phone number");

export const charterTypeSchema = z.enum(["half-day", "full-day", "multi-day"]);

export const bookingCreateSchema = z.object({
  yachtId: z.string().min(1),
  customerInfo: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.email("Please enter a valid email address"),
    phone,
    specialRequests: z.string().max(2000).optional(),
  }),
  schedule: z.object({
    date: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    type: charterTypeSchema,
    endDate: z.string().optional(),
  }),
  guests: z.number().int().positive(),
  addOns: z.array(z.string()).default([]),
  pricing: z.object({
    basePrice: z.number().int().nonnegative(),
    addOnsTotal: z.number().int().nonnegative(),
    serviceFee: z.number().int().nonnegative(),
    tax: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
    deposit: z.number().int().nonnegative(),
    balance: z.number().int().nonnegative(),
  }),
  payment: z.object({
    method: z.enum(["card", "wire", "crypto"]).default("card"),
    status: z
      .enum(["pending", "deposit_paid", "fully_paid", "refunded"])
      .default("pending"),
    stripePaymentIntentId: z.string().optional(),
    paidAmount: z.number().int().nonnegative().default(0),
    remainingAmount: z.number().int().nonnegative().default(0),
  }),
  status: z
    .enum([
      "pending",
      "confirmed",
      "deposit_paid",
      "fully_paid",
      "completed",
      "cancelled",
    ])
    .default("pending"),
  notes: z.string().max(2000).optional(),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;

export const bookingUpdateSchema = z.object({
  status: z
    .enum([
      "pending",
      "confirmed",
      "deposit_paid",
      "fully_paid",
      "completed",
      "cancelled",
    ])
    .optional(),
  notes: z.string().max(2000).optional(),
});

// Client-side waiver form fields (no booking linkage — that comes from the URL).
export const waiverFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.email("Please enter a valid email address"),
  phone,
  emergencyContactName: z
    .string()
    .min(2, "Emergency contact name is required")
    .max(100),
  emergencyContactPhone: phone,
  emergencyContactRelation: z.string().min(1, "Relationship is required").max(50),
  agreedToTerms: z.literal(true, {
    error: "You must agree to the terms and conditions",
  }),
  typedSignature: z
    .string()
    .min(2, "Please type your full legal name as a signature")
    .max(100),
});

export type WaiverFormData = z.infer<typeof waiverFormSchema>;

// Server-side waiver submission = the form fields plus the per-booking link params.
export const waiverSubmitSchema = waiverFormSchema.extend({
  bookingId: z.string().optional(),
  token: z.string().optional(),
});

export type WaiverSubmitInput = z.infer<typeof waiverSubmitSchema>;

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
