import "server-only";
import { prisma } from "@/lib/prisma";

// Server-side availability engine. The Postgres exclusion constraint
// (prisma/sql/002_no_overlap_constraint.sql) is the real guard; these helpers
// keep the "active" set clean and answer availability questions for the UI.

/**
 * Release abandoned checkout holds. A booking that is still `pending` past its
 * hold expiry never completed payment, so we cancel it — which also drops it
 * out of the exclusion constraint, freeing the slot for the next person. Run
 * this before any availability read or reservation attempt so expired holds
 * never block a real booking.
 */
export async function cleanupExpiredHolds(): Promise<number> {
  const res = await prisma.booking.updateMany({
    where: {
      status: "pending",
      holdExpiresAt: { not: null, lt: new Date() },
    },
    data: { status: "cancelled", holdExpiresAt: null },
  });
  return res.count;
}

export interface TakenInterval {
  startsAt: Date;
  endsAt: Date;
  charterType: "half_day" | "full_day" | "multi_day";
  scheduleDate: string;
  startTime: string;
  endTime: string;
  endDate: string | null;
}

/**
 * Every non-cancelled booking for a yacht whose interval touches [from, to).
 * Used to build the availability map the calendar renders.
 */
export async function getTakenIntervals(
  yachtId: string,
  from: Date,
  to: Date
): Promise<TakenInterval[]> {
  await cleanupExpiredHolds();
  const rows = await prisma.booking.findMany({
    where: {
      yachtId,
      status: { not: "cancelled" },
      startsAt: { lt: to },
      endsAt: { gt: from },
    },
    select: {
      startsAt: true,
      endsAt: true,
      charterType: true,
      scheduleDate: true,
      startTime: true,
      endTime: true,
      endDate: true,
    },
    orderBy: { startsAt: "asc" },
  });
  return rows;
}

/**
 * Detect the Postgres exclusion-constraint violation raised when a reservation
 * would collide with an existing booking. Prisma surfaces it as a raw DB error;
 * we match on the constraint name / SQLSTATE 23P01 rather than a Prisma code.
 */
export function isOverlapError(e: unknown): boolean {
  const anyErr = e as { message?: string; meta?: { code?: string } } | null;
  const meta = anyErr?.meta?.code;
  const msg = anyErr?.message ?? String(e);
  return (
    meta === "23P01" ||
    msg.includes("booking_no_overlap") ||
    msg.includes("23P01") ||
    msg.toLowerCase().includes("exclusion constraint")
  );
}
