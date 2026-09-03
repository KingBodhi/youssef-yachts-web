export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bookingCreateSchema } from "@/lib/schemas";
import { dbBookingToBooking, toDbCharterType } from "@/lib/serializers";
import { generateBookingId } from "@/lib/utils";
import { badRequest, baseUrlFrom, signingLink, unauthorized } from "@/lib/api";
import { computePricing } from "@/lib/pricing";
import { bookingInterval } from "@/lib/intervals";
import { cleanupExpiredHolds, isOverlapError } from "@/lib/availability";
import { stripe, isStripeConfigured, chargeMode } from "@/lib/stripe";
import { getYachtById } from "@/lib/data/yachts";
import type { BookingStatus } from "@/generated/prisma/enums";

// The DB hold is the backstop; the Stripe Checkout Session expires first
// (STRIPE_EXPIRE_MINUTES) so an abandoned checkout can't be paid after the
// slot might have freed. Stripe requires a session lifetime of >= 30 minutes.
const HOLD_MINUTES = 35;
const STRIPE_EXPIRE_MINUTES = 32;

// Public: reserve a booking from the guest booking flow, then (if Stripe is
// configured) hand back a Checkout URL for the deposit. The slot is reserved
// atomically — the Postgres exclusion constraint guarantees no two overlapping
// bookings for one yacht can both exist, so this is race-proof.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = bookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Invalid booking", parsed.error.flatten());
  }
  const d = parsed.data;

  const yacht = getYachtById(d.yachtId);
  if (!yacht) return badRequest("Unknown yacht");

  // Money is recomputed on the server — the client's numbers are never trusted.
  const pricing = computePricing(d.yachtId, d.schedule.type, d.addOns);

  // Concrete occupied interval used by the exclusion constraint.
  const { startsAt, endsAt } = bookingInterval(
    d.schedule.type,
    d.schedule.date,
    d.schedule.startTime,
    d.schedule.endTime,
    d.schedule.endDate ?? null
  );

  // Free any abandoned holds first so an expired one never blocks this booking.
  await cleanupExpiredHolds();

  const takesPayment = isStripeConfigured();
  const holdExpiresAt = takesPayment
    ? new Date(Date.now() + HOLD_MINUTES * 60_000)
    : null;

  let row;
  try {
    row = await prisma.booking.create({
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
        startsAt,
        endsAt,
        holdExpiresAt,
        guests: d.guests,
        addOns: d.addOns,
        basePrice: pricing.basePrice,
        addOnsTotal: pricing.addOnsTotal,
        serviceFee: pricing.serviceFee,
        tax: pricing.tax,
        total: pricing.total,
        deposit: pricing.deposit,
        balance: pricing.balance,
        paymentMethod: "card",
        paymentStatus: "pending",
        paidAmount: 0,
        remainingAmount: pricing.total,
        status: "pending",
        notes: d.customerInfo.specialRequests ?? null,
      },
    });
  } catch (e) {
    if (isOverlapError(e)) {
      return NextResponse.json(
        {
          error:
            "That date and time was just reserved by someone else. Please choose another slot.",
          code: "SLOT_TAKEN",
        },
        { status: 409 }
      );
    }
    console.error("Booking create failed:", e);
    return NextResponse.json(
      { error: "We couldn't create your booking. Please try again." },
      { status: 500 }
    );
  }

  const base = baseUrlFrom(req);
  const link = signingLink(base, row.id, row.waiverToken);

  // No Stripe configured yet → behave as the original "request a charter" flow.
  if (!takesPayment || !stripe) {
    return NextResponse.json(
      { booking: dbBookingToBooking(row), signingLink: link, checkoutUrl: null },
      { status: 201 }
    );
  }

  // Create the Checkout Session for the deposit (or full amount).
  const mode = chargeMode();
  const amountDollars = mode === "full" ? pricing.total : pricing.deposit;
  const label =
    d.schedule.type === "half-day"
      ? "Half-Day Charter"
      : d.schedule.type === "full-day"
        ? "Full-Day Charter"
        : "Multi-Day Charter";

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: d.customerInfo.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountDollars * 100,
            product_data: {
              name: `${yacht.name} — ${label} (${mode === "full" ? "Full payment" : "50% Deposit"})`,
              description: `${d.schedule.date} · ${d.guests} guests · Booking ${row.id}`,
            },
          },
        },
      ],
      metadata: { bookingId: row.id, chargeMode: mode },
      payment_intent_data: {
        metadata: { bookingId: row.id, chargeMode: mode },
      },
      success_url: `${base}/book/success?booking=${encodeURIComponent(row.id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/book/${yacht.slug}?canceled=${encodeURIComponent(row.id)}`,
      expires_at: Math.floor(Date.now() / 1000) + STRIPE_EXPIRE_MINUTES * 60,
    });

    return NextResponse.json(
      {
        booking: dbBookingToBooking(row),
        signingLink: link,
        checkoutUrl: checkout.url,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Stripe checkout creation failed:", e);
    // The hold will expire on its own; tell the client to retry.
    return NextResponse.json(
      { error: "Payment could not be started. Please try again." },
      { status: 502 }
    );
  }
}

// Admin: list bookings with optional filters.
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  await cleanupExpiredHolds();

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
