import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: `Contact & Booking | ${BRAND.name}`,
  description:
    "Request a Miami yacht charter. Tell us your date, party size and occasion, and our concierge team replies within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact & Booking | ${BRAND.name}`,
    description:
      "Request a Miami yacht charter. Our concierge team replies within 24 hours.",
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
  telephone: BRAND.phone,
  email: BRAND.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "300 Alton Road",
    addressLocality: "Miami Beach",
    addressRegion: "FL",
    postalCode: "33139",
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.7701, longitude: -80.1425 },
  sameAs: [BRAND.instagram, BRAND.facebook, BRAND.tiktok, BRAND.youtube],
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
