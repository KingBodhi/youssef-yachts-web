"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  getAllBookings,
  updateBookingStatus,
  createBooking,
} from "@/lib/bookings";
import { getYachtById, yachts } from "@/lib/data/yachts";
import { formatCurrency } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";
import {
  Search,
  X,
  ChevronDown,
  Check,
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  Copy,
  Download,
  FileCheck,
  FileWarning,
  Link2,
  IdCard,
  Plus,
} from "lucide-react";
import type { WaiverRecord } from "@/lib/serializers";
import QRCode from "qrcode";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400",
  confirmed: "bg-blue-500/15 text-blue-400",
  deposit_paid: "bg-cyan-500/15 text-cyan-400",
  fully_paid: "bg-emerald-500/15 text-emerald-400",
  completed: "bg-green-500/15 text-green-400",
  cancelled: "bg-red-500/15 text-red-400",
};

const FILTER_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

type SortKey = "id" | "customer" | "date" | "total" | "status";
type SortDir = "asc" | "desc";

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminBookingsPage() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalNotes, setModalNotes] = useState("");
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);
  const [waivers, setWaivers] = useState<WaiverRecord[]>([]);
  const [signingLink, setSigningLink] = useState("");
  const [waiversLoading, setWaiversLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    yachtId: yachts[0]?.id ?? "",
    charterType: "half-day" as "half-day" | "full-day" | "multi-day",
    date: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    guests: 2,
    notes: "",
  });

  async function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    const f = createForm;
    const yacht = getYachtById(f.yachtId);
    if (!yacht || !f.date || !f.firstName || !f.lastName) return;
    const base =
      f.charterType === "half-day"
        ? yacht.pricing.halfDay
        : f.charterType === "full-day"
          ? yacht.pricing.fullDay
          : yacht.pricing.multiDayPerDay ?? yacht.pricing.fullDay;
    const serviceFee = Math.round(base * 0.1);
    const tax = Math.round(base * 0.07);
    const total = base + serviceFee + tax;
    const deposit = Math.round(total * 0.5);
    const times =
      f.charterType === "half-day"
        ? { start: "08:00", end: "12:00" }
        : { start: "09:00", end: "17:00" };
    setCreating(true);
    try {
      await createBooking({
        yachtId: f.yachtId,
        customerInfo: {
          firstName: f.firstName,
          lastName: f.lastName,
          email: f.email,
          phone: f.phone,
        },
        schedule: {
          date: f.date,
          startTime: times.start,
          endTime: times.end,
          type: f.charterType,
        },
        guests: Number(f.guests) || 1,
        addOns: [],
        pricing: {
          basePrice: base,
          addOnsTotal: 0,
          serviceFee,
          tax,
          total,
          deposit,
          balance: total - deposit,
        },
        payment: {
          method: "card",
          status: "pending",
          paidAmount: 0,
          remainingAmount: total,
        },
        status: "confirmed",
        notes: f.notes || undefined,
      });
      setShowCreate(false);
      setCreateForm((p) => ({
        ...p,
        date: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        notes: "",
      }));
      await refresh();
    } finally {
      setCreating(false);
    }
  }

  const refresh = useCallback(async () => {
    setBookings(await getAllBookings());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  // Open modal from query param
  useEffect(() => {
    const viewId = searchParams.get("view");
    if (viewId && bookings.length > 0) {
      const found = bookings.find((b) => b.id === viewId);
      if (found) {
        setSelectedBooking(found);
        setModalNotes(found.notes ?? "");
      }
    }
  }, [searchParams, bookings]);

  // Load the guest waiver roster + signing link whenever a booking is opened.
  useEffect(() => {
    const id = selectedBooking?.id;
    if (!id) {
      setWaivers([]);
      setSigningLink("");
      return;
    }
    let active = true;
    setWaiversLoading(true);
    setQrDataUrl(null);
    fetch(`/api/bookings/${encodeURIComponent(id)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setWaivers(data.waivers ?? []);
        setSigningLink(data.signingLink ?? "");
        if (data.signingLink) {
          QRCode.toDataURL(data.signingLink, { width: 200, margin: 1 })
            .then((url) => active && setQrDataUrl(url))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setWaiversLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedBooking?.id]);

  async function copySigningLink() {
    if (!signingLink) return;
    try {
      await navigator.clipboard.writeText(signingLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const filtered = useMemo(() => {
    let result = bookings;

    if (filter !== "all") {
      result = result.filter((b) => b.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          `${b.customerInfo.firstName} ${b.customerInfo.lastName}`
            .toLowerCase()
            .includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id":
          cmp = a.id.localeCompare(b.id);
          break;
        case "customer":
          cmp = `${a.customerInfo.firstName} ${a.customerInfo.lastName}`.localeCompare(
            `${b.customerInfo.firstName} ${b.customerInfo.lastName}`
          );
          break;
        case "date":
          cmp = a.schedule.date.localeCompare(b.schedule.date);
          break;
        case "total":
          cmp = a.pricing.total - b.pricing.total;
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [bookings, filter, search, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleUpdateStatus(
    id: string,
    status: BookingStatus,
    notes?: string
  ) {
    await updateBookingStatus(id, status, notes);
    await refresh();
    if (selectedBooking?.id === id) {
      setSelectedBooking({
        ...selectedBooking,
        status,
        notes: notes ?? selectedBooking.notes,
      });
    }
    setOpenActionsId(null);
  }

  async function handleSaveNotes() {
    if (!selectedBooking) return;
    await updateBookingStatus(
      selectedBooking.id,
      selectedBooking.status,
      modalNotes
    );
    await refresh();
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Filter Tabs + New Booking */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowCreate(true)}
          className="mr-2 flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0A0A0B] transition hover:bg-[#C4C4CB]"
        >
          <Plus className="h-4 w-4" /> New Booking
        </button>
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-white text-[#0A0A0B]"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-1.5 text-xs opacity-70">
                {bookings.filter((b) =>
                  tab.value === "all" ? true : b.status === tab.value
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or booking ID..."
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#E9E9EC]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-[#161618]">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            {bookings.length === 0
              ? "No bookings yet."
              : "No bookings match your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th
                    className="cursor-pointer px-6 py-3 hover:text-gray-300"
                    onClick={() => handleSort("id")}
                  >
                    Booking ID{sortIndicator("id")}
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:text-gray-300"
                    onClick={() => handleSort("customer")}
                  >
                    Customer{sortIndicator("customer")}
                  </th>
                  <th className="px-6 py-3">Yacht</th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:text-gray-300"
                    onClick={() => handleSort("date")}
                  >
                    Date{sortIndicator("date")}
                  </th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Guests</th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:text-gray-300"
                    onClick={() => handleSort("status")}
                  >
                    Status{sortIndicator("status")}
                  </th>
                  <th
                    className="cursor-pointer px-6 py-3 hover:text-gray-300"
                    onClick={() => handleSort("total")}
                  >
                    Total{sortIndicator("total")}
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((booking) => {
                  const yacht = getYachtById(booking.yachtId);
                  return (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-gray-400">
                        {booking.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-white">
                          {booking.customerInfo.firstName}{" "}
                          {booking.customerInfo.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.customerInfo.email}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                        {yacht?.name ?? booking.yachtId}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                        {booking.schedule.date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-400">
                        {booking.schedule.startTime} - {booking.schedule.endTime}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center text-gray-300">
                        {booking.guests}
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
                        <div className="relative inline-block">
                          <div className="flex items-center gap-1">
                            <button
                              title="View Details"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setModalNotes(booking.notes ?? "");
                              }}
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setOpenActionsId(
                                  openActionsId === booking.id
                                    ? null
                                    : booking.id
                                )
                              }
                              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                          {openActionsId === booking.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenActionsId(null)}
                              />
                              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-white/10 bg-[#161618] py-1 shadow-xl">
                                {booking.status !== "confirmed" &&
                                  booking.status !== "cancelled" &&
                                  booking.status !== "completed" && (
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(
                                          booking.id,
                                          "confirmed"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
                                    >
                                      <Check className="h-4 w-4 text-blue-400" />
                                      Confirm
                                    </button>
                                  )}
                                {booking.status !== "fully_paid" &&
                                  booking.status !== "cancelled" &&
                                  booking.status !== "completed" && (
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(
                                          booking.id,
                                          "fully_paid"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
                                    >
                                      <CreditCard className="h-4 w-4 text-emerald-400" />
                                      Mark Paid
                                    </button>
                                  )}
                                {booking.status !== "completed" &&
                                  booking.status !== "cancelled" && (
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(
                                          booking.id,
                                          "completed"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                                      Complete
                                    </button>
                                  )}
                                {booking.status !== "cancelled" &&
                                  booking.status !== "completed" && (
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(
                                          booking.id,
                                          "cancelled"
                                        )
                                      }
                                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5"
                                    >
                                      <XCircle className="h-4 w-4 text-red-400" />
                                      Cancel
                                    </button>
                                  )}
                              </div>
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

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#161618] p-0 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#161618] px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Booking Details
                </h3>
                <p className="font-mono text-xs text-gray-500">
                  {selectedBooking.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">Status:</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    STATUS_STYLES[selectedBooking.status] ?? ""
                  }`}
                >
                  {statusLabel(selectedBooking.status)}
                </span>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </h4>
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-white/5 p-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm text-white">
                      {selectedBooking.customerInfo.firstName}{" "}
                      {selectedBooking.customerInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-white">
                      {selectedBooking.customerInfo.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-white">
                      {selectedBooking.customerInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Special Requests</p>
                    <p className="text-sm text-white">
                      {selectedBooking.customerInfo.specialRequests || "None"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Charter Details */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Charter Details
                </h4>
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-white/5 p-4">
                  <div>
                    <p className="text-xs text-gray-500">Yacht</p>
                    <p className="text-sm text-white">
                      {getYachtById(selectedBooking.yachtId)?.name ??
                        selectedBooking.yachtId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Charter Type</p>
                    <p className="text-sm capitalize text-white">
                      {selectedBooking.schedule.type.replace(/-/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-white">
                      {selectedBooking.schedule.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm text-white">
                      {selectedBooking.schedule.startTime} -{" "}
                      {selectedBooking.schedule.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Guests</p>
                    <p className="text-sm text-white">
                      {selectedBooking.guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Add-Ons</p>
                    <p className="text-sm text-white">
                      {selectedBooking.addOns.length > 0
                        ? selectedBooking.addOns.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Pricing
                </h4>
                <div className="space-y-2 rounded-lg bg-white/5 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white">
                      {formatCurrency(selectedBooking.pricing.basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Add-Ons</span>
                    <span className="text-white">
                      {formatCurrency(selectedBooking.pricing.addOnsTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Service Fee</span>
                    <span className="text-white">
                      {formatCurrency(selectedBooking.pricing.serviceFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">
                      {formatCurrency(selectedBooking.pricing.tax)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-[#E9E9EC]">
                        {formatCurrency(selectedBooking.pricing.total)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Paid</span>
                    <span className="text-green-400">
                      {formatCurrency(selectedBooking.payment.paidAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining</span>
                    <span className="text-yellow-400">
                      {formatCurrency(selectedBooking.payment.remainingAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Waivers */}
              {(() => {
                const bookerWaiver = waivers.find((w) => w.type === "booker");
                const guestWaivers = waivers.filter((w) => w.type === "guest");
                const bookerLink = signingLink ? `${signingLink}&type=booker` : "";
                const row = (w: WaiverRecord) => (
                  <li
                    key={w.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white/5 p-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 shrink-0 text-green-400" />
                        <span className="truncate text-sm font-medium text-white">
                          {w.fullName}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {new Date(w.signedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {w.hasId && (
                        <a
                          href={`/api/waivers/${w.id}/id`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/20"
                        >
                          <IdCard className="h-3 w-3" />
                          ID
                        </a>
                      )}
                      {w.pdfUrl && (
                        <a
                          href={`/api/waivers/${w.id}`}
                          className="flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-white/20"
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </a>
                      )}
                    </div>
                  </li>
                );

                return (
                  <div className="space-y-5">
                    {/* Booker waiver */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                          Booker Waiver
                        </h4>
                        <a
                          href={bookerLink || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#E9E9EC] hover:underline"
                        >
                          Open booker link
                        </a>
                      </div>
                      {waiversLoading ? (
                        <p className="text-sm text-gray-500">Loading…</p>
                      ) : bookerWaiver ? (
                        <ul>{row(bookerWaiver)}</ul>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3 text-sm text-yellow-400/90">
                          <FileWarning className="h-4 w-4" />
                          Not signed yet — required before boarding.
                        </div>
                      )}
                    </div>

                    {/* Guest waivers */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                          Guest Waivers
                        </h4>
                        <span className="text-xs font-medium text-gray-400">
                          {guestWaivers.length} of {selectedBooking.guests} signed
                        </span>
                      </div>

                      {/* Guest signing link + QR */}
                      <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 p-3">
                        <Link2 className="h-4 w-4 shrink-0 text-[#E9E9EC]" />
                        <input
                          readOnly
                          value={signingLink}
                          placeholder="Generating link..."
                          className="flex-1 truncate bg-transparent text-xs text-gray-300 outline-none"
                        />
                        <button
                          onClick={copySigningLink}
                          disabled={!signingLink}
                          className="flex items-center gap-1 rounded-md bg-[#E9E9EC]/20 px-2.5 py-1 text-xs font-medium text-[#E9E9EC] transition hover:bg-[#E9E9EC]/30 disabled:opacity-50"
                        >
                          <Copy className="h-3 w-3" />
                          {linkCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      {qrDataUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={qrDataUrl}
                          alt="Guest check-in QR"
                          className="mb-3 h-32 w-32 rounded-md bg-white p-1.5"
                        />
                      )}

                      {waiversLoading ? (
                        <p className="text-sm text-gray-500">Loading…</p>
                      ) : guestWaivers.length === 0 ? (
                        <div className="flex items-center gap-2 rounded-lg bg-white/5 p-4 text-sm text-gray-400">
                          <FileWarning className="h-4 w-4 text-yellow-400" />
                          No guests have signed yet.
                        </div>
                      ) : (
                        <ul className="space-y-2">{guestWaivers.map(row)}</ul>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Admin Notes
                </h4>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this booking..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#E9E9EC]"
                />
                <button
                  onClick={handleSaveNotes}
                  className="mt-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                >
                  Save Notes
                </button>
              </div>

              {/* Quick Status Actions */}
              {selectedBooking.status !== "completed" &&
                selectedBooking.status !== "cancelled" && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Update Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.status !== "confirmed" && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedBooking.id, "confirmed");
                            setSelectedBooking({
                              ...selectedBooking,
                              status: "confirmed",
                            });
                          }}
                          className="rounded-lg bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-400 transition hover:bg-blue-500/25"
                        >
                          Confirm
                        </button>
                      )}
                      {selectedBooking.status !== "fully_paid" && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(
                              selectedBooking.id,
                              "fully_paid"
                            );
                            setSelectedBooking({
                              ...selectedBooking,
                              status: "fully_paid",
                            });
                          }}
                          className="rounded-lg bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/25"
                        >
                          Mark Paid
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedBooking.id, "completed");
                          setSelectedBooking({
                            ...selectedBooking,
                            status: "completed",
                          });
                        }}
                        className="rounded-lg bg-green-500/15 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/25"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedBooking.id, "cancelled");
                          setSelectedBooking({
                            ...selectedBooking,
                            status: "cancelled",
                          });
                        }}
                        className="rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/25"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

              {/* Timestamps */}
              <div className="flex gap-6 text-xs text-gray-500">
                <span>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(selectedBooking.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowCreate(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateBooking}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#161618] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">New Booking</h3>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-gray-400">Yacht</label>
                <select
                  value={createForm.yachtId}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, yachtId: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                >
                  {yachts.map((y) => (
                    <option key={y.id} value={y.id} className="bg-[#161618]">
                      {y.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Charter Type
                </label>
                <select
                  value={createForm.charterType}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      charterType: e.target.value as typeof p.charterType,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                >
                  <option value="half-day" className="bg-[#161618]">
                    Half Day
                  </option>
                  <option value="full-day" className="bg-[#161618]">
                    Full Day
                  </option>
                  <option value="multi-day" className="bg-[#161618]">
                    Multi-Day
                  </option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Date</label>
                <input
                  type="date"
                  required
                  value={createForm.date}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, date: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  First Name
                </label>
                <input
                  required
                  value={createForm.firstName}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, firstName: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Last Name
                </label>
                <input
                  required
                  value={createForm.lastName}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, lastName: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Phone</label>
                <input
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-400">Guests</label>
                <input
                  type="number"
                  min={1}
                  value={createForm.guests}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      guests: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-gray-400">Notes</label>
                <input
                  value={createForm.notes}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Optional"
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[#E9E9EC]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="mt-5 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0A0A0B] transition hover:bg-[#C4C4CB] disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create Booking"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
