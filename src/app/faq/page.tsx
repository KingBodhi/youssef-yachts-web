import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { FAQ_CATEGORIES } from "./faq-data";
import { FaqClient } from "./faq-client";

export const metadata: Metadata = {
  title: `Charter FAQ | ${BRAND.name}`,
  description:
    "Deposits, cancellation policy, what to bring, departure location, payment methods and fees for a Hurry Up Slowly yacht charter in Miami.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `Charter FAQ | ${BRAND.name}`,
    description:
      "Deposits, cancellations, what to bring, and how pricing works on a Miami yacht charter.",
    url: "/faq",
    siteName: BRAND.name,
    type: "website",
  },
};

/**
 * FAQPage structured data, generated from the same source the accordion
 * renders, so the two cannot drift apart.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_CATEGORIES.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient />
    </>
  );
}
