import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { LegalPage } from "@/components/ui/legal-page";

export const metadata: Metadata = {
  title: `Privacy Policy | ${BRAND.name}`,
  description: `How ${BRAND.name} collects, uses and protects the information you provide when you enquire about or book a charter.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const UPDATED = "14 August 2026";

const sections = [
  {
    heading: "Information We Collect",
    body: [
      `We collect the information you give us directly: your name, email address, phone number, preferred charter date, party size and any details you add to an inquiry, booking or liability waiver. Waivers additionally capture a date of birth, an emergency contact and a signature, because those are required before boarding.`,
      `We also collect standard technical information that any website receives, such as your browser type, device type and the pages you viewed. We use this to understand which parts of the site are useful and to diagnose problems.`,
    ],
  },
  {
    heading: "How We Use It",
    body: [
      `Your information is used to respond to your inquiry, confirm and operate your charter, process payment, meet our safety and insurance obligations, and keep you updated about your booking.`,
      `We may contact you about your charter by phone, email or text. If you opt in, we may also send occasional availability and offer updates, and every one of those messages includes a way to opt out.`,
    ],
  },
  {
    heading: "Payment Information",
    body: [
      `We do not store full card numbers on our systems. Card payments are handled by our payment processor, which is PCI DSS compliant. We retain only the transaction reference and the amount, which is what we need for our own records.`,
    ],
  },
  {
    heading: "Sharing",
    body: [
      `We do not sell your personal information. We share it only with the parties needed to run your charter: the captain and crew assigned to your vessel, our payment processor, and any add-on vendor you have specifically booked, such as a chef or photographer.`,
      `We may disclose information where the law requires it, or where it is necessary to protect the safety of guests and crew.`,
    ],
  },
  {
    heading: "Retention",
    body: [
      `Booking and waiver records are retained for as long as our insurance and legal obligations require, typically seven years. Inquiry records that do not lead to a booking are retained for two years, after which they are deleted.`,
    ],
  },
  {
    heading: "Your Choices",
    body: [
      `You may request a copy of the information we hold about you, ask us to correct it, or ask us to delete it where we are not required to keep it. Write to us at the email address below and we will respond within 30 days.`,
      `You can opt out of marketing messages at any time without affecting an existing booking.`,
    ],
  },
  {
    heading: "Cookies",
    body: [
      `The site uses only the cookies needed to make it work and to measure aggregate traffic. We do not use advertising cookies or cross-site tracking. Your browser settings can block cookies, though doing so may affect the booking flow.`,
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about this policy can go to ${BRAND.email}, or by phone on ${BRAND.phone}. Our mailing address is ${BRAND.address}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      accentFrom={1}
      lede="What we collect when you enquire or book, why we collect it, and what you can ask us to do with it."
      updated={UPDATED}
      sections={sections}
    >
      <p className="mt-12 rounded-2xl border border-border bg-surface p-6 text-xs leading-relaxed text-muted/80">
        This policy is a plain-language summary of our current practice. It is
        not legal advice and it has not been reviewed by counsel. Have your
        attorney review it before the site handles live customer data.
      </p>
    </LegalPage>
  );
}
