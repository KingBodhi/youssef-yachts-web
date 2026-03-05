import type { Booking, BookingStatus } from "@/lib/types";
import { generateBookingId } from "@/lib/utils";

const STORAGE_KEY = "yousef_yachts_bookings";

function getBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function getAllBookings(): Booking[] {
  return getBookings().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

export function getBookingsByYacht(yachtId: string): Booking[] {
  return getBookings().filter((b) => b.yachtId === yachtId);
}

export function getBookingsByDate(date: string): Booking[] {
  return getBookings().filter((b) => b.schedule.date === date);
}

export function getBookingsByStatus(status: BookingStatus): Booking[] {
  return getBookings().filter((b) => b.status === status);
}

export function createBooking(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
  const bookings = getBookings();
  const now = new Date().toISOString();
  const booking: Booking = {
    ...data,
    id: generateBookingId(),
    createdAt: now,
    updatedAt: now,
  };
  bookings.push(booking);
  saveBookings(bookings);
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus, notes?: string): Booking | null {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  bookings[index].status = status;
  bookings[index].updatedAt = new Date().toISOString();
  if (notes) bookings[index].notes = notes;
  saveBookings(bookings);
  return bookings[index];
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) return false;
  saveBookings(filtered);
  return true;
}

export function isDateAvailable(yachtId: string, date: string, type: string): boolean {
  const bookings = getBookings().filter(
    (b) =>
      b.yachtId === yachtId &&
      b.schedule.date === date &&
      b.status !== "cancelled"
  );
  if (type === "full-day" || type === "multi-day") {
    return bookings.length === 0;
  }
  return bookings.filter((b) => b.schedule.type === "full-day" || b.schedule.type === "multi-day").length === 0 &&
    bookings.length < 2;
}

export function getMonthBookings(yachtId: string, year: number, month: number): Booking[] {
  const startDate = new Date(year, month, 1).toISOString().split("T")[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];
  return getBookings().filter(
    (b) =>
      b.yachtId === yachtId &&
      b.schedule.date >= startDate &&
      b.schedule.date <= endDate &&
      b.status !== "cancelled"
  );
}
