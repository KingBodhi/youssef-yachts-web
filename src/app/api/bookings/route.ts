export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bookingCreateSchema } from "@/lib/schemas";
import { dbBookingToBooking, toDbCharterType } from "@/lib/serializers";
import { generateBookingId } from "@/lib/utils";
import { badRequest, baseUrlFrom, signingLink, unauthorized } from "@/lib/api";
import type { BookingStatus } from "@/generated/prisma/enums";

// Public: create a booking from the guest booking flow.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Invalid booking", parsed.error.flatten());
  }
  const d = parsed.data;

  const row = await prisma.booking.create({
    data: {
      id: generateBookingId(),
      yachtId: d.yachtId,
      firstName: d.customerInfo.firstName,
      lastName: d.customerInfo.lastName,
      email: d.customerInfo.email,
      phone: d.customerInfo.phone,
      specialRequests: d.customerInfo.specialRequests ?? null,
      scheduleDate: d.schedule.date,
      startTime: d.schedule.startTime,
      endTime: d.schedule.endTime,
      charterType: toDbCharterType(d.schedule.type),
      endDate: d.schedule.endDate ?? null,
      guests: d.guests,
      addOns: d.addOns,
      basePrice: d.pricing.basePrice,
      addOnsTotal: d.pricing.addOnsTotal,
      serviceFee: d.pricing.serviceFee,
      tax: d.pricing.tax,
      total: d.pricing.total,
      deposit: d.pricing.deposit,
      balance: d.pricing.balance,
      paymentMethod: d.payment.method,
      paymentStatus: d.payment.status,
      stripePaymentIntentId: d.payment.stripePaymentIntentId ?? null,
      paidAmount: d.payment.paidAmount,
      remainingAmount: d.payment.remainingAmount,
      status: d.status,
      notes: d.notes ?? null,
    },
  });

  return NextResponse.json(
    {
      booking: dbBookingToBooking(row),
      signingLink: signingLink(baseUrlFrom(req), row.id, row.waiverToken),
    },
    { status: 201 }
  );
}

// Admin: list bookings with optional filters.
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const yacht = searchParams.get("yacht");
  const status = searchParams.get("status");
  const date = searchParams.get("date");

  const rows = await prisma.booking.findMany({
    where: {
      ...(yacht ? { yachtId: yacht } : {}),
      ...(status ? { status: status as BookingStatus } : {}),
      ...(date ? { scheduleDate: date } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(rows.map(dbBookingToBooking));
}
