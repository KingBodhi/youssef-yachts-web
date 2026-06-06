export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { waiverSubmitSchema } from "@/lib/schemas";
import { dbWaiverToWaiver } from "@/lib/serializers";
import { verifyBookingToken } from "@/lib/waiver-token";
import { generateWaiverPdf } from "@/lib/pdf/waiver-pdf";
import { getYachtById } from "@/lib/data/yachts";
import { badRequest, clientIp, unauthorized } from "@/lib/api";

function extFor(type: string): string {
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("heic")) return "heic";
  return "jpg";
}

// Public: a guest or the booker signs their waiver via the per-booking link.
// multipart/form-data: payload (JSON) + signature (PNG) + idImage (file) + optional guardianSignature (PNG)
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return badRequest("Expected multipart form data");
  }

  const rawPayload = form.get("payload");
  if (typeof rawPayload !== "string") return badRequest("Missing payload");
  let payloadJson: unknown;
  try {
    payloadJson = JSON.parse(rawPayload);
  } catch {
    return badRequest("Invalid payload JSON");
  }

  const parsed = waiverSubmitSchema.safeParse(payloadJson);
  if (!parsed.success) {
    return badRequest("Invalid waiver", parsed.error.flatten());
  }
  const d = parsed.data;

  // Booking token must be valid when link params are present.
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

  const signature = form.get("signature");
  if (!(signature instanceof Blob) || signature.size === 0) {
    return badRequest("A drawn signature is required");
  }
  const idImage = form.get("idImage");
  if (!(idImage instanceof Blob) || idImage.size === 0) {
    return badRequest("A photo of your government ID is required");
  }
  const guardianSignature = form.get("guardianSignature");

  const ipAddress = clientIp(req);
  const userAgent = req.headers.get("user-agent");
  const stamp = Date.now().toString(36);

  // Upload signature (public, unguessable) and ID (admin-only proxied).
  const sigBytes = Buffer.from(await signature.arrayBuffer());
  const sigBlob = await put(`waivers/sig-${stamp}.png`, sigBytes, {
    access: "public",
    contentType: "image/png",
  });

  const idBytes = Buffer.from(await idImage.arrayBuffer());
  const idExt = extFor((idImage as File).type || "image/jpeg");
  const idBlob = await put(`waivers/id-${stamp}.${idExt}`, idBytes, {
    access: "public",
    contentType: (idImage as File).type || "application/octet-stream",
  });

  let guardianBytes: Buffer | null = null;
  let guardianUrl: string | null = null;
  if (guardianSignature instanceof Blob && guardianSignature.size > 0) {
    guardianBytes = Buffer.from(await guardianSignature.arrayBuffer());
    const gBlob = await put(`waivers/gsig-${stamp}.png`, guardianBytes, {
      access: "public",
      contentType: "image/png",
    });
    guardianUrl = gBlob.url;
  }

  const isBooker = d.type === "booker";

  const row = await prisma.waiver.create({
    data: {
      bookingId: booking?.id ?? null,
      type: d.type,
      fullName: d.fullName,
      dateOfBirth: d.dateOfBirth,
      email: isBooker ? d.email : null,
      address: isBooker ? d.address : null,
      initials: isBooker ? d.initials : undefined,
      isMinor: isBooker ? d.isMinor : false,
      minorName: isBooker ? d.minorName ?? null : null,
      minorDateOfBirth: isBooker ? d.minorDateOfBirth ?? null : null,
      guardianName: isBooker ? d.guardianName ?? null : null,
      guardianSignatureImageUrl: guardianUrl,
      signatureImageUrl: sigBlob.url,
      idImageUrl: idBlob.url,
      agreedToTerms: true,
      status: "signed",
      ipAddress,
      userAgent,
    },
  });

  // Generate the signed PDF and store it in Blob.
  let pdfUrl: string | null = null;
  try {
    const yacht = booking ? getYachtById(booking.yachtId) : undefined;
    const pdfBytes = await generateWaiverPdf({
      type: d.type,
      fullName: row.fullName,
      dateOfBirth: row.dateOfBirth,
      email: row.email,
      address: row.address,
      initials: isBooker ? d.initials : null,
      isMinor: row.isMinor,
      minorName: row.minorName,
      minorDateOfBirth: row.minorDateOfBirth,
      guardianName: row.guardianName,
      signaturePng: sigBytes,
      guardianSignaturePng: guardianBytes,
      signedAt: row.signedAt,
      ipAddress,
      hasId: true,
      booking: booking
        ? {
            id: booking.id,
            yachtName: yacht?.name,
            scheduleDate: booking.scheduleDate,
          }
        : null,
    });
    const pdfBlob = await put(`waivers/${row.id}.pdf`, Buffer.from(pdfBytes), {
      access: "public",
      contentType: "application/pdf",
    });
    pdfUrl = pdfBlob.url;
    await prisma.waiver.update({ where: { id: row.id }, data: { pdfUrl } });
  } catch (err) {
    console.error("Waiver PDF generation failed:", err);
  }

  return NextResponse.json({ ok: true, id: row.id, pdfUrl }, { status: 201 });
}

// Admin: list waivers (optionally for one booking). Never returns ID image URLs.
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
