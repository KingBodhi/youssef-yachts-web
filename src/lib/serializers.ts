// Re-assemble flat Prisma rows into the nested shapes the existing UI expects
// (src/lib/types.ts stays untouched). Pure module — no Node/Prisma runtime imports.
import type {
  Booking as DbBooking,
  Waiver as DbWaiver,
} from "@/generated/prisma/client";
import type { Booking } from "@/lib/types";

type UiCharterType = "half-day" | "full-day" | "multi-day";
type DbCharterType = "half_day" | "full_day" | "multi_day";

const CHARTER_TO_UI: Record<DbCharterType, UiCharterType> = {
  half_day: "half-day",
  full_day: "full-day",
  multi_day: "multi-day",
};

const CHARTER_TO_DB: Record<UiCharterType, DbCharterType> = {
  "half-day": "half_day",
  "full-day": "full_day",
  "multi-day": "multi_day",
};

export function toUiCharterType(value: DbCharterType): UiCharterType {
  return CHARTER_TO_UI[value];
}

export function toDbCharterType(value: UiCharterType): DbCharterType {
  return CHARTER_TO_DB[value];
}

export function dbBookingToBooking(row: DbBooking): Booking {
  return {
    id: row.id,
    yachtId: row.yachtId,
    customerInfo: {
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      specialRequests: row.specialRequests ?? undefined,
    },
    schedule: {
      date: row.scheduleDate,
      startTime: row.startTime,
      endTime: row.endTime,
      type: toUiCharterType(row.charterType),
      endDate: row.endDate ?? undefined,
    },
    guests: row.guests,
    addOns: row.addOns,
    pricing: {
      basePrice: row.basePrice,
      addOnsTotal: row.addOnsTotal,
      serviceFee: row.serviceFee,
      tax: row.tax,
      total: row.total,
      deposit: row.deposit,
      balance: row.balance,
    },
    payment: {
      method: row.paymentMethod,
      status: row.paymentStatus,
      stripePaymentIntentId: row.stripePaymentIntentId ?? undefined,
      paidAmount: row.paidAmount,
      remainingAmount: row.remainingAmount,
    },
    status: row.status,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export type WaiverRecord = {
  id: string;
  bookingId: string | null;
  type: "booker" | "guest";
  fullName: string;
  dateOfBirth: string;
  email: string | null;
  address: string | null;
  isMinor: boolean;
  minorName: string | null;
  signatureImageUrl: string | null;
  hasId: boolean; // ID image exists; download only via admin /api/waivers/[id]/id
  status: "pending" | "signed";
  pdfUrl: string | null;
  signedAt: string;
  createdAt: string;
};

// NOTE: never includes idImageUrl — the ID photo is admin-only via a proxied route.
export function dbWaiverToWaiver(row: DbWaiver): WaiverRecord {
  return {
    id: row.id,
    bookingId: row.bookingId,
    type: row.type,
    fullName: row.fullName,
    dateOfBirth: row.dateOfBirth,
    email: row.email,
    address: row.address,
    isMinor: row.isMinor,
    minorName: row.minorName,
    signatureImageUrl: row.signatureImageUrl,
    hasId: !!row.idImageUrl,
    status: row.status,
    pdfUrl: row.pdfUrl,
    signedAt: row.signedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}
