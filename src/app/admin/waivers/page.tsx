"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { getAllBookings } from "@/lib/bookings";
import { getYachtById } from "@/lib/data/yachts";
import type { Booking } from "@/lib/types";
import type { WaiverRecord } from "@/lib/serializers";
import {
  Download,
  IdCard,
  Link2,
  FileSignature,
  ExternalLink,
} from "lucide-react";

export default function AdminWaiversPage() {
  const [waivers, setWaivers] = useState<WaiverRecord[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "booker" | "guest" | "unassigned">(
    "all"
  );
  const [universalUrl, setUniversalUrl] = useState("");
  const [universalQr, setUniversalQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    const [w, b] = await Promise.all([
      fetch("/api/waivers").then((r) => (r.ok ? r.json() : [])),
      getAllBookings(),
    ]);
    setWaivers(w);
    setBookings(b);
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
    const url = `${window.location.origin}/waiver`;
    setUniversalUrl(url);
    QRCode.toDataURL(url, { width: 240, margin: 1 })
      .then(setUniversalQr)
      .catch(() => {});
  }, [refresh]);

  const bookingLabel = useCallback(
    (id: string | null) => {
      if (!id) return null;
      const b = bookings.find((x) => x.id === id);
      if (!b) return id;
      return `${b.id} · ${b.customerInfo.firstName} ${b.customerInfo.lastName}`;
    },
    [bookings]
  );

  async function assign(waiverId: string, bookingId: string | null) {
    const res = await fetch(`/api/waivers/${waiverId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    if (res.ok) refresh();
  }

  const filtered = useMemo(() => {
    return waivers.filter((w) => {
      if (filter === "all") return true;
      if (filter === "unassigned") return !w.bookingId;
      return w.type === filter;
    });
  }, [waivers, filter]);

  if (!mounted) return null;

  const copyUniversal = async () => {
    try {
      await navigator.clipboard.writeText(universalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const FILTERS: { label: string; value: typeof filter }[] = [
    { label: "All", value: "all" },
    { label: "Booker", value: "booker" },
    { label: "Guest", value: "guest" },
    { label: "Unassigned", value: "unassigned" },
  ];

  return (
    <div className="space-y-6">
      {/* Universal check-in link + QR */}
      <div className="flex flex-col gap-6 rounded-xl border border-white/10 bg-[#161618] p-6 sm:flex-row sm:items-center">
        {universalQr && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={universalQr}
            alt="Universal waiver QR"
            className="h-36 w-36 shrink-0 rounded-lg bg-white p-2"
          />
        )}
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <FileSignature className="h-5 w-5 text-[#E9E9EC]" />
            Universal Guest Waiver
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Print or display this QR at check-in (iPad, dock signage). Anyone can
            sign the guest waiver here; assign their waiver to a charter below.
            For a charter-specific link, open a booking and use its unique link.
          </p>
          <div className="mt-3 flex max-w-lg items-center gap-2 rounded-lg bg-white/5 p-2">
            <Link2 className="h-4 w-4 shrink-0 text-[#E9E9EC]" />
            <input
              readOnly
              value={universalUrl}
              className="flex-1 truncate bg-transparent text-xs text-gray-300 outline-none"
            />
            <button
              onClick={copyUniversal}
              className="rounded-md bg-[#E9E9EC]/20 px-2.5 py-1 text-xs font-medium text-[#E9E9EC] hover:bg-[#E9E9EC]/30"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={universalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-white text-[#0A0A0B]"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-70">
              {f.value === "all"
                ? waivers.length
                : f.value === "unassigned"
                  ? waivers.filter((w) => !w.bookingId).length
                  : waivers.filter((w) => w.type === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Waivers table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#161618]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Signed</th>
              <th className="px-4 py-3 font-medium">Charter</th>
              <th className="px-4 py-3 font-medium">Docs</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-500">
                  No waivers yet.
                </td>
              </tr>
            ) : (
              filtered.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${
                        w.type === "booker"
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-cyan-500/15 text-cyan-300"
                      }`}
                    >
                      {w.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">{w.fullName}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(w.signedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={w.bookingId ?? ""}
                      onChange={(e) => assign(w.id, e.target.value || null)}
                      className="max-w-[240px] rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-[#E9E9EC]"
                    >
                      <option value="" className="bg-[#161618]">
                        Unassigned
                      </option>
                      {bookings.map((b) => (
                        <option key={b.id} value={b.id} className="bg-[#161618]">
                          {b.id} · {b.customerInfo.firstName}{" "}
                          {b.customerInfo.lastName} ·{" "}
                          {getYachtById(b.yachtId)?.name.split("'")[0] ?? ""}{" "}
                          {b.schedule.date}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {w.hasId && (
                        <a
                          href={`/api/waivers/${w.id}/id`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                        >
                          <IdCard className="h-3 w-3" /> ID
                        </a>
                      )}
                      {w.pdfUrl && (
                        <a
                          href={`/api/waivers/${w.id}`}
                          className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20"
                        >
                          <Download className="h-3 w-3" /> PDF
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
