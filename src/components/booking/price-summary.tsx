"use client";

import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import type { Yacht } from "@/lib/types";
import type { ADD_ONS } from "@/lib/constants";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
} from "lucide-react";

interface PriceSummaryProps {
  yacht: Yacht;
  date: string;
  charterType: "half-day" | "full-day" | "multi-day";
  timeSlot: string;
  guests: number;
  selectedAddOns: typeof ADD_ONS[number][];
  className?: string;
}

export function PriceSummary({
  yacht,
  date,
  charterType,
  timeSlot,
  guests,
  selectedAddOns,
  className,
}: PriceSummaryProps) {
  const basePrice =
    charterType === "half-day"
      ? yacht.pricing.halfDay
      : charterType === "full-day"
        ? yacht.pricing.fullDay
        : (yacht.pricing.multiDayPerDay ?? yacht.pricing.fullDay);

  const addOnsTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const subtotal = basePrice + addOnsTotal;
  const serviceFee = Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + serviceFee + tax;

  const formattedDate = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const charterLabel =
    charterType === "half-day"
      ? "Half Day (4 hrs)"
      : charterType === "full-day"
        ? "Full Day (8 hrs)"
        : "Multi-Day";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-navy/40 backdrop-blur-sm",
        className
      )}
    >
      {/* Yacht Header */}
      <div className="border-b border-border p-5">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-navy-light">
            <Image
              src={yacht.thumbnail}
              alt={yacht.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {yacht.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted">{yacht.location.marina}</p>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-3 border-b border-border p-5">
        {formattedDate && (
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 shrink-0 text-primary/60" />
            <span className="text-foreground">{formattedDate}</span>
          </div>
        )}
        {timeSlot && (
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 shrink-0 text-primary/60" />
            <span className="text-foreground">
              {timeSlot} &middot; {charterLabel}
            </span>
          </div>
        )}
        {guests > 0 && (
          <div className="flex items-center gap-3 text-sm">
            <Users className="h-4 w-4 shrink-0 text-primary/60" />
            <span className="text-foreground">
              {guests} {guests === 1 ? "Guest" : "Guests"}
            </span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            {charterLabel}
          </span>
          <span className="text-foreground">{formatCurrency(basePrice)}</span>
        </div>

        {selectedAddOns.map((addon) => (
          <div
            key={addon.id}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted">{addon.name}</span>
            <span className="text-foreground">{formatCurrency(addon.price)}</span>
          </div>
        ))}

        <div className="my-2 h-px bg-border" />

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Service Fee (10%)</span>
          <span className="text-foreground">{formatCurrency(serviceFee)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Tax (7%)</span>
          <span className="text-foreground">{formatCurrency(tax)}</span>
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">Total</span>
          <span className="font-heading text-2xl font-bold text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Payment box */}
      <div className="mx-5 mb-5 rounded-md border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-primary">
              Total Due Today: {formatCurrency(total)}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Paid securely online. Your date is confirmed on payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
