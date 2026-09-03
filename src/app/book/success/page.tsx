export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { markBookingPaid } from "@/lib/payments";
import { getYachtById } from "@/lib/data/yachts";
import { signingLink } from "@/lib/api";
import { BookingSuccess } from "@/components/booking/booking-success";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | Hurry Up Slowly Yachts",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ booking?: string; session_id?: string }>;
}

async function baseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_BASE_URL;
  if (env) return env.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { booking: bookingId, session_id } = await searchParams;
  if (!bookingId) notFound();

  // If we can reach Stripe, confirm the payment now (a safety net in case the
  // webhook is delayed) and only trust a session that matches this booking.
  if (stripe && session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (
        s.metadata?.bookingId === bookingId &&
        s.payment_status === "paid"
      ) {
        const pi =
          typeof s.payment_intent === "string"
            ? s.payment_intent
            : (s.payment_intent?.id ?? null);
        const mode = s.metadata?.chargeMode === "full" ? "full" : "deposit";
        await markBookingPaid(bookingId, s.amount_total ?? 0, pi, mode);
      }
    } catch (e) {
      console.error("Success-page Stripe confirm failed:", e);
    }
  }

  const row = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!row) notFound();

  const yacht = getYachtById(row.yachtId);
  const base = await baseUrl();
  const link = signingLink(base, row.id, row.waiverToken);
  const paid =
    row.paymentStatus === "deposit_paid" || row.paymentStatus === "fully_paid";

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <BookingSuccess
          yachtName={yacht?.name ?? "your yacht"}
          firstName={row.firstName}
          email={row.email}
          signingLink={link}
          paid={paid}
          paidAmount={paid ? row.paidAmount : undefined}
          remainingAmount={paid ? row.remainingAmount : undefined}
        />
      </div>
    </main>
  );
}
