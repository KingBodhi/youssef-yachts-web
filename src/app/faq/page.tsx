"use client";

import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  id: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
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
          "Cancellations made 14 or more days before the charter date receive a full refund of the deposit. Cancellations made 7-13 days prior receive a 50% refund. Cancellations within 7 days of the charter are non-refundable. We strongly recommend travel insurance for added peace of mind. Rescheduling is available at no charge with at least 72 hours' notice, subject to availability.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend booking at least 2-4 weeks in advance, especially during peak season (March through September) and holiday weekends. Popular dates and larger vessels tend to book up quickly. That said, we do accommodate last-minute bookings when availability permits — give us a call to check same-day or next-day openings.",
      },
      {
        question: "What happens if the weather is bad on my charter day?",
        answer:
          "Your safety is our top priority. If the National Weather Service issues a small craft advisory or conditions are deemed unsafe by our captain, we will offer you the option to reschedule to the next available date at no additional charge, or receive a full refund. Light rain does not typically constitute a cancellation — our yachts have covered areas and climate-controlled cabins. The final call is always made by the captain on the morning of your charter.",
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
          "We recommend bringing sunscreen (reef-safe preferred), sunglasses, a light cover-up or jacket for the evening, swimwear, a towel, and any personal medications. Non-marking shoes are required on deck. We provide fresh towels, water, ice, and a Bluetooth speaker. Leave the stress on shore — we handle the rest.",
      },
      {
        question: "Can I bring my own food and drinks?",
        answer:
          "Absolutely. You are welcome to bring your own food, beverages, and alcohol aboard. We provide coolers, ice, cups, and utensils. For a more elevated experience, consider adding our Private Chef add-on — our onboard chef will prepare a custom gourmet menu tailored to your group's preferences and dietary needs.",
      },
      {
        question: "Can I choose the route or destinations?",
        answer:
          "Yes. While our captain will suggest the best itinerary based on weather, tides, and your charter duration, we are happy to accommodate your preferences. Popular stops include the Miami Beach sandbar, Star Island, Fisher Island, Stiltsville, Key Biscayne, and the Nixon Sandbar. Multi-day charters can venture to the Florida Keys or the Bahamas.",
      },
      {
        question: "Where do charters depart from?",
        answer:
          "All charters depart from our private dock at 300 Alton Road, Miami Beach, FL 33139. Free parking is available nearby. We recommend arriving 15-20 minutes before your scheduled departure for a smooth boarding process. Pickup from select hotels and marinas can be arranged upon request.",
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
          "Every charter includes a USCG-licensed captain, crew, fuel for standard routes, fresh water, ice, coolers, Bluetooth sound system, and basic water safety equipment. Additional extras such as a private chef, DJ, photographer, jet skis, and custom decorations are available as add-ons. Pricing varies by vessel, duration, and day of the week.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, Amex, Discover), wire transfers, Zelle, and Apple Pay. Payment links are sent via email for your convenience. Corporate accounts with invoicing are available for recurring or large-group bookings.",
      },
      {
        question: "Is gratuity expected?",
        answer:
          "Gratuity is not included in the charter price and is entirely at your discretion. However, it is customary in the yachting industry to tip 15-20% of the charter cost for exceptional service. Gratuity can be given in cash directly to the captain or added to your final invoice upon request.",
      },
      {
        question: "Are there fuel surcharges or hidden fees?",
        answer:
          "No hidden fees — ever. Fuel for standard routes within Biscayne Bay and surrounding waters is included in your charter price. Extended routes beyond our standard coverage area (e.g., trips to the Keys or Bahamas) may incur an additional fuel surcharge, which will be clearly communicated and agreed upon before booking.",
      },
    ],
  },
];

function AccordionItem({
  item,
  value,
}: {
  item: FaqItem;
  value: string;
}) {
  return (
    <Accordion.Item
      value={value}
      className="group border-b border-border last:border-b-0"
    >
      <Accordion.Trigger className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground transition-colors duration-200 hover:text-primary [&[data-state=open]>svg]:rotate-180">
        {item.question}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform duration-300" />
      </Accordion.Trigger>
      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <p className="pb-5 text-sm leading-relaxed text-muted">
          {item.answer}
        </p>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default function FaqPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative flex items-center justify-center bg-gradient-to-b from-navy via-background to-background pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
            >
              Support
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              Frequently Asked{" "}
              <span className="text-brand-gradient">Questions</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-xl text-muted"
            >
              Everything you need to know about chartering with {BRAND.name}.
              Can&apos;t find what you&apos;re looking for? Our team is just a
              call away.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, catIndex) => (
              <motion.div
                key={category.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={stagger}
              >
                <motion.div
                  variants={fadeUp}
                  custom={0}
                  className="mb-6"
                >
                  <h2
                    className={cn(
                      "font-heading text-xl font-semibold text-foreground sm:text-2xl",
                      catIndex > 0 && "pt-4"
                    )}
                  >
                    {category.title}
                  </h2>
                  <div className="mt-2 h-0.5 w-12 rounded bg-primary" />
                </motion.div>

                <motion.div variants={fadeUp} custom={1}>
                  <Accordion.Root
                    type="single"
                    collapsible
                    className="rounded-lg border border-border bg-surface px-6"
                  >
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem
                        key={itemIndex}
                        item={item}
                        value={`${category.id}-${itemIndex}`}
                      />
                    ))}
                  </Accordion.Root>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-navy/40 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
            >
              <MessageCircle className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-heading text-3xl font-bold text-foreground"
            >
              Still Have Questions?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-lg text-muted"
            >
              Our concierge team is happy to help with any questions about your
              charter, vessel options, or special requests.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button asChild size="lg">
                <a href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Us
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {BRAND.phone}
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
