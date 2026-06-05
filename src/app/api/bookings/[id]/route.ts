export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bookingUpdateSchema } from "@/lib/schemas";
import { dbBookingToBooking, dbWaiverToWaiver } from "@/lib/serializers";
import {
  badRequest,
  baseUrlFrom,
  notFound,
  signingLink,
  unauthorized,
} from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

// Admin: one booking + its guest waiver roster + the signing link.
export async function GET(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const row = await prisma.booking.findUnique({
    where: { id },
    include: { waivers: { orderBy: { signedAt: "desc" } } },
  });
  if (!row) return notFound("Booking not found");

  return NextResponse.json({
    booking: dbBookingToBooking(row),
    waivers: row.waivers.map(dbWaiverToWaiver),
    signingLink: signingLink(baseUrlFrom(req), row.id, row.waiverToken),
  });
}

// Admin: update status / notes.
export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = bookingUpdateSchema.safeParse(body);
  if (!parsed.success) return badRequest("Invalid update", parsed.error.flatten());

  try {
    const row = await prisma.booking.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.notes !== undefined ? { notes: parsed.data.notes } : {}),
      },
    });
    return NextResponse.json(dbBookingToBooking(row));
  } catch {
    return notFound("Booking not found");
  }
}

// Admin: delete a booking (linked waivers are kept, their bookingId set null).
export async function DELETE(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  try {
    await prisma.booking.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return notFound("Booking not found");
  }
}
