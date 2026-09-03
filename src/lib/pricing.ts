// Canonical pricing — the ONLY source of truth for money. The browser sends a
// selection (yacht, charter type, add-ons); the server recomputes every figure
// here so a tampered client payload can never change what is charged.
import { getYachtById } from "@/lib/data/yachts";
import { ADD_ONS } from "@/lib/constants";
import type { BookingPricing } from "@/lib/types";

export const SERVICE_FEE_RATE = 0.1; // 10%
export const TAX_RATE = 0.07; // 7%
export const DEPOSIT_RATE = 0.5; // 50% deposit confirms the reservation

export type UiCharterType = "half-day" | "full-day" | "multi-day";

function baseFor(
  yacht: NonNullable<ReturnType<typeof getYachtById>>,
  charterType: UiCharterType
): number {
  if (charterType === "half-day") return yacht.pricing.halfDay;
  if (charterType === "full-day") return yacht.pricing.fullDay;
  return yacht.pricing.multiDayPerDay ?? yacht.pricing.fullDay;
}

/**
 * Recompute the full price breakdown from a yacht id, charter type and the
 * *ids* of the selected add-ons. Unknown add-on ids are ignored. Throws when
 * the yacht id is not real. All figures are whole dollars, matching the
 * existing UI and DB columns.
 */
export function computePricing(
  yachtId: string,
  charterType: UiCharterType,
  addOnIds: string[]
): BookingPricing {
  const yacht = getYachtById(yachtId);
  if (!yacht) {
    throw new Error(`Unknown yacht: ${yachtId}`);
  }

  const basePrice = baseFor(yacht, charterType);
  const validAddOns = ADD_ONS.filter((a) => addOnIds.includes(a.id));
  const addOnsTotal = validAddOns.reduce((sum, a) => sum + a.price, 0);

  const subtotal = basePrice + addOnsTotal;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + serviceFee + tax;
  const deposit = Math.round(total * DEPOSIT_RATE);
  const balance = total - deposit;

  return { basePrice, addOnsTotal, serviceFee, tax, total, deposit, balance };
}
