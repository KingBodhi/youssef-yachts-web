"use client";

import { Marquee } from "@/components/ui/marquee";

const DESTINATIONS = [
  "Biscayne Bay",
  "Star Island",
  "Nixon Sandbar",
  "Fisher Island",
  "Stiltsville",
  "Key Biscayne",
  "Haulover Inlet",
  "The Florida Keys",
  "Bimini",
] as const;

/**
 * Slim ticker of the places a charter actually goes. It sits between two dense
 * sections and gives the page a moment of horizontal movement without asking
 * the reader to do anything.
 */
export function DestinationsBand() {
  return (
    <section
      aria-label="Charter destinations"
      className="relative border-y border-border bg-background py-8"
    >
      <Marquee items={DESTINATIONS} speed={48} />
    </section>
  );
}
