import "server-only";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Booking as DbBooking } from "@/generated/prisma/client";

// Validate a per-booking signing token (constant-time). Returns the booking
// row if the token matches, otherwise null.
export async function verifyBookingToken(
  bookingId: string | undefined | null,
  token: string | undefined | null
): Promise<DbBooking | null> {
  if (!bookingId || !token) return null;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return null;

  const expected = Buffer.from(booking.waiverToken);
  const provided = Buffer.from(token);
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  return booking;
}
