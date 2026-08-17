import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: `Contact & Booking | ${BRAND.name}`,
  description:
    "Request a Miami yacht charter. Tell us your date, party size and occasion, and our team will confirm availability.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact & Booking | ${BRAND.name}`,
    description:
      "Request a Miami yacht charter. Speak directly with our team to plan your day on the water.",
    url: "/contact",
    siteName: BRAND.name,
    type: "website",
  },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BRAND.name,
  description: BRAND.description,
  telephone: BRAND.phoneHref,
  areaServed: "Miami, Florida",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miami Beach",
    addressRegion: "FL",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "18:00",
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
