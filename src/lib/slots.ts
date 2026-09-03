// Single source of truth for the bookable time slots — used by the booking UI
// (which buttons to show) and by the availability API (which windows to test
// for overlap). Keeping one definition means the calendar and the server can
// never disagree about what "afternoon" means.
export const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 AM – 12:00 PM", start: "08:00", end: "12:00" },
  { id: "afternoon", label: "Afternoon", time: "1:00 PM – 5:00 PM", start: "13:00", end: "17:00" },
  { id: "sunset", label: "Sunset", time: "4:00 PM – 8:00 PM", start: "16:00", end: "20:00" },
  { id: "full-day", label: "Full Day", time: "9:00 AM – 5:00 PM", start: "09:00", end: "17:00" },
] as const;

export type SlotId = (typeof TIME_SLOTS)[number]["id"];

export const HALF_DAY_SLOTS = TIME_SLOTS.filter((s) => s.id !== "full-day");

export function slotById(id: string) {
  return TIME_SLOTS.find((s) => s.id === id);
}
