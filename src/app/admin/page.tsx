"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllBookings,
  updateBookingStatus,
} from "@/lib/bookings";
import { getYachtById } from "@/lib/data/yachts";
import { formatCurrency } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";
import {
  DollarSign,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Eye,
  Check,
  X,
} from "lucide-react";

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

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(async () => {
    setBookings(await getAllBookings());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  if (!mounted) return null;

  const totalBookings = bookings.length;
  const confirmed = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "deposit_paid" || b.status === "fully_paid"
  ).length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const revenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.pricing.total, 0);

  const recent = bookings.slice(0, 10);

  async function handleUpdateStatus(id: string, status: BookingStatus) {
    await updateBookingStatus(id, status);
    await refresh();
  }

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: CalendarCheck,
      color: "text-[#E9E9EC]",
      bg: "bg-[#E9E9EC]/15",
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
    },
    {
      label: "Revenue",
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: "text-green-400",
      bg: "bg-green-500/15",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/15",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-[#161618] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl border border-white/10 bg-[#161618]">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <p className="text-sm text-gray-400">
            Last 10 bookings across all yachts
          </p>
        </div>

        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No bookings yet. Bookings will appear here once customers start
            booking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Yacht</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((booking) => {
                  const yacht = getYachtById(booking.yachtId);
                  return (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-400">
                        {booking.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-white">
                        {booking.customerInfo.firstName}{" "}
                        {booking.customerInfo.lastName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                        {yacht?.name ?? booking.yachtId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                        {booking.schedule.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            STATUS_STYLES[booking.status] ?? ""
                          }`}
                        >
                          {statusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                        {formatCurrency(booking.pricing.total)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View"
                            onClick={() =>
                              window.open(
                                `/admin/bookings?view=${booking.id}`,
                                "_self"
                              )
                            }
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {booking.status === "pending" && (
                            <>
                              <button
                                title="Confirm"
                                onClick={() =>
                                  handleUpdateStatus(booking.id, "confirmed")
                                }
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-emerald-500/10 hover:text-emerald-400"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                title="Cancel"
                                onClick={() =>
                                  handleUpdateStatus(booking.id, "cancelled")
                                }
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
