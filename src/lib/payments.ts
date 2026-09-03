import "server-only";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";

/**
 * Mark a booking as paid. Called by both the Stripe webhook and the success
 * page (as an immediate-confirmation fallback), so it must be idempotent: a
 * booking already recorded as paid is left untouched. `amountCents` is what
 * Stripe actually collected; `mode` says whether that was the deposit or the
 * full balance.
 */
export async function markBookingPaid(
  bookingId: string,
  amountCents: number,
  paymentIntentId: string | null,
  mode: "deposit" | "full"
): Promise<boolean> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return false;
  if (
    booking.paymentStatus === "deposit_paid" ||
    booking.paymentStatus === "fully_paid"
  ) {
    return false; // already recorded — idempotent no-op
  }

  const paid = Math.round(amountCents / 100);
  const remaining = Math.max(booking.total - paid, 0);
  const fullyPaid = mode === "full" || paid >= booking.total;

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: fullyPaid ? "fully_paid" : "deposit_paid",
      status: fullyPaid ? "fully_paid" : "deposit_paid",
      paidAmount: paid,
      remainingAmount: remaining,
      stripePaymentIntentId: paymentIntentId ?? undefined,
      holdExpiresAt: null, // the reservation is now permanent
    },
  });

  // Fire the confirmation email once, now that payment is recorded.
  await sendBookingConfirmation(updated);
  return true;
}
