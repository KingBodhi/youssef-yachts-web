import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = {
  title: `Terms of Service | ${BRAND.name}`,
  description: `Booking, payment, cancellation, conduct and liability terms that apply to every ${BRAND.name} charter.`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const UPDATED = "14 August 2026";

const sections = [
  {
    heading: "Booking and Confirmation",
    body: [
      `A charter is confirmed once we have received your deposit and issued a written confirmation. A quote, a held date or a verbal agreement is not a confirmed booking, and dates are released if a deposit is not received.`,
      `A 50 percent deposit is due at booking. The balance is due 7 days before the charter date. Bookings made within 7 days of the charter are payable in full at the time of reservation.`,
    ],
  },
  {
    heading: "Cancellation and Rescheduling",
    body: [
      `Cancellations 14 or more days before the charter date receive a full refund of the deposit. Cancellations 7 to 13 days before receive a 50 percent refund. Cancellations inside 7 days are non-refundable.`,
      `Rescheduling is available at no charge with at least 72 hours' notice, subject to availability. A rescheduled charter must be taken within 12 months of the original date.`,
    ],
  },
  {
    heading: "Weather and Captain's Authority",
    body: [
      `The captain has final authority over the vessel, the route and whether the charter proceeds. If the captain determines that conditions are unsafe, you may reschedule at no charge or receive a full refund.`,
      `Light rain is not on its own grounds for cancellation. Our vessels have covered areas and climate-controlled cabins.`,
    ],
  },
  {
    heading: "Guest Count and Conduct",
    body: [
      `Guest numbers may not exceed the stated capacity of the vessel under any circumstances. Capacity is set by U.S. Coast Guard regulation and is not negotiable.`,
      `Guests must follow all instructions from the captain and crew. Illegal substances are prohibited aboard. The captain may end a charter without refund if guest conduct endangers the vessel, the crew or other guests.`,
    ],
  },
  {
    heading: "Damage and Cleaning",
    body: [
      `The person named on the booking is responsible for damage to the vessel or its equipment caused by their party, beyond normal wear. Excessive cleaning required after a charter, including cleaning arising from illness, may incur an additional fee, which will be itemised before it is charged.`,
    ],
  },
  {
    heading: "Waivers",
    body: [
      `Every guest boarding must sign a liability waiver before departure. Guests under 18 require a parent or guardian signature. Boarding may be refused where a waiver has not been signed.`,
    ],
  },
  {
    heading: "Included and Excluded",
    body: [
      `Charters include a licensed captain, crew, fuel for standard routes, ice, water and basic safety equipment. Gratuity is not included and is at your discretion. Add-on services are priced separately and confirmed in writing before the charter.`,
      `Routes beyond our standard coverage area may incur a fuel surcharge, which is agreed with you before booking.`,
    ],
  },
  {
    heading: "Limitation of Liability",
    body: [
      `To the fullest extent permitted by law, our liability arising from a charter is limited to the amount paid for that charter. We are not liable for personal property lost or damaged aboard, or for indirect or consequential loss.`,
      `Nothing in these terms limits liability that cannot be limited by law.`,
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about these terms can go to ${BRAND.email}, or by phone on ${BRAND.phone}. Our mailing address is ${BRAND.address}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      accentFrom={1}
      lede="The booking, payment, cancellation and conduct terms that apply to every charter we run."
      updated={UPDATED}
      sections={sections}
    >
      <p className="mt-12 rounded-2xl border border-border bg-surface p-6 text-xs leading-relaxed text-muted/80">
        These terms restate the policies published elsewhere on this site. They
        are not legal advice and they have not been reviewed by counsel. Have
        your attorney review them before they govern live bookings.
      </p>
    </LegalPage>
  );
}
