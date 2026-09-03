"use client";

import { useEffect, useState, useCallback } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DayInfo {
  anyTaken: boolean;
  dayBlocked: boolean;
  slotsTaken: string[];
}
export type DaysMap = Record<string, DayInfo>;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const HALF_DAY_IDS = ["morning", "afternoon", "sunset"];

// Fetch availability for the visible month. Returns a date -> DayInfo map of
// what is already taken, so the calendar and time-slot buttons can grey out
// anything unavailable. The DB exclusion constraint is the real guard; this is
// the UX layer that stops people from picking a taken slot in the first place.
export function useAvailability(yachtId: string, month: Date) {
  const [days, setDays] = useState<DaysMap>({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const from = format(startOfMonth(month), "yyyy-MM-dd");
    const to = format(endOfMonth(month), "yyyy-MM-dd");
    setLoading(true);
    try {
      const res = await fetch(
        `/api/availability?yacht=${encodeURIComponent(yachtId)}&from=${from}&to=${to}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = (await res.json()) as { days?: DaysMap };
        setDays(data.days ?? {});
      }
    } catch {
      /* leave availability empty on failure — the server still blocks overlaps */
    } finally {
      setLoading(false);
    }
  }, [yachtId, month]);

  useEffect(() => {
    void load();
  }, [load]);

  return { days, loading, reload: load };
}

export function AvailabilityCalendar({
  month,
  onMonthChange,
  days,
  loading,
  charterType,
  selectedDate,
  onSelect,
}: {
  month: Date;
  onMonthChange: (d: Date) => void;
  days: DaysMap;
  loading: boolean;
  charterType: "half-day" | "full-day" | "multi-day";
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const today = startOfToday();
  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const grid = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const canGoBack = !isSameMonth(month, today) && isBefore(today, month);

  function isDisabled(d: Date): boolean {
    if (isBefore(d, today)) return true;
    const info = days[format(d, "yyyy-MM-dd")];
    if (!info) return false;
    if (charterType === "half-day") {
      return info.dayBlocked || HALF_DAY_IDS.every((s) => info.slotsTaken.includes(s));
    }
    return info.anyTaken; // full-day / multi-day need the whole day free
  }

  function isPartial(d: Date): boolean {
    if (charterType !== "half-day") return false;
    const info = days[format(d, "yyyy-MM-dd")];
    return !!info && !info.dayBlocked && info.slotsTaken.length > 0;
  }

  return (
    <div className="max-w-sm rounded-lg border border-border bg-navy-light/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoBack && onMonthChange(subMonths(month, 1))}
          disabled={!canGoBack}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border transition-colors",
            canGoBack
              ? "border-border text-foreground hover:border-primary/40 hover:text-primary"
              : "cursor-not-allowed border-white/5 text-white/20"
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-heading text-sm font-semibold text-foreground">
          {format(month, "MMMM yyyy")}
          {loading && <span className="ml-2 text-xs text-muted">…</span>}
        </p>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="py-1 text-center text-[10px] font-medium uppercase tracking-wide text-muted">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, month);
          const disabled = isDisabled(d);
          const selected = selectedDate === key;
          const partial = isPartial(d);

          return (
            <button
              key={key}
              type="button"
              disabled={disabled || !inMonth}
              onClick={() => onSelect(key)}
              className={cn(
                "relative aspect-square rounded-md text-sm transition-colors",
                !inMonth && "invisible",
                selected
                  ? "bg-primary font-semibold text-[#0A0A0B]"
                  : disabled
                    ? "cursor-not-allowed text-white/20 line-through"
                    : "text-foreground hover:bg-primary/10 hover:text-primary-light"
              )}
              aria-label={key}
            >
              {format(d, "d")}
              {partial && !selected && (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Partly booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="text-white/30 line-through">00</span> Unavailable
        </span>
      </div>
    </div>
  );
}
