// Turn a charter selection into a concrete [startsAt, endsAt) instant range.
// This range is what the Postgres exclusion constraint compares, so it is the
// literal definition of "occupied" for a yacht.
//
// Rules (the recommended slot model):
//   half-day  -> the actual time window, so two non-overlapping half-days can
//                share a day (e.g. morning + sunset) but overlapping ones cannot.
//   full-day  -> the whole calendar day is blocked.
//   multi-day -> every day from the start date through the end date is blocked.
import type { UiCharterType } from "@/lib/pricing";

// Charters are in Miami (America/New_York). We anchor day/time math to a fixed
// UTC-derived local wall clock by treating the stored "yyyy-MM-dd" + "HH:mm" as
// naive local values and comparing them consistently. Because every booking for
// a given yacht is compared against every other with the same convention, the
// overlap test is correct regardless of absolute timezone.
function at(date: string, time: string): Date {
  // date: "yyyy-MM-dd", time: "HH:mm"
  return new Date(`${date}T${time}:00`);
}

function startOfDay(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

function nextDayStart(date: string): Date {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return d;
}

export interface Interval {
  startsAt: Date;
  endsAt: Date;
}

export function bookingInterval(
  charterType: UiCharterType,
  date: string,
  startTime: string,
  endTime: string,
  endDate?: string | null
): Interval {
  if (charterType === "half-day") {
    return { startsAt: at(date, startTime), endsAt: at(date, endTime) };
  }
  if (charterType === "full-day") {
    return { startsAt: startOfDay(date), endsAt: nextDayStart(date) };
  }
  // multi-day: whole days from date .. (endDate ?? date), end exclusive.
  const last = endDate && endDate >= date ? endDate : date;
  return { startsAt: startOfDay(date), endsAt: nextDayStart(last) };
}

/** True when two [start,end) ranges overlap. Touch-at-the-edge is allowed. */
export function overlaps(a: Interval, b: Interval): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}
