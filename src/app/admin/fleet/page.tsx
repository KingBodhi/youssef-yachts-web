"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { yachts } from "@/lib/data/yachts";
import { getAllBookings } from "@/lib/bookings";
import { formatCurrency } from "@/lib/utils";
import type { Booking, Yacht } from "@/lib/types";
import {
  Ship,
  ExternalLink,
  CalendarDays,
  DollarSign,
  Users,
  Clock,
  Plus,
} from "lucide-react";

const STATUS_BADGE: Record<string, { label: string; style: string }> = {
  active: { label: "Active", style: "bg-green-500/15 text-green-400" },
  maintenance: {
    label: "Maintenance",
    style: "bg-yellow-500/15 text-yellow-400",
  },
  inactive: { label: "Inactive", style: "bg-red-500/15 text-red-400" },
};

export default function AdminFleetPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState(false);

  const refresh = useCallback(async () => {
    setBookings(await getAllBookings());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  function showComingSoon() {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  function getYachtStats(yacht: Yacht) {
    const yachtBookings = bookings.filter((b) => b.yachtId === yacht.id);
    const activeBookings = yachtBookings.filter(
      (b) => b.status !== "cancelled"
    );

    const now = new Date().toISOString().split("T")[0];
    const upcoming = activeBookings.filter(
      (b) => b.schedule.date >= now
    ).length;

    const totalRevenue = activeBookings.reduce(
      (sum, b) => sum + b.pricing.total,
      0
    );

    const totalGuests = activeBookings.reduce((sum, b) => sum + b.guests, 0);

    const sorted = [...activeBookings].sort((a, b) =>
      b.schedule.date.localeCompare(a.schedule.date)
    );
    const lastBookingDate = sorted.length > 0 ? sorted[0].schedule.date : null;

    return { upcoming, totalRevenue, totalGuests, lastBookingDate, totalBookings: activeBookings.length };
  }

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {yachts.length} vessel{yachts.length !== 1 ? "s" : ""} in fleet
          </p>
        </div>
        <button
          onClick={showComingSoon}
          className="flex items-center gap-2 rounded-lg bg-[#006DB0] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#005a91]"
        >
          <Plus className="h-4 w-4" />
          Add Yacht
        </button>
      </div>

      {/* Yacht Cards */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {yachts.map((yacht) => {
          const stats = getYachtStats(yacht);
          const badge = STATUS_BADGE[yacht.status] ?? STATUS_BADGE.active;

          return (
            <div
              key={yacht.id}
              className="rounded-xl border border-white/10 bg-[#0d1b30] overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-white/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#006DB0]/15">
                    <Image
                      src={yacht.heroImage}
                      alt={yacht.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {yacht.name}
                    </h3>
                    <p className="text-sm text-gray-400">{yacht.tagline}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <span>{yacht.length} ft</span>
                      <span className="text-gray-700">|</span>
                      <span>{yacht.capacity} guests</span>
                      <span className="text-gray-700">|</span>
                      <span>{yacht.cabins} cabins</span>
                      <span className="text-gray-700">|</span>
                      <span>{yacht.builder} {yacht.year}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badge.style}`}
                >
                  {badge.label}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5">
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Upcoming
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">
                    {stats.upcoming}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <DollarSign className="h-3.5 w-3.5" />
                    Revenue
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    Guests
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">
                    {stats.totalGuests}
                  </p>
                </div>
                <div className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    Last Booking
                  </div>
                  <p className="mt-1 text-sm font-medium text-white">
                    {stats.lastBookingDate ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="border-b border-white/5 px-6 py-3">
                <div className="flex items-center gap-6 text-xs">
                  <span className="text-gray-500">Pricing:</span>
                  <span className="text-gray-300">
                    Half Day{" "}
                    <span className="font-semibold text-white">
                      {formatCurrency(yacht.pricing.halfDay)}
                    </span>
                  </span>
                  <span className="text-gray-300">
                    Full Day{" "}
                    <span className="font-semibold text-white">
                      {formatCurrency(yacht.pricing.fullDay)}
                    </span>
                  </span>
                  {yacht.pricing.multiDayPerDay && (
                    <span className="text-gray-300">
                      Multi-Day{" "}
                      <span className="font-semibold text-white">
                        {formatCurrency(yacht.pricing.multiDayPerDay)}/day
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 px-6 py-4">
                <a
                  href={`/fleet/${yacht.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Page
                </a>
                <a
                  href={`/admin/bookings?yacht=${yacht.id}`}
                  className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  View Bookings ({stats.totalBookings})
                </a>
                <a
                  href={`/admin/calendar?yacht=${yacht.id}`}
                  className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Calendar
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[300] animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-white/10 bg-[#0d1b30] px-6 py-3 shadow-xl">
          <p className="text-sm font-medium text-white">
            Coming Soon
          </p>
          <p className="text-xs text-gray-400">
            Adding yachts from the admin panel will be available in a future update.
          </p>
        </div>
      )}
    </div>
  );
}
