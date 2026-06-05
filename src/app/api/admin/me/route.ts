export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { unauthorized } from "@/lib/api";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  return NextResponse.json({ user: session });
}
