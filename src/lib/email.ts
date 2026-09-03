import "server-only";
import { getYachtById } from "@/lib/data/yachts";
import { formatCurrency } from "@/lib/utils";
import type { Booking as DbBooking } from "@/generated/prisma/client";

// Transactional email via Resend's REST API (no SDK dependency). Dormant until
// RESEND_API_KEY + EMAIL_FROM are set — everything degrades gracefully without
// them, exactly like the Stripe seam.
function configured(): boolean {
  return !!process.env.RESEND_API_KEY && !!process.env.EMAIL_FROM;
}

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!configured()) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend send failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.error("Resend send error:", e);
  }
}

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");
}

function money(n: number) {
  return formatCurrency(n);
}

/**
 * Sent to the customer (and, if EMAIL_ADMIN is set, the team) once payment is
 * confirmed. Called from markBookingPaid, so it fires exactly once per booking.
 */
export async function sendBookingConfirmation(booking: DbBooking): Promise<void> {
  if (!configured()) return;
  const yacht = getYachtById(booking.yachtId);
  const yachtName = yacht?.name ?? "your yacht";
  const link = `${baseUrl()}/waiver?booking=${encodeURIComponent(booking.id)}&token=${encodeURIComponent(booking.waiverToken)}`;
  const paid = booking.paidAmount;

  const summary = `
    <table style="border-collapse:collapse;font-size:14px;color:#222">
      <tr><td style="padding:4px 12px 4px 0;color:#666">Booking</td><td><b>${booking.id}</b></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Yacht</td><td>${yachtName}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Date</td><td>${booking.scheduleDate}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Time</td><td>${booking.startTime}–${booking.endTime}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Guests</td><td>${booking.guests}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Paid</td><td><b>${money(paid)}</b></td></tr>
    </table>`;

  const customerHtml = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#111">Your charter is confirmed 🛥️</h2>
      <p>Thank you, ${booking.firstName}. Your payment was received and your date aboard the <b>${yachtName}</b> is locked in.</p>
      ${summary}
      <p style="margin-top:20px">Before boarding, every guest must sign a liability waiver. Complete yours and share this link with your party:</p>
      <p><a href="${link}" style="background:#111;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Complete waivers</a></p>
      <p style="color:#888;font-size:12px;margin-top:24px">Hurry Up Slowly Yachts · Miami Beach, FL</p>
    </div>`;

  await send(booking.email, `Charter confirmed — ${yachtName} on ${booking.scheduleDate}`, customerHtml);

  const admin = process.env.EMAIL_ADMIN;
  if (admin) {
    const adminHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto">
        <h2>New paid booking</h2>
        ${summary}
        <p style="margin-top:12px">${booking.firstName} ${booking.lastName} · ${booking.email} · ${booking.phone}</p>
      </div>`;
    await send(admin, `New booking ${booking.id} — ${yachtName} ${booking.scheduleDate}`, adminHtml);
  }
}
