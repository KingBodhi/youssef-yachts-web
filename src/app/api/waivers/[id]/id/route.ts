export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { notFound, unauthorized } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

// Admin only: stream the government-ID photo (keeps the PII behind auth).
export async function GET(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const row = await prisma.waiver.findUnique({ where: { id } });
  if (!row?.idImageUrl) return notFound("ID image not found");

  const upstream = await fetch(row.idImageUrl);
  if (!upstream.ok) return notFound("ID image not available");

  const buffer = await upstream.arrayBuffer();
  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";
  const safeName = row.fullName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="id-${safeName}"`,
    },
  });
}
