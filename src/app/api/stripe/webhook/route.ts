export const runtime = "nodejs";

import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { markBookingPaid } from "@/lib/payments";

// Stripe -> app. This is what makes an order "place perfectly": even if the
// customer closes the tab on the way back from Stripe, this server-to-server
// event confirms the payment and finalizes the booking. The signature is
// verified against STRIPE_WEBHOOK_SECRET so only Stripe can trigger it.
export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const raw = await req.text(); // raw body required for signature verification
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const bookingId = s.metadata?.bookingId;
        const mode = s.metadata?.chargeMode === "full" ? "full" : "deposit";
        if (bookingId && s.payment_status === "paid") {
          const pi =
            typeof s.payment_intent === "string"
              ? s.payment_intent
              : (s.payment_intent?.id ?? null);
          await markBookingPaid(bookingId, s.amount_total ?? 0, pi, mode);
        }
        break;
      }
      case "checkout.session.expired": {
        const s = event.data.object as Stripe.Checkout.Session;
        const bookingId = s.metadata?.bookingId;
        if (bookingId) {
          // Checkout abandoned — release the hold so the slot frees up.
          await prisma.booking.updateMany({
            where: { id: bookingId, status: "pending" },
            data: { status: "cancelled", holdExpiresAt: null },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("Webhook handler error:", e);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
