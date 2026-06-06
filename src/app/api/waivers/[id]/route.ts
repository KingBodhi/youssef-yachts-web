export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { dbWaiverToWaiver } from "@/lib/serializers";
import { badRequest, notFound, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

// Admin: assign (or clear) the booking a waiver is linked to.
export async function PATCH(req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    bookingId?: string | null;
  } | null;
  if (!body || !("bookingId" in body)) return badRequest("bookingId required");

  if (body.bookingId) {
    const booking = await prisma.booking.findUnique({
      where: { id: body.bookingId },
    });
    if (!booking) return notFound("Booking not found");
  }

  try {
    const row = await prisma.waiver.update({
      where: { id },
      data: { bookingId: body.bookingId ?? null },
    });
    return NextResponse.json(dbWaiverToWaiver(row));
  } catch {
    return notFound("Waiver not found");
  }
}

// Admin: stream the signed PDF (keeps the PII document behind admin auth).
export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const row = await prisma.waiver.findUnique({ where: { id } });
  if (!row?.pdfUrl) return notFound("Signed PDF not found");

  const upstream = await fetch(row.pdfUrl);
  if (!upstream.ok) return notFound("Signed PDF not available");

  const buffer = await upstream.arrayBuffer();
  const safeName = row.fullName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="waiver-${safeName}.pdf"`,
    },
  });
}
