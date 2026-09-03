export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getTakenIntervals } from "@/lib/availability";
import { overlaps } from "@/lib/intervals";
import { HALF_DAY_SLOTS } from "@/lib/slots";
import { getYachtById } from "@/lib/data/yachts";

// Public: availability for one yacht across a date window. Returns, per day,
// whether the whole day is blocked, whether anything at all is taken (so
// full/multi-day selection can be disabled), and which half-day slots are
// taken. The calendar UI uses this to grey out unavailable dates and slots.
//
// GET /api/availability?yacht=<id>&from=YYYY-MM-DD&to=YYYY-MM-DD  (to inclusive)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const yachtId = searchParams.get("yacht");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!yachtId || !from || !to) {
    return NextResponse.json(
      { error: "yacht, from and to are required" },
      { status: 400 }
    );
  }
  if (!getYachtById(yachtId)) {
    return NextResponse.json({ error: "Unknown yacht" }, { status: 404 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const fromDate = new Date(`${from}T00:00:00`);
  const toExclusive = new Date(`${to}T00:00:00`);
  toExclusive.setDate(toExclusive.getDate() + 1);

  // Cap the window so this can't be abused to scan huge ranges.
  const spanDays = Math.round(
    (toExclusive.getTime() - fromDate.getTime()) / 86_400_000
  );
  if (spanDays < 1 || spanDays > 92) {
    return NextResponse.json({ error: "Range too large" }, { status: 400 });
  }

  const taken = await getTakenIntervals(yachtId, fromDate, toExclusive);

  const days: Record<
    string,
    { anyTaken: boolean; dayBlocked: boolean; slotsTaken: string[] }
  > = {};

  for (let i = 0; i < spanDays; i++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const dayStart = new Date(`${key}T00:00:00`);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayInterval = { startsAt: dayStart, endsAt: dayEnd };
    const dayTaken = taken.filter((t) => overlaps(t, dayInterval));

    const anyTaken = dayTaken.length > 0;
    // Whole day is blocked if a taken interval spans the entire day (full/multi).
    const dayBlocked = dayTaken.some(
      (t) => t.startsAt <= dayStart && t.endsAt >= dayEnd
    );

    const slotsTaken: string[] = [];
    for (const slot of HALF_DAY_SLOTS) {
      const slotInterval = {
        startsAt: new Date(`${key}T${slot.start}:00`),
        endsAt: new Date(`${key}T${slot.end}:00`),
      };
      if (dayTaken.some((t) => overlaps(t, slotInterval))) {
        slotsTaken.push(slot.id);
      }
    }

    if (anyTaken) days[key] = { anyTaken, dayBlocked, slotsTaken };
  }

  return NextResponse.json(
    { yachtId, from, to, days },
    { headers: { "Cache-Control": "no-store" } }
  );
}
