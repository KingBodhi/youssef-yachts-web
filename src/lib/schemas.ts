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

// --- Waivers ---
// Signature + ID images travel as multipart files; these schemas validate the
// JSON `payload` field. bookingId/token come from the per-booking link.

const linkParams = {
  bookingId: z.string().optional(),
  token: z.string().optional(),
};

// Guest waiver (G-NOMADS LLC) — minimal: name + DOB.
export const guestWaiverSchema = z.object({
  type: z.literal("guest"),
  fullName: z.string().min(2, "Full name is required").max(120),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ...linkParams,
});

export type GuestWaiverInput = z.infer<typeof guestWaiverSchema>;

// Booker waiver (DJ YOUSSEF LLC) — full details + per-section initials + minor block.
export const bookerWaiverSchema = z
  .object({
    type: z.literal("booker"),
    fullName: z.string().min(2, "Full name is required").max(120),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    address: z.string().min(3, "Address is required").max(300),
    email: z.email("Please enter a valid email address"),
    // sectionId -> typed initials
    initials: z.record(z.string(), z.string().min(1).max(8)),
    isMinor: z.boolean().default(false),
    minorName: z.string().max(120).optional(),
    minorDateOfBirth: z.string().max(40).optional(),
    guardianName: z.string().max(120).optional(),
    ...linkParams,
  })
  .refine(
    (d) =>
      !d.isMinor ||
      (!!d.minorName && !!d.minorDateOfBirth && !!d.guardianName),
    {
      message:
        "Minor name, date of birth and parent/guardian name are required for a minor",
      path: ["minorName"],
    }
  );

export type BookerWaiverInput = z.infer<typeof bookerWaiverSchema>;

export const waiverSubmitSchema = z.discriminatedUnion("type", [
  guestWaiverSchema,
  z.object({
    type: z.literal("booker"),
    fullName: z.string().min(2).max(120),
    dateOfBirth: z.string().min(1),
    address: z.string().min(3).max(300),
    email: z.email(),
    initials: z.record(z.string(), z.string().min(1).max(8)),
    isMinor: z.boolean().default(false),
    minorName: z.string().max(120).optional(),
    minorDateOfBirth: z.string().max(40).optional(),
    guardianName: z.string().max(120).optional(),
    ...linkParams,
  }),
]);

export type WaiverSubmitInput = z.infer<typeof waiverSubmitSchema>;

export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
