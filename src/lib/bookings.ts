import type { Booking, BookingStatus } from "@/lib/types";

// Client-side data access. Talks to the /api/bookings route handlers (server +
// Postgres) instead of localStorage, so bookings made by guests reach the admin.

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(`Request failed (${res.status}): ${message}`);
  }
  return res.json() as Promise<T>;
}

export async function getAllBookings(): Promise<Booking[]> {
  return fetchJson<Booking[]>("/api/bookings");
}

export async function getBookingById(id: string): Promise<Booking | undefined> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`);
  if (!res.ok) return undefined;
  const data = (await res.json()) as { booking: Booking };
  return data.booking;
}

export async function getBookingsByYacht(yachtId: string): Promise<Booking[]> {
  return fetchJson<Booking[]>(
    `/api/bookings?yacht=${encodeURIComponent(yachtId)}`
  );
}

export async function getBookingsByDate(date: string): Promise<Booking[]> {
  return fetchJson<Booking[]>(`/api/bookings?date=${encodeURIComponent(date)}`);
}

export async function getBookingsByStatus(
  status: BookingStatus
): Promise<Booking[]> {
  return fetchJson<Booking[]>(
    `/api/bookings?status=${encodeURIComponent(status)}`
  );
}

export interface CreateBookingResult {
  booking: Booking;
  signingLink: string;
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "updatedAt">
): Promise<CreateBookingResult> {
  return fetchJson<CreateBookingResult>("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  notes?: string
): Promise<Booking | null> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, ...(notes !== undefined ? { notes } : {}) }),
  });
  if (!res.ok) return null;
  return (await res.json()) as Booking;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const res = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return res.ok;
}

// --- Client-side availability helpers (kept for API parity) ---

export async function isDateAvailable(
  yachtId: string,
  date: string,
  type: string
): Promise<boolean> {
  const bookings = (await getBookingsByYacht(yachtId)).filter(
    (b) => b.schedule.date === date && b.status !== "cancelled"
  );
  if (type === "full-day" || type === "multi-day") {
    return bookings.length === 0;
  }
  return (
    bookings.filter(
      (b) => b.schedule.type === "full-day" || b.schedule.type === "multi-day"
    ).length === 0 && bookings.length < 2
  );
}

export async function getMonthBookings(
  yachtId: string,
  year: number,
  month: number
): Promise<Booking[]> {
  const startDate = new Date(year, month, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
  const bookings = await getBookingsByYacht(yachtId);
  return bookings.filter(
    (b) =>
      b.schedule.date >= startDate &&
      b.schedule.date <= endDate &&
      b.status !== "cancelled"
  );
}
