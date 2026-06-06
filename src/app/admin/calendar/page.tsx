"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllBookings } from "@/lib/bookings";
import { yachts, getYachtById } from "@/lib/data/yachts";
import { formatCurrency } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-400",
  confirmed: "bg-blue-400",
  deposit_paid: "bg-cyan-400",
  fully_paid: "bg-emerald-400",
  completed: "bg-green-400",
  cancelled: "bg-red-400",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  deposit_paid: "bg-cyan-500/15 text-cyan-400",
  fully_paid: "bg-emerald-500/15 text-emerald-400",
  completed: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedYacht, setSelectedYacht] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    setBookings(await getAllBookings());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  const filteredBookings = useMemo(() => {
    if (selectedYacht === "all") return bookings;
    return bookings.filter((b) => b.yachtId === selectedYacht);
  }, [bookings, selectedYacht]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  // Map date string -> bookings for quick lookup
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    filteredBookings.forEach((b) => {
      const d = b.schedule.date;
      if (!map[d]) map[d] = [];
      map[d].push(b);
    });
    return map;
  }, [filteredBookings]);

  const selectedDayBookings = useMemo(() => {
    if (!selectedDate) return [];
    const key = format(selectedDate, "yyyy-MM-dd");
    return bookingsByDate[key] ?? [];
  }, [selectedDate, bookingsByDate]);

  if (!mounted) return null;

  return (
    <div className="flex gap-6">
      {/* Calendar Main */}
      <div className="flex-1 space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white min-w-[200px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-300 transition hover:bg-white/10"
            >
              Today
            </button>
          </div>

          {/* Yacht Filter */}
          <select
            value={selectedYacht}
            onChange={(e) => setSelectedYacht(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-[#E9E9EC]"
          >
            <option value="all" className="bg-[#161618]">
              All Yachts
            </option>
            {yachts.map((y) => (
              <option key={y.id} value={y.id} className="bg-[#161618]">
                {y.name}
              </option>
            ))}
          </select>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-xl border border-white/10 bg-[#161618] overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-white/5">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayBookings = bookingsByDate[dateStr] ?? [];
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`relative min-h-[100px] border-b border-r border-white/5 p-2 text-left transition hover:bg-white/[0.03] ${
                    !inMonth ? "opacity-30" : ""
                  } ${isSelected ? "bg-[#E9E9EC]/10 ring-1 ring-inset ring-[#E9E9EC]/30" : ""}`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                      today
                        ? "bg-white font-bold text-[#0A0A0B]"
                        : "text-gray-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Booking Indicators */}
                  <div className="mt-1 space-y-1">
                    {dayBookings.slice(0, 3).map((b) => {
                      const yacht = getYachtById(b.yachtId);
                      return (
                        <div
                          key={b.id}
                          className="flex items-center gap-1 truncate"
                        >
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                              STATUS_COLORS[b.status] ?? "bg-gray-400"
                            }`}
                          />
                          <span className="truncate text-[10px] text-gray-400">
                            {yacht?.name.split("'")[0] ?? ""} - {b.customerInfo.lastName}
                          </span>
                        </div>
                      );
                    })}
                    {dayBookings.length > 3 && (
                      <span className="text-[10px] text-gray-500">
                        +{dayBookings.length - 3} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="font-medium text-gray-500">Legend:</span>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
              <span>{statusLabel(status)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Panel - Day Detail */}
      <div className="w-[340px] shrink-0">
        <div className="sticky top-0 rounded-xl border border-white/10 bg-[#161618]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold text-white">
              {selectedDate
                ? format(selectedDate, "EEEE, MMM d, yyyy")
                : "Select a Day"}
            </h3>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="rounded p-1 text-gray-500 hover:bg-white/10 hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[calc(100vh-240px)] overflow-y-auto p-4">
            {!selectedDate ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Click on a day in the calendar to view bookings.
              </p>
            ) : selectedDayBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No bookings for this day.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayBookings.map((booking) => {
                  const yacht = getYachtById(booking.yachtId);
                  return (
                    <div
                      key={booking.id}
                      className="rounded-lg border border-white/5 bg-white/[0.03] p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {yacht?.name ?? booking.yachtId}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.schedule.startTime} -{" "}
                            {booking.schedule.endTime}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            STATUS_STYLES[booking.status] ?? ""
                          }`}
                        >
                          {statusLabel(booking.status)}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Customer</span>
                          <span className="text-gray-300">
                            {booking.customerInfo.firstName}{" "}
                            {booking.customerInfo.lastName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Guests</span>
                          <span className="text-gray-300">
                            {booking.guests}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total</span>
                          <span className="font-medium text-white">
                            {formatCurrency(booking.pricing.total)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 font-mono text-[10px] text-gray-600">
                        {booking.id}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
