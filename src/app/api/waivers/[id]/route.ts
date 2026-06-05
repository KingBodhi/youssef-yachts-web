export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

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
