export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  id: string;
  items: FaqItem[];
}

/**
 * Shared between the client accordion and the FAQPage JSON-LD emitted by the
 * server component, so the structured data can never describe a different set
 * of questions from the ones on screen.
 */
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "Booking & Reservations",
    id: "booking",
    items: [
      {
        question: "What deposit is required to reserve a charter?",
        answer:
          "A 50% deposit is required at the time of booking to secure your date and vessel. The remaining balance is due 7 days prior to your charter date. For bookings made within 7 days of the charter, full payment is required at the time of reservation. We accept all major credit cards, wire transfers, and Zelle.",
      },
      {
        question: "What is your cancellation policy?",
        answer:
          "Cancellations made 14 or more days before the charter date receive a full refund of the deposit. Cancellations made 7 to 13 days prior receive a 50% refund. Cancellations within 7 days of the charter are non-refundable. We recommend travel insurance for added peace of mind. Rescheduling is available at no charge with at least 72 hours' notice, subject to availability.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend booking at least 2 to 4 weeks in advance, especially during peak season (March through September) and holiday weekends. Popular dates and larger vessels book up quickly. We do accommodate last-minute bookings when availability permits, so call us to check same-day or next-day openings.",
      },
      {
        question: "What happens if the weather is bad on my charter day?",
        answer:
          "Your safety is our top priority. If the National Weather Service issues a small craft advisory or conditions are deemed unsafe by our captain, you can reschedule to the next available date at no additional charge or receive a full refund. Light rain does not typically constitute a cancellation, since our yachts have covered areas and climate-controlled cabins. The final call is always made by the captain on the morning of your charter.",
      },
    ],
  },
  {
    title: "Charter Day",
    id: "charter-day",
    items: [
      {
        question: "What should I bring on the charter?",
        answer:
          "Bring sunscreen (reef-safe preferred), sunglasses, a light cover-up or jacket for the evening, swimwear, a towel, and any personal medications. Non-marking shoes are required on deck. We provide fresh towels, water, ice, and a Bluetooth speaker. Leave the stress on shore and we handle the rest.",
      },
      {
        question: "Can I bring my own food and drinks?",
        answer:
          "Yes. You are welcome to bring your own food, beverages, and alcohol aboard. We provide coolers, ice, cups, and utensils. For a more elevated experience, add our Private Chef service and our onboard chef will prepare a custom menu tailored to your group's preferences and dietary needs.",
      },
      {
        question: "Can I choose the route or destinations?",
        answer:
          "Yes. Our captain will suggest the best itinerary based on weather, tides, and your charter duration, and we are happy to work around your preferences. Popular stops include the Miami Beach sandbar, Star Island, Fisher Island, Stiltsville, Key Biscayne, and the Nixon Sandbar. Multi-day charters can venture to the Florida Keys or the Bahamas.",
      },
      {
        question: "Where do charters depart from?",
        answer:
          "All charters depart from our private dock at 300 Alton Road, Miami Beach, FL 33139. Free parking is available nearby. Arrive 15 to 20 minutes before your scheduled departure for a smooth boarding process. Pickup from select hotels and marinas can be arranged on request.",
      },
    ],
  },
  {
    title: "Payment & Pricing",
    id: "payment",
    items: [
      {
        question: "What is included in the charter price?",
        answer:
          "Every charter includes a USCG-licensed captain, crew, fuel for standard routes, fresh water, ice, coolers, a Bluetooth sound system, and basic water safety equipment. Extras such as a private chef, DJ, photographer, jet skis, and custom decorations are available as add-ons. Pricing varies by vessel, duration, and day of the week.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, Amex, Discover), wire transfers, Zelle, and Apple Pay. Payment links are sent by email for your convenience. Corporate accounts with invoicing are available for recurring or large-group bookings.",
      },
      {
        question: "Is gratuity expected?",
        answer:
          "Gratuity is not included in the charter price and is entirely at your discretion. It is customary in the yachting industry to tip 15 to 20% of the charter cost for exceptional service. Gratuity can be given in cash directly to the captain or added to your final invoice on request.",
      },
      {
        question: "Are there fuel surcharges or hidden fees?",
        answer:
          "No hidden fees, ever. Fuel for standard routes within Biscayne Bay and surrounding waters is included in your charter price. Extended routes beyond our standard coverage area, such as trips to the Keys or Bahamas, may incur an additional fuel surcharge, which is communicated and agreed before booking.",
      },
    ],
  },
];
