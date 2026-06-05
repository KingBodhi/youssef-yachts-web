export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { waiverSubmitSchema } from "@/lib/schemas";
import { dbWaiverToWaiver, toUiCharterType } from "@/lib/serializers";
import { verifyBookingToken } from "@/lib/waiver-token";
import { generateWaiverPdf } from "@/lib/pdf/waiver-pdf";
import { getYachtById } from "@/lib/data/yachts";
import { badRequest, clientIp, unauthorized } from "@/lib/api";

// Public: a guest signs the waiver via a per-booking link.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = waiverSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest("Invalid waiver", parsed.error.flatten());
  }
  const d = parsed.data;

  // If link params are present, the token must be valid for that booking.
  let booking = null;
  if (d.bookingId || d.token) {
    booking = await verifyBookingToken(d.bookingId, d.token);
    if (!booking) {
      return NextResponse.json(
        { error: "This signing link is invalid or has expired." },
        { status: 403 }
      );
    }
  }

  const ipAddress = clientIp(req);
  const userAgent = req.headers.get("user-agent");

  const row = await prisma.waiver.create({
    data: {
      bookingId: booking?.id ?? null,
      fullName: d.fullName,
      dateOfBirth: d.dateOfBirth,
      email: d.email,
      phone: d.phone,
      emergencyContactName: d.emergencyContactName,
      emergencyContactPhone: d.emergencyContactPhone,
      emergencyContactRelation: d.emergencyContactRelation,
      typedSignature: d.typedSignature,
      agreedToTerms: true,
      status: "signed",
      ipAddress,
      userAgent,
    },
  });

  // Generate the signed PDF and store it in Vercel Blob.
  let pdfUrl: string | null = null;
  try {
    const yacht = booking ? getYachtById(booking.yachtId) : undefined;
    const pdfBytes = await generateWaiverPdf({
      fullName: row.fullName,
      dateOfBirth: row.dateOfBirth,
      email: row.email,
      phone: row.phone,
      emergencyContactName: row.emergencyContactName,
      emergencyContactPhone: row.emergencyContactPhone,
      emergencyContactRelation: row.emergencyContactRelation,
      typedSignature: row.typedSignature,
      signedAt: row.signedAt,
      ipAddress,
      booking: booking
        ? {
            id: booking.id,
            yachtName: yacht?.name,
            scheduleDate: booking.scheduleDate,
            charterType: toUiCharterType(booking.charterType),
          }
        : null,
    });

    const blob = await put(`waivers/${row.id}.pdf`, Buffer.from(pdfBytes), {
      access: "public",
      contentType: "application/pdf",
    });
    pdfUrl = blob.url;
    await prisma.waiver.update({ where: { id: row.id }, data: { pdfUrl } });
  } catch (err) {
    // The waiver itself is recorded even if PDF generation/upload fails.
    console.error("Waiver PDF generation failed:", err);
  }

  return NextResponse.json({ ok: true, id: row.id, pdfUrl }, { status: 201 });
}

// Admin: list waivers (optionally for one booking).
export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  const rows = await prisma.waiver.findMany({
    where: bookingId ? { bookingId } : {},
    orderBy: { signedAt: "desc" },
  });

  return NextResponse.json(rows.map(dbWaiverToWaiver));
}
