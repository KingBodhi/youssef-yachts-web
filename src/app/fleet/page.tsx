import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { FleetClient } from "./fleet-client";

export const metadata: Metadata = {
  title: `The Fleet | ${BRAND.name}`,
  description:
    "Browse the Hurry Up Slowly charter fleet: seven vessels from 45 to 92 feet, based at Miami Beach Marina. Captain, crew and fuel included on every charter.",
  alternates: { canonical: "/fleet" },
  openGraph: {
    title: `The Fleet | ${BRAND.name}`,
    description:
      "Seven hand-selected yachts from 45 to 92 feet, chartered from Miami Beach Marina.",
    url: "/fleet",
    siteName: BRAND.name,
    type: "website",
  },
};

export default function FleetPage() {
  return <FleetClient />;
}
